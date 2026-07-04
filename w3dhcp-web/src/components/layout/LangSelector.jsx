import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Menu, Button, Dropdown, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { setLang } from '../../slices/lang'

const langNames = {
	'uk': 'Українська',
	'en': 'English',
};

const LangSelector = (props) => {
	const lang = useSelector(store => store.lang.lang)
	const list = useSelector(store => store.lang.list)
	const dispatch = useDispatch()

	const changeLang = (lang) => {
		dispatch(setLang({ lang: lang }))
	}

	const menuItems = list.map(item => ({
		key: item,
		label: (
			<Button key={item} onClick={() => changeLang(item)} type='text'>
				{langNames[item] || item}
			</Button>
		)
	}));

	return (
		<Dropdown menu={{ items: menuItems }} trigger={['click']}>
			<Button key='langswitch' type='text' onClick={e => e.preventDefault()}>
				<Space>
					{langNames[lang] || lang}
					<DownOutlined />
				</Space>
			</Button>
		</Dropdown>
	)
}

export default LangSelector
