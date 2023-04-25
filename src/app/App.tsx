import React, {useEffect} from 'react'
import 'app/App.css'
import {useSelector} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import {CircularProgress} from '@mui/material';
import {selectIsLoggedIn} from "features/Auth/auth.selectors";
import {selectInitialized} from "app/app.selector";
import {ErrorSnackbar} from "common/components";
import {useActions} from "common/hooks";
import {authThunks} from "features/Auth/auth.reducer";
import {Header} from "common/components/Header/Header";
import {Routing} from "features/Routing/Routing";

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
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
