import React from 'react';
import SignIn from './pages/SignIn';
//import SignUp from './pages/SignUp';
import GlobalStyle from './styles/global';


import AppProvider from './hooks'
import { ToastProvider } from './hooks/Toast'



const App: React.FC = () => (
  <>
    <AppProvider>
      <SignIn />
    </AppProvider>


    <GlobalStyle />
  </>
);

export default App;
