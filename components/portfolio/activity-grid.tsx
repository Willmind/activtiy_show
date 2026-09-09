'use client';
import { ArrowUpRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { activities, categories } from '@/data/activities';
import { sitePath } from '@/lib/site-path';

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
              .map((activity) => (
                <a
                  href={sitePath(`/activities/${activity.slug}`)}
                  className="project-card"
                  key={activity.slug}
                >
                  <div
                    className="project-photo"
                    style={{ background: activity.accent }}
                  >
                    <img
                      src={activity.cover}
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
                  <div className="project-meta">
                    <span>{activity.category}</span>
                    <span>
                      {String(activities.indexOf(activity) + 1).padStart(
                        2,
                        '0',
                      )}
                    </span>
                  </div>
                  <h3>{activity.title}</h3>
                  <p>{activity.subtitle}</p>
                </a>
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
