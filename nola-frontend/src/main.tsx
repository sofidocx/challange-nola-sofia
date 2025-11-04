// nola-frontend/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { CubeProvider } from '@cubejs-client/react';
import cubejs from '@cubejs-client/core';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; 

const CUBEJS_TOKEN = import.meta.env.VITE_CUBEJS_TOKEN || '6066b66a059206035b0330e54da3794fa63e53bb5af0b889c535f482ba0bbf09a41a0f12026a6a25662edae48d22d184f821a16dbfec84f57733ed59d18271e3';
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