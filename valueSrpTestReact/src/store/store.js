import { combineReducers, configureStore } from "@reduxjs/toolkit";
import layoutReducer from "../features/Layout/layoutSlice";
import AuthReducer from "../features/Auth/authSlice";
import UiReducer from "../features/Ui/uiSlice";
import SearchReducer from "../features/Search/searchSlice";

const rootReducer = combineReducers({
    layout:layoutReducer,
    auth:AuthReducer,
    ui:UiReducer,
    search:SearchReducer
})
export const store = configureStore({
    reducer: rootReducer
})