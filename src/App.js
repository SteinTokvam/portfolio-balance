
import './App.css';
import MyNavbar from './components/MyNavbar';
import './i18n/config';
import { useDispatch } from 'react-redux';
import { addInitialAccountTypes } from './actions/account';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';


function App() {

  const dispatch = useDispatch()
  const {t} = useTranslation()

  useEffect(() => {
    
    const defaultAccountType = window.localStorage.getItem("accountTypes") ? JSON.parse(window.localStorage.getItem("accountTypes")) : [t('valuators.defaultAccountType')] 
    dispatch(addInitialAccountTypes(defaultAccountType))
  }, [dispatch, t])

  const isDark = false
  return (
    <div className={isDark ? "App dark bg-background h-screen" : "App"}>
      <MyNavbar />
      {
      //  <Dashboard />
      }
      <Portfolio />
      
    </div>
  );
}

export default App;
