import { combineReducers } from '@reduxjs/toolkit';
import accountsReducer from './accountsReducer';

const rootReducer = combineReducers({
    //userId: userIdReducer,
    accounts: accountsReducer,
    //yield: yieldReducer,
    //totalValue: totalValueReducer,
});

export default rootReducer;