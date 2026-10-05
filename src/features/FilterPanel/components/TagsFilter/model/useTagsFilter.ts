import { useMemo, useState, type KeyboardEvent } from 'react';
import { COMMON_FEATURES } from '../../../constants';
import { getVisibleTags } from '../lib/getVisibleTags';

/** Search text and "Show all" state of the Features section; both reset when the modal remounts it */
export const useTagsFilter = (availableTags: string[], selectedTags: string[]) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const { tags: visibleTags, canExpand } = useMemo(
    () => getVisibleTags({ availableTags, selectedTags, commonTags: COMMON_FEATURES, query, isExpanded }),
    [availableTags, selectedTags, query, isExpanded],
  );

  const clearQuery = () => {
    setQuery('');
  };

  const toggleExpanded = () => {
    setIsExpanded((value) => !value);
  };

  // Escape with text clears the search; it must not reach the modal's document-level Escape handler
  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && query) {
      e.stopPropagation();
      clearQuery();
    }
  };

  return {
    query,
    setQuery,
    clearQuery,
    handleSearchKeyDown,
    visibleTags,
    canExpand,
    isExpanded,
    toggleExpanded,
  };
};
