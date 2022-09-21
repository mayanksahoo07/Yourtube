import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ChakraProvider , ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";
import { MoralisProvider } from "react-moralis";
import theme from './theme'
import './styles.css'

const id = process.env.REACT_APP_APP_SERVER_ID
const url = process.env.REACT_APP_APP_SERVER_URL

ReactDOM.render(
  <React.StrictMode>
    
    <ChakraProvider provider={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>    
      <MoralisProvider serverUrl={url} appId={id}>
          <App />
      </MoralisProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


