'use client'

import { useMemo, useState } from 'react'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Button, Card, CardHeader, IconButton, MenuItem, TablePagination, Typography } from '@mui/material'

import CustomAvatar from '@/@core/components/mui/Avatar'
import CustomTextField from '@/@core/components/mui/TextField'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import styles from '@core/styles/table.module.css'
import AddProductDrawer from './AddProductDrawer'
import { deleteProduct } from '@/services/product.service'
import { Notify } from '@/utils/notification'

const columnHelper = createColumnHelper()

const getAvatar = params => {
  const { avatar } = params

  if (avatar != undefined) {
    return <CustomAvatar src={avatar} size={34} />
  } else {
    return <CustomAvatar size={34} src='/images/avatar/1.png' />
  }
}

export default function ProductListTable({ dataForm, setReload, reload, suppliersData }) {
  const [data, setData] = useState(() => [...dataForm])
  const [addFormOpen, setAddFormOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const [titleForm, setTitleForm] = useState('')

  const openEditForm = row => {
    setFormData(row.original)
    setTitleForm('Editar Producto')
    setAddFormOpen(true)
  }

  const handleDelete = async row => {
    const response = await deleteProduct(row.original.id)

    if (response.isSuccess) {
      setReload(!reload)
      Notify(response.message, 'success')
    } else {
      Notify(response.message, 'error')
    }
  }

  const columns = useMemo(() => [
    columnHelper.accessor('photo', {
      header: 'Imagen',
      cell: ({ row }) => <div className='flex items-center gap-4'>{getAvatar({ avatar: row.original.photo })}</div>
    }),
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: 'Producto'
    }),
    columnHelper.accessor('description', {
      cell: info => info.getValue(),
      header: 'Descripcion'
    }),
    columnHelper.accessor('price', {
      cell: info => info.getValue(),
      header: 'Precio'
    }),
    columnHelper.accessor('quantity', {
      cell: info => info.getValue(),
      header: 'Cantidad'
    }),
    columnHelper.accessor('supplier', {
      header: 'Proveedor',
      cell: ({ row }) => (
        <div className='flex items-center gap-4'>
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.supplier.business_name}
            </Typography>
          </div>
        </div>
      )
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

  return (
    <>
      <Card>
        <CardHeader title='Productos' />
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
              onClick={() => {
                setAddFormOpen(!addFormOpen), setTitleForm('Nuevo Producto'), setFormData({})
              }}
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='max-sm:is-full'
            >
              Agregar nuevo producto
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
      <AddProductDrawer
        open={addFormOpen}
        formData={formData}
        titleForm={titleForm}
        handleClose={() => setAddFormOpen(!addFormOpen)}
        setReload={setReload}
        reload={reload}
        suppliersData={suppliersData}
      />
    </>
  )
}
