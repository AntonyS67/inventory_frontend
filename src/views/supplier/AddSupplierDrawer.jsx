'use client'

import { useEffect } from 'react'

import { Button, Divider, Drawer, IconButton, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import { saveSupplier } from '@/services/supplier.service'
import { Notify } from '@/utils/notification'

export default function AddSupplierDrawer(props) {
  const { open, handleClose, titleForm, formData, setReload, reload } = props

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      document_number: '',
      business_name: '',
      contact_name: '',
      contact_email: '',
      address: '',
      phone: ''
    }
  })

  useEffect(() => {
    handleResetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

  const onSubmit = async data => {
    const newSupplier = {
      id: Object.keys(formData).length > 0 ? formData.id : 0,
      document_number: data.document_number,
      business_name: data.business_name,
      contact_name: data.contact_name,
      contact_email: data.contact_email,
      address: data.address,
      phone: data.phone
    }

    const response = await saveSupplier(newSupplier)

    if (response.isSuccess) {
      // setData([...(userData ?? []), newUser])
      setReload(!reload)
      handleClose()
      handleResetForm()
      Notify(response.message, 'success')
    } else {
      Notify(response.message, 'error')
    }
  }

  const handleResetForm = () => {
    resetForm({
      document_number: formData.document_number || '',
      business_name: formData.business_name || '',
      contact_name: formData.contact_name || '',
      contact_email: formData.contact_email || '',
      address: formData.address || '',
      phone: formData.phone || ''
    })
  }

  const handleReset = () => {
    handleClose()
    handleResetForm()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>{titleForm}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6 p-6'>
          <Controller
            name='business_name'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Nombre de negocio'
                placeholder='John Doe'
                {...(errors.business_name && { error: true, helperText: 'Este campo es requerido.' })}
              />
            )}
          />
          <Controller
            name='document_number'
            control={control}
            rules={{
              required: 'El campo es requerido',
              maxLength: { value: 11, message: 'La longitud maxima es de 11 numeros' },
              minLength: { value: 8, message: 'La longitud minima es de 8 numeros' }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Numero de documento (DNI, RUC)'
                placeholder='12345678'
                {...(errors.document_number && { error: true, helperText: errors.document_number.message })}
              />
            )}
          />
          <Controller
            name='address'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Dirección'
                placeholder='Direccion'
                {...(errors.address && { error: true, helperText: 'Este campo es requerido.' })}
              />
            )}
          />
          <Controller
            name='phone'
            control={control}
            rules={{
              required: 'El campo es requerido',
              maxLength: { value: 11, message: 'La longitud maxima es de 11 numeros' },
              minLength: { value: 8, message: 'La longitud minima es de 8 numeros' }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='number'
                label='Telefono'
                placeholder='12345678'
                {...(errors.phone && { error: true, helperText: errors.phone.message })}
              />
            )}
          />
          <Controller
            name='contact_name'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Nombre de contacto'
                placeholder='johndoe'
                {...(errors.contact_name && { error: true, helperText: 'Este campo es requerido.' })}
              />
            )}
          />
          <Controller
            name='contact_email'
            control={control}
            rules={{
              required: 'El campo es obligatorio',
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'El formato del correo no es valido'
              }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                type='email'
                fullWidth
                label='Correo de contacto'
                placeholder='johndoe@contacto'
                {...(errors.contact_email && { error: true, helperText: errors.contact_email.message })}
              />
            )}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}
