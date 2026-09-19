import { ActivityGrid } from '@/components/portfolio/activity-grid';
import { ResumeSection } from '@/components/portfolio/resume-section';
import { HeroShowcase } from '@/components/portfolio/hero-showcase';
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { activities } from '@/data/activities';
import { profile } from '@/data/profile';
import { sitePath } from '@/lib/site-path';

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero studio-hero shell">
        <div className="hero-grid">
          <div className="hero-copy">
            <a className="hero-intro" href="#about">
              <img
                src={sitePath('/images/portrait.webp')}
                width="28"
                height="28"
                alt=""
              />
              曾慧仪 · 行政专员 <ArrowUpRight size={13} />
            </a>
            <h1>
              让日常有序。
              <br />
              <em>让相聚有温度。</em>
            </h1>
            <p className="hero-desc">
              从活动统筹到日常运营，
              <br className="mobile-break" />
              把每一份心意，落在细节里。
            </p>
            <div className="hero-actions">
              <a className="button-primary" href="#activities">
                查看活动作品 <ArrowDown size={17} />
              </a>
              <a
                className="text-link"
                href={profile.resumeUrl}
                download={profile.resumeFilename}
              >
                下载简历 <Download size={17} />
              </a>
            </div>
          </div>
        </div>
        <HeroShowcase />
        <div className="hero-bottom">
          <div className="hero-stat">
            <b>{activities.length}</b>
            <span>组活动记录</span>
          </div>
          <div className="hero-stat">
            <b>
              50<span className="stat-unit">人</span>
            </b>
            <span>独立统筹年会</span>
          </div>
          <div className="hero-stat">
            <b>{profile.experienceYears}</b>
            <span>年行政经验</span>
          </div>
          <div className="availability">
            <i className="status-dot" />
            {profile.city} · {profile.availability}
          </div>
        </div>
      </section>
      <section className="section section-soft" id="activities">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="section-number">01 / SELECTED ACTIVITIES</span>
              <h2>活动作品</h2>
            </div>
            <p>
              节日的仪式感，以及日常里的小惊喜。
              <br />
              这里是我参与筹备、执行与记录的活动现场。
            </p>
          </div>
          <ActivityGrid />
        </div>
      </section>
      <ResumeSection />
    </main>
  );
}
