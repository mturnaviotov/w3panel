import React, {useEffect, useCallback} from 'react'
import {useDispatch, useSelector } from 'react-redux'
import {Routes, Route, Navigate, useLocation } from 'react-router-dom'
import EventBus from '../common/EventBus'

import Login from './Login'
import Board from './Board'
import Register from './Register'
//import Profile from './Profile'
import Resellers from './Resellers'
import Domains from './Domains'
import DnsZones from './DnsZones'
import Customers from './Customers'
import WebApps from './WebApps'
import IpAddresses from './IpAddresses'
import DomainZones from './DomainZones'
import Registries from './Registries'
import Subscriptions from './Subscriptions'
import SubscriptionTemplates from './SubscriptionTemplates'
import Contacts from './Contacts'
import Check from './Check'
import NotFound from './NotFound'
import Users from './Users'
import FtpUsers from './FtpUsers'
import Cart from './Cart'
import Orders from './Orders'
import Events from './Events'

import {logout} from '../slices/auth'

const AppRoutes = () => {

  const user = useSelector((state) => state.auth.user)

  const dispatch = useDispatch()
  const logOut = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

function RequireUser({ children }) {
  let location = useLocation()
  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }
  return children
}

function RequireReseller({ children }) {
  let location = useLocation()
  if (user && user.reseller) { return children } else { return <Navigate to='/' state={{ from: location }} replace />}
}

function RequireOperator({ children }) {
  let location = useLocation()
  if (user && user.operator) { return children } else { return <Navigate to='/' state={{ from: location }} replace />}
}

  useEffect(() => {
    EventBus.on('logout', () => {
      logOut()
    })

    return () => {
      EventBus.remove('logout')
    }
  }, [user, logOut])

  return (
	<Routes>
	  <Route path='/' element={<Board />} />
	  <Route path='/cart' element={<Cart />} />
	  <Route path='/register' element={<Register />} />
	  <Route
		path='/contacts'
		element={
		<RequireUser>
		  <Contacts />
		</RequireUser>
        }
      />
	  <Route
		path='/domains'
		element={
		<RequireUser>
		  <Domains />
		</RequireUser>
        }
      />
	  <Route
		path='/domain_zones'
		element={
		<RequireUser>
		  <DomainZones />
		</RequireUser>
        }
      />
	  <Route
		path='/dns_zones'
		element={
		<RequireUser>
		  <DnsZones />
		</RequireUser>
        }
      />
	  <Route
		path='/users'
		element={
		<RequireUser>
		  <Users />
		</RequireUser>
        }
      />
	  <Route
		path='/ftp_users'
		element={
		<RequireUser>
		  <FtpUsers />
		</RequireUser>
        }
      />
	  <Route
		path='/web_apps'
		element={
		<RequireUser>
		  <WebApps />
		</RequireUser>
        }
      />
	  <Route
		path='/subscriptions'
		element={
		<RequireUser>
		  <Subscriptions />
		</RequireUser>
        }
      />
	  <Route
		path='/subscriptions'
		element={
		<RequireUser>
		  <Subscriptions />
		</RequireUser>
        }
      />
	  <Route
		path='/orders'
		element={
		<RequireUser>
		  <Orders />
		</RequireUser>
        }
      />
	  <Route
		path='/events'
		element={
		<RequireUser>
		  <Events />
		</RequireUser>
        }
      />
	  <Route
		path='/customers'
		element={
		<RequireReseller>
		  <Customers />
		</RequireReseller>
        }
      />
	  <Route
		path='/subscription_templates'
		element={
		<RequireReseller>
		  <SubscriptionTemplates />
		</RequireReseller>
        }
      />
	  <Route
		path='/resellers'
		element={
		<RequireOperator>
		  <Resellers />
		</RequireOperator>
        }
      />
	  <Route
		path='/registries'
		element={
		<RequireOperator>
		  <Registries />
		</RequireOperator>
        }
      />
	  <Route
		path='/ip_addresses'
		element={
		<RequireOperator>
		  <IpAddresses />
		</RequireOperator>
        }
      />
	  <Route path='/check' element={<Check />} />
	  <Route path='/login' element={<Login />} />
	  <Route path='*' element={<NotFound />} />
	</Routes>
  )
}

export default AppRoutes
