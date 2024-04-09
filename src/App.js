
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
import Footer from './components/Footer';

function App() {

  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
  }, [dispatch, t])

  const isDark = false
  return (

    <div className={isDark ? "App dark bg-background min-h-screen" : "App min-h-screen"}>
      <MyNavbar />
      <Routes>
        <Route path={routes.dashboard} element={
          <Dashboard isDark={isDark} />
        } />
        <Route path={routes.portfolio} element={
          <Portfolio isDark={isDark} />
        } />
      </Routes>

      <Footer isDark={isDark} />
    </div>
  );
}

export default App;
