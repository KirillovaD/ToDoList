import {appActions} from 'app/app-reducer';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsThunks} from "./todolists-reducer";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {handleServerAppError} from "common/utils";
import {
    AddTaskArgType,
    DeleteTaskArgType,
    TaskType,
    todolistsAPI,
    UpdateTaskArgType,
    UpdateTaskModelType
} from "features/TodolistsList/todolists.api";
import {ResultCode, TaskPriorities, TaskStatuses} from "common/enums";
import {thunkTryCatch} from "common/utils/thunk-try-catch";


const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>
('tasks/fetchTasks', async (todolistId, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async ()=>{
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        return {tasks, todolistId}
    })
})

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>
('tasks/addTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async ()=>{
        const res = await todolistsAPI.createTask(arg)
        if (res.data.resultCode === ResultCode.Success) {
            const task = res.data.data.item
            return {task}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    })

})

const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>
('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    return thunkTryCatch(thunkAPI, async ()=>{
        const state = getState()
        const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
        if (!task) {
            dispatch(appActions.setAppError({error: 'Task not found in the state'}))
            return rejectWithValue(null)
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...arg.domainModel
        }
        const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
        if (res.data.resultCode === ResultCode.Success) {
            return arg
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    })
})

const removeTask = createAppAsyncThunk<DeleteTaskArgType, DeleteTaskArgType>
('tasks/removeTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async ()=>{
        const res = await todolistsAPI.deleteTask(arg)
        if (res.data.resultCode === ResultCode.Success) {
            return arg
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    })
})


const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        //с упаковкой payload
        _removeTask: {
            reducer: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) tasks.splice(index, 1)
            },
            prepare: (taskId: string, todolistId: string) => {
                return {
                    payload: {
                        taskId,
                        todolistId
                    }
                }
            }
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) tasks.splice(index, 1)
            })

        //from todolist
            .addCase(todolistsThunks.fetchTodos.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = []
                })
            })
            .addCase(todolistsThunks.addTodo.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsThunks.removeTodo.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })

            .addCase(clearTasksAndTodolists, () => {
                return {}
            })
    }
})
export const tasksReducer = slice.reducer
export const tasksThunks = {fetchTasks, addTask, updateTask, removeTask}


// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

