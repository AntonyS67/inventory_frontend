import axiosInstance from '@/configs/axiosConfig'

export async function getUserList() {
  const response = await axiosInstance.get('/users/list')

  return response?.data
}

export async function saveUser(user) {
  const formData = new FormData()

  formData.append('id', user.id)
  formData.append('names', user.names)
  formData.append('lastnames', user.lastnames)
  formData.append('username', user.username)
  formData.append('password', user.password)
  formData.append('photo', 'photo')
  formData.append('role', user.role)

  const response = await axiosInstance.post('/users/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response?.data
}
