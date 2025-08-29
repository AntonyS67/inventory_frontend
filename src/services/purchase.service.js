import axiosInstance from '@/configs/axiosConfig'

export const PURCHASE = 0
export const SALE = 1
export const RETURN = 2

export async function getPurchasesList(type) {
  const response = await axiosInstance.get(`/purchases/list?type=${type}`)

  return response?.data
}

export async function createPurchase(data) {
  const response = await axiosInstance.post('/purchases/create', data)

  return response?.data
}

export async function updatePurchase(data) {
  const response = await axiosInstance.post('/purchases/update', data)

  return response?.data
}

export async function deletePurchase(id) {
  const response = await axiosInstance.delete(`/purchases/delete?id=${id}`)

  return response?.data
}

// status: 1: aceptado,2:rechazado
export async function updateStatusPurchase(id, status) {
  const response = await axiosInstance.get(`/purchases/updateStatus?id=${id}&status=${status}`)

  return response?.data
}

export async function getPurchase(id) {
  const response = await axiosInstance.get(`/purchases/show?id=${id}`)

  return response?.data
}
