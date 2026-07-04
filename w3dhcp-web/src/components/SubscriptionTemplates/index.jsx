import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { Button, Modal, Form, Input, InputNumber, Select, Switch, Space, Popconfirm } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'

import DataTable from '../common/DataTable'
import { 
  useGetSubscriptionTemplatesQuery, 
  useAddSubscriptionTemplateMutation,
  useUpdateSubscriptionTemplateMutation,
  useDeleteSubscriptionTemplateMutation,
  useGetResellersQuery
} from '../../services/api'

const { Option } = Select

const SubscriptionTemplates = () => {
  const { data: items = [], isLoading } = useGetSubscriptionTemplatesQuery()
  const { data: resellers = [], isLoading: isLoadingResellers } = useGetResellersQuery()
  const [addTemplate] = useAddSubscriptionTemplateMutation()
  const [updateTemplate] = useUpdateSubscriptionTemplateMutation()
  const [deleteTemplate] = useDeleteSubscriptionTemplateMutation()
  
  const user = useSelector(state => state.auth.user)
  const isPrivileged = user?.reseller || user?.operator

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form] = Form.useForm()

  const handleOpenModal = (item = null) => {
    setEditingItem(item)
    if (item) {
      form.setFieldsValue({
        ...item,
        kind: item.kind?.toString(),
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ listed: true, term: 1, kind: '10' })
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
      const payload = {
        ...values,
        kind: parseInt(values.kind, 10),
      }

      if (editingItem) {
        await updateTemplate({ id: editingItem.id, ...payload }).unwrap()
      } else {
        await addTemplate(payload).unwrap()
      }
      handleCloseModal()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTemplate(id).unwrap()
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
    },
    {
      title: <FormattedMessage id='common.kind' />,
      dataIndex: 'kind',
      key: 'kind',
      render: (text) => text === 'domain' || text === 10 ? 'Domain' : 'Balance (Hosting)'
    },
    {
      title: <FormattedMessage id='price' />,
      dataIndex: 'register',
      key: 'register',
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
            <FormattedMessage id='subscription_templates' />
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
          <Form.Item name="name" label={<FormattedMessage id='common.name' />} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item name="reseller_id" label={<FormattedMessage id='resellers' />}>
            <Select loading={isLoadingResellers} showSearch optionFilterProp="children" allowClear>
              {resellers.map(r => (
                <Option key={r.id} value={r.id}>{r.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="kind" label={<FormattedMessage id='common.kind' />} rules={[{ required: true }]}>
            <Select>
              <Option value="10">Domain</Option>
              <Option value="0">Balance (Hosting)</Option>
            </Select>
          </Form.Item>

          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="register" label="Register Price">
              <InputNumber min={0} step={0.01} />
            </Form.Item>
            <Form.Item name="renew" label="Renew Price">
              <InputNumber min={0} step={0.01} />
            </Form.Item>
            <Form.Item name="transfer" label="Transfer Price">
              <InputNumber min={0} step={0.01} />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="term" label="Term (months)">
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item name="disk" label="Disk Space">
              <InputNumber min={0} step={0.1} />
            </Form.Item>
            <Form.Item name="disk_unit" label="Disk Unit">
              <Select style={{ width: 80 }}>
                <Option value="m">MB</Option>
                <Option value="g">GB</Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item name="listed" valuePropName="checked" label="Listed (Publicly Visible)">
            <Switch />
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

export default SubscriptionTemplates
