'use client'

import { useEffect, useState } from 'react'

import { getPurchasesList, RETURN } from '@/services/purchase.service'
import PurchasesListTable from '@/views/purchases/PurchasesListTable'

export default function ReturnsApp() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const getData = async () => {
    setLoading(true)
    const response = await getPurchasesList(RETURN)

    if (response.isSuccess) {
      setData(response.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  if (loading) return <p>Loading...</p>

  return <PurchasesListTable dataForm={data} type={RETURN} />
}
