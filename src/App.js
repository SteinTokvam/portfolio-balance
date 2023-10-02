
import { Routes, Route } from 'react-router-dom';
import './App.css';
import MyNavbar from './components/MyNavbar';
import './i18n/config';
import { useDispatch } from 'react-redux';
import { addInitialAccountTypes } from './actions/account';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import { routes } from './Util/Global';
import Rebalancing from './components/Rebalancing';
import Footer from './components/Footer';


function App() {

  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {

    const defaultAccountType = window.localStorage.getItem("accountTypes") ? JSON.parse(window.localStorage.getItem("accountTypes")) : [t('valuators.defaultAccountType')]
    dispatch(addInitialAccountTypes(defaultAccountType))
  }, [dispatch, t])

  const isDark = false
  return (
    <>
      <div className={isDark ? "App dark bg-background h-screen" : "App h-screen"}>
        <MyNavbar />
        <Routes>
          <Route path={routes.dashboard} element={
            <Dashboard />
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
