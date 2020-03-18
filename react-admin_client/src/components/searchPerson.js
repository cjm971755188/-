import React, { Component } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

const { Option } = Select

@connect(({ loading }) => ({ loading: loading.effects['user/searchPerson'] }))
class SearchPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      person: this.props.users || [],
      width: this.props.width || null,
      uid: ''
    }
  }

  handleChange = (value, key) => {
    this.setState({ uid: value })
    this.props.sendValues({ uid: value })
  };

  handleFocus = (value) => {
    const { dispatch, did } = this.props
    dispatch({
      type: 'user/searchPerson',
      payload: {
        username: '',
        name: '',
        pageNum: 1,
        pageSize: 10000,
        did: did || null
      }
    })
      .then((res) => {
        this.setState({ person: res.data.data })
      })
  };
  
  handleSearch = (value) => {
    const { dispatch, did } = this.props
    dispatch({
      type: 'user/searchPerson',
      payload: {
        username: value,
        name: value,
        pageNum: 1,
        pageSize: 10000,
        did: did || null
      }
    })
      .then((res) => {
        this.setState({ person: res.data.data })
      })
  }

  render () {
    const { uid } = this.props
    const { person, width } = this.state
    return (
      <Select
        showSearch
        value={uid}
        style={{ width }}
        placeholder="请输入需要请假的员工工号或姓名"
        filterOption={false}
        onFocus={this.handleFocus}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
        notFoundContent={null}
        optionFilterProp="children"
      >
        {person && person.map((value, key) => {
          return <Option value={value.uid} key={value.uid}>{value.name}({value.username})</Option>
        })}
      </Select>
    )
  }
}

export default SearchPerson ;