import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";


// @ts-ignore
export default configureStore({ reducer: { rootReducer } });
