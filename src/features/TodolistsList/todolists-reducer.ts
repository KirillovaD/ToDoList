import {ResultCode, todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, SetErrorType, setStatusAC, SetStatusType} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios from "axios";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case 'CHANGE-ENTITY-STATUS':
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
        default:
            return state
    }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const changeEntityStatusAC = (id: string, entityStatus: RequestStatusType) => ({
    type: 'CHANGE-ENTITY-STATUS',
    id,
    entityStatus
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)

// thunks
// export const fetchTodolistsTC = () => (dispatch: Dispatch<TodolistsActionsType>) => {
//         dispatch(setStatusAC('loading'))
//         // dispatch(setErrorAC('ERROR'))
//         todolistsAPI.getTodolists()
//             .then((res) => {
//                 dispatch(setTodolistsAC(res.data))
//                 dispatch(setStatusAC('succeeded'))
//             })
// }

export const fetchTodolistsTC = () => async (dispatch: Dispatch<TodolistsActionsType>) => {
    dispatch(setStatusAC('loading'))
    // dispatch(setErrorAC('ERROR'))
    try{
        const res = await todolistsAPI.getTodolists()
        dispatch(setTodolistsAC(res.data))
        dispatch(setStatusAC('succeeded'))
    } catch (err) {
        if(axios.isAxiosError<{message:string}>(err)){
            const error = err.response ? err.response.data.message : err.message
            handleServerNetworkError(dispatch, error)
        }
    }

}

export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<TodolistsActionsType>) => {
        dispatch(setStatusAC('loading'))
        dispatch(changeEntityStatusAC(todolistId, 'loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                if (res.data.resultCode === ResultCode.OK) {
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(setStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err => {
                handleServerNetworkError(dispatch, err)
                dispatch(changeEntityStatusAC(todolistId, 'failed'))
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<TodolistsActionsType>) => {
        dispatch(setStatusAC('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setStatusAC('succeeded'))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<TodolistsActionsType>) => {
        dispatch(setStatusAC('loading'))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(id, title))
                dispatch(setStatusAC('succeeded'))
            })
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type TodolistsActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | SetErrorType
    | SetStatusType
    | ReturnType<typeof changeEntityStatusAC>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
