import { Spacer } from '@nextui-org/react';
import './App.css';
import InvestmentTable from './components/InvestmentTable';
import NewInvestment from './components/NewInvestment';
import Statistics from './components/Statistics';
import MyNavbar from './components/MyNavbar';
import './i18n/config';


function App() {

  return (
    <div className="App">
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
