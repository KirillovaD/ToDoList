import {Dispatch} from "redux";
import axios, {AxiosError} from "axios";
import {appActions} from "app/app-reducer";

/**
 * Error handler function with network errors, uses when in catch case
 * @param e
 * @param dispatch function for sending message to Redux store
 */
export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    const err = e as Error | AxiosError<{ error: string }>
    if (axios.isAxiosError(err)) {
        const error = err.message ? err.message : 'Some error occurred'
        dispatch(appActions.setAppError({error}))
    } else {
        dispatch(appActions.setAppError({error: `Native error ${err.message}`}))
    }
}
