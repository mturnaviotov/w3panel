import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

import DataTable from '../common/DataTable'
import { useGetContactsQuery } from '../../services/api'

const Contacts = () => {
  const { data: items = [], isLoading } = useGetContactsQuery()
  const user = useSelector(state => state.auth.user)

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
      loading={isLoading} 
      columns={columns}
      title={<FormattedMessage id='contacts' />} 
    />
  )
}

export default Contacts
