import { axios, DEV, _commonData, mock } from './axios';
import * as user from './user';
import * as lib from './lib';

const handleArray = (arr, name) => {
  let result = {};
  arr.forEach((element, i) => {
    let el = element.includes(' ') ? element.split(' ') : element;
    if (el instanceof Array) {
      el.forEach((sub, j) => {
        result[`${name}_${i}_${j}`] = sub;
      });
    } else {
      result[`${name}_${i}`] = el;
    }
  });
  return result;
};
const getCommonInfo = ({ userInfo, basicInfo, income }) => {
  let bInfo = handleArray(basicInfo, 'info');
  let iInfo = handleArray(income, 'income');
  let info = { userid: userInfo.openid };
  Object.keys(bInfo).forEach(el => (info[el] = bInfo[el]));
  Object.keys(iInfo).forEach(el => (info[el] = iInfo[el]));
  // console.log("info", info);
  info.rec_time = lib.now();
  return info;
};

const getPayInfo = ({ userInfo, pay }) => {
  let pInfo = handleArray(pay, 'q');
  let info = { userid: userInfo.openid };
  Object.keys(pInfo).forEach(el => (info[el] = pInfo[el]));
  return info;
};
/** 数据量较大时建议使用post模式：
*
*   @database: { 微信开发 }
*   @desc:     { 批量现金调查2019--基础信息录入 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[{userid,info_0,info_1,info_2_0,info_2_1,info_2_2,info_3,info_4,income_0,income_1_0,income_1_1,income_1_2,income_1_3,income_1_4,income_1_5,income_1_6,income_1_7,income_1_8,income_1_9,income_1_10,income_2_0,income_2_1,income_2_2,income_2_3,income_2_4,income_3_0,income_3_1,income_3_2,income_3_3,income_3_4,income_3_5,income_3_6,income_3_7,income_3_8,income_3_9,income_3_10 }]，数组的每一项表示一条数据
*/
export const addBasicInfo = params => {
  let values = [getCommonInfo(params)];

  return DEV
    ? mock(_commonData)
    : axios({
        method: 'post',
        data: {
          values,
          id: 199,
          nonce: 'c6562e7460',
        },
      }).then(({ data: [{ affected_rows }] }) => {
        user.setPaperStatus();
        return affected_rows;
      });
};

/**
 * 
 * @database: { 微信开发 }
 *   @desc:     { 批量现金调查2019--日常交易录入 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@desc:批量插入数据时，约定使用二维数组values参数，格式为[{userid,`q-0`,`q-1`,`q-2`,`q-3`,`q-4-0`,`q-4-1`,`q-4-2`,`q-4-3`,`q-4-4`,`q-4-5`,`q-4-6`,`q-4-7`,`q-4-8`,`q-4-9`,`q-4-10`,`q-5` }]，数组的每一项表示一条数据
 */
export const addPayInfo = params => {
  let values = [getPayInfo(params)];
  // console.log('commit', values);
  // return;

  return DEV
    ? mock(_commonData)
    : axios({
        method: 'post',
        data: {
          values,
          id: 192,
          nonce: '2a4c08d0f3',
        },
      })
        .then(({ data: [{ id }] }) => {
          user.setPaperStatus();
          return id;
        })
        .catch(e => {
          return 0;
        });
};

/**
 *   @database: { 微信开发 }
 *   @desc:     { 现金调查2019--基础信息查询 }
 */
export const getBasicInfo = userid =>
  DEV
    ? mock(_commonData)
    : axios({
        url: '/193/4bf0c20aa3.json',
        params: {
          userid,
        },
      });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 现金调查2019--近期支付数据查询 }
 */
export const getPostPayInfo = userid =>
  DEV
    ? mock(_commonData)
    : axios({
        url: '/194/55dad15c3f.json',
        params: {
          userid,
        },
      });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 现金调查2019--近期支付数据查询 }
 */
export const getCashSurvey2019Pay = userid =>
  axios({
    url: '/194/55dad15c3f.json',
    params: {
      userid,
    },
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 删除日志 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
	@id:_id. 参数说明：api 索引序号
    const { userid, _id } = params;
*/
export const delCashSurvey2019Pay = params =>
  DEV
    ? mock(_commonData)
    : axios({
        url: '/195/90e875ff52.json',
        params,
      });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 现金调查-各省参与情况 }
 */
export const getCashSurvey2019CommonList = () =>
  axios({
    url: '/196/334cc60eb8.json',
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 现金调查-指定省份参与情况 }
 */
export const getCashSurvey2019CommonByProv = info_2_0 =>
  axios({
    url: '/197/80d1c4601c.json',
    params: {
      info_2_0,
    },
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 指定县级单位参与情况 }
 */
export const getCashSurvey2019Common = info_2_1 =>
  axios({
    url: '/198/21b56a2cc7.json',
    params: {
      info_2_1,
    },
  });
