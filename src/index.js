import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '~/redux/store';
import App from './App';
import GlobalStyles from './components/GlobalStyles';
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <BrowserRouter>
          <GlobalStyles>
            <App />
          </GlobalStyles>
        </BrowserRouter>
      </CookiesProvider>
    </PersistGate>
  </Provider>,
);
