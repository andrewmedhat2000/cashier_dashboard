import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { axiosInstance } from '../config/axios';
import { useNavigate } from 'react-router-dom';
export default function ReturnProduct() {
  const Navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      invoiceId: '',
    },
    validationSchema: yup.object({
      invoiceId: yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      axiosInstance
        .patch('/user/returnproduct', values)
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
    <div className='contact'>
      <div className='container'>
        <div className='form'>
          <h2>Return Product</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className='box'>
              <div className='lable'>
                <h4>Name</h4>
              </div>
              <div className='input'>
                <input
                  type='text'
                  placeholder='Invoice Id'
                  value={formik.values.invoiceId}
                  name='invoiceId'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></input>
              </div>
            </div>
            <button type='submit'>Done</button>
          </form>
        </div>
      </div>
    </div>
  );
}
