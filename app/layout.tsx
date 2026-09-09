import type { Metadata } from 'next';
import { sitePath } from '@/lib/site-path';
import './globals.css';

export const metadata: Metadata = {
  title: { default: '曾慧仪 · 行政活动作品集', template: '%s | 曾慧仪' },
  description:
    '曾慧仪的行政活动作品集：节日活动、员工关怀、办公空间与综合行政工作经历。',
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
              <span className="brand-mark" aria-hidden="true">
                慧
              </span>
              曾慧仪<small>行政活动作品集</small>
            </a>
            <nav className="site-nav" aria-label="主导航">
              <a href={sitePath('/#activities')}>活动作品</a>
              <a href={sitePath('/#about')}>关于我</a>
              <a className="nav-contact" href={sitePath('/#contact')}>
                联系我 ↗
              </a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="shell footer-inner">
            <span>© {new Date().getFullYear()} 曾慧仪 · 行政活动作品集</span>
            <span>以细节成就体验，以行动回应信任。</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
