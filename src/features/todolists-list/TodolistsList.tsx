import React, {FC, useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {todolistsThunks} from 'features/todolists-list/todolists/todolists.reducer'
import {Grid, Paper} from '@mui/material'
import {Todolist} from 'features/todolists-list/todolists/Todolist/Todolist'
import {Navigate} from 'react-router-dom'
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectTodolists} from "features/todolists-list/todolists/todolists.selector";
import {selectTasks} from "features/todolists-list/tasks/task.selector";
import {AddItemForm} from "common/components";
import {useActions} from "common/hooks";

type Props = {
    demo?: boolean
}

export const TodolistsList: FC<Props> = ({demo = false}) => {
    const todolists = useSelector(selectTodolists)
    const tasks = useSelector(selectTasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {fetchTodolists, addTodolist} = useActions(todolistsThunks)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodolists({})
    }, [])

    const addTodolistCallback = (title: string) => {
        return addTodolist(title).unwrap()
    }

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolistCallback}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}

