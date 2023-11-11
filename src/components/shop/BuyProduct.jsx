import React, { useState } from 'react';
import {
  FormControlLabel,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { axiosInstance } from '../config/axios';
import { toast } from 'react-toastify';

export default function BuyProduct({ isFormOpened, handleCloseDialog, props }) {
  // console.log(props);
  const [tailoringDetails, setTailorDetails] = useState(false);
  const [client, setClient] = useState();

  const Navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      quantity: '',
      tailoring: '',
      description: '',
      phone: '',
      price: '',
      paymentMethod: '',
    },
    validationSchema: yup.object({
      quantity: yup.string().required('Required'),
      tailoring: yup.string().required('Required'),
      phone: yup.string().required('Required'),
      paymentMethod: yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      values = { ...values, productId: props?._id };
      console.log(props?._id);
      axiosInstance
        .post(`/user/buy`, values)
        .then((response) => {
          handleCloseDialog();
          toast.success(response.data.message);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response);
            if (error.response.data.err.statusCode == 404) {
              Navigate('/addClient');
            } else if (error.response.data.err.statusCode === 401) {
              Navigate('/addCardInfo');
            } else {
              toast.error(error);
            }
          } else {
            toast.error('Something wrong happened while logining');
          }
        });
    },
  });

  return (
    <Box component='form' onSubmit={formik.handleSubmit}>
      <Dialog open={isFormOpened}>
        <DialogTitle
          style={{
            fontSize: '25px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Buy Product Now
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                autoFocus
                margin='dense'
                id='quantity'
                label='Quantity'
                type='text'
                fullWidth
                variant='standard'
                name='quantity'
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.quantity && formik.errors.quantity}
                helperText={formik.touched.quantity && formik.errors.quantity}
              />
              <FormControl>
                <FormLabel
                  id='demo-row-radio-buttons-group-label'
                  sx={{ padding: '30px' }}
                >
                  Tailoring
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={formik.values.tailoring}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    name='tailoring'
                    control={<Radio />}
                    label='Yes '
                    value='yes'
                    onChange={() => setTailorDetails(!tailoringDetails)}
                  />
                  <FormControlLabel
                    value='no'
                    control={<Radio />}
                    label='No'
                    name='tailoring'
                  />
                  {tailoringDetails && (
                    <>
                      <TextField
                        sx={{ mt: '30px' }}
                        id='text'
                        label='Description'
                        multiline
                        type='text'
                        fullWidth
                        variant='standard'
                        name='description'
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.description &&
                          formik.errors.description
                        }
                        helperText={
                          formik.touched.description &&
                          formik.errors.description
                        }
                      />
                      <TextField
                        autoFocus
                        margin='dense'
                        id='price'
                        label='Price'
                        type='text'
                        fullWidth
                        variant='standard'
                        name='price'
                        value={formik.values.price}
                        onChange={formik.handleChange}
                      />
                    </>
                  )}
                </RadioGroup>
              </FormControl>
              <TextField
                sx={{ mt: '30px' }}
                id='text'
                label='Phone'
                multiline
                type='text'
                fullWidth
                variant='standard'
                name='phone'
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && formik.errors.phone}
                helperText={formik.touched.phone && formik.errors.phone}
              />

              <FormControl>
                <FormLabel
                  id='demo-row-radio-buttons-group-label'
                  sx={{ padding: '30px' }}
                >
                  Payment Method
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={formik.values.paymentMethod}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    name='paymentMethod'
                    control={<Radio />}
                    label='Cash '
                    value='cash'
                  />
                  <FormControlLabel
                    value='card'
                    control={<Radio />}
                    label='Card'
                    name='paymentMethod'
                  />
                </RadioGroup>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              type='submit'
              disabled={formik.isSubmitting}
              sx={{ fontSize: '20px' }}
            >
              Buy
            </Button>
            <Button onClick={handleCloseDialog} sx={{ fontSize: '20px' }}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
