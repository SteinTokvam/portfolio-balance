import { combineReducers } from '@reduxjs/toolkit';
import equityTypeReducer from './equityReducer';
import settingsReducer from './settingsReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
    equity: equityTypeReducer,
    settings: settingsReducer,
    auth: authReducer
});

export default rootReducer;