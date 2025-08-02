# GraphQL Queries Organization

This directory contains all GraphQL queries and mutations organized by domain.

## Structure

```
src/shared/query/
├── auth/           # Authentication queries and mutations
├── places/         # Places-related queries and mutations
├── reviews/        # Reviews and ratings
├── user/           # User profile and settings
├── contact/        # Contact form
└── index.ts        # Main export file
```

## Usage

### Import specific queries
```typescript
import { LOGIN_WITH_GOOGLE, CURRENT_USER } from '@/shared/query/auth';
import { PLACES, TOGGLE_FAVORITE } from '@/shared/query/places';
import { PLACE_REVIEWS, ADD_REVIEW } from '@/shared/query/reviews';
```

### Import all queries
```typescript
import * as Queries from '@/shared/query';
```

### Using generated types and hooks
```typescript
import { useLoginWithGoogleMutation, usePlacesQuery } from '@/shared/generated/graphql';
```