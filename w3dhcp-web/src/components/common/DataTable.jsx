import React from 'react'
import { Card, Table, Button, Tooltip } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import { ReloadOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { api } from '../../services/api'

const pagination = {showSizeChanger: true, showQuickJumper:true, pageSizeOptions: [10, 20, 50, 100]}

const DataTable = (props) => {
  const dispatch = useDispatch()
  const intl = useIntl()

  const handleRefresh = () => {
    dispatch(api.util.resetApiState())
  }

  const defaultPagination = { showSizeChanger: true, showQuickJumper: true, pageSizeOptions: [10, 20, 50, 100] }
  const paginationConfig = props.serverPagination ? { ...defaultPagination, ...props.serverPagination } : (props.items?.length > 10 ? defaultPagination : false)


  const extra = (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Tooltip title={intl.formatMessage({ id: 'action.refresh', defaultMessage: 'Refresh Data' })}>
        <Button icon={<ReloadOutlined />} onClick={handleRefresh} shape="circle" />
      </Tooltip>
      {props.extra}
    </div>
  )

  return (
	<Card title={props.title} extra={extra} variant={(props.bordered === false) ? 'borderless' : 'outlined'}>
	  <div key='props'>{(props.controls) && props.controls }</div>
	  {props.loading ? (
		<h1 key='loading'><center><FormattedMessage id='data.loading' /></center></h1>
	  ) : (
	  <Table rowKey={record => record.id} dataSource={props.items}
		pagination={paginationConfig}
		onChange={props.onChange}
		loading={props.loading} columns={props.columns}
		expandedRowRender={props.expanded} rowSelection={props.rowSelection} footer={props.footer} summary={props.summary} />
	  )}
	</Card>)}

export default DataTable
