import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Tag, Space, Input, DatePicker, Select, Button } from 'antd'
import { useState } from 'react'
import { useGetCustomersQuery } from '../../services/api'

import DataTable from '../common/DataTable'
import { useGetEventsQuery } from '../../services/api'

const Events = () => {
  
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  
  const [filterIp, setFilterIp] = useState('')
  const [filterCustomerName, setFilterCustomerName] = useState('')
  const [filterItem, setFilterItem] = useState('')
  const [dateRange, setDateRange] = useState([])
  
  const [appliedFilters, setAppliedFilters] = useState({})
  
  const { data: rawData = { data: [], meta: { total: 0 } }, isLoading, isFetching } = useGetEventsQuery({
    page, 
    per_page: perPage,
    ...appliedFilters
  })
  const { data: customersList } = useGetCustomersQuery({ pagination: 'false' })
  
  const items = rawData.data || []
  const total = rawData.meta?.total || 0

  const handleTableChange = (pagination) => {
    setPage(pagination.current)
    setPerPage(pagination.pageSize)
  }

  const applyFilters = () => {
    setPage(1)
    setAppliedFilters({
      ip: filterIp || undefined,
      customer_name: filterCustomerName || undefined,
      item: filterItem || undefined,
      date_from: dateRange && dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : undefined,
      date_to: dateRange && dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : undefined,
    })
  }
  
  const clearFilters = () => {
    setFilterIp('')
    setFilterCustomerName('')
    setFilterItem('')
    setDateRange([])
    setPage(1)
    setAppliedFilters({})
  }

  const intl = useIntl()

  const getTypeColor = (type) => {
    switch (type) {
      case 'info': return 'blue'
      case 'warning': return 'orange'
      case 'error': return 'red'
      default: return 'default'
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'e_create': return 'green'
      case 'e_update': return 'blue'
      case 'e_delete': return 'red'
      default: return 'default'
    }
  }

  const columns = [
    {
      title: <FormattedMessage id='common.date' />,
      dataIndex: 'created_at',
      key: 'created_at',
      render: (val) => new Date(val).toLocaleString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at)
    },
    {
      title: <FormattedMessage id='common.kind' />,
      dataIndex: 'event_type',
      key: 'event_type',
      render: (type) => <Tag color={getTypeColor(type)}>{type?.toUpperCase()}</Tag>
    },
    {
      title: <FormattedMessage id='common.action' />,
      dataIndex: 'event_action',
      key: 'event_action',
      render: (action) => <Tag color={getActionColor(action)}><FormattedMessage id={`event.action.${action}`} defaultMessage={action} /></Tag>
    },
    {
      title: <FormattedMessage id='common.ip' />,
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: <FormattedMessage id='customer' />,
      dataIndex: ['customer', 'name'],
      key: 'customerName',
      render: (_, record) => record.customer ? record.customer.name : '-'
    },
    {
      title: <FormattedMessage id='common.item' />,
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: <FormattedMessage id='common.description' />,
      dataIndex: 'description',
      key: 'description'
    }
  ]

  
  const controls = (
    <Space style={{ marginBottom: 16 }} wrap>
      <Input 
        placeholder={intl.formatMessage({ id: 'common.ip_address', defaultMessage: 'IP Address' })} 
        value={filterIp} 
        onChange={e => setFilterIp(e.target.value)} 
        style={{ width: 150 }} 
      />
      
      <Input 
        placeholder={intl.formatMessage({ id: 'customer', defaultMessage: 'Customer' })} 
        value={filterCustomerName} 
        onChange={e => setFilterCustomerName(e.target.value)} 
        style={{ width: 150 }} 
      />
      <Input 
        placeholder={intl.formatMessage({ id: 'common.item', defaultMessage: 'Item' })} 
        value={filterItem} 
        onChange={e => setFilterItem(e.target.value)} 
        style={{ width: 150 }} 
      />

      <DatePicker.RangePicker 
        value={dateRange} 
        onChange={val => setDateRange(val)} 
      />
      <Button type="primary" onClick={applyFilters}>
        <FormattedMessage id="action.search" />
      </Button>
      <Button onClick={clearFilters}>
        <FormattedMessage id="action.clear" />
      </Button>
    </Space>
  )

  return (
    <DataTable 
      items={items} 
      loading={isLoading || isFetching} 
      columns={columns}
      title={<FormattedMessage id="events" />} 
      controls={controls}
      serverPagination={{ current: page, pageSize: perPage, total }}
      onChange={handleTableChange}
    />
  )
}

export default Events
