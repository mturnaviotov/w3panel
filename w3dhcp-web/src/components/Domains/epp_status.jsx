import React from 'react'
import {Tag, Tooltip} from 'antd'

const EppStatus = (props) => {
	const statusColor = (item) => {
		switch (item){
		case String(item.match(/ok/)):
			return 'green'
		case String(item.match(/inactive/)):
			return 'red'
		case String(item.match(/clientHold/)):
			return 'yellow'
		case String(item.match(/pendingDelete/)):
			return 'red'
		case String(item.match(/RedemptionPeriod/)):
			return 'red'
		case String(item.match(/AutoRenewGracePeriod/)):
			return 'yellow'
		case String(item.match(/clientTransferProhibited/)):
			return 'blue'
		default:
			return 'blue'
		}
	}

	const humanText = (item) => {
		switch (item){
		case String(item.match(/ok/)):
			return <Tooltip title="ok">OK</Tooltip>
		case String(item.match(/inactive/)):
			return <Tooltip title="inactive">Inactive</Tooltip>
		case String(item.match(/clientHold/)):
			return <Tooltip title="clientHold">Hold</Tooltip>
		case String(item.match(/pendingDelete/)):
			return <Tooltip title="pendingDelete">Pending Delete</Tooltip>
		case String(item.match(/RedemptionPeriod/)):
			return <Tooltip title="RedemptionPeriod">Redemption</Tooltip>
		case String(item.match(/AutoRenewGracePeriod/)):
			return <Tooltip title="AutoRenewGracePeriod">Auto Renew Grace Period</Tooltip>
		default:
			return <Tooltip title={item}>{item}</Tooltip>
		}
	}

	return <Tag color={statusColor(props.status)}>{humanText(props.status)|| 'none' }</Tag>
}

export default EppStatus
