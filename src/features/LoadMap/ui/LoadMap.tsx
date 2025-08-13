import { type GeoJSONSource } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { Map, Source, Layer, Popup, GeolocateControl, NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef, MapLayerMouseEvent, LngLatLike, MapGeoJSONFeature } from 'react-map-gl/maplibre';
import { TooltipCardOnMap } from 'entities/TooltipCardOnMap';
import { type GetAllPlacesQuery } from 'shared/generated/graphql';
import { useWidth } from 'shared/hooks';
import { usePlacesStore } from 'shared/stores/places';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer, namesLayer } from '../model/layers/layers';
import { type LoadMapProps } from '../types';

type MyMapFeature = Omit<MapGeoJSONFeature, 'geometry'> & GetAllPlacesQuery['places'][number];

export const LoadMap = ({ placesGeo }: LoadMapProps) => {
  const mapRef = useRef<MapRef>(null);

  const currentPlacePosition = usePlacesStore((state) => state.currentPlacePosition);

  const [eventFeatureData, setEventFeatureData] = useState<MyMapFeature | null>(null);
  const [tooltipCurrentData, setTooltipCurrentData] = useState<
    GetAllPlacesQuery['places'][number]['properties'] | null
  >(null);
  // const [isMapLoaded, setIsMapLoaded] = useState(false);

  const screenWidth = useWidth();

  useEffect(() => {
    // if (!isMapLoaded) return;
    if (currentPlacePosition) {
      mapRef?.current?.flyTo({
        center: currentPlacePosition as LngLatLike,
        zoom: 15.6,
        offset: [screenWidth < 768 ? 0 : 220, 0],
      });
    }
  }, [currentPlacePosition, screenWidth]);

  const onClick = async (event: MapLayerMouseEvent) => {
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
  };

  useEffect(() => {
    if (eventFeatureData?.properties) {
      const currentData = placesGeo.features.find(
        (propsFeature) => propsFeature.properties.id === eventFeatureData?.properties?.id,
      );
      if (currentData) {
        setTooltipCurrentData(currentData.properties);
      }
    }
  }, [eventFeatureData, placesGeo.features]);

  const popupCoordinates =
    eventFeatureData?.geometry && eventFeatureData.geometry.type === 'Point'
      ? (eventFeatureData.geometry.coordinates as [number, number])
      : null;

  return (
    <>
      <Map
        initialViewState={{
          latitude: 52.5182315090094,
          longitude: 13.397000808436752,
          zoom: 12,
        }}
        minZoom={9}
        maxZoom={18}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactiveLayerIds={[unclusteredPointLayer.id!, clusterLayer.id!, namesLayer.id!]}
        onClick={onClick}
        // onLoad={() => {
        //   setIsMapLoaded(true);
        //   const map = mapRef.current?.getMap();
        //   if (map) {
        //     try {
        //       map.showOverdrawInspector = false;
        //       map.showCollisionBoxes = false;
        //       map.showTileBoundaries = false;
        //     } catch {}
        //   }
        // }}
        ref={mapRef}
        onMouseEnter={() => {
          const canvas = mapRef.current?.getCanvas();
          if (canvas) {
            canvas.style.cursor = 'pointer';
          }
        }}
        onMouseLeave={() => {
          const canvas = mapRef.current?.getCanvas();
          if (canvas) {
            canvas.style.cursor = '';
          }
        }}
      >
        <Source
          id="places"
          type="geojson"
          data={placesGeo as GeoJSON.FeatureCollection<GeoJSON.Geometry>}
          cluster={true}
          clusterMaxZoom={12}
          clusterRadius={30}
        >
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
        <NavigationControl position="bottom-right" />
        <GeolocateControl position="bottom-right" />
      </Map>
    </>
  );
};
