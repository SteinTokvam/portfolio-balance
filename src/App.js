import { Spacer } from '@nextui-org/react';
import './App.css';
import InvestmentTable from './components/InvestmentTable';
import NewInvestment from './components/NewInvestment';
import Statistics from './components/Statistics';
import MyNavbar from './components/MyNavbar';
import './i18n/config';
import { useDispatch } from 'react-redux';
import { addInitialAccountTypes } from './actions/account';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';


function App() {

  const dispatch = useDispatch()
  const {t} = useTranslation()

  useEffect(() => {
    
    const defaultAccountType = window.localStorage.getItem("accountTypes") ? JSON.parse(window.localStorage.getItem("accountTypes")) : [t('valuators.defaultAccountType')] 
    dispatch(addInitialAccountTypes(defaultAccountType))
  }, [dispatch, t])

  const isDark = true
  return (
    <div className={isDark ? "App dark bg-background h-screen" : "App"}>
      <MyNavbar />
      <div className='w-full text-center'>
      <NewInvestment />
      <Spacer y={4} x={4}/>
      </div>

      <div className="flex flex-col md:flex-row">
        <InvestmentTable />
        <Spacer y={4} x={4}/>  
        <Statistics />
        <Spacer y={4} x={4}/>  
      </div>
    </div>
  );
}

export default App;
