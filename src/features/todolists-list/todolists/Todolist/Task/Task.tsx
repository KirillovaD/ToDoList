import React, {ChangeEvent, FC, memo} from 'react'
import {Checkbox, IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {EditableSpan} from "common/components";
import {TaskStatuses} from "common/enums";
import {TaskType} from "features/todolists-list/tasks/tasks.api";
import {useActions} from "common/hooks";
import {tasksThunks} from "features/todolists-list/tasks/tasks.reducer";
import s from './task.module.css'

type Props = {
    task: TaskType
    todolistId: string
}

export const Task: FC<Props> = memo(({task, todolistId}) => {
    const {removeTask, updateTask} = useActions(tasksThunks)

    const removeTaskHandler = () => removeTask({taskId: task.id, todolistId});
    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        updateTask({taskId: task.id, domainModel: {status}, todolistId})
    }
    const changeTaskTitleHandler = (title: string) => {
        updateTask({taskId: task.id, domainModel: {title}, todolistId})
    }

    return <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ''}>
        <Checkbox
            checked={task.status === TaskStatuses.Completed}
            color="primary"
            onChange={changeTaskStatusHandler}
        />

        <EditableSpan value={task.title} onChange={changeTaskTitleHandler}/>
        <IconButton onClick={removeTaskHandler}>
            <Delete/>
        </IconButton>
    </div>
})

