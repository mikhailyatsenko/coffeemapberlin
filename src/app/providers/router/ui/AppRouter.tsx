import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import { Loader } from 'shared/ui/Loader';
import { routeConfig } from '../lib/routeConfig/routeConfig';

export const AppRouter = () => {
  return (
    <Routes>
      {Object.entries(routeConfig).map(([key, { element, path, children }]) => {
        if (path === RoutePaths.main) {
          return (
            <Route
              key={path}
              path={path}
              element={
                <div className="page-wrapper">
                  <Suspense fallback={<Loader />}>{element}</Suspense>
                </div>
              }
            >
              {children?.map((child, index) => (
                <Route
                  key={index}
                  path={child.path}
                  element={<Suspense fallback={<Loader />}>{child.element}</Suspense>}
                />
              ))}
            </Route>
          );
        }

        return (
          <Route
            key={key}
            path={path}
            element={
              <div className="page-wrapper">
                <Suspense fallback={<Loader />}>{element}</Suspense>
              </div>
            }
          />
        );
      })}
    </Routes>
  );
};
