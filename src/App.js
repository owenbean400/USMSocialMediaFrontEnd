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
        <Route path={'/'} exact element={<LoginPage/>} />
        <Route path={'/register'}  exact element={<RegisterPage/>} />
        <Route path={'/verify/awaiting'} exact element={<VerifyAwaiting/>} />
        <Route path={'/verify'} exact element={<VerificationAcceptance/>} />
        <Route path={'/passwordreset'}  exact element={<PasswordReset/>} />
        <Route path={'/passwordchange'}  exact element={<PasswordChange/>} />
        <Route path={'/main'}  exact element={<Main/>} />
      </Routes>
    </Router>
  );
}

export default App;
