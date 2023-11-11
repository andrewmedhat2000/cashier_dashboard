import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { axiosInstance } from '../config/axios';
import { useNavigate } from 'react-router-dom';
import {
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import '../contact/contact.css';
const AddClient = () => {
  const Navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      gender: '',
    },
    validationSchema: yup.object({
      name: yup.string().required('Required'),
      phone: yup.string().required('Required'),
      gender: yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      axiosInstance
        .post('/user/addclient', values)
        .then((res) => {
          console.log(res.data.message);
          formik.resetForm();
          toast.success(res.data.message);
          Navigate('/shop');
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
            <h2>Add New Client</h2>
            <form onSubmit={formik.handleSubmit}>
              <div className='box'>
                <div className='lable'>
                  <h4>Name</h4>
                </div>
                <div className='input'>
                  <input
                    type='text'
                    placeholder='Name'
                    value={formik.values.name}
                    name='name'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  ></input>
                </div>
              </div>
              <div className='box'>
                <div className='lable'>
                  <h4>Phone</h4>
                </div>
                <div className='input'>
                  <input
                    type='text'
                    name='phone'
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    placeholder='Phone'
                    onBlur={formik.handleBlur}
                  ></input>
                </div>
              </div>
              <div className='box'>
                <FormControl>
                  <div className='lable'>
                    <h4>Gender</h4>
                  </div>

                  <RadioGroup
                    row
                    aria-labelledby='demo-row-radio-buttons-group-label'
                    name='row-radio-buttons-group'
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      name='gender'
                      control={<Radio />}
                      label='Male '
                      value='male'
                    />
                    <FormControlLabel
                      value='female'
                      control={<Radio />}
                      label='Female'
                      name='gender'
                    />
                  </RadioGroup>
                </FormControl>
              </div>

              <button type='sublit'>Create</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddClient;
