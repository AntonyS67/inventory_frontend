import axiosInstance from '@/configs/axiosConfig'

export async function getProductsList() {
  const response = await axiosInstance.get('/products/list')

  return response?.data
}

export async function saveProduct(product) {
  console.log(product)

  const formData = new FormData()

  formData.append('id', product.id)
  formData.append('name', product.name)
  formData.append('description', product.description)
  formData.append('price', product.price)
  formData.append('photo', product.photo)
  formData.append('Supplierid', product.Supplierid)
  formData.append('quantity', product.quantity)

  const response = await axiosInstance.post('/products/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  console.log(response)

  return response?.data
}

export async function deleteProduct(id) {
  const response = await axiosInstance.delete(`/products/delete?id=${id}`)

  return response?.data
}

export async function getProductsBySupplier(supplierId) {
  const response = await axiosInstance.get('/products/list?supplierId=' + supplierId)

  return response?.data
}
