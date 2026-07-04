import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import {Navigate, useNavigate} from 'react-router-dom'
import {Form, Input, Checkbox, Button, Card, Row, Col} from 'antd'

import { register } from '../slices/auth'
import { clearMessage } from '../slices/message'

const Login = (props) => {

  const { isLoggedIn } = useSelector((state) => state.auth)

  const [customerEnabled, setCustomerEnabled] = useState(true)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(clearMessage())
  }, [dispatch])

  const handleLogin = (formValue) => {
    dispatch(register({user: formValue}))
	navigate("/login", { replace: true })
  }

  if (isLoggedIn) {
    return <Navigate to='/' />
  }

  const changeCustomerEnabled = (e) => {
	setCustomerEnabled(!e.target.checked)
  }

  return (<Card>
	<Row justify="center"><Col justify="center"><h3><FormattedMessage id='user.register' /></h3></Col></Row>
	<Row justify="center"><Col span='8'>
   <Form
      name="basic"
      initialValues={{
        name: '', customer_name: '', voice: '', email: '', password: '', corporate: false
      }}
      onFinish={handleLogin}
      autoComplete="off"
    >
      <Form.Item
        label=<FormattedMessage id='common.name' />
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label=<FormattedMessage id='customer.corporate' />
        name="corporate"
		valuePropName="checked"
      >
        <Checkbox onChange={changeCustomerEnabled} />
      </Form.Item>

      <Form.Item
        label=<FormattedMessage id='customer.company_name' />
        name="customer_name"
		
      >
        <Input disabled={customerEnabled} />
      </Form.Item>

      <Form.Item
        label=<FormattedMessage id='contact.voice' />
        name="voice"
        rules={[
          {
            required: true,
            message: 'Please input your phone!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label=<FormattedMessage id='user.email' />
        name="email"
        rules={[
	     {
            type: 'email',
            message: <FormattedMessage id='user.email' />,
          },
          {
            required: true,
            message: 'Please input your email!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label=<FormattedMessage id='user.password' />
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          <FormattedMessage id='user.register' />
        </Button>
      </Form.Item>
    </Form></Col></Row></Card>)
}

export default Login
