'use client'

import { useEffect, useState } from 'react'

import { getUserList } from '@/services/user.service'
import UserListTable from '@/views/user/UserListTable'

export default function UserListApp() {
  const [usersData, setUsersData] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [reload, setReload] = useState(false)

  const getData = async () => {
    setLoading(true)
    const response = await getUserList()

    if (response.isSuccess) {
      setLoading(false)
      setUsersData(response.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [reload])

  if (isLoading) return <p>Loading...</p>

  return <UserListTable userData={usersData} setReload={setReload} reload={reload} />
}
