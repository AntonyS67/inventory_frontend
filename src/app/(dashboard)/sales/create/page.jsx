'use client'

import { useEffect, useState } from 'react'

import { SALE } from '@/services/purchase.service'
import { getSupplierList } from '@/services/supplier.service'
import AddPurchase from '@/views/purchases/AddPurchase'

export default function SalesCreateApp() {
  const [loading, setLoading] = useState(false)
  const [suppliers, setSuppliers] = useState([])

  const getData = async () => {
    setLoading(true)
    const response = await getSupplierList()

    if (response.isSuccess) {
      setLoading(false)
      setSuppliers(response.data)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  if (loading) return <p>Loading...</p>

  return <AddPurchase suppliers={suppliers} type={SALE} />
}
