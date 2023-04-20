import {Dispatch} from "redux";
import {appActions} from "app/app-reducer";
import {ResponseType} from "common/types";

/**
 * Error handler function with server API
 * @param data - server response in ResponseType<D>
 * @param dispatch - function for sending message to Redux store
 * @param showError - flag shows, if we need to show errors in UI
 */
export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
    if(showError){
        dispatch(appActions.setAppError({error: data.messages.length? data.messages[0] :'Some error occurred'}))
    }
}
