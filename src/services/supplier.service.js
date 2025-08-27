import axiosInstance from '@/configs/axiosConfig'

export async function getSupplierList() {
  const response = await axiosInstance.get('/suppliers/list')

  return response?.data
}

export async function saveSupplier(supplier) {
  const response = await axiosInstance.post('/suppliers/create', supplier, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response?.data
}

export async function deleteSupplier(id) {
  const response = await axiosInstance.delete('/suppliers/delete?id=' + id)

  return response?.data
}
