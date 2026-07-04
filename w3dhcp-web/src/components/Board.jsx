import React, { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Link, Navigate } from 'react-router-dom'
import { Card, Statistic, Row, Col, Typography, Divider } from 'antd'
import {
  UserOutlined, AppstoreOutlined, GlobalOutlined, ShoppingCartOutlined,
  ContactsOutlined, CloudServerOutlined, TeamOutlined, SafetyCertificateOutlined,
  DatabaseOutlined
} from '@ant-design/icons'

import { fetchBoard } from "../slices/board"

const { Title } = Typography

const userItems = [
  { k: 'name', title: 'customer', icon: <UserOutlined />, gradient: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)' },
  { k: 'web_apps', title: 'web_apps', icon: <AppstoreOutlined />, gradient: 'linear-gradient(135deg, #52c41a 0%, #237804 100%)' },
  { k: 'dns_zones', title: 'dns_zones', icon: <GlobalOutlined />, gradient: 'linear-gradient(135deg, #722ed1 0%, #391085 100%)' },
  { k: 'domains', title: 'domains', icon: <GlobalOutlined />, gradient: 'linear-gradient(135deg, #eb2f96 0%, #9e1068 100%)' },
  { k: 'subscriptions', title: 'subscriptions', icon: <SafetyCertificateOutlined />, gradient: 'linear-gradient(135deg, #fa8c16 0%, #ad4e00 100%)' },
  { k: 'orders', title: 'orders', icon: <ShoppingCartOutlined />, gradient: 'linear-gradient(135deg, #f5222d 0%, #a8071a 100%)' },
  { k: 'contacts', title: 'contacts', icon: <ContactsOutlined />, gradient: 'linear-gradient(135deg, #13c2c2 0%, #006d75 100%)' },
  { k: 'ftp_users', title: 'ftp_users', icon: <CloudServerOutlined />, gradient: 'linear-gradient(135deg, #2f54eb 0%, #10239e 100%)' },
]

const resellerItems = [
  { k: 'customers', title: 'customers', icon: <TeamOutlined />, gradient: 'linear-gradient(135deg, #faad14 0%, #ad6800 100%)' },
]

const operatorItems = [
  { k: 'resellers', title: 'resellers', icon: <TeamOutlined />, gradient: 'linear-gradient(135deg, #a0d911 0%, #5b8c00 100%)' },
  { k: 'domain_zones', title: 'domain_zones', icon: <GlobalOutlined />, gradient: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)' },
  { k: 'registries', title: 'registries', icon: <DatabaseOutlined />, gradient: 'linear-gradient(135deg, #eb2f96 0%, #9e1068 100%)' },
]

const MetricCard = ({ item, boardValue }) => (
  <Col xs={24} sm={12} md={8} lg={6}>
    <Link to={item.k === 'name' ? '/customer' : '/' + item.k}>
      <Card hoverable className="metric-card-wrapper" style={{ background: item.gradient }}>
        <Statistic 
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="icon-wrapper">{item.icon}</span>
              <FormattedMessage id={item.title} />
            </div>
          }
          value={boardValue}
        />
      </Card>
    </Link>
  </Col>
)

const Board = () => {
  const dispatch = useDispatch()
  const board = useSelector(store => store.board.board)
  const loaded = useSelector(store => store.board.loaded)
  const user = useSelector(store => store.auth.user)

  useEffect(() => {
    if (user && !loaded) {
      dispatch(fetchBoard())
    }
  }, [board, dispatch, loaded, user])

  if (!user) { return <Navigate to='/check' /> }

  return loaded && (
    <div className="dashboard-container">
      <Title level={2} className="dashboard-title">
        <FormattedMessage id='board.name' />
      </Title>

      <Row gutter={[24, 24]}>
        {userItems.map(item => (
          <MetricCard key={item.k} item={item} boardValue={board[item.k]} />
        ))}
      </Row>

      {user.reseller && (
        <>
          <Divider orientation="left" className="dashboard-divider">
            <FormattedMessage id='resellers' />
          </Divider>
          <Row gutter={[24, 24]}>
            {resellerItems.map(item => (
              <MetricCard key={item.k} item={item} boardValue={board[item.k]} />
            ))}
          </Row>
        </>
      )}

      {user.operator && (
        <>
          <Divider orientation="left" className="dashboard-divider">
            <FormattedMessage id='operator_tools' />
          </Divider>
          <Row gutter={[24, 24]}>
            {operatorItems.map(item => (
              <MetricCard key={item.k} item={item} boardValue={board[item.k]} />
            ))}
          </Row>
        </>
      )}
    </div>
  )
}

export default Board
