# PlacesList Widget

Виджет для отображения списка мест с виртуализацией для оптимизации производительности.

## Архитектура

Модуль следует FSD архитектуре и разделен на следующие компоненты:

### Основные компоненты

- **PlacesList** - главный компонент виджета
- **VirtualizedList** - компонент для виртуализации списка
- **VirtualizedItem** - компонент для отображения отдельного элемента
- **ContainerSizeManager** - компонент для управления размерами контейнера

### Структура

```
src/widgets/PlacesList/
├── components/
│   ├── VirtualizedList/
│   │   ├── components/
│   │   │   └── VirtualizedItem/
│   │   │       ├── ui/
│   │   │       │   ├── VirtualizedItem.tsx
│   │   │       │   └── VirtualizedItem.module.scss
│   │   │       ├── types/
│   │   │       │   └── index.ts
│   │   │       └── index.ts
│   │   ├── ui/
│   │   │   └── VirtualizedList.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   └── ContainerSizeManager/
│       ├── ui/
│       │   └── ContainerSizeManager.tsx
│       ├── types/
│       │   └── index.ts
│       └── index.ts
├── constants/
│   └── index.ts
├── types/
│   └── index.ts
├── ui/
│   ├── PlacesList.tsx
│   └── PlacesList.module.scss
├── index.ts
└── README.md
```

## Особенности

### Виртуализация
- **Мобильная версия**: горизонтальная прокрутка с фиксированными размерами
- **Десктопная версия**: вертикальная прокрутка с динамическими размерами элементов

### Производительность
- Использование `react-window` для эффективной виртуализации
- Кэширование высот элементов для десктопной версии
- Мемоизация компонентов для предотвращения лишних ререндеров

### Адаптивность
- Автоматическое определение мобильной/десктопной версии
- Динамическое управление размерами контейнера
- Использование ResizeObserver для отслеживания изменений размеров

## Использование

```tsx
import { PlacesList } from 'widgets/PlacesList';

<PlacesList places={places} isReady={true} />
```

## Пропсы

- `places: Place[]` - массив мест для отображения
- `isReady?: boolean` - флаг готовности данных
