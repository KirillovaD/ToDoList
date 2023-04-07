import {createAction, nanoid} from "@reduxjs/toolkit";
import {TasksStateType} from "features/TodolistsList/tasks-reducer";
import {TodolistDomainType} from "features/TodolistsList/todolists-reducer";

export type ClearTasksAndTodolistsType = {
    tasks: TasksStateType,
    todolists: TodolistDomainType[]
}

export const clearTasksAndTodolists = createAction<ClearTasksAndTodolistsType>('common/clear-tasks-todolists')


//с доп параметрами
// export const clearTasksAndTodolists = createAction('common/clear-tasks-todolists',
//     (tasks:TasksStateType,todolists:TodolistDomainType[]) => {
//     let random = 100
//         return {
//             payload: {
//                 tasks,
//                 todolists,
//                 id: random > 90 ? nanoid(): Math.random()
//
//             }
//         }
//     })
