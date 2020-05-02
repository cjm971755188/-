import React, { Component } from 'react';
import { Card, Form, Input, Radio, Button, message, DatePicker, Icon } from 'antd';
import { connect } from 'dva';

import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import SearchPerson from '../../components/searchPerson'

const { TextArea } = Input;
const { RangePicker } = DatePicker;

@connect(({ absent, user, loading }) => ({
  absent,
  user,
  loading: loading.effects['absent/createAbsent'],
}))
class AbsentCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '事假',
      uid: ''
    }
  }

  handleSubmit = e => {
    const { user: { user }, dispatch } = this.props
    const { flag } = this.props.history.location.state
    const { type } = this.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'absent/create',
          payload: {
            flag,
            uid: flag === 1 ? this.state.uid : user.uid,
            type,
            detail: values.detail,
            startTime: moment(values.times[0]).valueOf(),
            endTime: moment(values.times[1]).valueOf(),
            checkUid: flag === 1 ? user.uid : '',
            checkName: flag === 1 ? user.name : '',
          }
        })
          .then((res) => {
            if (res.msg === '') {
              message.success('添加请假单成功！')
              this.props.history.replace(user.did === 1 ? '/home/absent/list' : '/home/main');
              this.props.form.resetFields();
            } else {
              message.error(res.msg)
            }
          })
      }
    });
  };

  getPersonValues = (values) => {
    this.setState({
      uid: values.uid
    })
  }

  render () {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { flag } = this.props.history.location.state
    const { type, uid } = this.state
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    }
    function disabledDate(current) {
      return current && current < moment().endOf('day');
    }
    return (
      <Card title='添加请假单'>
        <Form onSubmit={this.handleSubmit} layout='horizontal' labelAlign='left'>
          {flag === 1 ? <Form.Item label='员工' {...formItemLayout}>
            <SearchPerson sendValues={this.getPersonValues} uid={uid} width='100%' />
          </Form.Item> : null}
          <Form.Item label='类型' {...formItemLayout}>
            <Radio.Group
              value={type}
              onChange={(e) => { this.setState({ type: e.target.value }) }} 
            >
              <Radio value={'事假'}>事假</Radio>
              <Radio value={'病假'}>病假</Radio>
              <Radio value={'其他'}>其他</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label='请假理由' {...formItemLayout}>
            {getFieldDecorator('detail', {
              rules: [
                { required: true, message: '请假理由不能为空!' },
              ],
            })(
              <TextArea
                allowClear 
                placeholder="请输入员工请假理由（不得超过25个字符）"
                maxLength={25}
                autoSize={{ minRows: 4, maxRows: 4 }}
              />
            )}
          </Form.Item>
          <Form.Item label='请假日期' {...formItemLayout}>
            {getFieldDecorator('times', {
              rules: [
                { required: true, message: '请假日期不能为空!' },
              ],
            })(
              <RangePicker 
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: [moment('08:00:00', 'HH:mm:ss'), moment('16:30:00', 'HH:mm:ss')],
                }}
                locale={locale}
                format="YYYY-MM-DD HH:mm:ss" 
                disabledDate={disabledDate}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Icon type="info-circle" />
            <span>注：请假必须至少提前一天，管理员主动添加请假单后，审批过程由系统默认为通过</span>
          </Form.Item>
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
            <Button  type="primary"  htmlType="submit">确认添加</Button>
          </Form.Item>
        </Form>
      </Card>
      
    )
  }
}

const AbsentCreateForm  = Form.create({ name: 'absentCreate' })(AbsentCreate);

export default AbsentCreateForm ;