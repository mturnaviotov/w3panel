import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'

import DataTable from '../common/DataTable'
import IsActive from '../common/IsActive'

import { Button, Input, Card, Modal, Form, Select, Space, Popconfirm, Tag, Flex } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons'

import { useGetWebAppsQuery, useAddWebAppMutation, useUpdateWebAppMutation, useDeleteWebAppMutation, useStartWebAppMutation, useStopWebAppMutation, useRestartWebAppMutation, useBlockWebAppMutation, useUnblockWebAppMutation, useGetIpAddressesQuery, useGetCustomersQuery } from '../../services/api'

const { Option } = Select



const APP_TYPES = [
  { value: 0, label: 'stub' },
  { value: 1, label: 'static' },
  { value: 2, label: 'redirect' },
  { value: 3, label: 'php5' },
  { value: 4, label: 'php7' },
]

const WebApps = () => {
  const fetchedRef = React.useRef(false)
  const dispatch = useDispatch()

  
  const intl = useIntl()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')
  const [appliedFilter, setAppliedFilter] = useState(undefined)
  
  const { data: rawData = { data: [], meta: { total: 0 } }, isLoading: loading, isFetching } = useGetWebAppsQuery({
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

  const [addWebApp] = useAddWebAppMutation()
  const [updateWebApp] = useUpdateWebAppMutation()
  const [deleteWebApp] = useDeleteWebAppMutation()
  const [startWebApp] = useStartWebAppMutation()
  const [stopWebApp] = useStopWebAppMutation()
  const [restartWebApp] = useRestartWebAppMutation()
  const [blockWebApp] = useBlockWebAppMutation()
  const [unblockWebApp] = useUnblockWebAppMutation()
  
  const { data: customersList = [] } = useGetCustomersQuery({ pagination: 'false' })
  const { data: ipAddressesList = [] } = useGetIpAddressesQuery()

  const [filterNameContent, setFilterNameContent] = useState('')
  const [filterNameDropdownVisible, setfilterNameDropdownVisible] = useState(false)
  const [filteredItems, setFilteredItems] = useState([])

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingApp, setEditingApp] = useState(null)
  const [form] = Form.useForm()

  const user = useSelector(store => store.auth.user)

  const onFilterNameChange = (e) => {
    setFilterNameContent(e.target.value)
  }

  const filterNameSearch = useCallback(() => {
    const reg = new RegExp(filterNameContent, 'gi')
    const filtered = items.map((record) => { if (record.name.match(reg)) { return record } }).filter(record => !!record)
    setFilteredItems(filtered)
    setfilterNameDropdownVisible(false)
  }, [items, filterNameContent])

  const clearFilterNameContent = () => {
    setFilterNameContent('')
    setfilterNameDropdownVisible(false)
  }

  // Action Handlers
  const handleAdd = () => {
    setEditingApp(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditingApp(record)
    form.setFieldsValue({
      name: record.name,
      app_type: record.app_type_enum || 0, // Fallback to stub
      customer_id: record.customer?.id,
      ip_address_id: record.ip_address_id
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id) => {
    deleteWebApp(id)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingApp) {
        updateWebApp({ id: editingApp.id, ...values })
      } else {
        addWebApp(values)
      }
      setIsModalVisible(false)
      form.resetFields()
    }).catch(info => {
      console.log('Validate Failed:', info)
    })
  }

  const columnsUser = [

    {
      title: <FormattedMessage id='common.name' />,
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name < b.name,
      sortDirections: ['ascend', 'descend'],
      filterDropdown: (
        <Card title={<FormattedMessage id='action.search' />}>
          <Input
            value={filterNameContent}
            onChange={onFilterNameChange}
            onPressEnter={filterNameSearch}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type='primary' onClick={() => filterNameSearch()}><FormattedMessage id='action.search' /></Button>
            <Button onClick={() => clearFilterNameContent()}><FormattedMessage id='action.clear' /></Button>
          </Space>
        </Card>
      ),
      filterDropdownProps: {
        open: filterNameDropdownVisible,
        onOpenChange: visible => setfilterNameDropdownVisible(true)
      },
    },
    {
      title: <FormattedMessage id='common.kind' />,
      dataIndex: 'app_type',
      key: 'app_type',
      sorter: (a, b) => a.app_type < b.app_type,
    },
    {
      title: <FormattedMessage id='status' />,
      key: 'status',
      render: (_, record) => {
        let tag = '';
        let color = '';
        if (!record.active) {
          tag = 'BLOCKED';
          color = 'volcano';
        } else if (record.container_id) {
          tag = 'STARTED';
          color = 'green';
        } else {
          tag = 'STOPPED';
          color = 'default';
        }
        return (
          <Tag color={color}>
            {tag}
          </Tag>
        );
      }
    }
  ]

  const columnsAdmin = [
    {
      title: <FormattedMessage id='customer' />,
      dataIndex: ['customer', 'name'],
      key: 'customer',
      sorter: (a, b) => (a.customer?.name || '') < (b.customer?.name || ''),
    }
  ]

  const columnsActions = [
    {
      title: <FormattedMessage id='actions' />,
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          {record.active && !record.container_id && (
             <Button type="text" icon={<PlayCircleOutlined />} onClick={() => startWebApp(record.id)} title={<FormattedMessage id="action.start" />} />
          )}
          {record.active && record.container_id && (
             <>
               <Button type="text" icon={<PauseCircleOutlined />} onClick={() => stopWebApp(record.id)} title={<FormattedMessage id="action.stop" />} />
               <Button type="text" icon={<ReloadOutlined />} onClick={() => restartWebApp(record.id)} title={<FormattedMessage id="action.restart" />} />
             </>
          )}
          {user.operator && record.active && (
             <Popconfirm title={<FormattedMessage id="action.block.confirm" />} onConfirm={() => blockWebApp(record.id)}>
               <Button type="text" danger icon={<StopOutlined />} title={<FormattedMessage id="action.block" />} />
             </Popconfirm>
          )}
          {user.operator && !record.active && (
             <Popconfirm title={<FormattedMessage id="action.unblock.confirm" />} onConfirm={() => unblockWebApp(record.id)}>
               <Button type="text" style={{ color: 'green' }} icon={<CheckCircleOutlined />} title={<FormattedMessage id="action.unblock" />} />
             </Popconfirm>
          )}

          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title={<FormattedMessage id="action.delete.confirm" />} onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    }
  ]

  const makeColumns = () => {
    let columns = columnsUser
    if (user.reseller || user.operator) {
      columns = columns.concat(columnsAdmin)
    }
    columns = columns.concat(columnsActions)
    return columns
  }

  useEffect(() => {
    if (filteredItems.length) {
      filterNameSearch()
    }
  }, [loading, items, dispatch, filterNameSearch, filteredItems.length])

  const footer = () => {
    return <FormattedMessage key='loaded' id='data.loaded' values={{ items: (filteredItems.length) ? filteredItems.length : items.length }} />
  }

  const tableTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <FormattedMessage id='web_apps' />
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Add Web App
      </Button>
    </div>
  )

  return (
    <>
      <DataTable 
        items={items} 
        footer={footer} 
        loading={loading || isFetching}
        controls={controls}
        serverPagination={{ current: page, pageSize: perPage, total }}
        onChange={handleTableChange} 
        columns={makeColumns()}
        title={tableTitle}
      />

      <Modal
        title={editingApp ? "Edit Web App" : "Add Web App"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={<FormattedMessage id="common.name" />} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item name="app_type" label={<FormattedMessage id="webapp.app_type" />} rules={[{ required: true }]}>
            <Select>
              {APP_TYPES.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="customer_id" label={<FormattedMessage id="webapp.customer_binding" />} rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="children">
              {customersList && customersList.map(cust => (
                <Option key={cust.id} value={cust.id}>{cust.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="ip_address_id" label={<FormattedMessage id="webapp.ip_binding" />} rules={[{ required: true }]}>
            <Select>
              {ipAddressesList && ipAddressesList.map(ip => (
                <Option key={ip.id} value={ip.id}>{ip.ip}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default WebApps
