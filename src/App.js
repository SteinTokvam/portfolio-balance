
import './App.css';
import MyNavbar from './components/MyNavbar';
import './i18n/config';
import { useDispatch } from 'react-redux';
import { addInitialAccountTypes } from './actions/account';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Dashboard from './components/Dashboard';


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
      <Dashboard />
      {
        //<div className='w-full text-center'>
      //<NewInvestment />
      //<Spacer y={4} x={4}/>
      //</div>

      //<div className="flex flex-col md:flex-row">
        //<InvestmentTable />
        //<Spacer y={4} x={4}/>  
        //<Statistics />
        //<Spacer y={4} x={4}/>  
      //</div>
    }
    </div>
  );
}

export default App;
