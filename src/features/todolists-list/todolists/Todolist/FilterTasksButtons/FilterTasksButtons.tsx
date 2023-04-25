import React, {FC, useCallback} from "react";
import {Button} from "@mui/material";
import {
    FilterValuesType,
    TodolistDomainType,
    todolistsActions
} from "features/todolists-list/todolists/todolists.reducer";
import {useActions} from "common/hooks";

type Props = {
    todolist: TodolistDomainType
}

export const FilterTasksButtons:FC<Props>=({todolist})=> {
    const {changeTodolistFilter} = useActions(todolistsActions)

    const changeFilterHandler = (filter:FilterValuesType)=>{
        changeTodolistFilter({filter, id: todolist.id})
    }

    return (
        <>
            <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={()=>changeFilterHandler('all')}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={()=>changeFilterHandler('active')}
                    color={'primary'}>Active
            </Button>
            <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={()=>changeFilterHandler('completed')}
                    color={'secondary'}>Completed
            </Button>
        </>
    );
}
