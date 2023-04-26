import {FC} from 'react';
import {EditableSpan} from "common/components";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useActions} from "common/hooks";
import {TodolistDomainType, todolistsThunks} from "features/todolists-list/todolists/todolists.reducer";
import React from 'react';

type Props = {
  todolist: TodolistDomainType
}

export const TodolistTitle: FC<Props> = ({todolist}) => {
  const {changeTodolistTitle, removeTodolist} = useActions(todolistsThunks)
  const removeTodolistHandler = () => {
    removeTodolist(todolist.id)
  }
  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitle({title, id: todolist.id})
  }
  
  return <h3>
    <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler}/>
    <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === 'loading'}>
      <Delete/>
    </IconButton>
  </h3>
}
