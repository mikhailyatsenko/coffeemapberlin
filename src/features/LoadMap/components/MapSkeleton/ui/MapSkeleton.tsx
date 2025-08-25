import cls from './MapSkeleton.module.scss';

const Map = () => (
  <div className={cls.mapSkeleton}>
    <div className={cls.loadingText}>Map is preparing...</div>
  </div>
);

// const PlaceCardSkeleton = () => (
//   <div className={cls.placeCardSkeleton}>
//     <div className={cls.cardContent}>
//       <div className={cls.imageBox}></div>
//       <div className={cls.textContent}>
//         <div className={cls.titleBar}></div>
//         <div className={cls.subtitleBar}></div>
//         <div className={cls.descBar}></div>
//       </div>
//     </div>
//   </div>
// );

// const PlacesListSkeleton = () => (
//   <div className={cls.placesListSkeleton}>
//     <div className={cls.headerBar}></div>
//     {[1, 2, 3, 4, 5].map((i) => (
//       <PlaceCardSkeleton key={i} />
//     ))}
//   </div>
// );

export const MapSkeleton = () => (
  <div className={cls.mainPageSkeleton}>
    <div className={cls.mapContainer}>
      <Map />

      {/* <div className={cls.floatingList}>
        <PlacesListSkeleton />
      </div> */}

      <div className={cls.favoritesButton}>
        <div className={cls.buttonSkeleton}></div>
      </div>
    </div>
  </div>
);
