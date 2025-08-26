import { useMemo, useState } from 'react'

import { Button, Card, CardHeader, IconButton, MenuItem, TablePagination, Typography } from '@mui/material'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'

import CustomTextField from '@/@core/components/mui/TextField'
import CustomAvatar from '@/@core/components/mui/Avatar'
import TablePaginationComponent from '@/components/TablePaginationComponent'

import styles from '@core/styles/table.module.css'
import AddUserDrawer from './AddUserDrawer'
import { deleteUser } from '@/services/user.service'
import { Notify } from '@/utils/notification'

// Column Definitions
const columnHelper = createColumnHelper()

const getAvatar = params => {
  const { avatar } = params

  if (avatar != '') {
    return <CustomAvatar src={'/images/avatar/' + avatar} size={34} />
  } else {
    return <CustomAvatar size={34} src='/images/avatar/1.png' />
  }
}

export default function UserListTable({ userData, setReload, reload }) {
  const [data, setData] = useState(() => [...userData])
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [userFormData, setUserData] = useState({})
  const [titleForm, setTitleForm] = useState('')

  const columns = useMemo(() => [
    columnHelper.accessor('names', {
      header: 'Nombre',
      cell: ({ row }) => (
        <div className='flex items-center gap-4'>
          {getAvatar({ avatar: row.original.avatar })}
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.names}
            </Typography>
            <Typography variant='body2'>{row.original.lastnames}</Typography>
          </div>
        </div>
      )
    }),
    columnHelper.accessor('username', {
      cell: info => info.getValue(),
      header: 'Username'
    }),
    columnHelper.accessor('role', {
      cell: ({ row }) => (row.original.role == 1 ? 'Administrador' : 'Usuario'),
      header: 'Rol'
    }),
    columnHelper.accessor('action', {
      header: 'Acciones',
      cell: ({ row }) => (
        <div className='flex items-center'>
          <IconButton title='Editar' onClick={() => openEditForm(row)}>
            <i className='tabler-edit' />
          </IconButton>
          <IconButton title='Eliminar' onClick={() => handleDelete(row)}>
            <i className='tabler-trash' />
          </IconButton>
        </div>
      )
    })
  ])

  // Hooks
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: () => false
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    getPaginationRowModel: getPaginationRowModel()
  })

  const openEditForm = row => {
    setUserData(row.original)
    setTitleForm('Editar Usuario')
    setAddUserOpen(true)
  }

  const handleDelete = async row => {
    const response = await deleteUser(row.original.id)

    if (response.isSuccess) {
      setReload(!reload)
      Notify(response.message, 'success')
    } else {
      Notify(response.messageException, 'error')
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='Usuarios' />
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='max-sm:is-full sm:is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => {
                setAddUserOpen(!addUserOpen), setTitleForm('Nuevo Usuario'), setUserData({})
              }}
            >
              Add New User
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, 10)
                .map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
      <AddUserDrawer
        open={addUserOpen}
        userData={userData}
        userFormData={userFormData}
        titleForm={titleForm}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        setData={setData}
        setReload={setReload}
        reload={reload}
      />
    </>
  )
}
