import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Modal, Form, Input, Checkbox, Space, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

import DataTable from '../common/DataTable'
import { useGetIpAddressesQuery, useAddIpAddressMutation, useUpdateIpAddressMutation, useDeleteIpAddressMutation } from '../../services/api'

const IpAddresses = () => {
  const { data: items = [], isLoading } = useGetIpAddressesQuery()
  const [addIpAddress] = useAddIpAddressMutation()
  const [updateIpAddress] = useUpdateIpAddressMutation()
  const [deleteIpAddress] = useDeleteIpAddressMutation()

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
      ip: record.ip,
      shared: record.shared,
      default: record.default
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id) => {
    deleteIpAddress(id)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      // Checkbox might return undefined if never clicked, default it to false
      const payload = {
        ip: values.ip,
        shared: !!values.shared,
        default: !!values.default
      }
      
      if (editingItem) {
        updateIpAddress({ id: editingItem.id, ...payload })
      } else {
        addIpAddress(payload)
      }
      setIsModalVisible(false)
      form.resetFields()
    }).catch(info => {
      console.log('Validate Failed:', info)
    })
  }

  const columns = [
    {
      title: <FormattedMessage id='common.ip_address' />,
      dataIndex: 'ip',
      key: 'ip',
      sorter: (a, b) => a.ip.localeCompare(b.ip),
    },
    {
      title: <FormattedMessage id='common.shared' />,
      dataIndex: 'shared',
      key: 'shared',
      render: (shared) => shared ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />
    },
    {
      title: <FormattedMessage id='common.default' />,
      dataIndex: 'default',
      key: 'default',
      render: (def) => def ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />
    },
    {
      title: <FormattedMessage id='actions' />,
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Are you sure to delete this IP?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    }
  ]

  const tableTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>IP Addresses</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Add IP
      </Button>
    </div>
  )

  const footer = () => (
    <span>Loaded: {items.length} IP(s)</span>
  )

  return (
    <>
      <DataTable 
        items={items} 
        footer={footer} 
        loading={isLoading} 
        columns={columns}
        title={tableTitle} 
      />

      <Modal
        title={editingItem ? "Edit IP Address" : "Add IP Address"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical" initialValues={{ shared: false, default: false }}>
          <Form.Item name="ip" label="IP Address" rules={[{ required: true, message: 'Please input the IP address!' }]}>
            <Input placeholder="e.g. 192.168.1.1" />
          </Form.Item>
          
          <Form.Item name="shared" valuePropName="checked">
            <Checkbox>Shared</Checkbox>
          </Form.Item>

          <Form.Item name="default" valuePropName="checked">
            <Checkbox>Default</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default IpAddresses
