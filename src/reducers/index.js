import { combineReducers } from '@reduxjs/toolkit';
import investmentReducer from './InvestmentReducer';

const rootReducer = combineReducers({
    investments: investmentReducer    
});

export default rootReducer;