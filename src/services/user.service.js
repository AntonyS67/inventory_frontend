import axiosInstance from '@/configs/axiosConfig'

export async function getUserList() {
  const response = await axiosInstance.get('/users/list')

  return response?.data
}
