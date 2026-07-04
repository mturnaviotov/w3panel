import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'antd'
import { MailOutlined, PhoneOutlined } from '@ant-design/icons'

const Contacts = () => {
	return (
		<span>
			<FormattedMessage id='common.contact_us' /> : <Button href="mailto:info@EXAMPLE.COM" ><MailOutlined /> Email </Button>
			<Button href="callto:+380123456789" ><PhoneOutlined /> +380123456789 </Button>
			<Button href="callto:+380123456789" ><PhoneOutlined /> +380123456789 </Button>
		</span>
	)
}

export default Contacts
