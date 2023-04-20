import {AppDispatch, AppRootStateType} from 'app/store';
import {handleServerNetworkError} from 'common/utils/handle-server-network-error';
import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {appActions} from "app/app-reducer";
import {ResponseType} from "common/types";

/**
 * Function for api request and error utils handler returns logic function, if request fullfiled or we have App Error, and minimize duplicates in loader status
 * @param thunkAPI
 * @param logic function executed try-catch from our main async thunk
 */
export const thunkTryCatch = async (thunkAPI: BaseThunkAPI<AppRootStateType, any, AppDispatch, null | ResponseType>, logic: Function) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        return await logic()
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(appActions.setAppStatus({status: 'idle'}))
    }
}
