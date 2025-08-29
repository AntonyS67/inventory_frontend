'use client'

import { useEffect, useState } from 'react'

import { getProductsList } from '@/services/product.service'
import { getSupplierList } from '@/services/supplier.service'
import ProductListTable from '@/views/products/ProductListTable'

export default function ProductsApp() {
  const [productsData, setProductsData] = useState([])
  const [suppliersData, setSupplierData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [reload, setReload] = useState(false)

  const getData = async () => {
    setIsLoading(true)
    const response = await getProductsList()
    const responseSupplier = await getSupplierList()

    if (response.isSuccess) {
      setProductsData(response.data)
      setIsLoading(false)
    }

    if (responseSupplier.isSuccess) {
      setSupplierData(responseSupplier.data)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [reload])

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <ProductListTable dataForm={productsData} setReload={setReload} reload={reload} suppliersData={suppliersData} />
  )
}
