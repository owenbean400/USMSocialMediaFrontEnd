import React from 'react';
import { HashRouter  as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/login-page';
import RegisterPage from './pages/login/register-user';
import PasswordChange from './pages/login/password-change';
import PasswordReset from './pages/login/password-reset';
import Main from './pages/main/main';
import Profile from './pages/profile/profile';
import UserPage from './pages/userpage/userpage';
import UserPost from './pages/userpage/usersubpage/userpost';
import UserFollowingsPageSection from './pages/userpage/usersubpage/userfollowings';
import UserFollowersPageSection from './pages/userpage/usersubpage/userfollowers';
import VerifyAwaiting from './pages/login/verification-awaiting';
import VerificationAcceptance from './pages/login/verification-acceptance';
import { Provider } from 'react-redux';
import store from './redux/store';
import Discover from './pages/discovery/discover';
import PostPage from './pages/post/postpage';

function App() {

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path={'/'} exact element={<LoginPage/>} />
          <Route path={'/register'}  exact element={<RegisterPage/>} />
          <Route path={'/verify/awaiting'} exact element={<VerifyAwaiting/>} />
          <Route path={'/verify/:verificationToken'} element={<VerificationAcceptance/>} />
          <Route path={'/passwordreset'}  exact element={<PasswordReset/>} />
          <Route path={'/passwordchange/:emailAddr/:resetToken'} element={<PasswordChange/>} />
          <Route path={'/main'}  exact element={<Main/>} />
          <Route path={'/profile'}  exact element={<Profile/>} />
          <Route path={'/user/:userId'} element={<UserPage/>}>
            <Route path='posts' element={<UserPost/>}></Route>
            <Route path='followers' element={<UserFollowersPageSection/>}></Route>
            <Route path='followings' element={<UserFollowingsPageSection/>}></Route>
          </Route>
          <Route path={'/discover'}  exact element={<Discover/>} />
          <Route path={'/post/:postId'} exact element={<PostPage/>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
