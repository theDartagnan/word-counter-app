import { createRoot } from 'react-dom/client';
import App from './common/components/App';

import './main-styles.css';

const root = createRoot(document.getElementById('appMountPoint'));

root.render(
  <App />,
);
