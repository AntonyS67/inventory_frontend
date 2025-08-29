'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Controller, useForm } from 'react-hook-form'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'
import { PURCHASE, RETURN, updatePurchase } from '@/services/purchase.service'
import { Notify } from '@/utils/notification'
import { getProductsBySupplier } from '@/services/product.service'

export default function UpdatePurchase({ suppliers, purchase, productsData, supplierId, type }) {
  const router = useRouter()

  console.log(supplierId)

  const [products, setProducts] = useState(productsData)
  const [productTable, setProductsTable] = useState([])
  const [total, setTotal] = useState(0)

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    defaultValues: {
      code: 0,
      supplierId: '',
      productId: '',
      quantity: 0,
      description: '',
      observations: ''
    }
  })

  const handleAdd = () => {
    let quant = getValues('quantity')

    if (getValues('productId') == '') {
      Notify('Seleccione algun producto', 'error')

      return
    }

    if (quant <= 0) {
      Notify('Ingrese una cantidad mayor a 0', 'error')

      return
    }

    const product = products.find(item => item.id == getValues('productId'))

    setTotal(Number(total) + Number(product.price * quant))

    if (productTable.find(p => p.id == product.id)) {
      setProductsTable(prev =>
        prev.map(prod =>
          prod.id == getValues('productId') ? { ...prod, quantity: Number(quant) + Number(prod.quantity) } : prod
        )
      )
    } else {
      setProductsTable([...productTable, { id: product.id, name: product.name, price: product.price, quantity: quant }])
    }
  }

  useEffect(() => {
    resetForm({
      code: purchase.code || 0,
      supplierId: '',
      productId: '',
      quantity: 0,
      description: purchase.description || '',
      observations: purchase.observations || ''
    })

    if (purchase.stocks.length > 0 && products.length > 0) {
      let purchases = []
      let sum = 0

      purchase.stocks.map(item => {
        const product = products.find(p => p.id == item.productid)

        if (product) {
          sum = sum + product.price * item.quantity
          purchases.push({ id: item.productid, name: product.name, price: product.price, quantity: item.quantity })
        }
      })
      setTotal(sum)

      setProductsTable(purchases)
    }
  }, [purchase, resetForm, products])

  const handleChange = async event => {
    if (event.target.value != '') {
      await getProducts(event.target.value)
    } else {
      setProducts([])
    }
  }

  const getProducts = async supplierId => {
    const response = await getProductsBySupplier(supplierId)

    if (response.isSuccess) {
      setProducts(response.data)
    }
  }

  const handleDelete = id => {
    let products = productTable.filter(product => product.id != id)

    if (products.length == 0) {
      setTotal(0)
    } else {
      setTotal(products.map(item => item.quantity * item.price))
    }

    setProductsTable(products)
  }

  const handleForm = () => {
    resetForm({
      code: 0,
      supplierId: '',
      productId: '',
      quantity: 0,
      description: '',
      observations: ''
    })
    setProductsTable([])
    setTotal(0)
  }

  const onSubmit = async data => {
    let products = productTable.map(item => {
      return { ProductId: item.id, quantity: item.quantity }
    })
    let newData = {
      id: purchase.id,
      code: data.code,
      description: data.description,
      observations: data.observations,
      type,
      total,
      products
    }

    const response = await updatePurchase(newData)

    if (response.isSuccess) {
      handleForm()
      Notify(response.message, 'success')

      if (type == PURCHASE) {
        router.push('/purchases')
      } else if (type == RETURN) {
        router.push('/returns')
      } else {
        router.push('/sales')
      }
    } else {
      Notify(response.message, 'error')
    }
  }

  return (
    <Card>
      <CardHeader
        title={type == PURCHASE ? 'Actualizar compra' : type == RETURN ? 'Actualizar devolucion' : 'Actualizar venta'}
      />

      <CardContent>
        <form onSubmit={handleSubmit(data => onSubmit(data))}>
          <Grid container spacing={12}>
            <Grid item md={6}>
              <Controller
                name='code'
                control={control}
                type='number'
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    InputProps={{
                      readOnly: true
                    }}
                    fullWidth
                    label='Código'
                  />
                )}
              />
            </Grid>
            <Grid item md={6}>
              <Controller
                name='supplierId'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    onChange={e => {
                      field.onChange(e)
                      handleChange(e)
                    }}
                    fullWidth
                    label='Proveedor'
                    value={supplierId}
                    select
                    id='select-supplier'
                  >
                    <MenuItem value=''>---- Seleccionar ---</MenuItem>
                    {suppliers != null &&
                      suppliers.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.business_name}
                        </MenuItem>
                      ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
          <Grid container spacing={12} className='mt-1 items-center'>
            <Grid item md={5}>
              <Controller
                name='productId'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Producto' select id='select-products'>
                    <MenuItem value=''>---- Seleccionar ----</MenuItem>
                    {products != null &&
                      products.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item md={5}>
              <Controller
                name='quantity'
                control={control}
                render={({ field }) => <CustomTextField {...field} fullWidth label='Cantidad' type='number' />}
              />
            </Grid>
            <Grid item md={2}>
              <Button variant='contained' className='mt-4 flex float-right' onClick={handleAdd}>
                Agregar
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={12} className='mt-1'>
            <Grid item md={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell scope='col'>Producto</TableCell>
                    <TableCell scope='col'>Cantidad</TableCell>
                    <TableCell scope='col'>Precio</TableCell>
                    <TableCell scope='col'>Total</TableCell>
                    <TableCell scope='col'>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productTable.length > 0 &&
                    productTable.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{item.quantity * item.price}</TableCell>
                        <TableCell>
                          <IconButton title='Eliminar' onClick={() => handleDelete(item.id)}>
                            <i className='tabler-trash' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow>
                    <TableCell colSpan='3' className='text-right'>
                      Total
                    </TableCell>
                    <TableCell colSpan='1'>{total}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
            <Grid item sm={12}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => <CustomTextField {...field} fullWidth multiline label='Descripción' rows={3} />}
              />
            </Grid>
            <Grid item sm={12}>
              <Button type='submit' variant='contained' className='flex float-right'>
                Guardar
              </Button>
              <Button
                onClick={() =>
                  type == PURCHASE
                    ? router.push('/purchases')
                    : type == RETURN
                      ? router.push('/returns')
                      : router.push('/sales')
                }
                color='error'
                variant='contained'
                className='flex float-right mr-4'
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
