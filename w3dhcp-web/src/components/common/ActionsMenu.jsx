import {DownOutlined} from '@ant-design/icons'
import {FormattedMessage} from 'react-intl'
import {Button, Menu, Dropdown, Popconfirm} from 'antd'

const {Item} = Menu
const ActionsMenu = (props) => {
  const makeItems = () => {
    return props.items.map((item) => (item.confirm) ?
	  <Item key={item.key}>
		<Popconfirm key={item.key} title={<FormattedMessage id='action.confirm' />}
		  okText={<FormattedMessage id='action.confirm' />} cancelText={<FormattedMessage id='action.cancel' />}
			onConfirm={() => item.action(props.record.id)} >
 		<Button key={item.key} type='text'>{<FormattedMessage id={item.name} />}</Button>
		</Popconfirm>
	  </Item>
	: 
	  <Item key={item.key} >
		<Button key={item.key} onClick={() => item.action(props.record.id)} type='text'>{<FormattedMessage id={item.name} />}</Button>
	  </Item>)
  }

  const makeModals = () => {
	return (props.modals && props.modals.length) && props.modals.map((item) => <Item key={item.key}>{item}</Item>)
  }

  const menu = () => {
    return <Menu mode='vertical' title='1'>
    <Item key='first'><Button key='first' type='text' disabled={true}>{props.name}</Button></Item>
    {makeModals()}{props.items && makeItems()}
    </Menu>
  }

  return (
	<Dropdown overlay={menu} trigger={['click']}>
	  <Button key='actions_menu' type='text' onClick={e => e.preventDefault()}><FormattedMessage id='actions' /> <DownOutlined /></Button>
	</Dropdown>)
}

export default ActionsMenu
