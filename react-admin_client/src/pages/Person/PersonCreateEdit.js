import React, { Component } from 'react';
import { Card, Form, Input, Radio, Button, message, Select, Icon, Row, Modal } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ person, loading }) => ({
  person,
  loading: loading.effects['person/create'] || loading.effects['person/edit'],
}))
class PersonCreateEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  UNSAFE_componentWillMount () {
    const { dispatch } = this.props
    const { permission } = this.props.history.location.state
    dispatch({
      type: 'person/getDepartments',
      payload: {}
    })
    dispatch({
      type: 'person/getPermissions',
      payload: { permission }
    })
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    const { flag, record } = this.props.history.location.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(!(/^1[3456789]\d{9}$/.test(values.phone))){ 
          message.error("手机号码有误，请重填!");
        } else {
          dispatch({
            type: flag === 'create' ? 'person/create' : 'person/edit',
            payload: { 
              uid: flag === 'create' ? null : record.uid,  
              ...values 
            }
          })
            .then((res) => {
              if (res.msg === '') {
                if (flag === 'create') {
                  Modal.info({
                    title: '添加员工成功！',
                    content: (
                      <div>
                        <p>新员工{values.name}的工号为：{res.data.username}，密码为：123456</p>
                        <p>PS: 建议该员工先自行修改登录密码</p>
                      </div>
                    ),
                    onOk() {},
                  })
                } else {
                  message.success('修改员工信息成功！')
                }
                this.props.history.replace('/home/person/list');
                this.props.form.resetFields();
              } else {
                message.error(res.msg)
              }
            })
            .catch((e) => {
              message.error(e);
            });
        }
        
      }
    });
  };

  render () {
    const { dispatch } = this.props
    const { getFieldDecorator, resetFields } = this.props.form;
    const { flag, record } = this.props.history.location.state
    const { person: { departments: { departments = [] } } } = this.props
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 16 },
    }
    return (
      <Card title={flag === 'create' ? '添加员工' : '修改员工信息'}>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          {flag === 'create' ? null : <Form.Item label='工号' {...formItemLayout}>
            {getFieldDecorator('username', {
              initialValue: record.username,
              rules: [
                { required: true, message: '姓名不能为空!' },
              ],
            })(
              <Input disabled style={{ width: '50%' }} />,
            )}
          </Form.Item>}
          <Form.Item label='姓名' {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: flag === 'create' ? '' : record.name,
              rules: [
                { required: true, message: '姓名不能为空!' },
              ],
            })(
              <Input placeholder="请输入员工姓名" style={{ width: '50%' }} />,
            )}
          </Form.Item>
          <Form.Item label='性别' {...formItemLayout}>
            {getFieldDecorator('sex', {
              initialValue: flag === 'create' ? '男' : record.sex,
              rules: [
                { required: true, message: '性别不能为空!' },
              ],
            })(
              <Radio.Group>
                <Radio value='男'>男</Radio>
                <Radio value='女'>女</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label='联系方式' {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: flag === 'create' ? '' : record.phone,
              rules: [
                { required: true, message: '联系方式不能为空!' },
              ],
            })(
              <Input placeholder="请输入员工的手机号" style={{ width: '50%' }} />,
            )}
          </Form.Item>
          <Form.Item label='部门职位' {...formItemLayout}>
            {getFieldDecorator('did', {
              initialValue: flag === 'create' ? '' : record.did,
              rules: [
                { required: true, message: '部门职位不能为空!' },
              ],
            })(
              <Select 
                placeholder="请选择员工的部门职位" 
                style={{ width: '50%' }}
                onFocus={() => {
                  dispatch({
                    type: 'person/getDepartments',
                    payload: {}
                  })
                }}
              >
                {departments && departments.map((value, key) => {
                  return <Option value={value.did} key={value.did}>{value.name}</Option>
                })}
              </Select>,
            )}
          </Form.Item>
          {flag === 'create' ? <Form.Item>
            <Row>
              <Icon type="info-circle" />
              <span>注：员工账号添加后，默认密码为123456，默认权限与部门职位匹配，可在'账号管理'中修改</span>
            </Row>
          </Form.Item>: null}
          <Form.Item>
            <Button 
              style={{ marginRight: '8px' }}
              onClick={() => { 
                this.props.history.goBack();
                resetFields();
              }}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit">{flag === 'create' ? '确认添加' : '确认修改'}</Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

const PersonForm  = Form.create({ name: 'person' })(PersonCreateEdit);

export default PersonForm;