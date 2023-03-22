import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {action} from "@storybook/addon-actions";

import {EditableSpan} from "../components/EditableSpan/EditableSpan";
import {TextField} from "@mui/material";

export default {
    title: 'TODOLISTS/EditableSpan',
    component: EditableSpan,
    args: {
        value:'CSS',
        onChange:action('Value changed')
    }
} as ComponentMeta<typeof EditableSpan>;


const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan{...args} />;

export const EditableSpanExample = Template.bind({})

const Template2: ComponentStory<typeof EditableSpan>=(args)=>{
    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState('CSS');

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(title);
    }
    const activateViewMode = () => {
        setEditMode(false);
        setTitle(title);
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
     return editMode
        ?    <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode} />
        : <span onDoubleClick={activateEditMode}>{title}</span>
}

export const EditableSpanChanged = Template2.bind({})
