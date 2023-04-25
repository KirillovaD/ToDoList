import React from 'react'
import {FormikHelpers, useFormik} from 'formik'
import {useSelector} from 'react-redux'
import {Navigate} from 'react-router-dom'
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from '@mui/material'
import {selectIsLoggedIn} from "./auth.selectors";
import {useActions} from "common/hooks";
import {authThunks} from "features/Auth/auth.reducer";
import {LoginParamsType} from "features/Auth/auth.api";
import {ResponseType} from "common/types";

import '../../index.css';


export const Login = () => {
    const {login} = useActions(authThunks)

    const isLoggedIn = useSelector(selectIsLoggedIn);

    const formik = useFormik({
        validate: (values) => {
            const errors: Partial<LoginParamsType> = {}
            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length > 10) {
                errors.password = 'Password should be max 7 symbols'
            }
            return errors
        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
           login(values)
                .unwrap()
                .catch((reason: ResponseType) => {
                    const {fieldsErrors} = reason
                    if (fieldsErrors){
                        fieldsErrors.forEach((f)=>formikHelpers.setFieldError(f.field,f.error))
                    }
                });
        },
    })

    if (isLoggedIn) {
        return <Navigate to={"/"}/>
    }


    return <Grid container justifyContent="center">
        <Grid item xs={4}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>
                            To log in get registered <a href={'https://social-network.samuraijs.com/'}
                                                        target={'_blank'}>here</a>
                        </p>
                        <p>
                            or use common test account credentials:
                        </p>
                        <p> Email: free@samuraijs.com
                        </p>
                        <p>
                            Password: free
                        </p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email && <div className='error'>{formik.errors.email}</div>}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password && <div className='error'>{formik.errors.password}</div>}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox
                                {...formik.getFieldProps("rememberMe")}
                                checked={formik.values.rememberMe}
                            />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'} disabled={!!formik.errors.email || !!formik.errors.password}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
