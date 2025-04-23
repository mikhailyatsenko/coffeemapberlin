import { useContext, useEffect, useRef, useState } from 'react';
import { Map, Source, Layer, Popup, GeolocateControl, NavigationControl } from 'react-map-gl';
import type { MapRef, GeoJSONSource, MapLayerMouseEvent, LngLatLike, MapboxGeoJSONFeature } from 'react-map-gl';
import { TooltipCardOnMap } from 'entities/TooltipCardOnMap';
import { LocationContext } from 'shared/context/Location/LocationContext';
import { useWidth } from 'shared/hooks';
import { type PlaceResponse, type PlaceProperties } from 'shared/types';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer, namesLayer } from '../model/layers/layers';

const MAPBOX_TOKEN = process.env.MAPBOX_API;

export interface PlacesDataWithGeo extends GeoJSON.FeatureCollection<GeoJSON.Geometry, PlaceProperties> {
  features: PlaceResponse[];
}

interface LoadMapProps {
  placesGeo: PlacesDataWithGeo;
}

export const LoadMap = ({ placesGeo }: LoadMapProps) => {
  const mapRef = useRef<MapRef>(null);

  const { location } = useContext(LocationContext);

  type MyMapboxGeoJSONFeature = MapboxGeoJSONFeature & PlaceResponse;

  const [eventFeatureData, setEventFeatureData] = useState<MyMapboxGeoJSONFeature | null>(null);
  const [tooltipCurrentData, setTooltipCurrentData] = useState<PlaceProperties | null>(null);

  const screenWidth = useWidth();

  useEffect(() => {
    if (location) {
      mapRef?.current?.flyTo({
        center: location as LngLatLike,
        zoom: 15.6,
        offset: [screenWidth < 768 ? 0 : 220, 0],
      });
    }
  }, [location, screenWidth]);

  const onClick = (event: MapLayerMouseEvent) => {
    event.originalEvent.stopPropagation();

    const featureFromEvent = event.features?.[0] as MyMapboxGeoJSONFeature;

    if (!featureFromEvent) {
      setEventFeatureData(null);
      return;
    }

    switch (featureFromEvent?.layer?.id) {
      case 'clusters': {
        const clusterId: number = featureFromEvent.properties?.cluster_id;

        const mapboxSource = mapRef.current!.getSource('places') as GeoJSONSource;

        mapboxSource.getClusterExpansionZoom(clusterId, (err: Error | null, zoom) => {
          if (!err) {
            mapRef?.current?.easeTo({
              center: featureFromEvent.geometry.coordinates as LngLatLike,
              zoom,
              duration: 500,
            });
          }
        });
        setEventFeatureData(null);
        break;
      }
      case 'unclustered-point':
        if (featureFromEvent.geometry.type === 'Point') {
          setEventFeatureData(null);
        }
        break;
      case 'place_title':
        if (featureFromEvent.geometry.type === 'Point') {
          setEventFeatureData(featureFromEvent);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (eventFeatureData?.properties) {
      const currentData = placesGeo.features.find(
        (propsFeature) => propsFeature.properties.id === eventFeatureData.properties.id,
      );
      if (currentData) {
        setTooltipCurrentData(currentData.properties);
      }
    }
  }, [eventFeatureData, placesGeo.features]);

  return (
    <>
      <Map
        initialViewState={{
          latitude: 52.5182315090094,
          longitude: 13.397000808436752,
          zoom: 12,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[unclusteredPointLayer.id!, clusterLayer.id!, namesLayer.id!]}
        onClick={onClick}
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
        <Source id="places" type="geojson" data={placesGeo} cluster={true} clusterMaxZoom={12} clusterRadius={30}>
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
          <Layer {...namesLayer} />
        </Source>
        {eventFeatureData && tooltipCurrentData && (
          <Popup
            closeButton={false}
            closeOnClick={false}
            anchor="top"
            longitude={Number(eventFeatureData.geometry.coordinates[0])}
            latitude={Number(eventFeatureData.geometry.coordinates[1])}
            onClose={() => {
              setEventFeatureData(null);
            }}
          >
            <TooltipCardOnMap properties={tooltipCurrentData} coordinates={eventFeatureData.geometry.coordinates} />
          </Popup>
        )}
        <NavigationControl position="bottom-right" />
        <GeolocateControl position="bottom-right" />
      </Map>
    </>
  );
};
