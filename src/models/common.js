import { setStore, transformProvName } from '@/utils/lib';
import * as lib from '@/utils/user';
import * as db from '@/utils/db';
import weixin from '@/utils/WeiXin';
import paper from '@/utils/payLog';

const namespace = 'common';
export default {
  namespace,
  state: {
    user: {},
    basic: [],
    income: [],
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
      let { data } = yield call(db.getBasicInfo, user.openid);
      if (data.length === 0) {
        return;
      }
      let {
        info_0,
        info_1,
        info_2_0,
        info_2_1,
        info_2_2,
        info_3,
        info_4,
        income_0,
        income_1_0,
        income_1_1,
        income_1_2,
        income_1_3,
        income_1_4,
        income_1_5,
        income_1_6,
        income_1_7,
        income_1_8,
        income_1_9,
        income_1_10,
        income_2_0,
        income_2_1,
        income_2_2,
        income_2_3,
        income_2_4,
        income_3_0,
        income_3_1,
        income_3_2,
        income_3_3,
        income_3_4,
        income_3_5,
        income_3_6,
        income_3_7,
        income_3_8,
        income_3_9,
        income_3_10,
      } = data[0];

      console.log(transformProvName([info_2_0, info_2_1, info_2_2]));
      let basic = [
        info_0,
        info_1,
        transformProvName([info_2_0, info_2_1, info_2_2]),
        info_3,
        info_4,
      ];
      let income = [
        income_0,
        [
          income_1_0,
          income_1_1,
          income_1_2,
          income_1_3,
          income_1_4,
          income_1_5,
          income_1_6,
          income_1_7,
          income_1_8,
          income_1_9,
          income_1_10,
        ],
        [income_2_0, income_2_1, income_2_2, income_2_3, income_2_4],
        [
          income_3_0,
          income_3_1,
          income_3_2,
          income_3_3,
          income_3_4,
          income_3_5,
          income_3_6,
          income_3_7,
          income_3_8,
          income_3_9,
          income_3_10,
        ],
      ];
      yield put({
        type: 'setStore',
        payload: {
          basic,
          income,
          hasSubmitted: true,
        },
      });
      console.log('loading from db', basic, income);
    },
    *getPayLog(_, { put, call, select }) {
      let user = yield select(state => state.common.user);
      if (!user.openid) {
        return;
      }

      let res = yield call(db.getCashSurvey2019Pay, user.openid);
      let nextLog = res.data.map(item => ({
        id: item.id,
        sence: paper[1].data[item.q_1],
        total: '￥' + item.q_2,
        pay_way: paper[3].data[item.q_3],
        date_name: item.q_0,
        note: item.q_5,
      }));
      // nextLog = R.sortWith([R.ascend(R.prop('id'))])(nextLog);

      yield put({
        type: 'setStore',
        payload: {
          logs: nextLog,
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

          // let pay = lib.loadPaper('pay');
          // if (pay.length) {
          //   dispatch({
          //     type: 'setStore',
          //     payload: { pay },
          //   });
          // } else {
          //   dispatch({
          //     type: 'getPayLog',
          //   });
          // }
        }

        if (['/paper'].includes(pathname)) {
          // 载入历史数据
          let basic = lib.loadPaper('basic');
          let income = lib.loadPaper('income');
          let hasSubmitted = lib.getBasicStatus();
          if (basic.length) {
            dispatch({
              type: 'setStore',
              payload: { basic, income, hasSubmitted },
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
