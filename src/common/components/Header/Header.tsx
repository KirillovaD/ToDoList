import React, {FC} from 'react';
import {AppBar, Button, IconButton, LinearProgress, Toolbar} from "@mui/material";
import {Menu} from "@mui/icons-material";

type Props = {
    isLoggedIn: boolean
    logoutHandler: () => void
}
export const Header: FC<Props> = ({isLoggedIn, logoutHandler}) => {
    return (
        <AppBar position="static">
            <Toolbar className='header'>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    {isLoggedIn && <Menu/>}
                </IconButton>
                {isLoggedIn && <Button color="inherit" onClick={logoutHandler} className='logout'>Log out</Button>}
            </Toolbar>
            {status === 'loading' && <LinearProgress/>}
        </AppBar>
    )
}

