import {Dispatch} from "redux";
import axios, {AxiosError} from "axios";
import {appActions} from "app/app-reducer";

/**
 * Handles network errors that may occur when sending requests to the server using the Axios library.
 *
 * @param {unknown} e - An error object that can be of any data type.
 * @param {Dispatch} dispatch - A function for dispatching an action to the Redux Store.
 * @returns {void}
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
