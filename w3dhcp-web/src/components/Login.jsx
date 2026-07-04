import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import {useNavigate, Navigate} from 'react-router-dom'
import {Form, Input, Button, Card, Row, Col} from 'antd'

import { login } from '../slices/auth'
// import { clearMessage } from '../slices/message'

const Login = (props) => {
//  const [loading, setLoading] = useState(false)

  const { isLoggedIn } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

//  useEffect(() => {
//    dispatch(clearMessage())
//  }, [dispatch])

  const handleLogin = (formValue) => {
    const { username, password } = formValue
//    setLoading(true)

    dispatch(login({ username, password }))
      .unwrap()
      .then(() => {
        navigate('/')
        window.location.reload()
      })
      .catch(() => {
//        setLoading(false)
      })
  }

  if (isLoggedIn) {
    return <Navigate to='/' />
  }

  return (<Card>
	<Row justify="center"><Col justify="center"><h3><FormattedMessage id='user.login' /></h3></Col></Row>
	<Row justify="center"><Col span='8'>
   <Form
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={handleLogin}
      autoComplete="off"
    >
      <Form.Item
        label=<FormattedMessage id='user.email' />
        name="username"
        rules={[
	     {
            type: 'email',
            message: <FormattedMessage id='user.email' />,
          },
          {
            required: true,
            message: 'Please input your username!',
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
          <FormattedMessage id='user.login' />
        </Button>
      </Form.Item>
    </Form></Col></Row></Card>)
}

export default Login
