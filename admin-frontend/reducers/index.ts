import { combineReducers } from "redux";
import authReducer from './auth';

const combinedReducers = combineReducers({
    auth: authReducer
});

export default combinedReducers;