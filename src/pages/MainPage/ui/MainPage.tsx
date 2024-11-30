import { Outlet } from 'react-router-dom';
import { MainMap } from 'widgets/Map';
import { PlacesList } from 'widgets/PlacesList';
import { ShowFavoritePlaces } from 'features/ShowFavoritePlaces';

export const MainPage = () => {
  return (
    <>
      <MainMap />
      <PlacesList />
      <ShowFavoritePlaces />
      <Outlet />
    </>
  );
};
