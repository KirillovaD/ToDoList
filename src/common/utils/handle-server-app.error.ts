import {Dispatch} from "redux";
import {appActions} from "app/app.reducer";
import {ResponseType} from "common/types";

/**
 * Handles application errors that may occur on the server.
 *
 * @template D - The type of data returned by the response.
 * @param {ResponseType} data - The response data from the server.
 * @param {Dispatch} dispatch - A function for dispatching an action to the Redux Store.
 * @param {boolean} [showError=true] - A flag indicating whether or not to show the error message in the application.
 * @returns {void}
 */
export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
    if(showError){
        dispatch(appActions.setAppError({error: data.messages.length? data.messages[0] :'Some error occurred'}))
    }
}
