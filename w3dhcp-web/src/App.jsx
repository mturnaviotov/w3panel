import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { IntlProvider, FormattedMessage } from 'react-intl'

import { Layout, Divider, Alert } from 'antd'
import { FlagOutlined, CopyrightOutlined } from '@ant-design/icons'

import Contacts from './components/layout/Contacts'
import SideBar from './components/layout/SideBar'
import HeaderBar from './components/layout/HeaderBar'
import AppRoutes from './components/Routes'
import LangSelector from './components/layout/LangSelector'
import { useCart } from './hooks/useCart'

import { clearMessage } from './slices/message'


const { Header, Footer, Sider, Content } = Layout

import enMessages from './lang/en.json'
import ukMessages from './lang/uk.json'

let i18nConfig = {
  'en': {
    key: 'en',
    locale: 'en',
    messages: enMessages,
    textComponent: 'div'
  }, 'uk': {
    key: 'uk',
    locale: 'uk',
    messages: ukMessages,
    textComponent: 'div'
  }
}

const App = () => {

  const user = useSelector((state) => state.auth.user)
  const lang = useSelector((state) => state.lang.lang) || 'uk'
  const { cartDomains } = useCart()
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const message = useSelector((state) => state.message.message)
  const dispatch = useDispatch()

  const styleTheme = 'light'

  const clearMsg = useCallback(() => {
    dispatch(clearMessage())
  }, [dispatch])

  const showMsg = () => {
    return message && <Alert key='msg' message={message} type="error" closable onClose={clearMsg} />
  }
  return (<IntlProvider locale={lang} key={lang} messages={i18nConfig[lang] ? i18nConfig[lang].messages : i18nConfig['uk'].messages}><Router>
    <Layout theme={styleTheme} style={{ minHeight: '100vh' }}>
      <Header style={{ 'background': 'white' }} theme={styleTheme}><HeaderBar user={user} cart={cartDomains.length} /></Header>
      <Layout theme={styleTheme}>
        {isLoggedIn && <Sider theme={styleTheme}><SideBar user={user} /></Sider>}
        <Content>
          {showMsg()}
          <AppRoutes key='routes' />
        </Content>
      </Layout>
      <Footer style={{ textAlign: 'center' }}>
        <Contacts />
        <Divider type='vertical' /> <CopyrightOutlined /> EXAMPLE.COM <Divider type='vertical' />
        <FlagOutlined style={{ marginRight: 8 }} />
        LANGUAGE SELECT | <FormattedMessage id='app.lang' />: <LangSelector />
      </Footer>
    </Layout></Router></IntlProvider>
  )
}

export default App
