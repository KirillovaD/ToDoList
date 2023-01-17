import React, {ChangeEvent, useState} from 'react';

type EditableSpanPropsType = {
    oldTitle: string
    callBack: (newTitle:string) => void

}

export const EditableSpan = (props: EditableSpanPropsType) => {
    const [edit, setEdit] = useState(false)
    const [newTitle, setNewTitle] = useState(props.oldTitle)

    const onDoubleClickHandler = () => {
        setEdit(!edit)
        addTask()
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)

    }
    const addTask = () => {
        props.callBack(newTitle)
    }
    return (
        edit
            ? <input value={newTitle} onChange={onChangeHandler} onBlur={onDoubleClickHandler} autoFocus/>
            : <span onDoubleClick={onDoubleClickHandler}>{props.oldTitle}</span>
    );
};

