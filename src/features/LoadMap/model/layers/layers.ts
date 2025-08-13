import type { LayerProps } from 'react-map-gl/maplibre';

export const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'places',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#303030', 100, '#f1f075', 750, '#f28cb1'],
    'circle-radius': ['step', ['get', 'point_count'], 16, 100, 30, 750, 40],
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff',
  },
};

export const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'places',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-size': 14,
    'text-allow-overlap': true,
  },
  paint: {
    'text-color': '#fafafa',
  },
};

export const unclusteredPointLayer: LayerProps = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'places',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#ff4b34',
    'circle-radius': 6,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  },
};

export const namesLayer: LayerProps = {
  id: 'place_title',
  type: 'symbol',
  source: 'places',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'text-field': '{name}',
    'text-justify': 'left',
    'text-max-width': 15,
    'text-size': 13,
    'text-allow-overlap': true,
    'text-anchor': 'left',
    'text-offset': [1, 0],
  },
};
