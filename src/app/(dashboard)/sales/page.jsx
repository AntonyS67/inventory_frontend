'use client'

import { useEffect, useState } from 'react'

import { getPurchasesList, SALE } from '@/services/purchase.service'
import PurchasesListTable from '@/views/purchases/PurchasesListTable'

export default function SalesApp() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  const getData = async () => {
    setLoading(true)
    const response = await getPurchasesList(SALE)

    if (response.isSuccess) {
      setData(response.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  if (loading) return <p>Loading...</p>

  return <PurchasesListTable dataForm={data} type={SALE} />
}
