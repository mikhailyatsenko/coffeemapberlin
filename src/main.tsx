import './index.scss';
// import 'maplibre-gl/dist/maplibre-gl.css';

import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import App from './app/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
