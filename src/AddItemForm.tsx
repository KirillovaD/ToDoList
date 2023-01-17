import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export function AddItemForm(props: AddItemFormPropsType) {

    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const addItem = () => {
        if (title.trim() !== "") {
            props.addItem(title);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (e.key === 'Enter') {
            addItem();
        }
    }

    const buttonStyles =
        {
            maxWidth: '38px',
            maxHeight: '38px',
            minWidth: '38px',
            minHeight: '38px',
            marginLeft:'10px'
        }

    return <div>
        <TextField
            id="outlined-basic"
            label={!error?"Title is required":"Type task"}
            variant="outlined"
            size={"small"}
            value={title}
            onChange={onChangeHandler}
            onKeyDown={onKeyPressHandler}
            error={!!error}
            />
        <Button variant={"contained"} style={buttonStyles} onClick={addItem}>+</Button>

        {error && <div className="error-message">{error}</div>}
    </div>
}
