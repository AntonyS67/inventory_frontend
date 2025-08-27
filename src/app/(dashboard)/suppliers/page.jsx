'use client'

import { useEffect, useState } from 'react'

import { getSupplierList } from '@/services/supplier.service'
import SupplierListTable from '@/views/supplier/SupplierListTable'

export default function SupplierListApp() {
  const [suppliersData, setSuppliersData] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [reload, setReload] = useState(false)

  const getData = async () => {
    setLoading(true)
    const response = await getSupplierList()

    if (response.isSuccess) {
      setLoading(false)
      setSuppliersData(response.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [reload])

  if (isLoading) return <p>Loading...</p>

  return <SupplierListTable suppliersData={suppliersData} setReload={setReload} reload={reload} />
}
