'use client'

import { useMemo, useState } from 'react'

import Link from 'next/link'

import { useRouter } from 'next/navigation'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Button, Card, CardHeader, MenuItem, TablePagination } from '@mui/material'

import OptionMenu from '@/@core/components/option-menu'
import CustomTextField from '@/@core/components/mui/TextField'
import { deletePurchase, getPurchasesList, PURCHASE, RETURN, updateStatusPurchase } from '@/services/purchase.service'

import styles from '@core/styles/table.module.css'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import { Notify } from '@/utils/notification'

const columnHelper = createColumnHelper()

export default function PurchasesListTable({ dataForm, type, setReload, reload }) {
  const router = useRouter()
  const [data, setData] = useState(() => [...dataForm])

  const handleUpdatedStatus = async (id, status) => {
    const response = await updateStatusPurchase(id, status)

    if (response.isSuccess) {
      Notify(response.message, 'success')
      const responsePurchase = await getPurchasesList(type)

      if (responsePurchase.isSuccess) {
        setData(responsePurchase.data)
      }
    } else {
      Notify(response.message, 'error')
    }
  }

  const handleDelete = async id => {
    const response = await deletePurchase(id)

    if (response.isSuccess) {
      Notify(response.message, 'success')
      const responsePurchase = await getPurchasesList(type)

      if (responsePurchase.isSuccess) {
        setData(responsePurchase.data)
      }
    } else {
      Notify(response.message, 'error')
    }
  }

  const columns = useMemo(() => [
    columnHelper.accessor('created_at', {
      cell: ({ row }) =>
        new Intl.DateTimeFormat('es-PE', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).format(new Date(row.original.created_at)),
      header: 'Fecha de creación'
    }),
    columnHelper.accessor('code', {
      cell: info => info.getValue(),
      header: 'Codigo'
    }),
    columnHelper.accessor('description', {
      cell: info => info.getValue(),
      header: 'Descripcion'
    }),
    columnHelper.accessor('total', {
      cell: info => info.getValue(),
      header: 'Total'
    }),
    columnHelper.accessor('products', {
      cell: ({ row }) => {
        return row.original.stocks.length
      },
      header: 'Productos'
    }),
    columnHelper.accessor('statusCode', {
      header: 'Estado',
      cell: ({ row }) => (
        <div className='flex items-center gap-4'>
          <Button
            variant='contained'
            type='button'
            color={row.original.statusCode == 0 ? 'secondary' : row.original.statusCode == 1 ? 'success' : 'error'}
          >
            {row.original.statusName}
          </Button>
        </div>
      )
    }),
    columnHelper.accessor('actions', {
      header: 'Acciones',
      cell: ({ row }) => (
        <div className='flex items-center'>
          {row.original.statusCode == 0 && (
            <OptionMenu
              options={[
                {
                  text: 'Aceptar',
                  icon: 'tabler-circle-check',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => handleUpdatedStatus(row.original.id, '1')
                  }
                },
                {
                  text: 'Rechazar',
                  icon: 'tabler-circle-x',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => handleUpdatedStatus(row.original.id, '2')
                  }
                },
                {
                  text: 'Editar',
                  icon: 'tabler-edit',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () =>
                      router.push(
                        (type == PURCHASE
                          ? '/purchases/update/'
                          : type == RETURN
                            ? '/returns/update/'
                            : '/sales/update/') + row.original.id
                      )
                  }
                },
                {
                  text: 'Eliminar',
                  icon: 'tabler-trash',
                  menuItemProps: {
                    className: 'flex items-center gap-2 text-textSecondary',
                    onClick: () => handleDelete(row.original.id)
                  }
                }
              ]}
            />
          )}
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
        <CardHeader title={type == PURCHASE ? 'Compras' : type == RETURN ? 'Devoluciones' : 'Ventas'} />
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
              component={Link}
              href={type == PURCHASE ? '/purchases/create' : type == RETURN ? '/returns/create' : '/sales/create'}
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='max-sm:is-full'
            >
              {type == PURCHASE ? 'Nueva compra' : type == RETURN ? 'Nueva devolucion' : 'Nueva venta'}
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
    </>
  )
}
