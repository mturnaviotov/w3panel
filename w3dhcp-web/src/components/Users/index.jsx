import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Modal, Form, Input, Select, Popconfirm, Checkbox, Space } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

import DataTable from '../common/DataTable'
import IsActive from '../common/IsActive'
import { useGetUsersQuery, useAddUserMutation, useDeleteUserMutation, useGetCustomersQuery } from '../../services/api'

const { Option } = Select

const Users = () => {

  const intl = useIntl()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')
  const [appliedFilter, setAppliedFilter] = useState(undefined)

  const { data: rawData = { data: [], meta: { total: 0 } }, isLoading, isFetching } = useGetUsersQuery({
    page,
    per_page: perPage,
    email: appliedFilter
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

  const { data: customers = [], isLoading: isLoadingCustomers } = useGetCustomersQuery({ pagination: 'false' })
  const user = useSelector(state => state.auth.user)

  const [addUser] = useAddUserMutation()
  const [deleteUser] = useDeleteUserMutation()

  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [addForm] = Form.useForm()

  const handleAddModalOk = () => {
    addForm.validateFields().then(values => {
      // In AntD Checkbox, the value is in `checked` prop if we use valuePropName="checked"
      addUser(values)
      setIsAddModalVisible(false)
      addForm.resetFields()
    }).catch(info => {
      console.log('Validate Failed:', info)
    })
  }

  const handleDelete = (id) => {
    deleteUser(id)
  }

  const columnsUser = [
    {
      title: <FormattedMessage id='contact.email' />,
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: <FormattedMessage id='state.active' />,
      dataIndex: 'active',
      key: 'active',
      render: (text, record) => <IsActive active={record.active} />
    }
  ]

  const columnsAdmin = [
    {
      title: <FormattedMessage id='customer' />,
      dataIndex: ['customer', 'name'],
      key: 'customer',
      sorter: (a, b) => (a.customer?.name || '').localeCompare(b.customer?.name || ''),
    },
    {
      title: <FormattedMessage id='actions' />,
      key: 'actions',
      render: (_, record) => (
        <Popconfirm title={<FormattedMessage id='action.confirm' />} onConfirm={() => handleDelete(record.id)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ]

  let columns = columnsUser
  if (user?.reseller || user?.operator) {
    columns = columns.concat(columnsAdmin)
  }

  return (
    <>
      <DataTable
        items={items}
        loading={isLoading || isFetching}
        columns={columns}
        controls={controls}
        controls={controls}
        serverPagination={{ current: page, pageSize: perPage, total }}
        onChange={handleTableChange}
        title={<FormattedMessage id='users' />}
      />

      <Modal
        title={<FormattedMessage id='action.add' />}
        open={isAddModalVisible}
        onOk={handleAddModalOk}
        onCancel={() => setIsAddModalVisible(false)}
        okText={<FormattedMessage id='action.create' />}
      >
        <Form form={addForm} layout="vertical" initialValues={{ active: true }}>
          <Form.Item name="email" label={<FormattedMessage id='contact.email' />} rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label={<FormattedMessage id='user.password' />} rules={[{ required: true, message: 'Please input password!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="active" valuePropName="checked">
            <Checkbox><FormattedMessage id='state.active' /></Checkbox>
          </Form.Item>
          {(user?.reseller || user?.operator) && (
            <Form.Item name="customer_id" label={<FormattedMessage id='customer' />} rules={[{ required: true, message: 'Please select a customer!' }]}>
              <Select loading={isLoadingCustomers}>
                {customers.map(customer => (
                  <Option key={customer.id} value={customer.id}>{customer.name}</Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  )
}

export default Users
