import clsx from 'clsx';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { AllPlaces } from '../components/AllPlaces';
import { NeighborhoodHeader, NeighborhoodSummary, NeighborhoodSummarySkeleton } from '../components/NeighborhoodHeader';
import { SectionSwitcher, SectionSwitcherSkeleton } from '../components/SectionSwitcher';
import { ShortlistBlock, ShortlistBlockSkeleton } from '../components/ShortlistBlock';
import { TopRatedPlaces, TopRatedPlacesSkeleton } from '../components/TopRatedPlaces';
import { SWITCHER_MIN_SECTIONS } from '../constants';
import { useScrollToHash } from '../hooks/useScrollToHash';
import { switcherSections } from '../lib/switcherSections';
import { useNeighborhoodAnalytics } from '../model/useNeighborhoodAnalytics';
import { useNeighborhoodPlaces } from '../model/useNeighborhoodPlaces';
import { type NeighborhoodPageProps } from '../types';
import cls from './NeighborhoodPage.module.scss';

export const NeighborhoodPage = ({ notFound }: NeighborhoodPageProps) => {
  const { neighborhood: slug } = useParams<{ neighborhood: string }>();
  const { status, displayNeighborhood, topRated, shortlists, all, total } = useNeighborhoodPlaces(slug);
  const { trackShortlistView, trackShortlistMapOpen, trackCardOpen, trackNeighborhoodMapOpen, trackNavClick } =
    useNeighborhoodAnalytics({
      slug,
      neighborhood: displayNeighborhood,
      shortlistsShown: shortlists.length,
      placesTotal: total,
      isLoaded: status === 'loaded',
    });
  useScrollToHash(status === 'loaded');
  const sections = switcherSections({ hasTopRated: topRated.length > 0, shortlists, placesTotal: total });
  const hasSwitcher = status === 'loaded' && sections.length >= SWITCHER_MIN_SECTIONS;
  const isLoading = status === 'loading';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (status === 'notFound') return notFound;

  return (
    <main className={clsx(cls.NeighborhoodPage, (hasSwitcher || isLoading) && cls.withSwitcher, 'container')}>
      <Helmet>
        <title>{`Best Coffee Places in ${displayNeighborhood} | Berlin Coffee Map`}</title>
      </Helmet>
      <NeighborhoodHeader neighborhood={displayNeighborhood}>
        {isLoading && <NeighborhoodSummarySkeleton />}
        {status === 'loaded' && (
          <NeighborhoodSummary
            neighborhood={displayNeighborhood}
            numbers={{ placesTotal: total, topRatedTotal: topRated.length }}
            onMapOpen={trackNeighborhoodMapOpen}
          />
        )}
      </NeighborhoodHeader>
      {isLoading && (
        <>
          <p role="status" className="sr-only">
            Loading the Places…
          </p>
          {/* The page's shape in grey, so nothing jumps when the Places arrive: the usual switcher, Top rated and a Shortlist. */}
          <div aria-hidden="true">
            <SectionSwitcherSkeleton />
            <TopRatedPlacesSkeleton />
            <ShortlistBlockSkeleton />
          </div>
        </>
      )}
      {status === 'error' && (
        <div className={cls.emptyState}>
          <p>Couldn’t load the Places. Please try again later.</p>
        </div>
      )}
      {status === 'loaded' && (
        <>
          {hasSwitcher && <SectionSwitcher sections={sections} onNavigate={trackNavClick} />}
          <TopRatedPlaces
            places={topRated}
            neighborhood={displayNeighborhood}
            onCardOpen={() => {
              trackCardOpen('top_rated');
            }}
            onMapOpen={() => {
              trackShortlistMapOpen('top_rated', topRated.length);
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
