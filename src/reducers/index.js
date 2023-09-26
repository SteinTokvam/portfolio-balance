import { combineReducers } from '@reduxjs/toolkit';
import investmentReducer from './InvestmentReducer';
import accountReducer from './accountReducer';

const rootReducer = combineReducers({
    investments: investmentReducer,
    accounts: accountReducer
});

export default rootReducer;