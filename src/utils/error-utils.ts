import {AppActionsType, setErrorAC, setStatusAC} from "../app/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";

export const handleServerNetworkError = (dispatch:ErrorUtilsDispatchType, error:string)=>{
    dispatch(setErrorAC(error))
    dispatch(setStatusAC('failed'))
}

export const handleServerAppError=<T>(data:ResponseType<T>,dispatch: ErrorUtilsDispatchType)=>{
    if (data.messages.length) {
        dispatch(setErrorAC(data.messages[0]))
    } else (
        dispatch(setErrorAC('SOME ERROR'))
    )
    dispatch(setStatusAC('idle'))
}
type ErrorUtilsDispatchType = Dispatch<AppActionsType>

