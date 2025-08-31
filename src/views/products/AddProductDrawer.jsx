'use client'

import { useEffect, useState } from 'react'

import { Button, Divider, Drawer, IconButton, MenuItem, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import { saveProduct } from '@/services/product.service'
import { Notify } from '@/utils/notification'
import CustomInputImage from '@/components/images/CustomInputImage'

export default function AddProductDrawer(props) {
  const { open, handleClose, titleForm, formData, setReload, reload, suppliersData } = props
  const [files, setFiles] = useState([])

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '@avion_2.png;type=image/png',
      photo: '',
      Supplierid: '',
      quantity: 0
    }
  })

  const onSubmit = async data => {
    const newProduct = {
      id: Object.keys(formData).length > 0 ? formData.id : 0,
      name: data.name,
      description: data.description,
      price: data.price,
      photo: files.length > 0 ? files[0] : '',
      Supplierid: data.Supplierid,
      quantity: data.quantity
    }

    const response = await saveProduct(newProduct)

    if (response.isSuccess) {
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
      name: formData.name || '',
      description: formData.description || '',
      price: formData.price || '',
      photo: formData.photo || '',
      Supplierid: formData.supplier?.id || '',
      quantity: formData.quantity || 0
    })
    setFiles([{ name: formData.name, uri: formData.photo }])
  }

  const handleReset = () => {
    handleClose()
    handleResetForm()
  }

  useEffect(() => {
    handleResetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

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
          <CustomInputImage files={files} setFiles={setFiles} />
          <Controller
            name='name'
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Nombre del producto'
                placeholder='John Doe'
                {...(errors.name && { error: true, helperText: errors.name.message })}
              />
            )}
          />
          <Controller
            name='description'
            control={control}
            rules={{
              required: 'El campo es requerido'
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='textarea'
                label='Descripcion del producto'
                placeholder='Descripcion'
                {...(errors.description && { error: true, helperText: errors.description.message })}
              />
            )}
          />
          <Controller
            name='price'
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='number'
                label='Precio'
                placeholder='10'
                {...(errors.price && { error: true, helperText: errors.price.message })}
              />
            )}
          />
          <Controller
            name='quantity'
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='number'
                label='Cantidad'
                placeholder='10'
                {...(errors.quantity && { error: true, helperText: errors.quantity.message })}
              />
            )}
          />
          <Controller
            name='Supplierid'
            control={control}
            rules={{ required: 'Este campo es requerido' }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                id='select-supplier'
                label='Seleccione un proveedor'
                placeholder='Seleccione un proveedor'
                {...field}
                {...(errors.Supplierid && { error: true, helperText: errors.Supplierid.message })}
              >
                {suppliersData.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.business_name}
                  </MenuItem>
                ))}
              </CustomTextField>
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
