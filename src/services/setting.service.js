import axiosInstance from '@/configs/axiosConfig'

export async function getSetting() {
  const response = await axiosInstance.get('/settings/list')

  return response?.data
}

export async function saveSetting(setting) {
  const formData = new FormData()

  formData.append('system_name', setting.system_name)
  formData.append('short_name', setting.short_name)
  formData.append('logo', setting.logo)

  const response = await axiosInstance.post('/settings/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response?.data
}
