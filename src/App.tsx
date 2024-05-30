
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
import TransactionsTable from './components/TransactionsTable';
import Accounts from './components/Accounts';
import AuthTest from './components/AuthTest';

function App() {

  const dispatch = useDispatch()
  const { t } = useTranslation()

  // @ts-ignore
  

  useEffect(() => {
  }, [dispatch, t])

  const isDark = false
  return (

    <div>
      <div className={isDark ? "App dark bg-background min-h-screen" : "App min-h-screen"}>
        <MyNavbar />
        <Routes>
          <Route path={routes.dashboard} element={
            <Dashboard />
          } />
          <Route path={routes.portfolio} element={
            <Accounts />
          } />
          <Route path={routes.account} element={
            <TransactionsTable />
          } />
          <Route path='/auth' element={
            <AuthTest />
          } />
        </Routes>
      </div>
      <Footer isDark={isDark} />
    </div>
  );
}

export default App;
