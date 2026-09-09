'use client';
import { useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ActivityImage } from '@/data/activities';
import { cardImageSizes } from '@/lib/image-sizes';

export function ImageGallery({
  images,
  title,
}: {
  images: ActivityImage[];
  title: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selected = active === null ? null : images[active];
  function change(delta: number) {
    if (active === null) return;
    setActive((active + delta + images.length) % images.length);
    setZoomed(false);
    scrollRef.current?.scrollTo({ top: 0, left: 0 });
  }
  return (
    <>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <button
            className="gallery-item"
            type="button"
            key={image.id}
            onClick={() => {
              setActive(index);
              setZoomed(false);
            }}
            aria-label={`查看${image.label}，第 ${index + 1} 张`}
          >
            <div className="gallery-thumb">
              <img
                src={image.thumb}
                srcSet={image.thumbSrcSet}
                sizes={cardImageSizes}
                width="960"
                height="720"
                alt={image.label}
                loading="lazy"
                decoding="async"
              />
              <span>
                <Expand size={16} />
                查看完整图片
              </span>
              {image.kind === 'long' && <i className="long-label">长图</i>}
            </div>
            <div className="gallery-caption">
              <b>{String(index + 1).padStart(2, '0')}</b>
              {image.label}
            </div>
          </button>
        ))}
      </div>
      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent
          className="image-dialog"
          showCloseButton={false}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              change(-1);
            }
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              change(1);
            }
          }}
        >
          <div className="viewer-toolbar">
            <div>
              <DialogTitle className="viewer-title">
                {selected?.label ?? title}
              </DialogTitle>
              <DialogDescription className="viewer-description">
                {active === null ? '' : `${active + 1} / ${images.length}`} ·{' '}
                {selected?.kind === 'long'
                  ? '向下滚动查看完整长图'
                  : '活动现场与宣传记录'}
              </DialogDescription>
            </div>
            <div className="viewer-actions">
              <button
                type="button"
                className="viewer-icon"
                aria-label={zoomed ? '适应屏幕' : '放大图片'}
                aria-pressed={zoomed}
                onClick={() => setZoomed((v) => !v)}
              >
                {zoomed ? <Minus size={20} /> : <Plus size={20} />}
              </button>
              <DialogClose className="viewer-icon" aria-label="关闭图片">
                <X size={22} />
              </DialogClose>
            </div>
          </div>
          <div
            ref={scrollRef}
            className={`viewer-scroll ${zoomed ? 'is-zoomed' : ''}`}
            tabIndex={0}
            aria-label="图片内容，可滚动查看"
          >
            {selected && (
              <div
                className={`viewer-image-stack ${selected.kind === 'long' ? 'is-long' : ''}`}
                key={selected.id}
                style={
                  zoomed
                    ? { width: Math.min(selected.parts[0].width, 2400) }
                    : undefined
                }
              >
                {selected.parts.map((part, i) => (
                  <img
                    src={part.src}
                    width={part.width}
                    height={part.height}
                    alt={`${selected.label}${selected.parts.length > 1 ? `，第 ${i + 1} 部分` : ''}`}
                    key={part.src}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                ))}
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="viewer-footer">
              <button type="button" onClick={() => change(-1)}>
                <ChevronLeft size={18} />
                上一张
              </button>
              <span>← → 切换 · Esc 关闭</span>
              <button type="button" onClick={() => change(1)}>
                下一张
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
