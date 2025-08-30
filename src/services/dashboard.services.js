import axiosInstance from '@/configs/axiosConfig'

export async function getDashboardData() {
  const response = await axiosInstance.get('/dashboard')

  return response?.data
}
