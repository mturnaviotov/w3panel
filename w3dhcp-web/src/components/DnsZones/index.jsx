import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { Card, Input, Button, Modal, Table, Form, Select, Space, Popconfirm, Tag, Spin, InputNumber } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

import DataTable from '../common/DataTable'
import { 
  useGetDnsZonesQuery, 
  useAddDnsZoneMutation,
  useGetDnsRecordsQuery,
  useAddDnsRecordMutation,
  useUpdateDnsRecordMutation,
  useDeleteDnsRecordMutation,
  useDeleteDnsZoneMutation
} from '../../services/api'

const { Option } = Select

const DnsRecordsManager = ({ zone }) => {
  const { data: records = [], isLoading } = useGetDnsRecordsQuery(zone.id)
  const [addRecord] = useAddDnsRecordMutation()
  const [updateRecord] = useUpdateDnsRecordMutation()
  const [deleteRecord] = useDeleteDnsRecordMutation()

  const [form] = Form.useForm()
  const [editingId, setEditingId] = useState('')

  const isEditing = (record) => record.id === editingId

  const edit = (record) => {
    form.setFieldsValue({
      name: record.name,
      record_type: record.record_type,
      records: record.records?.join(', '), // Assume comma separated if multiple
      ttl: record.ttl,
    })
    setEditingId(record.id)
  }

  const cancel = () => {
    setEditingId('')
    form.resetFields()
  }

  const save = async (id) => {
    try {
      const row = await form.validateFields()
      // format records back to array
      const payload = {
        ...row,
        records: row.records.split(',').map(r => r.trim()).filter(r => r),
      }
      
      if (id === 'new') {
        await addRecord({ zoneId: zone.id, ...payload })
      } else {
        await updateRecord({ zoneId: zone.id, id, ...payload })
      }
      setEditingId('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const handleAdd = () => {
    if (editingId) return
    const newRecord = {
      id: 'new',
      name: zone.name,
      record_type: 'A',
      records: [],
      ttl: 3600
    }
    form.setFieldsValue({
      name: newRecord.name,
      record_type: newRecord.record_type,
      records: '',
      ttl: newRecord.ttl,
    })
    setEditingId('new')
  }

  const handleDelete = (id) => {
    deleteRecord({ zoneId: zone.id, id })
  }

  const columns = [
    {
      title: <FormattedMessage id='common.name' />,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        isEditing(record) ? (
          <Form.Item name="name" style={{ margin: 0 }} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        ) : text
      )
    },
    {
      title: <FormattedMessage id='common.kind' />,
      dataIndex: 'record_type',
      key: 'record_type',
      width: 120,
      render: (text, record) => (
        isEditing(record) ? (
          <Form.Item name="record_type" style={{ margin: 0 }} rules={[{ required: true }]}>
            <Select>
              <Option value="A">A</Option>
              <Option value="AAAA">AAAA</Option>
              <Option value="CNAME">CNAME</Option>
              <Option value="MX">MX</Option>
              <Option value="TXT">TXT</Option>
              <Option value="NS">NS</Option>
              <Option value="SOA">SOA</Option>
              <Option value="SRV">SRV</Option>
            </Select>
          </Form.Item>
        ) : <Tag color="blue">{text}</Tag>
      )
    },
    {
      title: <FormattedMessage id='dns_zone.record_content' />,
      dataIndex: 'records',
      key: 'records',
      render: (text, record) => (
        isEditing(record) ? (
          <Form.Item name="records" style={{ margin: 0 }} rules={[{ required: true }]}>
            <Input placeholder="Values (comma separated)" />
          </Form.Item>
        ) : (Array.isArray(text) ? text.join(', ') : text)
      )
    },
    {
      title: <FormattedMessage id='dns_zone.record_ttl' />,
      dataIndex: 'ttl',
      key: 'ttl',
      width: 100,
      render: (text, record) => (
        isEditing(record) ? (
          <Form.Item name="ttl" style={{ margin: 0 }}>
            <InputNumber min={1} />
          </Form.Item>
        ) : text
      )
    },
    {
      title: <FormattedMessage id='actions' />,
      key: 'actions',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <Space>
            <Button type="primary" onClick={() => save(record.id)}>Save</Button>
            <Button onClick={cancel}>Cancel</Button>
          </Space>
        ) : (
          <Space>
            <Button type="text" disabled={editingId !== ''} icon={<EditOutlined />} onClick={() => edit(record)} />
            {record.record_type !== 'SOA' && (
              <Popconfirm title="Delete record?" onConfirm={() => handleDelete(record.id)}>
                <Button type="text" danger disabled={editingId !== ''} icon={<DeleteOutlined />} />
              </Popconfirm>
            )}
          </Space>
        )
      }
    }
  ]

  // Add a fake row for the new record being created
  const displayRecords = [...records]
  if (editingId === 'new') {
    displayRecords.unshift({ id: 'new', name: '', record_type: 'A', records: [], ttl: 3600 })
  }

  return (
    <Form form={form} component={false}>
      <div style={{ marginBottom: 16 }}>
        <Button type="dashed" onClick={handleAdd} icon={<PlusOutlined />} block disabled={editingId !== ''}>
          Add DNS Record
        </Button>
      </div>
      <Table
        components={{
          body: { cell: ({ children, ...restProps }) => <td {...restProps}>{children}</td> }
        }}
        bordered
        dataSource={displayRecords}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={isLoading}
        size="small"
      />
    </Form>
  )
}

