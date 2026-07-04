import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Modal, Form, Input, Checkbox, Space, Popconfirm, Select, Tooltip, Tag } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, CrownOutlined } from '@ant-design/icons'

import DataTable from '../common/DataTable'
import { useGetCustomersQuery, useAddCustomerMutation, useUpdateCustomerMutation, useDeleteCustomerMutation, useGetResellersQuery } from '../../services/api'

const { Option } = Select

const Customers = () => {
  
  const intl = useIntl()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')
  const [appliedFilter, setAppliedFilter] = useState(undefined)
  
  const { data: rawData = { data: [], meta: { total: 0 } }, isLoading, isFetching } = useGetCustomersQuery({
    page, 
    per_page: perPage,
    name: appliedFilter
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

  const { data: resellers = [], isLoading: isLoadingResellers } = useGetResellersQuery()
  
  const [addCustomer] = useAddCustomerMutation()
  const [updateCustomer] = useUpdateCustomerMutation()
  const [deleteCustomer] = useDeleteCustomerMutation()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form] = Form.useForm()

  const handleAdd = () => {
    setEditingItem(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditingItem(record)
    form.setFieldsValue({
      name: record.name,
      reseller_id: record.reseller ? record.reseller.id : null,
      corporate: record.corporate,
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id) => {
    deleteCustomer(id)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const payload = {
        name: values.name,
        reseller_id: values.reseller_id,
        corporate: !!values.corporate
      }
      
      if (editingItem) {
        updateCustomer({ id: editingItem.id, ...payload })
      } else {
        addCustomer(payload)
      }
      setIsModalVisible(false)
      form.resetFields()
    }).catch(info => {
      console.log('Validate Failed:', info)
    })
  }

  const columns = [
    {
      title: <FormattedMessage id='common.name' />,
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Space>
          {text}
          {record.owner && <Tooltip title="Hosting Owner (Cannot be deleted)"><Tag color="gold" icon={<CrownOutlined />}>Owner</Tag></Tooltip>}
        </Space>
      )
    },
    {
      title: <FormattedMessage id='reseller' />,
      dataIndex: ['reseller', 'name'],
      key: 'reseller',
    },
    {
      title: <FormattedMessage id='corporate' />,
      dataIndex: 'corporate',
      key: 'corporate',
      render: (corporate) => corporate ? <Tag color="blue">Corporate</Tag> : <Tag>Personal</Tag>
    },
    {
      title: <FormattedMessage id='actions' />,
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm 
            title="Are you sure to delete this customer?" 
            onConfirm={() => handleDelete(record.id)}
            disabled={record.owner}
          >
            <Button type="text" danger icon={<DeleteOutlined />} disabled={record.owner} />
          </Popconfirm>
        </Space>
      ),
    }
  ]

  const tableTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2><FormattedMessage id='customers' /></h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Add Customer
      </Button>
    </div>
  )

  const footer = () => (
    <span>Loaded: {items.length} Customers</span>
  )

  return (
    <>
      <DataTable 
        items={items} 
        footer={footer} 
        loading={isLoading || isFetching} 
        columns={columns}
        title={tableTitle} 
      
        controls={controls}
        serverPagination={{ current: page, pageSize: perPage, total }}
        onChange={handleTableChange}
      />

      <Modal
        title={editingItem ? "Edit Customer" : "Add Customer"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical" initialValues={{ corporate: false }}>
          <Form.Item name="name" label="Customer Name" rules={[{ required: true, message: 'Please input the customer name!' }]}>
            <Input placeholder="e.g. John Doe" />
          </Form.Item>
          
          <Form.Item name="reseller_id" label="Reseller" rules={[{ required: true, message: 'Please select a reseller!' }]}>
            <Select placeholder="Select a reseller" loading={isLoadingResellers}>
              {resellers.map(reseller => (
                <Option key={reseller.id} value={reseller.id}>{reseller.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="corporate" valuePropName="checked">
            <Checkbox>Corporate Entity</Checkbox>
          </Form.Item>
          
          {editingItem?.owner && (
            <div style={{ marginBottom: 16, color: '#faad14' }}>
              <CrownOutlined /> This is the system owner account. It cannot be reassigned or deleted.
            </div>
          )}
        </Form>
      </Modal>
    </>
  )
}

export default Customers
