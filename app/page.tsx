import { ActivityGrid } from '@/components/portfolio/activity-grid';
import { ResumeSection } from '@/components/portfolio/resume-section';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { activities } from '@/data/activities';

const heroActivity = activities.find(
  (activity) => activity.slug === 'mid-autumn',
)!;
const secondaryActivity = activities.find(
  (activity) => activity.slug === 'qixi',
)!;

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero shell">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">ZENG HUIYI / ADMINISTRATIVE PORTFOLIO</p>
            <h1>
              让日常有序，
              <br />
              <em>让相聚有温度。</em>
            </h1>
            <p className="hero-desc">
              你好，我是曾慧仪，一名注重细节与体验的行政工作者。从活动统筹到日常运营，用认真准备，照顾好每一个环节。
            </p>
            <div className="hero-actions">
              <a className="button-primary" href="#activities">
                查看活动作品 <ArrowDown size={17} />
              </a>
              <a className="text-link" href="#about">
                了解我的经历 <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <span className="photo-index">
              认真筹备
              <br />
              温暖发生
            </span>
            <img
              className="hero-photo"
              src={heroActivity.cover}
              srcSet={heroActivity.coverSrcSet}
              sizes="(max-width: 760px) 90vw, (max-width: 1296px) 43vw, 532px"
              width="960"
              height="720"
              alt="中秋国庆双节活动的主题布置与节日礼篮"
              fetchPriority="high"
            />
            <img
              className="hero-photo-secondary"
              src={secondaryActivity.cover}
              srcSet={secondaryActivity.coverSrcSet}
              sizes="(max-width: 760px) 42vw, 260px"
              decoding="async"
              width="960"
              height="720"
              alt="七夕粉色主题福利与现场布置"
            />
            <div className="photo-caption">
              <strong>每一次相聚，都有用心的细节。</strong>活动现场 · 员工关怀 ·
              企业文化
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <div className="hero-stat">
            <b>{activities.length}</b>
            <span>类活动记录</span>
          </div>
          <div className="hero-stat">
            <b>
              {activities.reduce(
                (total, activity) => total + activity.images.length,
                0,
              )}
            </b>
            <span>张活动素材</span>
          </div>
          <div className="hero-stat">
            <b>5</b>
            <span>年行政经验</span>
          </div>
          <div className="availability">
            <i className="status-dot" />
            行政专员 · 随时到岗
          </div>
        </div>
      </section>
      <section className="section section-soft" id="activities">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="section-number">01 / SELECTED ACTIVITIES</span>
              <h2>把用心，留在每个现场。</h2>
            </div>
            <p>节日的仪式感，以及日常里的小惊喜。</p>
          </div>
          <ActivityGrid />
        </div>
      </section>
      <ResumeSection />
    </main>
  );
}
