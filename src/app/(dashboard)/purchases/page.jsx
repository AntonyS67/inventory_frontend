'use client'

import { useEffect, useState } from 'react'

import { getPurchasesList, PURCHASE } from '@/services/purchase.service'
import PurchasesListTable from '@/views/purchases/PurchasesListTable'

export default function PurchasesApp() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  const getData = async () => {
    setLoading(true)
    const response = await getPurchasesList(PURCHASE)

    setLoading(false)

    if (response.isSuccess) {
      setData(response.data)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  return <PurchasesListTable dataForm={data} type={PURCHASE} />
}
