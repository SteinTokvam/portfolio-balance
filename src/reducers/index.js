import { combineReducers } from '@reduxjs/toolkit';
import accountsReducer from './accountsReducer';
import equityTypeReducer from './equityReducer';

const rootReducer = combineReducers({
    //userId: userIdReducer,
    accounts: accountsReducer,
    equity: equityTypeReducer,
    //yield: yieldReducer,
    //totalValue: totalValueReducer,
});

export default rootReducer;