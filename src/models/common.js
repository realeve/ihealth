import { setStore, transformProvName } from '@/utils/lib';
import * as lib from '@/utils/user';
import * as db from '@/utils/db';
import weixin from '@/utils/WeiXin';

const namespace = 'common';
export default {
  namespace,
  state: {
    user: {},
    basic: [],
    pay: [],
    hasSubmitted: 0,
    result: {
      title: '提交成功',
      status: 'success',
    },
    logs: [],
    status: 0,
  },
  reducers: {
    setStore,
    clearPay(state) {
      return {
        ...state,
        pay: [],
      };
    },
  },
  effects: {
    *getWxUser(_, { put, call, select }) {
      // 调整用户信息获取
      let user = yield select(state => state.common.user);
      if (user.openid) {
        return;
      }

      user = yield call(weixin.getWxUserInfo);
      console.log('用户信息载入完毕', user);
      if (!user) {
        return;
      }

      yield put({
        type: 'setStore',
        payload: {
          user,
        },
      });
    },
    *getBasicInfo(_, { put, call, select }) {
      let { user, basic: basicData } = yield select(state => state.common);

      if (!user.openid || basicData.length > 0) {
        return;
      }
      let { data } = yield call(db.getCbpc2020NcovWork, user.openid);
      if (data.length === 0) {
        return;
      }
      let {
        deptname,
        company_id,
        username,
        sex,
        id_card,
        hometown,
        work_date,
        address,
        mobile,
        leave_wenjiang,
        leave_time,
        connect_hubei,
      } = data[0];

      console.log(transformProvName(hometown.split(' ')));

      let basic = [
        deptname,
        company_id,
        username,
        sex,
        id_card,
        transformProvName(hometown.split(' ')),
        work_date,
        address,
        mobile,
        leave_wenjiang,
        leave_time,
        connect_hubei,
      ];

      yield put({
        type: 'setStore',
        payload: {
          basic,
          hasSubmitted: true,
        },
      });
      console.log('loading from db', basic);
    },
    *getPayLog(_, { put, call, select }) {
      let user = yield select(state => state.common.user);
      if (!user.openid) {
        return;
      }

      let res = yield call(db.getCbpc2020NcovWorkLog, user.openid);

      yield put({
        type: 'setStore',
        payload: {
          logs: res.data,
        },
      });
    },
  },
  subscriptions: {
    async setup({ dispatch, history }) {
      await dispatch({ type: 'getWxUser' });

      return history.listen(async ({ pathname }) => {
        if (!['/result', '/export', '/chart', '/log', '/paper', '/new'].includes(pathname)) {
          await weixin.init();
        }

        if (['/log'].includes(pathname)) {
          dispatch({
            type: 'getPayLog',
          });
        }

        if (['/paper'].includes(pathname)) {
          // 载入历史数据
          let basic = lib.loadPaper('basic');
          let hasSubmitted = lib.getBasicStatus();
          if (basic.length) {
            dispatch({
              type: 'setStore',
              payload: { basic, hasSubmitted },
            });
            console.log('loading from cache');
          } else {
            dispatch({ type: 'getBasicInfo' });
          }
        }
      });
    },
  },
};