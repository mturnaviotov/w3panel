import React from 'react'
import { Modal, Button } from 'antd'

const ModalWin = (props) => {
  const [visible, setVisible] = React.useState(false)

  const showModal = () => {
    setVisible(true)
  }

  const handleOk = (values) => {
	props.action()
  }

  const handleCancel = () => {
    setVisible(false)
  }


  return (
    <>
      <Button type='text' onClick={showModal}>
        {props.title}
      </Button>
      <Modal
        title={props.title}
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
		footer={props.noBtns && null}
      >
	    {React.cloneElement(props.content, { closeAction: handleCancel })}
      </Modal>
    </>
  )
}

export default ModalWin
