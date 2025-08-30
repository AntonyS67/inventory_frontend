'use client'

import { useEffect, useState } from 'react'

import { getProductsBySupplier } from '@/services/product.service'
import { getPurchase, PURCHASE, RETURN } from '@/services/purchase.service'
import { getSupplierList } from '@/services/supplier.service'
import UpdatePurchase from '@/views/purchases/UpdatePurchase'

export default function UpdateReturnApp({ params }) {
  const { id } = params

  const [loading, setLoading] = useState(true)
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [purchase, setPurchase] = useState({})
  const [supplierId, setSupplierId] = useState(0)

  const getData = async () => {
    setLoading(true)
    const purchase = await getPurchase(id)

    if (purchase.isSuccess) {
      setPurchase(purchase.item)

      if (purchase.item.stocks.length > 0) {
        setSupplierId(purchase.item.stocks[0].supplierid)
        const response = await getProductsBySupplier(supplierId)

        if (response.isSuccess) {
          setProducts(response.data)
        }
      }

      const suppliers = await getSupplierList()

      if (suppliers.isSuccess) {
        setSuppliers(suppliers.data)
      }

      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <UpdatePurchase
      suppliers={suppliers}
      purchase={purchase}
      productsData={products}
      supplierId={supplierId}
      type={RETURN}
    />
  )
}
