import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, Images } from 'lucide-react';
import { activities } from '@/data/activities';
import { ImageGallery } from '@/components/portfolio/image-gallery';
import { sitePath } from '@/lib/site-path';

export function generateStaticParams() {
  return activities.map((activity) => ({ slug: activity.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = activities.find((a) => a.slug === slug);
  return {
    title: activity?.title ?? '活动未找到',
    description: activity?.description,
  };
}
export default async function ActivityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity = activities.find((a) => a.slug === slug);
  if (!activity) notFound();
  const index = activities.indexOf(activity);
  const next = activities[(index + 1) % activities.length];
  return (
    <main id="main-content">
      <section className="detail-hero shell">
        <a className="back-link" href={sitePath('/#activities')}>
          <ArrowLeft size={16} />
          全部活动
        </a>
        <div className="detail-heading">
          <div>
            <p className="eyebrow">
              {String(index + 1).padStart(2, '0')} / {activity.category}
            </p>
            <h1>{activity.title}</h1>
            <p className="detail-subtitle">{activity.subtitle}</p>
          </div>
          <span className="detail-count">
            <Images size={17} />
            {activity.images.length} 张活动记录
          </span>
        </div>
        <div className="detail-cover" style={{ background: activity.accent }}>
          <img
            src={activity.cover}
            width="960"
            height="720"
            alt={activity.title}
            fetchPriority="high"
          />
        </div>
      </section>
      <section className="detail-overview shell">
        <div>
          <span className="section-number">ABOUT THIS ACTIVITY</span>
          <h2>活动概览</h2>
        </div>
        <div>
          <p className="detail-description">{activity.description}</p>
          <div className="tag-list">
            {activity.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="detail-points shell" aria-label="展示要点">
        {activity.points.map((point, i) => (
          <article key={point.title}>
            <span>0{i + 1}</span>
            <h3>{point.title}</h3>
            <p>{point.text}</p>
          </article>
        ))}
      </section>
      <section className="section section-soft">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="section-number">ACTIVITY ARCHIVE</span>
              <h2>现场与活动记录</h2>
            </div>
            <p>点击图片查看完整内容，长图可滚动阅读。</p>
          </div>
          <ImageGallery images={activity.images} title={activity.title} />
        </div>
      </section>
      <nav className="shell next-project" aria-label="其他活动">
        <a className="back-link" href={sitePath('/#activities')}>
          <ArrowLeft size={16} />
          返回全部活动
        </a>
        <a href={sitePath(`/activities/${next.slug}`)}>
          <span>
            下一场活动 <ArrowRight size={15} />
          </span>
          <strong>
            {next.title}
            <ArrowUpRight size={23} />
          </strong>
        </a>
      </nav>
    </main>
  );
}
