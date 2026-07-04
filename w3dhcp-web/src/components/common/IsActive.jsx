import React from 'react'
import {CheckCircleOutlined, PauseOutlined} from '@ant-design/icons'

const IsActive = (props) => {
  return (props.active) ? <CheckCircleOutlined /> : <PauseOutlined/>
}

export default IsActive
