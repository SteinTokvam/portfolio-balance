import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { NextUIProvider } from "@nextui-org/react";
import store from './store';
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <NextUIProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </NextUIProvider>
    </Provider>
  </React.StrictMode>
);