'use client';
import { ArrowUpRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { activities, categories } from '@/data/activities';
import { sitePath } from '@/lib/site-path';
import { cardImageSizes } from '@/lib/image-sizes';

export function ActivityGrid() {
  return (
    <Tabs defaultValue="全部活动" className="activity-tabs">
      <TabsList className="activity-tab-list" aria-label="按活动类型筛选">
        {categories.map((category) => (
          <TabsTrigger key={category} value={category} className="activity-tab">
            {category}
            <span>
              {category === '全部活动'
                ? activities.length
                : activities.filter((a) => a.category === category).length}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map((category) => (
        <TabsContent key={category} value={category}>
          <div className="activity-grid">
            {activities
              .filter((a) => category === '全部活动' || a.category === category)
              .map((activity, index) => (
                <a
                  href={sitePath(`/activities/${activity.slug}`)}
                  className="project-card"
                  data-category={activity.category}
                  data-lead={index === 0 || undefined}
                  key={activity.slug}
                >
                  <div
                    className="project-photo"
                    style={{ background: activity.accent }}
                  >
                    <img
                      src={activity.cover}
                      srcSet={activity.coverSrcSet}
                      sizes={`auto, ${cardImageSizes}`}
                      width="960"
                      height="720"
                      alt={activity.title}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="image-count">
                      {activity.images.length} 张记录
                    </span>
                    <span className="project-open" aria-hidden="true">
                      <ArrowUpRight size={23} />
                    </span>
                  </div>
                  <div className="project-copy">
                    <div className="project-meta">
                      <span>{activity.category}</span>
                      <span>
                        {String(activities.indexOf(activity) + 1).padStart(
                          2,
                          '0',
                        )}
                      </span>
                    </div>
                    <h3>
                      <span className="project-event">
                        {activity.title.split(' · ')[0]}
                      </span>
                      <span className="project-title">
                        {activity.title.split(' · ')[1]}
                      </span>
                    </h3>
                    <p>{activity.subtitle}</p>
                    <span className="project-view">
                      查看活动 <ArrowUpRight size={17} />
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
