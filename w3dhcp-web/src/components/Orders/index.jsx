import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Card, Button, Popconfirm, Tag, Modal, Table, Space, message, Input } from 'antd'
import { DeleteOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons'

import DataTable from '../common/DataTable'
import { useGetOrdersQuery, useGetOrderQuery, useDeleteOrderMutation, useApproveOrderMutation } from '../../services/api'

const Orders = () => {

  const intl = useIntl()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')
  const [appliedFilter, setAppliedFilter] = useState(undefined)

  const { data: rawData = { data: [], meta: { total: 0 } }, isLoading, isFetching } = useGetOrdersQuery({
    page,
    per_page: perPage,
    number: appliedFilter
  })

  const items = rawData.data || []
  const total = rawData.meta?.total || 0

  const handleTableChange = (pagination) => {
    setPage(pagination.current)
    setPerPage(pagination.pageSize)
  }

  const applyFilters = () => {
    setPage(1)
    setAppliedFilter(filterValue || undefined)
  }

  const clearFilters = () => {
    setFilterValue('')
    setPage(1)
    setAppliedFilter(undefined)
  }

  const controls = (
    <Space style={{ marginBottom: 16 }}>
      <Input
        placeholder={intl.formatMessage({ id: 'action.search', defaultMessage: 'Search' })}
        value={filterValue}
        onChange={e => setFilterValue(e.target.value)}
        onPressEnter={applyFilters}
        style={{ width: 200 }}
      />
      <Button type="primary" onClick={applyFilters}>
        <FormattedMessage id="action.search" />
      </Button>
      <Button onClick={clearFilters}>
        <FormattedMessage id="action.clear" />
      </Button>
    </Space>
  )

  const [deleteOrder] = useDeleteOrderMutation()
  const [approveOrder, { isLoading: isApproving }] = useApproveOrderMutation()

  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { data: orderDetails, isLoading: isLoadingDetails } = useGetOrderQuery(selectedOrder?.id, { skip: !selectedOrder })


  const handleDelete = async (record) => {
    try {
      await deleteOrder(record.id).unwrap()
    } catch (e) {
      console.error(e)
    }
  }

  const handleApprove = async () => {
    if (!selectedOrder) return
    try {
      await approveOrder(selectedOrder.id).unwrap()
      message.success('Order approved successfully')
      setViewModalVisible(false)
      setSelectedOrder(null)
    } catch (e) {
      console.error(e)
      message.error('Failed to approve order')
    }
  }

  const handleView = (record) => {
    setSelectedOrder(record)
    setViewModalVisible(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'created': return 'blue'
      case 'approved': return 'green'
      case 'processing': return 'orange'
      case 'done': return 'default'
      default: return 'default'
    }
  }

  const columnsUser = [
    {
      title: <FormattedMessage id='common.number' />,
      dataIndex: 'number',
      key: 'number',
      sorter: (a, b) => (a.number || '').localeCompare(b.number || ''),
    },
    {
      title: <FormattedMessage id='common.name' />,
      dataIndex: ['customer', 'name'],
      key: 'customerName',
      sorter: (a, b) => (a.customer?.name || '').localeCompare(b.customer?.name || ''),
    },
    {
      title: <FormattedMessage id='common.status' defaultMessage='Status' />,
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status?.toUpperCase()}</Tag>,
      sorter: (a, b) => (a.status || '').localeCompare(b.status || ''),
    },
    {
      title: <FormattedMessage id='common.summ' />,
      dataIndex: 'summ',
      key: 'summ',
      sorter: (a, b) => (a.summ || 0) - (b.summ || 0),
    },
    {
      title: <FormattedMessage id='actions' />,
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Popconfirm
            title={<FormattedMessage id='action.delete' />}
            description={<FormattedMessage id='action.delete.confirm' defaultMessage='Are you sure?' />}
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    }
  ]

  const itemColumns = [
    { title: <FormattedMessage id='common.name' />, dataIndex: 'name', key: 'name' },
    { title: <FormattedMessage id='cart.operation' />, dataIndex: 'operation', key: 'operation' },
    { title: <FormattedMessage id='price' />, dataIndex: 'price', key: 'price', render: (val) => `${val} UAH` }
  ]

  return (
    <>
      <DataTable
        items={items}
        loading={isLoading || isFetching}
        columns={columnsUser}
        controls={controls}
        serverPagination={{ current: page, pageSize: perPage, total }}
        onChange={handleTableChange}
        title={<FormattedMessage id='orders' />}
      />

      <Modal
        title={`Order: ${selectedOrder?.number || ''}`}
        open={viewModalVisible}
        onCancel={() => { setViewModalVisible(false); setSelectedOrder(null) }}
        width={700}
        footer={[
          <Button key="close" onClick={() => { setViewModalVisible(false); setSelectedOrder(null) }}>
            Close
          </Button>,
          selectedOrder?.status === 'created' && (
            <Button
              key="approve"
              type="primary"
              icon={<CheckCircleOutlined />}
              loading={isApproving}
              onClick={handleApprove}
            >
              Approve Order
            </Button>
          )
        ]}
      >
        {selectedOrder && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: 16 }}>
              <strong>Customer:</strong> {selectedOrder.customer?.name} <br />
              <strong>Status:</strong> <Tag color={getStatusColor(selectedOrder.status)}>{selectedOrder.status?.toUpperCase()}</Tag> <br />
              <strong>Total:</strong> {selectedOrder.summ} UAH
            </div>

            <Table
              loading={isLoadingDetails}
              dataSource={orderDetails?.items || []}
              columns={itemColumns}
              pagination={false}
              rowKey="name"
              size="small"
            />
          </div>
        )}
      </Modal>
    </>
  )
}

export default Orders
