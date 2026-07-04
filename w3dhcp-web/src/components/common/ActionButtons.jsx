import {FormattedMessage} from 'react-intl'
import {Button, Popconfirm} from 'antd'

const ActionButtons = (props) => {
  return props.items.map((item) => (item.confirm) ?
	<Popconfirm key={item.key} title={<FormattedMessage id='action.confirm' />}
	  okText={<FormattedMessage id='action.confirm' />} cancelText={<FormattedMessage id='action.cancel' />} onConfirm={() => item.action(props.record)} >
 		<Button danger key={item.key} >{<FormattedMessage id={item.name} />}</Button>
	</Popconfirm>
	: 
	<Button key={item.key} onClick={() => item.action(props.record)}>{<FormattedMessage id={item.name} />}</Button>
  )}

export default ActionButtons
