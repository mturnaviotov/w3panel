import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Button, Modal, Form, Select, Switch, Space, Popconfirm } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'

import DataTable from '../common/DataTable'
import {
  useGetResellersQuery,
  useAddResellerMutation,
  useUpdateResellerMutation,
  useDeleteResellerMutation,
  useGetCustomersQuery
} from '../../services/api'

const { Option } = Select

const Resellers = () => {
  const { data: items = [], isLoading } = useGetResellersQuery({ pagination: 'false' })
  const { data: customers = [], isLoading: isLoadingCustomers } = useGetCustomersQuery({ pagination: 'false' })

  const [addReseller] = useAddResellerMutation()
  const [updateReseller] = useUpdateResellerMutation()
  const [deleteReseller] = useDeleteResellerMutation()

  const user = useSelector(state => state.auth.user)
  const isPrivileged = user?.reseller || user?.operator // Or specifically hosting_owner if that was exposed

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form] = Form.useForm()

  const handleOpenModal = (item = null) => {
    setEditingItem(item)
    if (item) {
      form.setFieldsValue(item)
    } else {
      form.resetFields()
      form.setFieldsValue({ hosting_operator: false, reseller_owner: false })
    }
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setEditingItem(null)
    form.resetFields()
  }

  const handleSave = async (values) => {
    try {
      if (editingItem) {
        await updateReseller({ id: editingItem.id, ...values }).unwrap()
      } else {
        await addReseller(values).unwrap()
      }
      handleCloseModal()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteReseller(id).unwrap()
    } catch (e) {
      console.error(e)
    }
  }

  const columnsUser = [
    {
      title: <FormattedMessage id='common.name' />,
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    }
  ]

  const columnsAdmin = [
    {
      title: <FormattedMessage id='actions' />,
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          <Popconfirm
            title={<FormattedMessage id='action.delete' />}
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  let columns = columnsUser
  if (isPrivileged) {
    columns = columns.concat(columnsAdmin)
  }

  return (
    <>
      <DataTable
        items={items}
        loading={isLoading}
        columns={columns}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormattedMessage id='resellers' />
            {isPrivileged && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
                <FormattedMessage id='action.add' />
              </Button>
            )}
          </div>
        }
      />

      <Modal
        title={<FormattedMessage id={editingItem ? 'action.edit' : 'action.add'} />}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="customer_id" label={<FormattedMessage id='customer' />} rules={[{ required: true }]}>
            <Select loading={isLoadingCustomers} showSearch optionFilterProp="children">
              {customers.map(c => (
                <Option key={c.id} value={c.id}>{c.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id='action.save' />
              </Button>
              <Button onClick={handleCloseModal}>
                <FormattedMessage id='action.cancel' />
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Resellers
