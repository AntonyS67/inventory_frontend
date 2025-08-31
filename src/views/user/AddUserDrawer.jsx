import { useEffect, useState } from 'react'

import { Button, Divider, Drawer, IconButton, MenuItem, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import { saveUser } from '@/services/user.service'
import { Notify } from '@/utils/notification'
import CustomInputImage from '@/components/images/CustomInputImage'

export default function AddUserDrawer(props) {
  const { open, handleClose, titleForm, userFormData, setReload, reload } = props
  const [files, setFiles] = useState([])

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      names: '',
      lastnames: '',
      username: '',
      role: '1'
    }
  })

  useEffect(() => {
    resetForm({
      names: userFormData.names || '',
      lastnames: userFormData.lastnames || '',
      username: userFormData.username || '',
      role: userFormData.role || '0'
    })
    setFiles([{ name: userFormData.names, uri: userFormData.photo }])
  }, [userFormData, resetForm])

  const onSubmit = async data => {
    const newUser = {
      id: Object.keys(userFormData).length > 0 ? userFormData.id : 0,
      photo: files.length > 0 ? files[0] : '',
      names: data.names,
      lastnames: data.lastnames,
      username: data.username,
      role: data.role
    }

    const response = await saveUser(newUser)

    if (response.isSuccess) {
      // setData([...(userData ?? []), newUser])
      setReload(!reload)
      handleClose()
      resetForm({ names: '', lastnames: '', username: '', role: '' })
      Notify(response.message, 'success')
    } else {
      Notify(response.message, 'error')
    }
  }

  const handleReset = () => {
    handleClose()
    resetForm({ names: '', lastnames: '', username: '', role: '' })
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
          <CustomInputImage files={files} setFiles={setFiles} />
          <Controller
            name='names'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Nombres'
                placeholder='John Doe'
                {...(errors.names && { error: true, helperText: 'Este campo es requerido.' })}
              />
            )}
          />
          <Controller
            name='lastnames'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Apellidos'
                placeholder='johndoe'
                {...(errors.lastnames && { error: true, helperText: 'Este campo es requerido.' })}
              />
            )}
          />
          <Controller
            name='username'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Username'
                placeholder='johndoe'
                {...(errors.username && { error: true, helperText: 'Este campo es requerido.' })}
              />
            )}
          />
          <Controller
            name='role'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                id='select-role'
                label='Select Role'
                placeholder='Selecciona un rol'
                {...field}
                {...(errors.role && { error: true, helperText: 'Este campo es requerido.' })}
              >
                <MenuItem value='1'>Admin</MenuItem>
                <MenuItem value='0'>Usuario</MenuItem>
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
