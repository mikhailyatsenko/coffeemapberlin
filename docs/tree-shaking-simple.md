# Tree Shaking - Краткое руководство

## Что это?

Tree shaking удаляет неиспользуемый код из финального бандла.

## Основные правила

### 1. Импорты
```typescript
// ✅ Хорошо
import { useState } from 'react';
import { format } from 'date-fns';

// ❌ Плохо
import * as React from 'react';
import * as dateFns from 'date-fns';
```

### 2. Экспорты
```typescript
// ✅ Хорошо
export const Button = () => <button>Click</button>;

// ❌ Плохо
export default { Button };
```

### 3. Библиотеки
```typescript
// ✅ Хорошо
import { debounce } from 'lodash-es';

// ❌ Плохо
import _ from 'lodash';
```

## Проверка

```bash
npm run build
npm run analyze
```

## Что уже настроено

- ✅ ES модули в package.json
- ✅ `sideEffects: false` в package.json
- ✅ Vite с tree shaking
- ✅ ESLint правила против неиспользуемого кода
- ✅ Разделение на vendor чанки 