const DnsZones = () => {
  const user = useSelector(store => store.auth.user)
  
  const intl = useIntl()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')
  const [appliedFilter, setAppliedFilter] = useState(undefined)
  
  const { data: rawData = { data: [], meta: { total: 0 } }, isLoading, isFetching } = useGetDnsZonesQuery({
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


  const [filterNameContent, setFilterNameContent] = useState('')
  const [filterNameDropdownVisible, setfilterNameDropdownVisible] = useState(false)
  const [filteredItems, setFilteredItems] = useState([])

  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)

  const [addModalVisible, setAddModalVisible] = useState(false)
  const [addForm] = Form.useForm()
  const [addDnsZone] = useAddDnsZoneMutation()
  const [deleteDnsZone] = useDeleteDnsZoneMutation()

  const onFilterNameChange = (e) => setFilterNameContent(e.target.value)

  const filterNameSearch = () => {
    const reg = new RegExp(filterNameContent, 'gi')
    const filtered = items.filter(record => record.name.match(reg))
    setFilteredItems(filtered)
    setfilterNameDropdownVisible(false)
  }

  const clearFilterNameContent = () => {
    setFilterNameContent('')
    setfilterNameDropdownVisible(false)
    setFilteredItems([])
  }

  const handleEditZone = (record) => {
    setSelectedZone(record)
    setEditModalVisible(true)
  }

  const handleDeleteZone = (id) => {
    deleteDnsZone(id)
  }

  const handleAddZone = async () => {
    try {
      const values = await addForm.validateFields()
      await addDnsZone({
        ...values,
        masters: values.masters ? values.masters.split(',').map(m => m.trim()) : [],
        nameservers: values.nameservers ? values.nameservers.split(',').map(m => m.trim()) : [],
      })
      setAddModalVisible(false)
      addForm.resetFields()
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columnsUser = [
    {
      title: <FormattedMessage id='common.name' />,
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: (
        <Card title={<FormattedMessage id='action.search' />}>
          <Space direction="vertical">
            <Input value={filterNameContent} onChange={onFilterNameChange} onPressEnter={filterNameSearch} />
            <Space>
              <Button type='primary' onClick={filterNameSearch}><FormattedMessage id='action.search' /></Button>
              <Button onClick={clearFilterNameContent}><FormattedMessage id='action.clear' /></Button>
            </Space>
          </Space>
        </Card>
      ),
      filterDropdownProps: {
        open: filterNameDropdownVisible,
        onOpenChange: visible => setfilterNameDropdownVisible(visible)
      },
    },
    {
      title: <FormattedMessage id='actions' />,
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEditZone(record)} />
          <Popconfirm title="Delete zone?" onConfirm={() => handleDeleteZone(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  const columnsAdmin = [
    {
      title: <FormattedMessage id='customer' />,
      dataIndex: ['customer','name'],
      key: 'customer',
      sorter: (a, b) => a.customer.name.localeCompare(b.customer.name),
    }
  ]

  const makeColumns = () => {
    let columns = [...columnsUser]
    if (user.reseller || user.operator) {
      columns.splice(1, 0, columnsAdmin[0])
    }
    return columns
  }

  const footer = () => (
    <FormattedMessage key='loaded' id='data.loaded' values={{ items: (filteredItems.length) ? filteredItems.length : items.length}} />
  )

  const displayItems = filteredItems.length ? filteredItems : items

  return (
    <>
      <DataTable 
        items={displayItems} 
        footer={footer} 
        loading={isLoading} 
        columns={makeColumns()}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2><FormattedMessage id='dns_zones' /></h2>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>
              Add DNS Zone
            </Button>
          </div>
        } 
      />

      <Modal
        title={`Edit DNS Zone: ${selectedZone?.name}`}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setEditModalVisible(false)}>Close</Button>
        ]}
      >
        {selectedZone && <DnsRecordsManager zone={selectedZone} />}
      </Modal>

      <Modal
        title="Add DNS Zone"
        open={addModalVisible}
        onOk={handleAddZone}
        onCancel={() => setAddModalVisible(false)}
        okText="Create"
      >
        <Form form={addForm} layout="vertical" initialValues={{ kind: 'Master' }}>
          <Form.Item name="name" label="Zone Name" rules={[{ required: true }]}>
            <Input placeholder="example.com" />
          </Form.Item>
          <Form.Item name="kind" label="Type" rules={[{ required: true }]}>
            <Select>
              <Option value="Master">Master</Option>
              <Option value="Slave">Slave</Option>
              <Option value="Native">Native</Option>
            </Select>
          </Form.Item>
          <Form.Item name="masters" label="Masters (IPs, comma separated for Slave)">
            <Input />
          </Form.Item>
          <Form.Item name="nameservers" label="Nameservers (comma separated)">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default DnsZones
