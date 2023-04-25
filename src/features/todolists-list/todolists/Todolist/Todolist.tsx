import React, {FC, memo, useEffect} from 'react'
import {TodolistDomainType, todolistsThunks} from 'features/todolists-list/todolists/todolists.reducer'
import {IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {tasksThunks} from "features/todolists-list/tasks/tasks.reducer";
import {AddItemForm, EditableSpan} from "common/components";
import {useActions} from "common/hooks";
import {TaskType} from "features/todolists-list/tasks/tasks.api";
import {FilterTasksButtons} from "features/todolists-list/todolists/Todolist/FilterTasksButtons/FilterTasksButtons";
import s from './todolist.module.css'
import {Tasks} from "features/todolists-list/todolists/Tasks/Tasks";

type Props = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
}

export const Todolist: FC<Props> = memo(({todolist, tasks, demo}) => {

    const {fetchTasks, addTask} = useActions(tasksThunks)
    const {changeTodolistTitle, removeTodolist} = useActions(todolistsThunks)

    useEffect(() => {
        if (demo) {
            return
        }
        fetchTasks(todolist.id)
    }, [])


    const addTaskCallback = (title: string) => {
        addTask({title, todolistId: todolist.id})
    }

    const removeTodolistHandler = () => {
        removeTodolist(todolist.id)
    }
    const changeTodolistTitleHandler = (title: string) => {
        changeTodolistTitle({title, id: todolist.id})
    }


    return <div className={s.todolist_container}>
        <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler}/>
            <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === 'loading'}/>
        <Tasks tasks={tasks} todolist={todolist}/>
        <div className={s.filterTasksButtons_container}>
            <FilterTasksButtons todolist={todolist}/>
        </div>
    </div>
})


