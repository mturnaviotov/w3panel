import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Modal, Form, Input, Checkbox, Space, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

import DataTable from '../common/DataTable'
import { useGetRegistriesQuery, useAddRegistryMutation, useUpdateRegistryMutation, useDeleteRegistryMutation } from '../../services/api'

const Registries = () => {
  const { data: items = [], isLoading } = useGetRegistriesQuery()
  const [addRegistry] = useAddRegistryMutation()
  const [updateRegistry] = useUpdateRegistryMutation()
  const [deleteRegistry] = useDeleteRegistryMutation()

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
      manual: record.manual
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id) => {
    deleteRegistry(id)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const payload = {
        name: values.name,
        manual: !!values.manual
      }
      
      if (editingItem) {
        updateRegistry({ id: editingItem.id, ...payload })
      } else {
        addRegistry(payload)
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
    },
    {
      title: <FormattedMessage id='common.manual' />,
      dataIndex: 'manual',
      key: 'manual',
      render: (manual) => manual ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />
    },
    {
      title: <FormattedMessage id='actions' />,
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Are you sure to delete this registry?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    }
  ]

  const tableTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2><FormattedMessage id='registries' /></h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Add Registry
      </Button>
    </div>
  )

  const footer = () => (
    <span>Loaded: {items.length} Registries</span>
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
        title={editingItem ? "Edit Registry" : "Add Registry"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical" initialValues={{ manual: false }}>
          <Form.Item name="name" label="Registry Name" rules={[{ required: true, message: 'Please input the registry name!' }]}>
            <Input placeholder="e.g. default_registry" />
          </Form.Item>
          
          <Form.Item name="manual" valuePropName="checked">
            <Checkbox>Manual</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Registries
