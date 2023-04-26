import React, {ChangeEvent, FC, KeyboardEvent, memo, useState} from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import {AddBox} from '@mui/icons-material';
import {ResponseType} from "common/types";
import {RejectValueType} from '../../utils/create-app-async.thunk'

type Props = {
    addItem: (title: string) => Promise<any>
    disabled?: boolean
}

export const AddItemForm: FC<Props> = memo(({addItem, disabled}) => {
        let [title, setTitle] = useState('')
        let [error, setError] = useState<string | null>(null)

        const addItemHandler = () => {
            if (title.trim() !== '') {
                addItem(title)
                    .then(() => {
                        setTitle('');
                    })
                    .catch((err: RejectValueType) => {
                        if (err.data) {
                            const messages = err.data.messages
                            setError(messages.length ? messages[0] : 'Some error occurred')
                        }
                    })
            } else {
                setError('Title is required');
            }
        }

        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            setTitle(e.currentTarget.value)
        }

        const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
            if (error !== null) {
                setError(null);
            }
            if (e.key === 'Enter') {
                addItemHandler();
            }
        }

        return <div>
            <TextField variant="outlined"
                       error={!!error}
                       value={title}
                       onChange={onChangeHandler}
                       onKeyDown={onKeyPressHandler}
                       label="Title"
                       helperText={error}
                       disabled={disabled}
            />
            <IconButton color="primary" onClick={addItemHandler} disabled={disabled}>
                <AddBox/>
            </IconButton>
        </div>
    }
)
