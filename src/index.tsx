import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import './css/fonts.css';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { initI18n } from './utils/i18n';

// Call the element loader before the render call

const container = document.getElementById('root');
const root = createRoot(container!);


initI18n().then(() => {
  defineCustomElements(window);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

})
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
