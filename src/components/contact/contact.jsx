import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { axiosInstance } from '../config/axios';
import './contact.css';
const Contact = () => {
  const formik = useFormik({
    initialValues: {
      description: '',
      name: '',
    },
    validationSchema: yup.object({
      description: yup.string().required('Required'),
      name: yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      axiosInstance
        .post('/report/createreport', values)
        .then((res) => {
          console.log(res.data.status);
          formik.resetForm();
          toast.success(res.data.status);
        })
        .catch((e) => {
          toast.error('Something wrong happened while logining');
        });
    },
  });

  return (
    <>
      <div className='contact'>
        <div className='container'>
          <div className='form'>
            <h2>contact us</h2>
            <form onSubmit={formik.handleSubmit}>
              <div className='box'>
                <div className='lable'>
                  <h4>Title</h4>
                </div>
                <div className='input'>
                  <input
                    type='text'
                    placeholder='Title'
                    value={formik.values.name}
                    name='name'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  ></input>
                </div>
              </div>
              <div className='box'>
                <div className='lable'>
                  <h4>Description</h4>
                </div>
                <div className='input'>
                  <input
                    type='text'
                    name='description'
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    placeholder='Description'
                    onBlur={formik.handleBlur}
                  ></input>
                </div>
              </div>
              <button type='sublit'>Send</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
