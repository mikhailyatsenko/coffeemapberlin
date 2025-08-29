import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routeConfig } from '../lib/routeConfig/routeConfig';

export const AppRouter = () => {
  return (
    <Routes>
      {Object.entries(routeConfig).map(([key, { element, path }]) => {
        return (
          <Route
            key={key}
            path={path}
            element={
              <div className="page-wrapper">
                <Suspense>{element}</Suspense>
              </div>
            }
          />
        );
      })}
    </Routes>
  );
};
