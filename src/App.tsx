
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import MyNavbar from './components/MyNavbar';
import './i18n/config';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { routes } from './Util/Global';
import Footer from './components/Footer';
import Accounts from './components/Accounts';
import Auth from './components/Auth';
import TransactionsTable from './components/TransactionsTable';
import ConfirmMail from './components/ConfirmMail';
import { createClient } from '@supabase/supabase-js';

function App() {

  const dispatch = useDispatch()
  const { t } = useTranslation()

  // @ts-ignore
  

  useEffect(() => {
  }, [dispatch, t])

  const supabase = createClient(process.env.REACT_APP_SUPABASE_URL as string, process.env.REACT_APP_SUPABASE_KEY as string)

  const isDark = false
  return (

    <div>
      <div className={isDark ? "App dark bg-background min-h-screen" : "App min-h-screen"}>
        <MyNavbar supabase={supabase}/>
        <Routes>
          <Route path={routes.dashboard} element={
            <Auth supabase={supabase}>
              <Dashboard />
            </Auth>
          } />
          <Route path={routes.portfolio} element={
            <Auth supabase={supabase}>
              <Accounts />
            </Auth>
          } />
          <Route path={routes.account} element={
            <Auth supabase={supabase}>
              <TransactionsTable />
            </Auth>
          } />
          <Route path={routes.confirmMail} element={<ConfirmMail />} />
        </Routes>
      </div>
      <Footer isDark={isDark} />
    </div>
  );
}

export default App;
