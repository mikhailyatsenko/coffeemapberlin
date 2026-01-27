import { memo } from 'react';
import { toggleTag } from 'shared/stores/filters';
import { BadgePill } from 'shared/ui/BadgePill';
import cls from './TagsFilter.module.scss';

interface TagsFilterProps {
  availableTags: Array<{ tag: string; category: string }>;
  selectedTags: string[];
}

const TagsFilterComponent = ({ availableTags, selectedTags }: TagsFilterProps) => {
  if (availableTags.length === 0) return null;

  return (
    <div className={cls.filterSection}>
      <h3 className={cls.sectionTitle}>Features (meets all selected)</h3>
      <div className={cls.tagsContainer}>
        {availableTags.map((tagObj) => {
          const tag = String(tagObj.tag);
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              className={`${cls.tagButton}`}
              onClick={() => {
                toggleTag(tag);
              }}
              type="button"
            >
              <BadgePill hover="orange" text={tag} color={isSelected ? 'orange' : 'gray'} size="medium" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const TagsFilter = memo(TagsFilterComponent);
