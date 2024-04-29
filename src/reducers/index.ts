import { combineReducers } from '@reduxjs/toolkit';
import accountsReducer from './accountsReducer';
import equityTypeReducer from './equityReducer';
import holdingsReducer from './holdingsReducer';

const rootReducer = combineReducers({
    //userId: userIdReducer,
    accounts: accountsReducer,
    equity: equityTypeReducer,
    holdings: holdingsReducer,
    //yield: yieldReducer,
    //totalValue: totalValueReducer,
});

export default rootReducer;