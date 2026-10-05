interface GetVisibleTagsParams {
  availableTags: string[];
  selectedTags: string[];
  commonTags: readonly string[];
  query: string;
  isExpanded: boolean;
}

interface VisibleTags {
  tags: string[];
  /** Whether the "Show all" / "Show fewer" toggle applies */
  canExpand: boolean;
}

const normalize = (value: string) => value.toLowerCase().replace(/[\s-]/g, '');

/** Which Features the section shows; always in `availableTags` order */
export const getVisibleTags = ({
  availableTags,
  selectedTags,
  commonTags,
  query,
  isExpanded,
}: GetVisibleTagsParams): VisibleTags => {
  const normalizedQuery = normalize(query.trim());
  if (normalizedQuery) {
    return {
      tags: availableTags.filter((tag) => normalize(tag).includes(normalizedQuery)),
      canExpand: false,
    };
  }

  const hasCommon = availableTags.some((tag) => commonTags.includes(tag));
  const collapsedTags = availableTags.filter((tag) => commonTags.includes(tag) || selectedTags.includes(tag));
  const canExpand = hasCommon && collapsedTags.length < availableTags.length;

  return { tags: canExpand && !isExpanded ? collapsedTags : availableTags, canExpand };
};
