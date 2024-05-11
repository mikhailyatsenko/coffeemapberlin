import cls from './Places.module.scss';

export function Places() {
  return (
    <div className={cls.Places}>
      <h3>Marker, Popup, NavigationControl and FullscreenControl </h3>
      <p>Map showing top 20 most populated cities of the United States. Click on a marker to learn more.</p>
      <p>
        Data source: <a href="https://en.wikipedia.org/wiki/List_of_United_States_cities_by_population">Wikipedia</a>
      </p>
      <div className="source-link">
        <a href="https://github.com/visgl/react-map-gl/tree/7.1-release/examples/controls" target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}
