import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Card, Button, Space, message } from 'antd'

import DataTable from './common/DataTable'
import { useCart } from '../hooks/useCart'
import { useAddOrderMutation } from '../services/api'

const Cart = () => {
  const { cartDomains, deleteDomain, clearCart } = useCart()
  const user = useSelector(store => store.auth.user)
  const navigate = useNavigate()
  
  const [addOrder, { isLoading: isCreatingOrder }] = useAddOrderMutation()

  const handleCreateOrder = async () => {
    try {
      await addOrder({ order: { items: cartDomains } }).unwrap()
      message.success('Order created successfully')
      clearCart()
      navigate('/orders') // Redirect to orders page
    } catch (err) {
      message.error('Failed to create order')
    }
  }

  const columns = [
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
    },
    {
      title: <FormattedMessage id='price' />,
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
    },
    {
      title: <FormattedMessage id='actions' />,
      key: 'actions',
      render: (_, record) => (
        <Button danger onClick={() => deleteDomain(record.id)}>
          <FormattedMessage id='cart.del' />
        </Button>
      )
    }
  ]

  return (
    <Card align='center' variant='borderless'>
      <div style={{ marginBottom: 24 }}>
        <DataTable 
          title={<FormattedMessage id='cart' />} 
          items={cartDomains} 
          columns={columns} 
          variant='borderless' 
          pagination={false}
        />
      </div>
      
      <Space>
        {user ? (
          <Button 
            type="primary" 
            onClick={handleCreateOrder} 
            loading={isCreatingOrder}
            disabled={cartDomains.length === 0}
          >
            Create Order
          </Button>
        ) : (
          <Link to='/register'>
            <Button type="primary"><FormattedMessage id='user.register' /></Button>
          </Link>
        )}
      </Space>
    </Card>
  )
}

export default Cart
