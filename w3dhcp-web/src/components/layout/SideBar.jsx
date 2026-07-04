import React from 'react'
import {Link} from 'react-router-dom'
import {FormattedMessage} from 'react-intl'
import {Menu} from 'antd'

const { Item, SubMenu } = Menu

const techItems = [
  {k: 'web_apps',  'url': '/web_apps',  'name': <FormattedMessage id='web_apps' />},
  {k: 'domains',  'url': '/domains' ,  'name': <FormattedMessage id='domains' />},
  {k: 'dnszones', 'url': '/dns_zones', 'name': <FormattedMessage id='dns_zones' />},
  {k: 'ftpusers', 'url': '/ftp_users', 'name': <FormattedMessage id='ftp_users' />},
]

const techOperatorItems = [
  {k: 'domainzones', 'url': '/domain_zones', 'name': <FormattedMessage id='domain_zones' />},
  {k: 'registries',  'url': '/registries',   'name': <FormattedMessage id='registries' />},
  {k: 'ip_addresses', 'url': '/ip_addresses', 'name': <FormattedMessage id='ip_addresses' />},
]

const accountingItems = [
  {k: 'subscriptions', 'url': '/subscriptions', 'name': <FormattedMessage id='subscriptions' />},
  {k: 'orders',        'url': '/orders',        'name': <FormattedMessage id='orders' />},
  {k: 'events',        'url': '/events',        'name': <FormattedMessage id='events' />},
  {k: 'users',         'url': '/users',         'name': <FormattedMessage id='users' />},
  {k: 'contacts',      'url': '/contacts',      'name': <FormattedMessage id='contacts' />},
]

const accountingResellerItems = [
  {k: 'customers',              'url': '/customers',              'name': <FormattedMessage id='customers' />},
  {k: 'subscription_templates', 'url': '/subscription_templates', 'name': <FormattedMessage id='subscription_templates' />}
]

const accountingOperatorItems = [
  {k: 'resellers', 'url': '/resellers', 'name': <FormattedMessage id='resellers' />}
]

const getTechItems = (user) => {
  let tech = techItems
  if (user.operator) {
	tech = tech.concat(techOperatorItems)
  }
  return {
    key: 'tech',
    label: <h3><FormattedMessage id='settings' /></h3>,
    children: tech.map(item => ({
      key: item.k,
      icon: item.icon,
      label: <Link to={item.url}>{item.name}</Link>
    }))
  }
}

const getAccountingItems = (user) => {
  let account = accountingItems
  if (user.reseller) {
	account = account.concat(accountingResellerItems)
  }
  if (user.operator) {
	account = account.concat(accountingOperatorItems)
  }
  return {
    key: 'acc',
    label: <h3><FormattedMessage id='accounting' /></h3>,
    children: account.map(item => ({
      key: item.k,
      icon: item.icon,
      label: <Link to={item.url}>{item.name}</Link>
    }))
  }
}

const generateMenu = (user) => {
  const items = [getTechItems(user), getAccountingItems(user)]
  return <Menu mode='inline' defaultOpenKeys={['tech','acc']} items={items} />
}

const SideBar = (props) => {
  const user = props.user
  return user && generateMenu(user)
}

export default SideBar
