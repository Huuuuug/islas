import { createRoot } from 'react-dom/client';
import { App } from './App';
// import siteData from 'islas:site-data'

function renderInBrowser() {
  const containerEl = document.getElementById('root');
  if (!containerEl) {
    throw new Error('#root element not found');
  }
  createRoot(containerEl).render(<App />);
}

renderInBrowser();
