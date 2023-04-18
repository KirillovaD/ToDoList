import {Dispatch} from 'redux'
import {appActions, RequestStatusType} from 'app/app-reducer'
import {AppThunk} from 'app/store';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerNetworkError} from "common/utils/handle-server-network-error";
import {clearTasksAndTodolists} from "common/actions";
import {todolistsAPI, TodolistType} from "features/TodolistsList/todolists.api";
import {createAppAsyncThunk, handleServerAppError} from "common/utils";
import {ResultCode} from "common/enums";


const fetchTodos = createAppAsyncThunk<{ todolists: TodolistType[] }, void>
('todo/fetchTodos',
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: 'loading'}))
            const res = await todolistsAPI.getTodolists()
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {todolists: res.data}

        } catch (err) {
            handleServerNetworkError(err, dispatch);
            return rejectWithValue(null)
        }

    })
const addTodo = createAppAsyncThunk<{ todolist: TodolistType },string>
('todo/addTodo',
    async (title, thunkAPI)=>{
        const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.createTodolist(title)
        if (res.data.resultCode===ResultCode.Success){
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {todolist: res.data.data.item}
        }
        else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }

    } catch (err) {
        handleServerNetworkError(err, dispatch);
        return rejectWithValue(null)
    }
})

const removeTodo = createAppAsyncThunk<{ id: string }, string>
('todo/removeTodo',
    async (id, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: 'loading'}))
            dispatch(todolistsActions.changeTodolistEntityStatus({id, status: 'loading'}))
            const res = await todolistsAPI.deleteTodolist(id)
            if (res.data.resultCode===ResultCode.Success){
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return {id}
            }
            else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }


        } catch (err) {
            handleServerNetworkError(err, dispatch);
            return rejectWithValue(null)
        }

    })


const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const todo = state.find(tl => tl.id === action.payload.id)
            if (todo) todo.title = action.payload.title
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTodos.fulfilled, (state, action) => {
                return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
            })
            .addCase(addTodo.fulfilled, (state,action)=>{
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
            })
            .addCase(removeTodo.fulfilled,(state,action)=>{
                const index = state.findIndex(todo => todo.id === action.payload.id)
                if (index !== -1) state.splice(index, 1)
            })

            .addCase(clearTasksAndTodolists, (state, action) => {
                return action.payload.todolists
            })

    }


})
export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {fetchTodos,removeTodo,addTodo}

// thunks



export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolist(id, title)
            .then(() => {
                dispatch(todolistsActions.changeTodolistTitle({id: id, title}))
            })
    }
}

// types


export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

