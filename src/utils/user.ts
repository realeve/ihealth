import uuidv4 from 'uuid/v4.js';
import * as R from 'ramda';
import * as lib from './lib';
import router from 'umi/router';

// 活动开始前，参与测试人员数据加前缀
export const _dev = false;

const prefix = (_dev ? 'dev' : 'dist') + '2020_ihealth_';
let key: {
  [key: string]: string;
} = {
  user: prefix + 'user',
  basic: prefix + 'basic',
  pay: prefix + 'pay',
  status: prefix + 'status',
  hasSubmitted: prefix + 'hasSubmitted',
};

export const getUid = () => {
  let user: string | null = window.localStorage.getItem(key.user);
  if (R.isNil(user)) {
    // uuidv5 中传入的字符值为随机值，此处无意义
    let uuid: string = uuidv4(key.user);
    window.localStorage.setItem(key.user, uuid);
    user = uuid;
  }
  let status = loadPaperStatus();
  return { user, status, start_time: lib.now() };
};

export const savePaper = (paper: string[] | string[][], type: string = 'basic') => {
  let str = JSON.stringify(paper);
  window.localStorage.setItem(key[type], str);
};

export const loadPaper = (type: string = 'basic') => {
  let str: string | null = window.localStorage.getItem(key[type]);
  let paper = [];
  if (!R.isNil(str)) {
    paper = JSON.parse(str);
  }
  // 还原地理信息

  return paper;
};

// 存储答题状态
export const setPaperStatus = () => {
  window.localStorage.setItem(key.status, '1');
};

// 载入答题状态
export const loadPaperStatus = () => {
  let status: string | null = window.localStorage.getItem(key.status);
  let res = R.isNil(status) ? 0 : Number(status);
  return res;
};

export let gotoSuccess = () => router.push('/result');

// 存储基础信息填写状态
export const setBasicStatus = () => {
  window.localStorage.setItem(key.hasSubmitted, '1');
};
export const getBasicStatus = () => {
  let status: string | null = window.localStorage.getItem(key.hasSubmitted);
  let res = R.isNil(status) ? 0 : Number(status);
  return res;
};
