import React , { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { Card , Input, Space, Button} from 'antd'

import DataTable from '../common/DataTable'
import IsActive from '../common/IsActive'
import { useGetSubscriptionsQuery } from '../../services/api'

const Subscriptions = () => {
  
  const intl = useIntl()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')
  const [appliedFilter, setAppliedFilter] = useState(undefined)
  
  const { data: rawData = { data: [], meta: { total: 0 } }, isLoading, isFetching } = useGetSubscriptionsQuery({
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

  const user = useSelector(state => state.auth.user)

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
      render: (text) => text === 'domain' || text === 10 ? 'Domain' : 'Hosting',
      sorter: (a, b) => (a.kind || '').toString().localeCompare((b.kind || '').toString()),
    },
    {
      title: <FormattedMessage id='subscription_templates' />,
      dataIndex: ['subscription_template', 'name'],
      key: 'templateName',
    },
    {
      title: <FormattedMessage id='common.expire_date' />,
      dataIndex: 'expiration',
      key: 'expiration',
      render: (text) => text ? new Date(text).toLocaleDateString() : '-',
    },
    {
      title: <FormattedMessage id='status' />,
      dataIndex: 'status',
      key: 'status',
    }
  ]

  const columnsAdmin = [
    {
      title: <FormattedMessage id='customer' />,
      dataIndex: ['customer', 'name'],
      key: 'customer',
      sorter: (a, b) => (a.customer?.name || '').localeCompare(b.customer?.name || ''),
    }
  ]

  let columns = columnsUser
  if (user?.reseller || user?.operator) {
    columns = columns.concat(columnsAdmin)
  }

  return (
    <DataTable 
      items={items} 
      loading={isLoading || isFetching} 
      columns={columns}
      controls={controls}
        serverPagination={{ current: page, pageSize: perPage, total }}
        onChange={handleTableChange}
        title={<FormattedMessage id='subscriptions' />} 
    />
  )
}

export default Subscriptions
