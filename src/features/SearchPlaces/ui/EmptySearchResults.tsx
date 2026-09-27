import { memo } from 'react';
import { Link } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import { setSearchQuery } from 'shared/stores/filters';
import cls from './SearchPlaces.module.scss';

interface EmptySearchResultsProps {
  query: string;
}

const EmptySearchResultsComponent = ({ query }: EmptySearchResultsProps) => (
  <div className={cls.emptyResults}>
    <p className={cls.emptyText}>
      No coffee shops found for <b>“{query.trim()}”</b>
    </p>
    <button
      className={cls.emptyButton}
      type="button"
      onClick={() => {
        setSearchQuery('');
      }}
    >
      Clear search
    </button>
    <p className={cls.emptySuggest}>
      Not on the map yet? <Link to={`/${RoutePaths.suggestPlace}`}>Suggest it</Link>
    </p>
  </div>
);

export const EmptySearchResults = memo(EmptySearchResultsComponent);
