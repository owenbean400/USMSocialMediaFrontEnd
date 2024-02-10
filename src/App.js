import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/login-page';
import RegisterPage from './pages/login/register-user';
import Main from './pages/main/main';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<LoginPage/>} />
        <Route path='/register' exact element={<RegisterPage/>} />
        <Route path='/main' exact element={<Main/>} />
      </Routes>
    </Router>
  );
}

export default App;
