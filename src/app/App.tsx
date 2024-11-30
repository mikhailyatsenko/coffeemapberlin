import { useLocation, matchPath } from 'react-router-dom';
import { AuthModalWindow } from 'widgets/AuthModalWindow';
import { Footer } from 'widgets/Footer';
import { Navbar } from 'widgets/Navbar';
import { AppRouter } from './providers/router';
import { AppRoutes } from './providers/router/lib/routeConfig/routeConfig';
const App = () => {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <main>
        <AppRouter />
      </main>

      {!matchPath(AppRoutes.MAIN, location.pathname) && <Footer />}
      <AuthModalWindow />
    </>
  );
};

export default App;
