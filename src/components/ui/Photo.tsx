import { useState } from 'react';
import { photos, type PhotoKey } from '../../data/images';
import type { ImageRef } from '../../data/types';
import { cx } from '../../lib/format';
import { LogoMark } from './Brand';

const tones = {
  field: 'from-[#1d3a22] via-[#24502d] to-[#0f2412]',
  earth: 'from-[#3b3524] via-[#2c3a23] to-[#151d10]',
  gold: 'from-[#5b5a1c] via-[#3f4f1d] to-[#18240f]',
};

/**
 * Photograph with intentional cropping. Accepts a photo-library key or a data URL
 * (local upload). If the image cannot load, it renders a branded placeholder that
 * keeps the composition intact and names the intended subject.
 */
export function Photo({ src, alt, className, imgClassName, position = 'center', eager = false, kenburns = false }: {
  src: ImageRef; alt?: string; className?: string; imgClassName?: string; position?: string; eager?: boolean; kenburns?: boolean;
}) {
  const entry = photos[src as PhotoKey];
  const url = entry ? entry.src : src;
  const caption = entry?.caption ?? alt ?? 'Farm photograph';
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cx('photo-frame relative overflow-hidden bg-[#1c3320]', className)}>
      {!failed ? (
        <img
          src={url}
          alt={alt ?? caption}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          style={{ objectPosition: position }}
          className={cx('absolute inset-0 h-full w-full object-cover transition-opacity duration-700', loaded ? 'opacity-100' : 'opacity-0', kenburns && 'animate-kenburns', imgClassName)}
        />
      ) : null}
      {(failed || !loaded) && (
        <div className={cx('absolute inset-0 bg-gradient-to-br', tones[entry?.tone ?? 'field'])} aria-hidden={!failed}>
          {/* furrow lines: a quiet nod to planted rows */}
          <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: 'repeating-linear-gradient(115deg, rgba(219,228,122,.55) 0 1px, transparent 1px 22px)' }} />
          {failed && (
            <div className="photo-cap absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              <span className="text-[11px] font-semibold uppercase tracking-label text-canvas/75">{caption}</span>
              <LogoMark size={18} className="opacity-70" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
