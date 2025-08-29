'use client'

import { useEffect } from 'react'

import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import { getSetting, saveSetting } from '@/services/setting.service'
import { Notify } from '@/utils/notification'

export default function Setting() {
  const fetchData = async () => {
    const response = await getSetting()

    if (response.isSuccess) {
      resetForm({
        system_name: response.item?.system_name || '',
        short_name: response.item?.short_name || '',
        logo: ''
      })
    }
  }

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      system_name: '',
      short_name: '',
      logo: ''
    }
  })

  const onSubmit = async data => {
    const response = await saveSetting(data)

    if (response.isSuccess) {
      Notify(response.message, 'success')
    } else {
      Notify(response.message, 'error')
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardHeader title='Configuración' />
      <CardContent>
        <form onSubmit={handleSubmit(data => onSubmit(data))}>
          <Grid container spacing={12}>
            <Grid item xs={12}>
              <Controller
                name='system_name'
                control={control}
                rules={{ required: 'El campo es requerido' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Nombre del sistema'
                    placeholder='SISTEMA'
                    {...(errors.system_name && { error: true, helperText: errors.system_name.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='short_name'
                control={control}
                rules={{ required: 'El campo es requerido' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Nombre corto del sistema'
                    placeholder='SIS'
                    {...(errors.short_name && { error: true, helperText: errors.short_name.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' className='max-sm:is-full' variant='contained'>
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
