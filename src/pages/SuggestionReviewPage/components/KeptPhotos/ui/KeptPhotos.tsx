import { photoThumbnailUrl } from '../../../lib/links';
import cls from './KeptPhotos.module.scss';

interface KeptPhotosProps {
  /** The photos Publish will keep, in upload order. */
  paths: string[];
  onRemove: (path: string) => void;
}

/** The suggestion's photos that go live with the Place; the first becomes its card image. */
export const KeptPhotos = ({ paths, onRemove }: KeptPhotosProps) => (
  <section className={cls.KeptPhotos} aria-labelledby="kept-photos-title">
    <h3 id="kept-photos-title" className={cls.heading}>
      Photos
    </h3>
    {paths.length === 0 ? (
      <p className={cls.note}>No photos, the Place keeps the default card image</p>
    ) : (
      <ul className={cls.grid} aria-label="Photos to publish">
        {paths.map((path, index) => (
          <li key={path} className={cls.item}>
            <img
              className={cls.image}
              src={photoThumbnailUrl(path)}
              alt={index === 0 ? `Photo ${index + 1}, the card image` : `Photo ${index + 1}`}
              loading="lazy"
            />
            {index === 0 && (
              <span className={cls.cardMark} aria-hidden="true">
                Card image
              </span>
            )}
            <button
              className={cls.remove}
              type="button"
              onClick={() => {
                onRemove(path);
              }}
              aria-label={`Remove photo ${index + 1}`}
            >
              <span aria-hidden="true">✕</span>
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
);
