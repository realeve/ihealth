import React from 'react';
import * as R from 'ramda';
import dayjs from 'dayjs';
import { sport } from './setting.js';
import { TAnswerList, ILog } from '@/pages/paper';
import { IPaper } from './paperData';
let chinaloc = require('../components/ChinaLocation').default.data;
import { IPickerData, ICityItem } from '@/components/PickerComponent';

// A-Z
export const alphaRange: string[] = R.map(
  (item: number) => String.fromCharCode(item).trim(),
  R.range(65, 65 + 26),
);

// 问卷原始数据格式化
export const handlePaper: (paper: IPaper[]) => IPaper[] = paper =>
  paper.map(item => {
    if (typeof item.data === 'string') {
      item.data = item.data.split('\n').map(item => item.trim());
      item.data = R.reject((a: string) => a.length === 0)(item.data);
    }
    if (typeof item.subTitle === 'string') {
      item.subTitle = item.subTitle.split('\n').map(item => item.trim());
    }
    if (item.type === 'DatePicker') {
      // console.log(item.data);
      item.subTitle = item.data;
    }
    return item;
  });

// 答案转换 '0' => 'A'，[0,1]=>'A,B'
export const parseAnswer = (
  state: (string | string[])[],
  key: number,
  title: string,
  showErr: boolean = false,
) => {
  let curAnswer = '';
  let res = state[key];
  if (res) {
    if (typeof res !== 'string') {
      curAnswer = res.map((id: string) => alphaRange[Number(id)]).join(',');
    } else {
      curAnswer = alphaRange[Number(res)];
    }
  }
  return (
    <div style={showErr && curAnswer === '' ? { color: '#e23' } : {}}>
      {title}
      <span> ( {curAnswer} ) </span>
    </div>
  );
};

// 多选答案处理
export const handleMultipleChange = (
  prevState: string[] | string[][],
  value: string | number,
  key: number,
  sort: boolean = true,
  length: undefined | number,
  maxLength: undefined | number,
) => {
  let state = R.clone(prevState);
  let res: string | string[] = R.isNil(state[key]) ? [] : state[key];
  value = String(value);
  // if (typeof sort === 'undefined') {
  //   sort = true;
  // }

  if (typeof res !== 'string') {
    if (res.includes(value)) {
      // 已选，去除
      res = R.reject(R.equals(value))(res);
    } else {
      // 未选，添加
      res.push(value);
    }
    if (typeof maxLength !== 'undefined') {
      res = R.slice(0, maxLength)(res);
    }

    if (typeof length !== 'undefined') {
      res = R.slice(0, length)(res);
    }

    if (sort) {
      res = res.sort((a, b) => Number(a) - Number(b));
    }
    state[key] = res;
  } else {
    state[key] = value;
  }
  return state;
};

export const now = () => dayjs().format('YYYY/MM/DD HH:mm:ss');
export const ymd = () => dayjs().format('YYYYMMDD');

export const getParams = (state: TAnswerList, user: ILog, paper: IPaper[]) => {
  let vote_detail = R.clone(state);
  let params: {
    [key: string]: string;
  } = {
    company_id: String(sport.company_id),
    remark_1: '',
    remark_2: '',
    remark_3: '',
    remark_4: '',
    remark_5: '',
    remark_6: '',
    remark_7: '',
    remark_8: '',
    remark_9: '',
    remark_10: '',
    start_time: user.start_time,
    uuid: user.user,
    vote_detail: '',
  };
  let text_idx: number[] = [],
    required_idx: number[] = [],
    cascade_idx: number[] = [];
  paper.forEach(({ type, required = true, cascade }: IPaper, idx: number) => {
    if (type === 'textarea') {
      text_idx = [...text_idx, idx];
    }
    if (required) {
      required_idx.push(idx);
    }
    if (cascade == 0) {
      cascade_idx.push(idx - 1);
    }
  });

  // 验证问卷是否有效
  let valid = true;

  paper.forEach((_, idx: number) => {
    let item = state[idx];
    if (R.isNil(item) && !cascade_idx.includes(idx - 1)) {
      valid = false;
      return;
    }
    if (required_idx.includes(idx)) {
      if (item.length === 0) {
        valid = false;
      }
    }
  });

  cascade_idx.forEach(idx => {
    let item: string | string[] = state[idx];
    let nextItem = state[idx + 1];
    if (item == '0' && (R.isNil(nextItem) || nextItem.length == 0)) {
      valid = false;
    }
  });
  if (!valid) {
    return valid;
  }

  // 文字信息处理
  text_idx.forEach((key, idx) => {
    params['remark_' + (idx + 1)] = typeof state[key] === 'undefined' ? '' : String(state[key]);
    vote_detail[key] = '';
  });
  params.vote_detail = JSON.stringify(vote_detail).replace(/\\r|\\n/g, '');
  return params;
};

interface Store {
  payload: any;
}
export const setStore = (state: any, store: Store) => {
  let { payload } = store;
  if (typeof payload === 'undefined') {
    payload = store;
    // throw new Error('需要更新的数据请设置在payload中');
  }
  let nextState = R.clone(state);
  Object.keys(payload).forEach(key => {
    let val = payload[key];
    if (R.type(val) === 'Object') {
      nextState[key] = Object.assign({}, nextState[key], val);
    } else {
      nextState[key] = val;
    }
  });
  return nextState;
};

export const convertProvinceData: (data: any) => IPickerData[] = data => {
  let dist: IPickerData[] = [];

  Object.keys(data).forEach((index: string) => {
    let { cities, ...item }: ICityItem = data[Number(index)];
    let provinceItem: IPickerData = { value: item.code, label: item.name, children: [] };

    Object.keys(cities).forEach((index: string) => {
      let { code: value, name: label } = R.pick(['code', 'name'])(cities[index]) as ICityItem;
      let children: ICityItem = [];

      let citydata = cities[index].districts;

      Object.keys(citydata).forEach((index: string) => {
        children.push({
          value: index,
          label: citydata[index],
        });
      });

      provinceItem.children.push({ value, label, children });
    });
    dist.push(provinceItem);
  });

  return dist;
};

export const handleProvName: (e: string[]) => string = pickerValue => {
  let [provId, cityId, districtId] = pickerValue;
  if (provId.length === 0) {
    return '请选择';
  }
  let { name: provName, cities } = chinaloc[Number(provId)];
  let { name: cityName, districts } = cities[cityId];
  let districtName = districts[districtId];
  return [provName, cityName, districtName].join(' ');
};

export const transformProvName: (e: string[]) => string[] = res => {
  if (res.length === 0) {
    return [];
  }

  let [prov, city, districtName] = res;
  let locales = Object.keys(chinaloc);
  let provDetail = {};

  for (let i = 0; i < locales.length; i++) {
    provDetail = chinaloc[locales[i]];
    if (provDetail.name === prov) {
      break;
    }
  }

  let cities = Object.keys(provDetail.cities);

  let districtDetail = {};
  for (let i = 0; i < cities.length; i++) {
    districtDetail = provDetail.cities[cities[i]];
    if (districtDetail.name === city) {
      break;
    }
  }

  let districtId = R.find(item => {
    if (item[1] === districtName) {
      return item[0];
    }
  })(Object.entries(districtDetail.districts));

  let dist = districtId && districtId[0];

  // console.log([dist.slice(0, 2) + '0000', dist.slice(0, 4) + '00', dist]);
  return [dist.slice(0, 2) + '0000', dist.slice(0, 4) + '00', dist];
};
