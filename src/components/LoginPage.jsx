// LoginPage.jsx
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import '../App.css';
import bcrypt from 'bcryptjs';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  Button,
  Alert
} from '@mui/material';
import { enqueueSnackbar } from "notistack";

import { LockOutlined } from '@mui/icons-material';
const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (values) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const user = users.find(u => u.email === values.email);
  
    if (user) {
      const passwordMatch = bcrypt.compareSync(values.password, user.password);
  
      if (passwordMatch) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/invoice');
      } else {
        enqueueSnackbar('Wrong password. Please try again.', { variant: 'error' });
      }
    } else {
      const hashedPassword = bcrypt.hashSync(values.password, 10); 
      const newUser = { email: values.email, password: hashedPassword };
  
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      navigate('/invoice');
    }
  };

  

  return (
    <div className="login-container">
      <div className="login-card">
        {/* <CardContent> */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <LockOutlined color="primary" fontSize="large" />
            <Typography variant="h5" component="h1">
              Login
            </Typography>
          </div>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({ errors, touched, handleChange, handleBlur }) => (
              <Form>
                <div className="form-field">
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    variant="outlined"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </div>

                <div className="form-field">
                  <TextField
                    fullWidth
                    name="password"
                    type="password"
                    label="Password"
                    variant="outlined"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </div>

                {/* {error && (
                  <Alert severity="error" className="form-field">
                    {error}
                  </Alert>
                )} */}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        {/* </CardContent> */}
      </div>
    </div>
  );
};

export default LoginPage;