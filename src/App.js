import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/login-page';
import RegisterPage from './pages/login/register-user';
import PasswordChange from './pages/login/password-change';
import PasswordReset from './pages/login/password-reset';
import Main from './pages/main/main';
import Decoy from './pages/decoy';
import VerifyAwaiting from './pages/login/verification-awaiting';
import VerificationAcceptance from './pages/login/verification-acceptance';

function App() {

  return (
    <Router>
      <Routes>
        <Route path={process.env.PUBLIC_URL + '/'} exact element={<LoginPage/>} />
        <Route path={process.env.PUBLIC_URL + '/register'}  exact element={<RegisterPage/>} />
        <Route path={process.env.PUBLIC_URL + '/verify/awaiting'} exact element={<VerifyAwaiting/>} />
        <Route path={process.env.PUBLIC_URL + '/verify'} exact element={<VerificationAcceptance/>} />
        <Route path={process.env.PUBLIC_URL + '/passwordreset'}  exact element={<PasswordReset/>} />
        <Route path={process.env.PUBLIC_URL + '/passwordchange'}  exact element={<PasswordChange/>} />
        <Route path={process.env.PUBLIC_URL + '/main'}  exact element={<Main/>} />
      </Routes>
    </Router>
  );
}

export default App;
