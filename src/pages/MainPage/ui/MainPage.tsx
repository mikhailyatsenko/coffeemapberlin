import { Outlet } from 'react-router-dom';
import { MainMap } from 'widgets/Map';
import { PlacesList } from 'widgets/PlacesList';

export const MainPage = () => {
  return (
    <>
      <MainMap />
      <PlacesList />
      <Outlet />
    </>
  );
};
