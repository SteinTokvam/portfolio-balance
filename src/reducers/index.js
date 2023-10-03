import { combineReducers } from '@reduxjs/toolkit';
import investmentReducer from './InvestmentReducer';
import accountReducer from './accountReducer';
import rebalancingReducer from './rebalancingReducer';

const rootReducer = combineReducers({
    investments: investmentReducer,
    accounts: accountReducer,
    rebalancing: rebalancingReducer
});

export default rootReducer;