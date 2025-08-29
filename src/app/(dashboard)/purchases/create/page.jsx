'use client'

import { useEffect, useState } from 'react'

import { getSupplierList } from '@/services/supplier.service'
import AddPurchase from '@/views/purchases/AddPurchase'
import { PURCHASE } from '@/services/purchase.service'

export default function PurchaseCreateApp() {
  const [loading, setLoading] = useState(true)
  const [suppliers, setSuppliers] = useState([])

  const getData = async () => {
    setLoading(true)
    const response = await getSupplierList()

    if (response.isSuccess) {
      setLoading(false)
      setSuppliers(response.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  if (loading) return <p>Loading...</p>

  return <AddPurchase suppliers={suppliers} type={PURCHASE} />
}
