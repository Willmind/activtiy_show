import type { Metadata } from 'next';
import { sitePath } from '@/lib/site-path';
import { Download } from 'lucide-react';
import { profile } from '@/data/profile';
import './globals.css';
import './portfolio-styles.css';

export const metadata: Metadata = {
  title: { default: '曾慧仪 · 行政活动作品集', template: '%s | 曾慧仪' },
  description:
    '曾慧仪的行政活动作品集：节日活动、员工关怀、活动统筹与综合行政工作经历，附完整求职简历。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main-content">
          跳转到主要内容
        </a>
        <header className="site-header">
          <div className="shell header-inner">
            <a
              className="brand"
              href={sitePath('/')}
              aria-label="曾慧仪，返回首页"
            >
              曾慧仪<small>行政活动作品集</small>
            </a>
            <div className="header-actions">
              <nav className="site-nav" aria-label="主导航">
                <a href={sitePath('/#activities')}>活动作品</a>
                <a href={sitePath('/#about')}>关于我</a>
                <a className="nav-contact" href={sitePath('/#contact')}>
                  联系我 ↗
                </a>
              </nav>
              <a
                className="header-resume"
                href={profile.resumeUrl}
                download={profile.resumeFilename}
              >
                <Download size={15} aria-hidden="true" />
                下载简历
              </a>
            </div>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="shell footer-inner">
            <span>© {new Date().getFullYear()} 曾慧仪 · 行政活动作品集</span>
            <span>以细节成就体验，以行动回应信任。</span>
          </div>
          <div className="shell">
            <a
              className="footer-filing"
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
            >
              粤ICP备2026144544号-1
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
