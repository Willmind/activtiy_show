'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { activities } from '@/data/activities';
import { sitePath } from '@/lib/site-path';

const moments = [
  {
    slug: 'qixi',
    title: '把浪漫，带进日常。',
    note: '一份心意，一场用心准备的相聚。',
    label: '七夕关怀',
    english: 'A LITTLE ROMANCE',
  },
  {
    slug: 'mid-autumn',
    title: '让团圆，近一点。',
    note: '从节日礼盒到现场布置，让心意有迹可循。',
    label: '中秋团圆',
    english: 'TOGETHER, CLOSER',
  },
  {
    slug: 'new-year-tea',
    title: '忙碌之间，留点甜。',
    note: '用一杯下午茶，为同事留出轻松交流的时刻。',
    label: '午后相聚',
    english: 'A MOMENT TO CONNECT',
  },
].map((moment) => ({
  ...moment,
  activity: activities.find((item) => item.slug === moment.slug)!,
}));

export function HeroShowcase() {
  const [selected, setSelected] = useState(0);
  const selectNext = (direction: number) =>
    setSelected(
      (current) => (current + direction + moments.length) % moments.length,
    );

  return (
    <div className="moment-showcase" aria-label="精选活动速览">
      <div aria-live="polite" aria-atomic="true">
        {moments.map((moment, index) => (
          <div
            className="moment-stage"
            key={moment.slug}
            data-moment-index={index}
            hidden={selected !== index}
          >
            <a
              className="moment-image-link"
              href={sitePath(`/activities/${moment.slug}`)}
              aria-label={`查看${moment.label}活动详情`}
            >
              <img
                src={moment.activity.cover}
                srcSet={moment.activity.coverSrcSet}
                sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1296px) 62vw, 780px"
                width="960"
                height="720"
                alt={moment.activity.title}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
              />
              <span className="moment-image-tag">
                现场记录 <ArrowUpRight size={14} />
              </span>
            </a>
            <div className="moment-caption">
              <div className="moment-topline">
                <span>精选现场</span>
                <span>
                  0{index + 1} / 0{moments.length}
                </span>
              </div>
              <div className="moment-story" key={moment.slug}>
                <span className="moment-english">{moment.english}</span>
                <h2>{moment.title}</h2>
                <p>{moment.note}</p>
                <a
                  href={sitePath(`/activities/${moment.slug}`)}
                  className="moment-link"
                >
                  走进这场活动 <ArrowUpRight size={18} />
                </a>
              </div>
              <div className="moment-footnote">
                <span>{moment.activity.category}</span>
                <span>{moment.activity.images.length} 张活动记录</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="moment-toolbar">
        <div className="moment-choices" aria-label="选择精选活动">
          {moments.map((item, index) => (
            <button
              type="button"
              key={item.slug}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <span className="moment-dot" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </div>
        <div className="moment-arrows">
          <button
            type="button"
            aria-label="上一项精选活动"
            data-moment-direction="-1"
            onClick={() => selectNext(-1)}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="下一项精选活动"
            data-moment-direction="1"
            onClick={() => selectNext(1)}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
