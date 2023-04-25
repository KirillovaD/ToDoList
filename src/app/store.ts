import { tasksReducer } from 'features/todolists-list/tasks/tasks.reducer';
import { todolistsReducer } from 'features/todolists-list/todolists/todolists.reducer';
import { AnyAction, combineReducers } from 'redux'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { appReducer } from 'app/app.reducer'
import { configureStore } from '@reduxjs/toolkit';
import {authReducer} from "features/Auth/auth.reducer";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
})


export type AppRootStateType = ReturnType<RootReducerType>
export type RootReducerType = typeof rootReducer

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store;
