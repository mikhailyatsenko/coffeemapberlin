import './index.scss';

import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import App from './app/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
