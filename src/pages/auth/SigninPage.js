import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../actions/userActions'
import { useNavigate } from "react-router-dom";
import { Checkbox, Container, Button, Grid, makeStyles, Paper, TextField, Box, Typography } from '@material-ui/core'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 100
  },
  container: {
    padding: theme.spacing(3),
    maxWidth: 600,
    margin: 'auto',
  },
  formContainer : {
    margin: '30 auto',
  },
  formLayout: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  }
}))

const SigninPage = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  // console.log(location)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  // console.log
  // const redirect = location.state ? location.state.from.pathname : '/'

  useEffect(() => {
    if (userInfo) {
      setTimeout(() => navigate('/admin'), 3000)
    }
  }, [navigate, userInfo])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <div className={classes.root}>
      <Box className={classes.container} maxWidth="xs" boxShadow={3}>
        <Typography component="div">
          <Box fontWeight="fontWeightBold" m={1} textAlign="center" fontSize="h5.fontSize">
            Sign In
          </Box>
        </Typography>
        <ValidatorForm onSubmit={submitHandler} className={classes.formContainer}>
          <Grid container spacing={5} className={classes.formLayout}>
            <Grid item xs={8} >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextValidator 
                    fullWidth 
                    id="Email"
                    label="Email" 
                    name="email" 
                    size="small" 
                    variant="outlined"
                    value={email}
                    validators={['required', 'isEmail']}
                    errorMessages={['This field is required', 'Email is not valid']}
                    onChange={(e) => setEmail(e.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                  <TextValidator
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    size="small"
                    type="password"
                    value={password}
                    variant="outlined"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Button color="primary" fullWidth type="submit" variant="contained">
                Sign in
              </Button>
            </Grid>
          </Grid>
        </ValidatorForm>
      </Box>
    </div>
  )
}

export default SigninPage
