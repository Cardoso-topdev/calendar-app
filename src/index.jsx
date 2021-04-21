import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastProvider } from 'react-toast-notifications';
import './main.css'
import persistorBuilder from './store'
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history'
import Toaster from './components/Toaster'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const THEME = createMuiTheme({
  typography: {
   "fontFamily": `"Monda", sans-serif`,
  }
});

const {store, persistor} = persistorBuilder()

render(
  <MuiThemeProvider theme={THEME}>
    <BrowserRouter history={createBrowserHistory()}>
      <Provider store={store}>
        <ToastProvider
          autoDismiss
          autoDismissTimeout={6000}
          placement="top-center"
        >
          <PersistGate loading={null} persistor={persistor}>
            <Toaster>
              <App />
            </Toaster>
          </PersistGate>
        </ToastProvider>
      </Provider>
    </BrowserRouter>
  </MuiThemeProvider>,
  document.getElementById("root")
);