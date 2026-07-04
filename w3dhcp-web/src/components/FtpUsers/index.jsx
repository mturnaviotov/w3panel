import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Modal, Form, Input, Select, Popconfirm, Space } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

import DataTable from '../common/DataTable'
import { useGetFtpUsersQuery, useAddFtpUserMutation, useDeleteFtpUserMutation, useUpdateFtpUserMutation, useGetWebAppsQuery } from '../../services/api'

const { Option } = Select

const FtpUsers = () => {

  const intl = useIntl()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')
  const [appliedFilter, setAppliedFilter] = useState(undefined)

  const { data: rawData = { data: [], meta: { total: 0 } }, isLoading, isFetching } = useGetFtpUsersQuery({
    page,
    per_page: perPage,
    username: appliedFilter
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

  const { data: webApps = [], isLoading: isLoadingWebApps } = useGetWebAppsQuery({ pagination: 'false' })
  const user = useSelector(state => state.auth.user)

  const [addFtpUser] = useAddFtpUserMutation()
  const [deleteFtpUser] = useDeleteFtpUserMutation()
  const [updateFtpUser] = useUpdateFtpUserMutation()

  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [addForm] = Form.useForm()

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [selectedFtpUser, setSelectedFtpUser] = useState(null)
  const [updateForm] = Form.useForm()

  const handleAddModalOk = () => {
    addForm.validateFields().then(values => {
      addFtpUser(values)
      setIsAddModalVisible(false)
      addForm.resetFields()
    }).catch(info => {
      console.log('Validate Failed:', info)
    })
  }

  const handleDelete = (id) => {
    deleteFtpUser(id)
  }

  const showUpdateModal = (user) => {
    setSelectedFtpUser(user)
    updateForm.resetFields()
    setIsUpdateModalVisible(true)
  }

  const handleUpdateOk = async () => {
    try {
      const values = await updateForm.validateFields()
      await updateFtpUser({ id: selectedFtpUser.id, ...values }).unwrap()
      setIsUpdateModalVisible(false)
      updateForm.resetFields()
    } catch (error) {
      console.log('Update Failed:', error)
    }
  }

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false)
    updateForm.resetFields()
  }

  const columnsUser = [
    {
      title: <FormattedMessage id='common.name' />,
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: <FormattedMessage id="webapp" />,
      dataIndex: ['web_app', 'name'],
      key: 'web_app',
      render: (text) => text || '—'
    },
    {
      title: <FormattedMessage id="server" />,
      dataIndex: 'application_server',
      key: 'server',
      render: (text) => text || '—'
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
        <Space>
          <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => showUpdateModal(record)} />
          <Popconfirm title={<FormattedMessage id='action.confirm' />} onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
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
        title={<FormattedMessage id='ftp_users' />}
      />

      <Modal
        title={<FormattedMessage id='action.add' />}
        open={isAddModalVisible}
        onOk={handleAddModalOk}
        onCancel={() => setIsAddModalVisible(false)}
        okText={<FormattedMessage id='action.create' />}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item name="username" label={<FormattedMessage id='user.login' />} rules={[{ required: true, message: 'Please input username!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label={<FormattedMessage id='user.password' />} rules={[{ required: true, message: 'Please input password!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="web_app_id" label={<FormattedMessage id="ftp.webapp_binding" />} rules={[{ required: true, message: 'Please select a web app!' }]}>
            <Select loading={isLoadingWebApps} showSearch optionFilterProp="children">
              {webApps.map(app => (
                <Option key={app.id} value={app.id}>{app.name} ({app.customer?.name})</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={<FormattedMessage id="ftp.change_password" />} open={isUpdateModalVisible} onOk={handleUpdateOk} onCancel={handleUpdateCancel}>
        <Form form={updateForm} layout="vertical">
          <Form.Item name="password" label={<FormattedMessage id="ftp.new_password" />} rules={[{ required: true, message: 'Please input the new password!' }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>

  )
}

export default FtpUsers
