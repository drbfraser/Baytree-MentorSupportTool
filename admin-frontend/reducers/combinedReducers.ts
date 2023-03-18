import { combineReducers } from 'redux'
import authReducer from './auth'
import themeReducer from './theme'

const combinedReducers = combineReducers({
    auth: authReducer,
    theme: themeReducer
})

export default combinedReducers