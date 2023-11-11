import React, { useState } from 'react';
import '../contact/contact.css';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { Button } from '@mui/material';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { toast } from 'react-toastify';

const Login = () => {
  const [passwordType, setPasswordType] = useState(true);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email('*Should be a valid email')
        .required('Required'),
      password: yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      axios
        .post('https://andrew-demo.onrender.com/user/login', values)
        .then((res) => {
          toast.success(res.data.message);
          localStorage.setItem('token', res.data.token);
          navigate('/home');
        })
        .catch((e) => {
          toast.error('Something wrong happened while logining');
        });
    },
  });

  return (
    <>
      <div className='contact'>
        <div style={{ marginTop: '300px' }}>
          <div className='container'>
            <div className='form'>
              <h2>Login To System</h2>
              <form onSubmit={formik.handleSubmit}>
                <div className='box'>
                  <div className='lable'>
                    <h4>E-mail</h4>
                  </div>
                  <div className='input'>
                    <input
                      type='text'
                      name='email'
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      placeholder='E-MAIL'
                      onBlur={formik.handleBlur}
                    ></input>
                    {/* {formik.errors.email && formik.touched.email && (
                      <FormHelperText sx={{ color: 'red' }} id='email'>
                        {formik.errors.email}
                      </FormHelperText>
                    )} */}
                  </div>
                </div>
                <div className='box'>
                  <div className='lable'>
                    <h4>Password</h4>
                  </div>
                  <div className='input'>
                    <input
                      type='text'
                      placeholder='PASSWORD'
                      name='password'
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      onBlur={formik.handleBlur}
                    ></input>
                  </div>
                </div>

                <button type='sublit'>Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
