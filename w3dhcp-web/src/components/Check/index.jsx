import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Card, Row, Col, Spin, Form, Input, Button, Checkbox, Space } from 'antd'

import DataTable from '../common/DataTable'
import ActionButtons from '../common/ActionButtons'
import IsActive from '../common/IsActive'
import { useGetDomainZonesQuery, useCheckDomainMutation, useGetSubscriptionTemplatesQuery } from '../../services/api'
import { useCart } from '../../hooks/useCart'

const Check = () => {
  const { data: domainZones = [], isLoading: isLoadingZones } = useGetDomainZonesQuery({ pagination: 'false' })
  const { data: templates = [], isLoading: isLoadingTemplates } = useGetSubscriptionTemplatesQuery()
  const [checkDomain, { isLoading: isChecking }] = useCheckDomainMutation()
  const { cartDomains, addDomain, deleteDomain } = useCart()

  const [form] = Form.useForm()
  const domainName = Form.useWatch('name', form)
  const [selectedZones, setSelectedZones] = useState([])
  const [checkResults, setCheckResults] = useState([])

  const onFinish = async (values) => {
    const response = await checkDomain({ domain: values, zones: { selected: selectedZones } }).unwrap()
    setCheckResults(response)
  }

  const toggleZone = (zoneName) => {
    setSelectedZones(prev => {
      if (prev.includes(zoneName)) return prev.filter(name => name !== zoneName)
      return [...prev, zoneName]
    })
  }

  const domainAdd = (record) => addDomain(record)
  const domainDel = (record) => deleteDomain(record.id)

  const columns = [
    {
      title: <FormattedMessage id='common.name' />,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <FormattedMessage id='domain.avail' />,
      key: 'avail',
      render: (_, record) => <IsActive active={record.avail} />
    },
    {
      title: <FormattedMessage id='actions' />,
      key: 'actions',
      render: (_, record) => {
        const isInCart = cartDomains.some(obj => obj.id === record.id)
        if (isInCart) {
          return <Button danger onClick={() => domainDel(record)}><FormattedMessage id='cart.del' /></Button>
        }
        if (record.avail) {
          return <Button type="primary" onClick={() => domainAdd(record)}><FormattedMessage id='cart.add' /></Button>
        }
        return null
      }
    }
  ]



  return (
    <Card title={<FormattedMessage id='domain.checking' />} align='center'>
      <Spin spinning={isChecking}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label={<FormattedMessage id='common.name' />} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={!domainName}>
              <FormattedMessage id='action.check' />
            </Button>
          </Form.Item>
        </Form>
      </Spin>

      {checkResults.length > 0 && (
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <DataTable items={checkResults} columns={columns} pagination={false} />
        </div>
      )}

      <Spin spinning={isLoadingZones || isLoadingTemplates}>
        <Card title={<FormattedMessage id='domain_zones' />}>
          <Space size={[16, 16]} wrap>
            {domainZones.map(item => {
              const template = templates.find(t => (t.kind === 'domain' || t.kind === 10) && t.name.startsWith(item.name))
              const price = template ? template.register : '-'
              
              return (
              <Card size="small" key={item.id} style={{ width: 200, textAlign: 'left' }}>
                <Checkbox 
                  checked={selectedZones.includes(item.name)} 
                  onChange={() => toggleZone(item.name)}
                >
                  <div>
                    <strong>{item.name}</strong>
                    <div style={{ color: 'gray' }}>{price} UAH</div>
                  </div>
                </Checkbox>
              </Card>
              )
            })}
          </Space>
        </Card>
      </Spin>
    </Card>
  )
}

export default Check
