import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Modal, Form, Input, Space, Popconfirm, Select, Dropdown, Menu, Tag, DatePicker, message } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, MoreOutlined, SyncOutlined, GlobalOutlined, PauseCircleOutlined, PlayCircleOutlined, InfoCircleOutlined, UndoOutlined } from '@ant-design/icons'
import moment from 'moment'
import { useSelector } from 'react-redux'

import DataTable from '../common/DataTable'
import { useGetDomainsQuery, useAddDomainMutation, useUpdateDomainMutation, useExecuteEppActionMutation, useGetRegistriesQuery, useGetCustomersQuery, useGetDomainZonesQuery } from '../../services/api'

const { Option } = Select

const Domains = () => {
  const [scope, setScope] = useState('all')
  
  const intl = useIntl()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [filterValue, setFilterValue] = useState('')
  const [appliedFilter, setAppliedFilter] = useState(undefined)
  
  const { data: rawData = { data: [], meta: { total: 0 } }, isLoading, isFetching } = useGetDomainsQuery({
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
  const { data: customers = [], isLoading: isLoadingCustomers } = useGetCustomersQuery({ pagination: 'false' })
  const { data: domainZones = [], isLoading: isLoadingDomainZones } = useGetDomainZonesQuery({ pagination: 'false' })
  
  const user = useSelector(state => state.auth.user)

  const [addDomain] = useAddDomainMutation()
  const [updateDomain] = useUpdateDomainMutation()
  const [executeEppAction] = useExecuteEppActionMutation()

  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isNSModalVisible, setIsNSModalVisible] = useState(false)
  const [isRenewModalVisible, setIsRenewModalVisible] = useState(false)
  
  const [activeDomain, setActiveDomain] = useState(null)
  
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [nsForm] = Form.useForm()
  const [renewForm] = Form.useForm()

  const handleEppAction = async (id, action, body = {}) => {
    try {
      await executeEppAction({ id, action, body }).unwrap()
      message.success(`Action ${action} executed successfully!`)
    } catch (e) {
      message.error(`Failed to execute ${action}.`)
    }
  }

  const handleActionMenuClick = ({ key }, record) => {
    setActiveDomain(record)
    
    switch (key) {
      case 'edit':
        editForm.setFieldsValue({
          name: record.name,
          customer_id: record.customer?.id,
          registry_id: record.registry?.id,
        })
        setIsEditModalVisible(true)
        break
      case 'epp_update_info':
      case 'epp_hold':
      case 'epp_unhold':
      case 'epp_delete':
      case 'epp_restore':
        handleEppAction(record.id, key)
        break
      case 'epp_update_ns':
        nsForm.setFieldsValue({
          nameservers: record.hostobject || []
        })
        setIsNSModalVisible(true)
        break
      case 'epp_renew':
        renewForm.resetFields()
        setIsRenewModalVisible(true)
        break
      default:
        break
    }
  }

  const handleAddModalOk = () => {
    addForm.validateFields().then(values => {
      addDomain(values)
      setIsAddModalVisible(false)
      addForm.resetFields()
    }).catch(info => {
      console.log('Validate Failed:', info)
    })
  }

  const handleEditModalOk = () => {
    editForm.validateFields().then(values => {
      updateDomain({ id: activeDomain.id, customer_id: values.customer_id, registry_id: values.registry_id })
      setIsEditModalVisible(false)
      editForm.resetFields()
    }).catch(info => {
      console.log('Validate Failed:', info)
    })
  }

  const handleNSModalOk = () => {
    nsForm.validateFields().then(values => {
      handleEppAction(activeDomain.id, 'epp_update_ns', { domain: values.nameservers })
      setIsNSModalVisible(false)
      nsForm.resetFields()
    })
  }

  const handleRenewModalOk = () => {
    renewForm.validateFields().then(values => {
      handleEppAction(activeDomain.id, 'epp_renew', { domain: values.period })
      setIsRenewModalVisible(false)
      renewForm.resetFields()
    })
  }

  const getActionMenuItems = (record) => {
    const items = []
    
    if (user?.operator) {
      items.push({
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit (Operator)'
      })
    }

    items.push(
      {
        key: 'epp_update_info',
        icon: <InfoCircleOutlined />,
        label: 'Update Info'
      },
      {
        key: 'epp_update_ns',
        icon: <GlobalOutlined />,
        label: 'Update Nameservers'
      },
      {
        key: 'epp_renew',
        icon: <SyncOutlined />,
        label: 'Renew Domain'
      },
      { type: 'divider' },
      {
        key: 'epp_hold',
        icon: <PauseCircleOutlined />,
        label: 'Hold'
      },
      {
        key: 'epp_unhold',
        icon: <PlayCircleOutlined />,
        label: 'Unhold'
      },
      { type: 'divider' },
      {
        key: 'epp_restore',
        icon: <UndoOutlined />,
        label: 'Restore'
      },
      {
        key: 'epp_delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        danger: true
      }
    )
    
    return items
  }

  const columns = [
    {
      title: <FormattedMessage id='common.name' />,
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: <FormattedMessage id='customer' />,
      dataIndex: ['customer', 'name'],
      key: 'customer',
    },
    {
      title: <FormattedMessage id='registry' />,
      dataIndex: ['registry', 'name'],
      key: 'registry',
    },
    {
      title: <FormattedMessage id='status' />,
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <>
          {status && status.map(s => <Tag color="blue" key={s}>{s}</Tag>)}
        </>
      )
    },
    {
      title: <FormattedMessage id='common.expire_date' />,
      dataIndex: 'date_expire',
      key: 'date_expire',
      render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm') : 'N/A',
    },
    {
      title: <FormattedMessage id='actions' />,
      key: 'actions',
      render: (_, record) => (
        <Dropdown menu={{ items: getActionMenuItems(record), onClick: (e) => handleActionMenuClick(e, record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    }
  ]

  const tableTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2><FormattedMessage id='domains' /></h2>
      <Space>
        <Button onClick={() => setScope(scope === 'all' ? 'near_expire' : 'all')}>
          {scope === 'all' ? 'Show Expiring Soon' : 'Show All'}
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { addForm.resetFields(); setIsAddModalVisible(true) }}>
          Add Domain
        </Button>
      </Space>
    </div>
  )

  return (
    <>
      <DataTable 
        items={items} 
        loading={isLoading || isFetching} 
        columns={columns}
        title={tableTitle} 
      
        controls={controls}
        serverPagination={{ current: page, pageSize: perPage, total }}
        onChange={handleTableChange}
      />

      {/* ADD DOMAIN MODAL */}
      <Modal
        title="Add Domain"
        open={isAddModalVisible}
        onOk={handleAddModalOk}
        onCancel={() => setIsAddModalVisible(false)}
        okText="Create"
      >
        <Form form={addForm} layout="vertical">
          <Form.Item name="name" label="Domain Name" rules={[{ required: true, message: 'Please input the domain name!' }]}>
            <Input placeholder="e.g. example" />
          </Form.Item>
          <Form.Item name="domain_zone_id" label="Domain Zone" rules={[{ required: true, message: 'Please select a domain zone!' }]}>
            <Select placeholder="Select a domain zone" loading={isLoadingDomainZones}>
              {domainZones.map(zone => (
                <Option key={zone.id} value={zone.id}>{zone.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="customer_id" label="Customer" rules={[{ required: true, message: 'Please select a customer!' }]}>
            <Select placeholder="Select a customer" loading={isLoadingCustomers}>
              {customers.map(customer => (
                <Option key={customer.id} value={customer.id}>{customer.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* EDIT DOMAIN MODAL (OPERATOR ONLY) */}
      <Modal
        title="Edit Domain (Operator)"
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Save"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Domain Name">
            <Input disabled />
          </Form.Item>
          <Form.Item name="customer_id" label="Customer" rules={[{ required: true, message: 'Please select a customer!' }]}>
            <Select placeholder="Select a customer" loading={isLoadingCustomers}>
              {customers.map(customer => (
                <Option key={customer.id} value={customer.id}>{customer.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="registry_id" label="Registry" rules={[{ required: true, message: 'Please select a registry!' }]}>
            <Select placeholder="Select a registry" loading={isLoadingRegistries}>
              {registries.map(registry => (
                <Option key={registry.id} value={registry.id}>{registry.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* UPDATE NAMESERVERS MODAL */}
      <Modal
        title="Update Nameservers"
        open={isNSModalVisible}
        onOk={handleNSModalOk}
        onCancel={() => setIsNSModalVisible(false)}
        okText="Update NS"
      >
        <Form form={nsForm} layout="vertical">
          <Form.List name="nameservers">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    {...field}
                    label={index === 0 ? 'Nameservers' : ''}
                    required={false}
                    key={field.key}
                  >
                    <Space>
                      <Form.Item
                        {...field}
                        noStyle
                        rules={[{ required: true, message: 'Nameserver cannot be empty' }]}
                      >
                        <Input placeholder="ns1.example.com" style={{ width: '300px' }} />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <DeleteOutlined onClick={() => remove(field.name)} />
                      ) : null}
                    </Space>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Nameserver
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* RENEW DOMAIN MODAL */}
      <Modal
        title="Renew Domain"
        open={isRenewModalVisible}
        onOk={handleRenewModalOk}
        onCancel={() => setIsRenewModalVisible(false)}
        okText="Renew"
      >
        <Form form={renewForm} layout="vertical">
          <Form.Item name="period" label="Renewal Period (Years)" rules={[{ required: true, message: 'Please input renewal period!' }]}>
            <Select placeholder="Select years">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => (
                <Option key={y} value={y}>{y} {y === 1 ? 'Year' : 'Years'}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Domains
