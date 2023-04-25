import {createSlice} from '@reduxjs/toolkit';
import {appActions} from 'app/app.reducer';
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {clearTasksAndTodolists} from "common/actions";
import {authAPI, LoginParamsType} from "features/auth/auth.api";
import {ResultCode} from "common/enums";
import {tryCatchThunk} from "common/utils/try-catch.thunk";

// import {handleServerAppError} from "common/utils/handle-server-app-error";
// import {handleServerNetworkError} from "common/utils/handle-server-network-error";

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
    'auth/login', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return tryCatchThunk(thunkAPI, async () => {
            const res = await authAPI.login(arg)
            if (res.data.resultCode === ResultCode.Success) {
                return {isLoggedIn: true}
            } else {
                const isShowAppError = !res.data.fieldsErrors.length
                handleServerAppError(res.data, dispatch, isShowAppError)
                return rejectWithValue(res.data)
            }
        })
    }
)
const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
('auth/logout', async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return tryCatchThunk(thunkAPI, async () => {
        const res = await authAPI.logout()
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(clearTasksAndTodolists())
            return {isLoggedIn: false}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    })
})

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
('app/initializeApp', async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === ResultCode.Success) {
            return {isLoggedIn: true};
        } else {
            return rejectWithValue(null);
        }
    } catch
        (err) {
        handleServerNetworkError(err, dispatch);
        return rejectWithValue(null)
    } finally {
        dispatch(appActions.setAppInitialized({isInitialized: true}));
    }

})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    }
})

export const authReducer = slice.reducer
export const authThunks = {login, logout, initializeApp}




