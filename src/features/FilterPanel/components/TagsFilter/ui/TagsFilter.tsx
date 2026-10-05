import { memo } from 'react';
import { toggleTag } from 'shared/stores/filters';
import { BadgePill } from 'shared/ui/BadgePill';
import { useTagsFilter } from '../model/useTagsFilter';
import cls from './TagsFilter.module.scss';

interface TagsFilterProps {
  isMobile: boolean;
  availableTags: string[];
  selectedTags: string[];
}

const TagsFilterComponent = ({ isMobile, availableTags, selectedTags }: TagsFilterProps) => {
  const { query, setQuery, clearQuery, handleSearchKeyDown, visibleTags, canExpand, isExpanded, toggleExpanded } =
    useTagsFilter(availableTags, selectedTags);

  if (availableTags.length === 0) return null;

  return (
    <div className={cls.filterSection}>
      <h3 className={cls.sectionTitle}>Features (meets all selected)</h3>

      <div className={cls.searchField}>
        <svg className={cls.searchIcon} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input
          className={cls.searchInput}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search features"
          aria-label="Search features"
          autoComplete="off"
        />
        {query && (
          <button className={cls.clearButton} type="button" onClick={clearQuery} aria-label="Clear features search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>

      {visibleTags.length > 0 ? (
        <div className={cls.tagsContainer}>
          {visibleTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                className={cls.tagButton}
                onClick={() => {
                  toggleTag(tag);
                }}
                type="button"
                aria-pressed={isSelected}
              >
                <BadgePill
                  hover={isMobile ? undefined : 'orange'}
                  text={tag}
                  color={isSelected ? 'orange' : 'gray'}
                  size="medium"
                />
              </button>
            );
          })}
        </div>
      ) : (
        <p className={cls.noMatches}>
          No features match “{query.trim()}”{' '}
          <button className={cls.textButton} type="button" onClick={clearQuery}>
            Clear search
          </button>
        </p>
      )}

      {canExpand && (
        <button className={cls.textButton} type="button" onClick={toggleExpanded} aria-expanded={isExpanded}>
          {isExpanded ? 'Show fewer' : `Show all ${availableTags.length} features`}
        </button>
      )}
    </div>
  );
};

export const TagsFilter = memo(TagsFilterComponent);
