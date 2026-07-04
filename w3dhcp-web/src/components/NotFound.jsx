import React from 'react'
import {Link} from 'react-router-dom'
import {FormattedMessage} from 'react-intl'

const NotFound = () => {
  return <div><h2><FormattedMessage id='notfound.header' /></h2><p><FormattedMessage id='notfound.text' /> :(</p><p><Link to='/'><FormattedMessage id='board.name' /></Link></p></div>
}

export default NotFound
