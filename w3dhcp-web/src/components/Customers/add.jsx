import React from 'react'
import {Button, Form, Input, Checkbox} from 'antd'
import {FormattedMessage} from 'react-intl'

const Add = (props) => {

  const [form] = Form.useForm()

  const onFinish = (values) => {
	props.action(values)
	form.resetFields()
	props.closeAction()
  }

  return (<>
	<Form
	  form={form}
	  layout="vertical"
	  name=<FormattedMessage id='action.add' />
		initialValues={{
		  name:			'',
		  corporate:	false,
		}}
	  autoComplete='off'
	  onFinish={onFinish}
	>
	  <Form.Item
		label=<FormattedMessage id='common.name' />
		name="name"
		rules={[
		  {
			required: true,
		  },
		]}
	  >
		<Input />
	  </Form.Item>

      <Form.Item
        label=<FormattedMessage id='corporate' />
        name="corporate"
		valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>

	<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
	  <Button type="primary" htmlType="submit">
		<FormattedMessage id='action.save' />
	  </Button>
	</Form.Item>
</Form>
</>)}

export default Add
