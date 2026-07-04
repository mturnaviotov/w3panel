import React, {useCallback} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import {Menu, Divider, Button} from 'antd'
import {logout} from '../../slices/auth'
import {ShoppingCartOutlined} from '@ant-design/icons'

const {Item} = Menu

const helpItems = [
  {k: 'check',  url: '/check',  name: 'domain.checking'},
  {k: 'hosting',  url: '/hosting' ,  name: 'hosting'},
]

const unAuth = [
  {k:'login', url: '/login', name: 'user.login'},
  {k:'register', url: '/register', name: 'user.register'}
]


const HeaderBar = (props) => {
  const user = props.user
  const cart = props.cart
  const dispatch = useDispatch()

  const logOut = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  const menuItems = [
    {
      key: 'logo',
      label: <Link to='/'><strong style={{ fontSize: '18px', color: '#1890ff' }}>ВАШЕ ЛОГО</strong></Link>
    },
    ...helpItems.map(item => ({
      key: item.k,
      label: <Link to={item.url}><FormattedMessage id={item.name} /></Link>
    }))
  ];

  // Add cart item if there are items in the cart
  if (cart > 0) {
    menuItems.push({
      key: 'cart',
      style: { marginLeft: 'auto' }, // This pushes everything from here on to the right
      label: <Link to='/cart'><ShoppingCartOutlined /> <FormattedMessage id='cart' /></Link>
    });
  }

  // Add auth/user items
  if (user) {
    menuItems.push({
      key: 'logout',
      style: cart === 0 ? { marginLeft: 'auto' } : undefined, // Apply only if cart isn't pushing already
      label: <Button type='text' onClick={logOut}><FormattedMessage id='user.logout' /></Button>
    });
  } else {
    unAuth.forEach((item, index) => {
      menuItems.push({
        key: item.k,
        style: (index === 0 && cart === 0) ? { marginLeft: 'auto' } : undefined, // Apply only if cart isn't pushing already
        label: <Link to={item.url}><FormattedMessage id={item.name} /></Link>
      });
    });
  }

  return (<>
	<Menu mode='horizontal' items={menuItems} />
  </>)
}

export default HeaderBar
