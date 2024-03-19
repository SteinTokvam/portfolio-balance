
import { Routes, Route } from 'react-router-dom';
import './App.css';
import MyNavbar from './components/MyNavbar';
import './i18n/config';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import { routes } from './Util/Global';
import Rebalancing from './components/Rebalancing';
import Footer from './components/Footer';
import Transactions from './components/Transactions';
import AccountsWithTransactions from './components/AccountsWithTransactions';


function App() {

  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
  }, [dispatch, t])

  const isDark = false
  return (
    <>
      <div className={isDark ? "App dark bg-background min-h-screen" : "App min-h-screen"}>
        <MyNavbar />
        <Routes>
          <Route path={routes.dashboard} element={
            <Dashboard />
          } />
          <Route path={routes.transactions} element={
            <Transactions />
          } />
          <Route path={routes.accountsWithTransactions} element={
            <AccountsWithTransactions />
          } />
          <Route path={routes.portfolio} element={
            <Portfolio />
          } />
          <Route path={routes.rebalancing} element={
            <Rebalancing />
          } />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
