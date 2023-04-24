import React, {useEffect} from 'react'
import 'app/App.css'
import {TodolistsList} from 'features/TodolistsList/TodolistsList'
import {useSelector} from 'react-redux'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {Login} from 'features/Auth/Login'


import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@mui/material';
import {Menu} from '@mui/icons-material'
import {selectIsLoggedIn} from "features/Auth/auth.selectors";
import {selectInitialized, selectStatus} from "app/app-selector";
import {ErrorSnackbar} from "common/components";
import {useActions} from "common/hooks";
import {authThunks} from "features/Auth/auth-reducer";
import {Header} from "common/components/Header/Header";
import {Routing} from "common/components/Routing/Routing";

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const status = useSelector(selectStatus)
    const isInitialized = useSelector(selectInitialized)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const {initializeApp, logout} = useActions(authThunks)

    useEffect(() => {
        initializeApp({})
    }, [])

    const logoutHandler = () => logout({})


    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <BrowserRouter>
            <div className="App">
                <ErrorSnackbar/>
                <Header isLoggedIn={isLoggedIn} logoutHandler={logoutHandler}/>
                <Routing demo={demo}/>
            </div>
        </BrowserRouter>
    )
}

export default App
