import { combineReducers } from '@reduxjs/toolkit';
import accountsReducer from './accountsReducer';
import equityTypeReducer from './equityReducer';
import holdingsReducer from './holdingsReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
    //userId: userIdReducer,
    accounts: accountsReducer,
    equity: equityTypeReducer,
    holdings: holdingsReducer,
    settings: settingsReducer,
    //yield: yieldReducer,
    //totalValue: totalValueReducer,
});

export default rootReducer;