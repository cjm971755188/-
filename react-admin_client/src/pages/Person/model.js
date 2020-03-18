import { getPersonList, createPerson, editPerson, deletePerson, getDepartments } from '../../services/person';

export default {
  namespace: 'person',
  state: {
    list: {
      data: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    },
    currentParameter: {
      username: '',
      name: '',
      did: 'all',
      absent: 'all'
    },
    comfirmData: {
      choosedUsername: '',
      choosedName: '',
      choosedPid: 'all',
      choosedAbsent: 'all'
    },
    detail: [],
    departments: [],
    permissions: []
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      try {
        const res = yield call(getPersonList, payload);
        yield put({
          type: 'save',
          payload: res.data,
          index: 'list'
        });
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *create({ payload }, { call, put }) {
      try {
        const res = yield call(createPerson, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *edit({ payload }, { call, put }) {
      try {
        const res = yield call(editPerson, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *del({ payload }, { call, put }) {
      try {
        const res = yield call(deletePerson, payload);
        return Promise.resolve(res);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *getDepartments({ payload }, { call, put }) {
      try {
        const res = yield call(getDepartments, payload);
        if (res.code === 200) {
          yield put({
            type: 'save',
            payload: res.data,
            index: 'departments'
          });
          return Promise.resolve(res);
        }
        return Promise.reject(res.msg);
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },

  reducers: {
    save(state, { payload, index }) {
      return {
        ...state,
        [index]: {
          ...state[index],
          ...payload,
        },
      };
    },
    reset(state) {
      return {
        ...state,
        list: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        currentParameter: {
          username: '',
          name: '',
          did: 'all',
          absent: 'all'
        },
        comfirmData: {
          choosedUsername:'',
          choosedName: '',
          choosedPid: 'all',
          choosedAbsent: 'all'
        },
      };
    },
  },
};
