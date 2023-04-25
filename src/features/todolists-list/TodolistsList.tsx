import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {FilterValuesType, todolistsActions, todolistsThunks} from 'features/todolists-list/todolists/todolists.reducer'
import {tasksThunks} from 'features/todolists-list/tasks/tasks.reducer'
import {Grid, Paper} from '@mui/material'
import {Todolist} from 'features/todolists-list/todolists/Todolist/Todolist'
import {Navigate} from 'react-router-dom'
import {selectIsLoggedIn} from "features/Auth/auth.selectors";
import {selectTodolists} from "features/todolists-list/todolists/todolists.selector";
import {selectTasks} from "features/todolists-list/tasks/task.selector";
import {AddItemForm} from "common/components";
import {useActions} from "common/hooks";
import {TaskStatuses} from "common/enums";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector(selectTodolists)
    const tasks = useSelector(selectTasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {fetchTodos,removeTodo:removeTodolistThunk,addTodo:addTodolistThunk, changeTodoTitle:changeTodolistTitleThunk }= useActions(todolistsThunks)
    const {removeTask:removeTaskThunk, addTask:addTaskThunk, updateTask}= useActions(tasksThunks)
    const {changeTodolistFilter}= useActions(todolistsActions)


    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodos({})
    }, [])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
       removeTaskThunk({taskId, todolistId})
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        addTaskThunk({title, todolistId})
    }, [])

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        updateTask({taskId, domainModel:{status}, todolistId:todolistId})
    }, [])

    const changeTaskTitle = useCallback(function (taskId: string, title: string, todolistId: string) {
       updateTask({taskId, domainModel: {title}, todolistId})
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        changeTodolistFilter({id:todolistId, filter:value})
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        removeTodolistThunk(id)
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        changeTodolistTitleThunk({id, title})
    }, [])

    const addTodolist = useCallback((title: string) => {
        addTodolistThunk(title)
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}

