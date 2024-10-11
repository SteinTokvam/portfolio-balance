import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import MyNavbar from './components/MyNavbar';
import './i18n/config';
import { useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import { routes } from './Util/Global';
import Footer from './components/Footer';
import Accounts from './components/Account/Accounts';
import Auth from './components/Auth';
import Account from './components/Account/AccountComponent';
import ConfirmMail from './components/ConfirmMail';
import { supabase } from './supabaseClient';

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const session = await (await supabase.auth.getSession()).data.session
      console.log(session)
      if (!session) {
        navigate(routes.login)
      }
    }
    checkSession()
  }, [])//eslint-disable-line react-hooks/exhaustive-deps

  const isDark = false
  return (
    <div>
      <div className={isDark ? "App dark bg-background min-h-screen" : "App min-h-screen"}>
        <MyNavbar />
        <Routes>
          <Route path={routes.dashboard} element={<Dashboard />} />
          <Route path={routes.portfolio} element={<Accounts />} />
          <Route path={routes.account} element={<Account />} />
          <Route path={routes.confirmMail} element={<ConfirmMail />} />
          <Route path={routes.login} element={<Auth />} />
        </Routes>
      </div>
      <Footer isDark={isDark} />
    </div>
  );
}

export default App;
