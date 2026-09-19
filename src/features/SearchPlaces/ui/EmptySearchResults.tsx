import { memo } from 'react';
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
  </div>
);

export const EmptySearchResults = memo(EmptySearchResultsComponent);
