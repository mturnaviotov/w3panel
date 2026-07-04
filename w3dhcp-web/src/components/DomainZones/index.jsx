import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Modal, Form, Input, Checkbox, Space, Popconfirm, Select, Tabs, InputNumber, Switch } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

import DataTable from '../common/DataTable'
import { useGetDomainZonesQuery, useAddDomainZoneMutation, useUpdateDomainZoneMutation, useDeleteDomainZoneMutation, useGetRegistriesQuery } from '../../services/api'

const { Option } = Select

const DomainZones = () => {
  
  const intl = useIntl()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')
  const [appliedFilter, setAppliedFilter] = useState(undefined)
  
  const { data: rawData = { data: [], meta: { total: 0 } }, isLoading, isFetching } = useGetDomainZonesQuery({
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

  const { data: registries = [], isLoading: isLoadingRegistries } = useGetRegistriesQuery()
  
  const [addDomainZone] = useAddDomainZoneMutation()
  const [updateDomainZone] = useUpdateDomainZoneMutation()
  const [deleteDomainZone] = useDeleteDomainZoneMutation()

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
      registry_id: record.registry ? record.registry.id : null,
      comment: record.comment,
      idn: record.idn,
      idn_only: record.idn_only,
      min_registration_period: record.min_registration_period,
      max_registration_period: record.max_registration_period,
      min_domain_length: record.min_domain_length,
      max_domain_length: record.max_domain_length,
      manual_processing: record.manual_processing,
      licence_requirement: record.licence_requirement,
      files_upload_requirement: record.files_upload_requirement,
      proxy_contact_requirement: record.proxy_contact_requirement,
      period_hold_avail: record.period_hold_avail,
      period_hold_length: record.period_hold_length,
      period_auto_renew_avail: record.period_auto_renew_avail,
      period_auto_renew_length: record.period_auto_renew_length,
      period_redemption_avail: record.period_redemption_avail,
      period_redemption_length: record.period_redemption_length,
      period_delete_avail: record.period_delete_avail,
      period_delete_length: record.period_delete_length,
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id) => {
    deleteDomainZone(id)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const payload = {
        ...values,
        idn: !!values.idn,
        idn_only: !!values.idn_only,
        manual_processing: !!values.manual_processing,
        licence_requirement: !!values.licence_requirement,
        files_upload_requirement: !!values.files_upload_requirement,
        proxy_contact_requirement: !!values.proxy_contact_requirement,
        period_hold_avail: !!values.period_hold_avail,
        period_auto_renew_avail: !!values.period_auto_renew_avail,
        period_redemption_avail: !!values.period_redemption_avail,
        period_delete_avail: !!values.period_delete_avail,
      }
      
      if (editingItem) {
        updateDomainZone({ id: editingItem.id, ...payload })
      } else {
        addDomainZone(payload)
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
      title: <FormattedMessage id='registry' />,
      dataIndex: ['registry', 'name'],
      key: 'registry',
    },
    {
      title: <FormattedMessage id='domain_zone.reg_period' />,
      key: 'periods',
      render: (_, record) => `${record.min_registration_period} - ${record.max_registration_period} yrs`,
    },
    {
      title: <FormattedMessage id='actions' />,
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Are you sure to delete this domain zone?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    }
  ]

  const tableTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2><FormattedMessage id='domain_zones' /></h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Add Domain Zone
      </Button>
    </div>
  )

  const footer = () => (
    <span>Loaded: {items.length} Domain Zones</span>
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
        title={editingItem ? "Edit Domain Zone" : "Add Domain Zone"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        okText="Save"
      >
        <Form 
          form={form} 
          layout="vertical" 
          initialValues={{ 
            idn: false, 
            idn_only: false,
            min_registration_period: 1,
            max_registration_period: 10,
            min_domain_length: 1,
            max_domain_length: 63,
            manual_processing: false,
            licence_requirement: false,
            files_upload_requirement: false,
            proxy_contact_requirement: false,
            period_hold_avail: true,
            period_hold_length: 29,
            period_auto_renew_avail: true,
            period_auto_renew_length: 29,
            period_redemption_avail: true,
            period_redemption_length: 30,
            period_delete_avail: true,
            period_delete_length: 5,
          }}
        >
          <Tabs defaultActiveKey="1" items={[
            {
              key: "1",
              label: "General",
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form.Item name="name" label="Zone Name" rules={[{ required: true, message: 'Please input the zone name!' }]}>
                    <Input placeholder="e.g. .com" />
                  </Form.Item>
                  <Form.Item name="registry_id" label="Registry" rules={[{ required: true, message: 'Please select a registry!' }]}>
                    <Select placeholder="Select a registry" loading={isLoadingRegistries}>
                      {registries.map(registry => (
                        <Option key={registry.id} value={registry.id}>{registry.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Space>
                    <Form.Item name="min_domain_length" label="Min Domain Length">
                      <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item name="max_domain_length" label="Max Domain Length">
                      <InputNumber min={1} />
                    </Form.Item>
                  </Space>
                  <Space>
                    <Form.Item name="min_registration_period" label="Min Reg Period (yrs)">
                      <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item name="max_registration_period" label="Max Reg Period (yrs)">
                      <InputNumber min={1} />
                    </Form.Item>
                  </Space>
                  <Form.Item name="comment" label="Comment">
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </Space>
              )
            },
            {
              key: "2",
              label: "IDN & Requirements",
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Form.Item name="idn" valuePropName="checked">
                      <Checkbox>Supports IDN</Checkbox>
                    </Form.Item>
                    <Form.Item name="idn_only" valuePropName="checked">
                      <Checkbox>IDN Only</Checkbox>
                    </Form.Item>
                    <Form.Item name="manual_processing" valuePropName="checked">
                      <Checkbox>Manual Processing</Checkbox>
                    </Form.Item>
                    <Form.Item name="licence_requirement" valuePropName="checked">
                      <Checkbox>Licence Required</Checkbox>
                    </Form.Item>
                    <Form.Item name="files_upload_requirement" valuePropName="checked">
                      <Checkbox>File Upload Required</Checkbox>
                    </Form.Item>
                    <Form.Item name="proxy_contact_requirement" valuePropName="checked">
                      <Checkbox>Proxy Contact Required</Checkbox>
                    </Form.Item>
                  </div>
                </Space>
              )
            },
            {
              key: "3",
              label: "Lifecycle Periods",
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '16px', alignItems: 'center' }}>
                    <Form.Item name="period_hold_avail" valuePropName="checked" style={{ marginBottom: 0 }}>
                      <Switch checkedChildren="Hold" unCheckedChildren="No Hold" />
                    </Form.Item>
                    <Form.Item name="period_hold_length" label="Hold Length (days)" style={{ marginBottom: 16 }}>
                      <InputNumber min={0} />
                    </Form.Item>

                    <Form.Item name="period_auto_renew_avail" valuePropName="checked" style={{ marginBottom: 0 }}>
                      <Switch checkedChildren="Auto Renew" unCheckedChildren="No Auto Renew" />
                    </Form.Item>
                    <Form.Item name="period_auto_renew_length" label="Auto Renew Length (days)" style={{ marginBottom: 16 }}>
                      <InputNumber min={0} />
                    </Form.Item>

                    <Form.Item name="period_redemption_avail" valuePropName="checked" style={{ marginBottom: 0 }}>
                      <Switch checkedChildren="Redemption" unCheckedChildren="No Redemption" />
                    </Form.Item>
                    <Form.Item name="period_redemption_length" label="Redemption Length (days)" style={{ marginBottom: 16 }}>
                      <InputNumber min={0} />
                    </Form.Item>

                    <Form.Item name="period_delete_avail" valuePropName="checked" style={{ marginBottom: 0 }}>
                      <Switch checkedChildren="Delete" unCheckedChildren="No Delete" />
                    </Form.Item>
                    <Form.Item name="period_delete_length" label="Delete Length (days)" style={{ marginBottom: 16 }}>
                      <InputNumber min={0} />
                    </Form.Item>
                  </div>
                </Space>
              )
            }
          ]} />
        </Form>
      </Modal>
    </>
  )
}

export default DomainZones
