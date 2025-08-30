'use client'

import { useEffect, useState } from 'react'

import { RETURN } from '@/services/purchase.service'
import { getSupplierList } from '@/services/supplier.service'
import AddPurchase from '@/views/purchases/AddPurchase'

export default function ReturnCreateApp() {
  const [loading, setLoading] = useState(false)
  const [suppliers, setSuppliers] = useState([])

  const getData = async () => {
    setLoading(true)
    const response = await getSupplierList()

    if (response.isSuccess) {
      setSuppliers(response.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  if (loading) return <p>Loading...</p>

  return <AddPurchase suppliers={suppliers} type={RETURN} />
}
