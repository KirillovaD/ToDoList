import React, {useEffect, useState} from 'react'
import {todolistsAPI} from "features/todolists-list/todolists/todolists.api";



export default {
    title: 'API-Todolists'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsAPI.getTodolists()
            .then(res => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState<string>('')
    const addTodolist = () => {
        todolistsAPI.createTodolist(title)
            .then(res => setState(res.data))
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'Title TodoList'} value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
            <button onClick={addTodolist}>Create TodoList</button>
        </div>
    </div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const deleteTodolist = () => {
        todolistsAPI.deleteTodolist(todolistId)
            .then(res => setState(res.data))
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'tofolist ID'} value={todolistId}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <button onClick={deleteTodolist}>Delete</button>
        </div>
    </div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')

    const updateTodo = () => {
        todolistsAPI.updateTodolist({title: title, id: todolistId})
            .then(res => setState(res.data))
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'tofolist ID'} value={todolistId}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input placeholder={'Title TodoList'} value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
            <button onClick={updateTodo}>Update</button>
        </div>
    </div>
}

