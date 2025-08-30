'use client'

import { useEffect, useState } from 'react'

import { Grid } from '@mui/material'

import { getDashboardData } from '@/services/dashboard.services'
import CardStatistic from '@/views/dashboard/CardStatistic'

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const getData = async () => {
    setLoading(true)
    const response = await getDashboardData()

    if (response.isSuccess) {
      setData(response.item)
    }

    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} lg={3}>
        <CardStatistic title='Ordenes de compra' value={data.totalPurchases} icon='tabler-building-store' />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CardStatistic title='Compras recibidas' value={data.receivedPurchases} icon='tabler-receipt-refund' />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CardStatistic title='Devoluciones' value={data.returns} icon='tabler-refresh' />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CardStatistic title='Ventas' value={data.sales} icon='tabler-shopping-cart' />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CardStatistic title='Proveedores' value={data.suppliers} icon='tabler-box' />
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <CardStatistic title='Productos' value={data.totalPurchases} icon='tabler-archive' />
      </Grid>
    </Grid>
  )
}
