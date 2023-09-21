import { Spacer } from '@nextui-org/react';
import './App.css';
import InvestmentTable from './components/InvestmentTable';
import NewInvestment from './components/NewInvestment';
import Statistics from './components/Statistics';


function App() {


  return (
    <div className="App">
      <NewInvestment />
      <Spacer y={4} />
      <div className="flex flex-col md:flex-row">
        <InvestmentTable />
        <Spacer y={4} x={4}/>  
        <Statistics />
      </div>
    </div>
  );
}

export default App;
