import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/login-page';
import RegisterPage from './pages/login/register-user';
import Main from './pages/main/main';

function App() {

  return (
    <Router>
      <Routes>
        <Route path={process.env.PUBLIC_URL + '/'} exact element={<LoginPage/>} />
        <Route path={process.env.PUBLIC_URL + '/register'}  exact element={<RegisterPage/>} />
        <Route path={process.env.PUBLIC_URL + '/main'}  exact element={<Main/>} />
      </Routes>
    </Router>
  );
}

export default App;
