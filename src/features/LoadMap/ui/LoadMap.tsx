import { type GeoJSONSource } from 'maplibre-gl';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Map as MapGL, Source, Layer, Popup, GeolocateControl, NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef, MapLayerMouseEvent, LngLatLike, MapGeoJSONFeature } from 'react-map-gl/maplibre';
import { TooltipCardOnMap } from 'entities/TooltipCardOnMap';
import { type GetPlacesQuery } from 'shared/generated/graphql';
import { useWidth } from 'shared/hooks';
import { usePlacesStore } from 'shared/stores/places';
// import { MapSkeleton } from '../components/MapSkeleton';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer, namesLayer } from '../model/layers/layers';
import { type LoadMapProps } from '../types';

type MyMapFeature = Omit<MapGeoJSONFeature, 'geometry'> & GetPlacesQuery['places']['places'][number];
type PlaceProps = GetPlacesQuery['places']['places'][number]['properties'];

export const LoadMap = ({ placesGeo }: LoadMapProps) => {
  const mapRef = useRef<MapRef>(null);

  const currentPlacePosition = usePlacesStore((state) => state.currentPlacePosition);

  const [eventFeatureData, setEventFeatureData] = useState<MyMapFeature | null>(null);
  const [tooltipCurrentData, setTooltipCurrentData] = useState<
    GetPlacesQuery['places']['places'][number]['properties'] | null
  >(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const screenWidth = useWidth();

  useEffect(() => {
    if (!isMapLoaded) return;
    if (currentPlacePosition && mapRef.current) {
      mapRef.current.flyTo({
        center: currentPlacePosition as LngLatLike,
        zoom: 17,
        offset: [screenWidth < 768 ? 0 : 220, 0],
      });
    }
  }, [currentPlacePosition, screenWidth, isMapLoaded]);

  const interactiveLayerIds = useMemo(() => [unclusteredPointLayer.id!, clusterLayer.id!, namesLayer.id!], []);

  const sourceData = useMemo(() => placesGeo as GeoJSON.FeatureCollection<GeoJSON.Geometry>, [placesGeo]);

  const idToPropertiesMap = useMemo(() => {
    const propsById = new Map<PlaceProps['id'], PlaceProps>();
    for (const feature of placesGeo.features as Array<{ properties: PlaceProps }>) {
      if (feature?.properties?.id) {
        propsById.set(feature.properties.id, feature.properties);
      }
    }
    return propsById;
  }, [placesGeo.features]);

  const onClick = useCallback(async (event: MapLayerMouseEvent) => {
    event.originalEvent.stopPropagation();

    const featureFromEvent = event.features?.[0];

    if (!featureFromEvent) {
      setEventFeatureData(null);
      return;
    }

    switch (featureFromEvent?.layer?.id) {
      case 'clusters': {
        const clusterId: number | undefined = featureFromEvent.properties?.cluster_id;
        if (clusterId == null) {
          break;
        }

        const source: GeoJSONSource | undefined = mapRef.current?.getSource('places');

        const zoom = await source?.getClusterExpansionZoom(clusterId);
        if (featureFromEvent.geometry.type === 'Point') {
          mapRef.current?.easeTo({
            center: featureFromEvent.geometry.coordinates as LngLatLike,
            zoom,
            duration: 500,
          });
        }
        setEventFeatureData(null);
        break;
      }
      case 'unclustered-point':
        if (featureFromEvent.geometry.type === 'Point') {
          setEventFeatureData(featureFromEvent as unknown as MyMapFeature);
        }
        break;
      case 'place_title':
        if (featureFromEvent.geometry.type === 'Point') {
          setEventFeatureData(featureFromEvent as unknown as MyMapFeature);
        }
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    if (eventFeatureData?.properties) {
      const currentData = idToPropertiesMap.get(eventFeatureData.properties.id) ?? null;
      if (currentData) {
        setTooltipCurrentData(currentData);
      }
    }
  }, [eventFeatureData, idToPropertiesMap]);

  const popupCoordinates =
    eventFeatureData?.geometry && eventFeatureData.geometry.type === 'Point'
      ? (eventFeatureData.geometry.coordinates as [number, number])
      : null;

  const handleMouseEnter = useCallback(() => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) {
      canvas.style.cursor = 'pointer';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) {
      canvas.style.cursor = '';
    }
  }, []);

  return (
    <>
      {/* {(!isMapLoaded || moreDataLoading) && <MapSkeleton />} */
      <MapGL
        reuseMaps
        initialViewState={{
          latitude: 52.5182315090094,
          longitude: 13.397000808436752,
          zoom: 12,
        }}
        minZoom={9}
        maxZoom={18}
        mapStyle="map/style.json"
        interactiveLayerIds={interactiveLayerIds}
        onClick={onClick}
        onLoad={() => {
          setIsMapLoaded(true);
        }}
        ref={mapRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Source id="places" type="geojson" data={sourceData} cluster={true} clusterMaxZoom={12} clusterRadius={30}>
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
          <Layer {...namesLayer} />
        </Source>
        {eventFeatureData && tooltipCurrentData && popupCoordinates && (
          <Popup
            closeButton={false}
            closeOnClick={false}
            anchor="top"
            longitude={Number(popupCoordinates[0])}
            latitude={Number(popupCoordinates[1])}
            onClose={() => {
              setEventFeatureData(null);
            }}
          >
            <TooltipCardOnMap properties={tooltipCurrentData} coordinates={popupCoordinates} />
          </Popup>
        )}
        {screenWidth >= 768 && (
          <>
            <NavigationControl position="bottom-right" />
            <GeolocateControl position="bottom-right" />
          </>
        )}
      </MapGL>
      {!isMapLoaded && <MapSkeleton />}
    </>
  );
};
