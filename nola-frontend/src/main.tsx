// nola-frontend/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { CubeProvider } from '@cubejs-client/react';
import cubejs from '@cubejs-client/core';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; 

const CUBEJS_TOKEN = import.meta.env.VITE_CUBEJS_TOKEN;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/cubejs-api/v1';

const cubeApi = cubejs(CUBEJS_TOKEN, {
  apiUrl: API_URL,
});

//provedor do cubejs para a aplicação react
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <CubeProvider cubeApi={cubeApi}>
      <App />
    </CubeProvider>
    </BrowserRouter>
  </React.StrictMode>
);