import { sitePath } from '@/lib/site-path';

export default function NotFound() {
  return (
    <main className="shell missing-page" id="main-content">
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1>这页活动暂时不在这里。</h1>
      <p>回到作品集，继续看看其他活动。</p>
      <a className="button-primary" href={sitePath('/#activities')}>
        返回活动作品 →
      </a>
    </main>
  );
}
