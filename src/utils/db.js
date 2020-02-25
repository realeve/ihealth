import { axios, DEV, _commonData, mock } from './axios';
import * as user from './user';
import * as lib from './lib';
import qs from 'qs';

let getCompany = () => {
  let str = window.location.search.slice(1);
  let res = qs.parse(str);
  return res.company_id || '1';
};

const getCommonInfo = ({ userInfo, basicInfo }) => {
  // let keys = `deptname,username,sex,id_card,hometown,work_date,address,mobile,leave_wenjiang,leave_time,connect_hubei`;
  let keys = `deptname,workname,username,sex,id_card,hometown,work_date,address,mobile,leave_wenjiang,leave_time,connect_hubei`;
  let info = {
    userid: userInfo.openid || user.getUid().user,
    rec_time: lib.now(),
    company_id: getCompany(),
  };
  keys.split(',').map((key, idx) => {
    info[key] = basicInfo[idx];
  });
  return info;
};

const getPayInfo = ({ userInfo, pay }) => {
  let keys = `rec_date,temprature,health_info,remark`;
  let info = { userid: userInfo.openid || user.getUid().user, rec_time: lib.now() };
  keys.split(',').map((key, idx) => {
    info[key] = pay[idx];
  });
  info.remark = info.remark || '';
  return info;
};

/** 数据量较大时建议使用post模式：
*
*   @database: { 微信开发 }
*   @desc:     { 批量现金调查2019--基础信息录入 } 
	以下参数在建立过程中与系统保留字段冲突，已自动替换:
  */
export const addBasicInfo = params => {
  let values = [getCommonInfo(params)];
  console.log('basicInfo', values);

  return DEV
    ? mock(_commonData)
    : axios({
        method: 'post',
        data: {
          values,
          id: 259,
          nonce: 'dcc336d556',
        },
      })
        .then(({ data: [{ affected_rows }] }) => {
          user.setPaperStatus();
          return affected_rows;
        })
        .catch(e => {
          console.log(e);
          return false;
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
  console.log('payInfo', values);

  return DEV
    ? mock(_commonData)
    : axios({
        method: 'post',
        data: {
          values,
          id: 260,
          nonce: '11432374fa',
        },
      })
        .then(({ data: [{ id }] }) => {
          user.setPaperStatus();
          return id;
        })
        .catch(e => {
          console.log(e);
          return 0;
        });
};

/**
 *   @database: { 微信开发 }
 *   @desc:     { 基础信息查询 }
 */
export const getCbpc2020NcovWork = userid =>
  axios({
    url: '/261/962f201823.json',
    params: {
      userid,
    },
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 现金调查2019--近期支付数据查询 }
 */
export const getCbpc2020NcovWorkLog = userid =>
  axios({
    url: '/262/9124ab0316.json',
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
export const delCbpc2020NcovWorkLog = params =>
  axios({
    url: '/263/280b74777e.json',
    params,
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 填写情况 }
 */
export const getCbpc2020NcovWorkStatic = () =>
  axios({
    url: '/264/d42a1d51b9.json',
    params: {
      company_id: getCompany(),
    },
  });
/**
 *   @database: { 微信开发 }
 *   @desc:     { 部门人员详情 }
 */
export const getCbpc2020NcovWorkTemprature = deptname =>
  axios({
    url: '/265/d6ae168866.json',
    params: {
      deptname,
    },
  });
