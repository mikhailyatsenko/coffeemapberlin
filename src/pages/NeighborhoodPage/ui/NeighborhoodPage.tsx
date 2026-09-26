import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { Spinner } from 'shared/ui/Loader';
import { AllPlaces } from '../components/AllPlaces';
import { ShortlistBlock } from '../components/ShortlistBlock';
import { TopRatedPlaces } from '../components/TopRatedPlaces';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { useNeighborhoodAnalytics } from '../model/useNeighborhoodAnalytics';
import { useNeighborhoodPlaces } from '../model/useNeighborhoodPlaces';
import { type NeighborhoodPageProps } from '../types';
import cls from './NeighborhoodPage.module.scss';

export const NeighborhoodPage = ({ notFound }: NeighborhoodPageProps) => {
  const { neighborhood: slug } = useParams<{ neighborhood: string }>();
  const { status, displayNeighborhood, topRated, shortlists, all, total } = useNeighborhoodPlaces(slug);
  const { trackShortlistView, trackShortlistMapOpen, trackCardOpen } = useNeighborhoodAnalytics({
    slug,
    neighborhood: displayNeighborhood,
    shortlistsShown: shortlists.length,
    placesTotal: total,
    isLoaded: status === 'loaded',
  });
  useScrollToHash(status === 'loaded');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (status === 'notFound') return notFound;

  return (
    <main className={`${cls.NeighborhoodPage} container`}>
      <Helmet>
        <title>{`Best Coffee Places in ${displayNeighborhood} | Berlin Coffee Map`}</title>
      </Helmet>
      <div className={cls.header}>
        <h1>Best Coffee Places in {displayNeighborhood}</h1>
        <p className={cls.subtitle}>The top rated Places first, then every Place on the map</p>
      </div>
      {status === 'loading' && (
        <div className={cls.loadingState}>
          <Spinner size="lg" />
          <p>Loading places...</p>
        </div>
      )}
      {status === 'error' && (
        <div className={cls.emptyState}>
          <p>Couldn’t load the Places. Please try again later.</p>
        </div>
      )}
      {status === 'loaded' && (
        <>
          <TopRatedPlaces
            places={topRated}
            onCardOpen={() => {
              trackCardOpen('top_rated');
            }}
          />
          {shortlists.map((shortlist) => (
            <ShortlistBlock
              key={`${slug}-${shortlist.id}`}
              shortlist={shortlist}
              neighborhood={displayNeighborhood}
              onView={() => {
                trackShortlistView(shortlist.id);
              }}
              onCardOpen={() => {
                trackCardOpen(shortlist.id);
              }}
              onMapOpen={() => {
                trackShortlistMapOpen(shortlist.id, shortlist.total);
              }}
            />
          ))}
          <AllPlaces
            key={slug}
            neighborhood={displayNeighborhood}
            places={all}
            total={total}
            onCardOpen={() => {
              trackCardOpen('all');
            }}
          />
        </>
      )}
    </main>
  );
};
