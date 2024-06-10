
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import MyNavbar from './components/MyNavbar';
import './i18n/config';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { routes, useDb } from './Util/Global';
import Footer from './components/Footer';
import Accounts from './components/Accounts';
import Auth from './components/Auth';
import Account from './components/AccountComponent';
import ConfirmMail from './components/ConfirmMail';
import { createClient } from '@supabase/supabase-js';
import { initSupabaseData } from './actions/accounts';
import { getAccounts, getTransactions } from './Util/Supabase';
import Analysis from './components/Analysis';

function App() {

  const dispatch = useDispatch()

  // @ts-ignore
  const accounts = useSelector(state => state.rootReducer.accounts.accounts)
  
  const supabase = createClient(process.env.REACT_APP_SUPABASE_URL as string, process.env.REACT_APP_SUPABASE_KEY as string)

  useEffect(() => {
    if (useDb && accounts && accounts.length === 0) {//TODO: må også sjekke om man er logget inn
      getAccounts(supabase)
        .then(accounts => {
          accounts.forEach(account => {
            getTransactions(supabase, account.key)
              .then(transactions => dispatch(initSupabaseData({...account, transactions})))
          });
        })
    }
  }, [])//eslint-disable-line react-hooks/exhaustive-deps

  const isDark = false
  return (

    <div>
      <div className={isDark ? "App dark bg-background min-h-screen" : "App min-h-screen"}>
        <MyNavbar supabase={supabase} />
        <Routes>
          <Route path={routes.dashboard} element={
            <Auth supabase={supabase}>
              <Dashboard supabase={supabase} />
            </Auth>
          } />
          <Route path={routes.portfolio} element={
            <Auth supabase={supabase}>
              <Accounts supabase={supabase} />
            </Auth>
          } />
          <Route path={routes.account} element={
            <Auth supabase={supabase}>
              <Account supabase={supabase} />
            </Auth>
          } />
          <Route path={routes.analysis} element={
            <Auth supabase={supabase}>
              <Analysis />
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
