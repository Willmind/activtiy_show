import io
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import tarfile
import tempfile
import threading
import unittest

from lighthouse_activate import activate, check_health


class ActivationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / 'releases/initial').mkdir(parents=True)
        (self.root / 'releases/initial/index.html').write_text('previous site')
        (self.root / 'uploads').mkdir()
        (self.root / 'current').symlink_to('releases/initial')
        self.release = 'a' * 40 + '-123-1'

    def archive(self, extra=None):
        entries = {
            'index.html': b'new site',
            'activities/qixi/index.html': b'activity',
            'resume/zeng-huiyi-resume.pdf': b'%PDF-1.7 test fixture',
        }
        with tarfile.open(self.root / 'uploads' / f'{self.release}.tar.gz', 'w:gz') as archive:
            for name, data in entries.items():
                info = tarfile.TarInfo(name)
                info.size = len(data)
                archive.addfile(info, io.BytesIO(data))
            if extra:
                archive.addfile(extra)

    def test_valid_release_changes_pointer_and_keeps_previous(self):
        self.archive()
        def health(release):
            self.assertEqual((self.root / 'current/index.html').read_text(), 'new site')
            self.assertEqual(json.loads((self.root / 'current/_deployment.json').read_text())['release'], release)
        activate(self.root, self.release, health)
        self.assertEqual(os.readlink(self.root / 'current'), f'releases/{self.release}')
        self.assertEqual((self.root / 'releases/initial/index.html').read_text(), 'previous site')

    def test_failed_health_check_restores_previous(self):
        self.archive()
        def fail(_):
            raise RuntimeError('simulated unhealthy response')
        with self.assertRaises(RuntimeError):
            activate(self.root, self.release, fail)
        self.assertEqual(os.readlink(self.root / 'current'), 'releases/initial')
        self.assertEqual((self.root / 'current/index.html').read_text(), 'previous site')
        self.assertFalse((self.root / 'releases' / self.release).exists())

    def test_restrictive_umask_still_allows_nginx_to_read(self):
        self.archive()
        previous_umask = os.umask(0o077)
        try:
            activate(self.root, self.release, lambda _: None)
        finally:
            os.umask(previous_umask)
        for path in (self.root / 'current').resolve().rglob('*'):
            self.assertEqual(path.stat().st_mode & 0o777, 0o755 if path.is_dir() else 0o644)
        self.assertEqual((self.root / 'current').stat().st_mode & 0o777, 0o755)

    def test_http_checks_new_version_and_rejects_stale_marker(self):
        self.archive()
        class Handler(SimpleHTTPRequestHandler):
            def log_message(self, *_):
                pass
        server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(self.root / 'current')))
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base_url = f'http://127.0.0.1:{server.server_port}'
        try:
            activate(self.root, self.release, lambda release: check_health(base_url, release))
            with self.assertRaises(RuntimeError):
                check_health(base_url, 'b' * 40 + '-124-1')
        finally:
            server.shutdown()
            server.server_close()
            thread.join()

    def test_parent_path_in_archive_rejected_before_activation(self):
        self.archive(tarfile.TarInfo('../outside'))
        with self.assertRaises(ValueError):
            activate(self.root, self.release, lambda _: None)
        self.assertFalse((self.root / 'releases/outside').exists())
        self.assertEqual(os.readlink(self.root / 'current'), 'releases/initial')

    def test_symlink_in_archive_rejected(self):
        link = tarfile.TarInfo('images')
        link.type = tarfile.SYMTYPE
        link.linkname = '/etc'
        self.archive(link)
        with self.assertRaises(ValueError):
            activate(self.root, self.release, lambda _: None)
        self.assertEqual(os.readlink(self.root / 'current'), 'releases/initial')

    def test_invalid_release_id_does_not_touch_site(self):
        with self.assertRaises(ValueError):
            activate(self.root, '../outside', lambda _: None)
        self.assertEqual((self.root / 'current/index.html').read_text(), 'previous site')


if __name__ == '__main__':
    unittest.main()
