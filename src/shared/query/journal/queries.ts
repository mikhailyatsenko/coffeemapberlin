import { gql } from '@apollo/client';

export const GET_JOURNAL_ARTICLES = gql`
  query GetArticles {
    articles {
      documentId
      title
      slug
      description
      tags
      publishedAt
      coverImage {
        url
        formats
        width
        height
        alternativeText
      }
      gallery {
        url
        formats
        alternativeText
      }
      seo {
        metaTitle
        metaDescription
        keywords
        canonicalURL
        metaImage {
          url
        }
      }
    }
  }
`;

export const GET_JOURNAL_ARTICLE = gql`
  query GetArticle($slug: String!) {
    articles(filters: { slug: { eq: $slug } }) {
      documentId
      title
      slug
      description
      content
      author
      featured
      tags
      viewCount
      publishedAt
      createdAt
      updatedAt
      coverImage {
        url
        formats
        width
        height
        alternativeText
      }
      gallery {
        url
        formats
        alternativeText
        width
        height
      }
      seo {
        metaTitle
        metaDescription
        canonicalURL
        metaImage {
          url
        }
      }
    }
  }
`;
