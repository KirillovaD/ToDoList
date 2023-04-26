import React, {FC} from 'react';
import {Route, Routes} from "react-router-dom";
import {TodolistsList} from "features/todolists-list/TodolistsList";
import {Login} from "features/auth/Login";
import {Container} from "@mui/material";

type Props = {
    demo?: boolean
}
export const Routing: FC<Props> = ({demo}) => {
    return (
        <Container fixed>
            <Routes>
                <Route path={'/'} element={<TodolistsList demo={demo}/>}/>
                <Route path={'/login'} element={<Login/>}/>
            </Routes>
        </Container>
    );
}
