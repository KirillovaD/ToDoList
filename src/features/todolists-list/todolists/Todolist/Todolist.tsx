import React, {FC, memo, useCallback, useEffect} from 'react'
import {Task} from 'features/todolists-list/todolists/Todolist/Task/Task'
import {
    TodolistDomainType,
    todolistsActions,
    todolistsThunks
} from 'features/todolists-list/todolists/todolists.reducer'
import {Button, IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {tasksThunks} from "features/todolists-list/tasks/tasks.reducer";
import {AddItemForm, EditableSpan} from "common/components";
import {useActions} from "common/hooks";
import {TaskStatuses} from "common/enums";
import {TaskType} from "features/todolists-list/tasks/tasks.api";
import {FilterTasksButtons} from "features/todolists-list/todolists/Todolist/FilterTasksButtons/FilterTasksButtons";

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


    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler}/>
            <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolist.id}/>)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <FilterTasksButtons todolist={todolist}/>
        </div>
    </div>
})


