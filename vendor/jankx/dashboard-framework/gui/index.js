   // src/index.js
   import React from 'react';
   import { createRoot } from 'react-dom/client';
   import { Provider } from 'react-redux';
   import store from './store'; // Import store
   import OptionFrameworkApp from './components/OptionFrameworkApp';
   import { ChakraProvider } from '@chakra-ui/react';

   // Sử dụng dữ liệu từ PHP
   const optionsData = window.optionsData;

   document.addEventListener('DOMContentLoaded', () => {
       const container = document.getElementById('option-framework-app');
       const root = createRoot(container);
       root.render(
           <Provider store={store}>
               <ChakraProvider>
                   <OptionFrameworkApp optionsData={optionsData} instanceName="my_custom_theme" />
               </ChakraProvider>
           </Provider>
       );
   });
