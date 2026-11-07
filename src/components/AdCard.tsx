import { useState } from 'react';
import { UPLOADS_BASE_URL } from '../services/api';
import type { Ad } from '../types/Ad';

interface AdCardProps {
  ad: Ad;
  currency: string;
}

function imageUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${UPLOADS_BASE_URL}/${path.replace(/^\/+/, '')}`;
}

export function AdCard({ ad, currency }: AdCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const price = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(ad.price);

  return (
    <article className="ad-card">
      <div className="ad-card__image-wrap">
        {ad.image_url && !imageFailed ? (
          <img
            src={imageUrl(ad.image_url)}
            alt={ad.title}
            className="ad-card__image"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="ad-card__placeholder" role="img" aria-label="Фото отсутствует">
            <span>Фото отсутствует</span>
          </div>
        )}
      </div>
      <div className="ad-card__body">
        <h3>{ad.title}</h3>
        <p className="ad-card__description">{ad.description}</p>
        <p className="ad-card__price">{price}</p>
      </div>
    </article>
  );
}
