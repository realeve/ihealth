import * as lib from './lib';
import dayjs from 'dayjs';

let chinaloc = require('../components/ChinaLocation').default.data;
// 题目
export interface IPaper {
  title: string;
  data?: string | string[];
  subTitle?: string | string[];
  type?: string;
  cascade?: number;
  [key: string]: any;
}

let paper: IPaper[] = [
  {
    title: '部门',
    type: 'select',
    data: `董事会、经理部
    办公室
    企划信息部
    计划财务部
    钞纸管理部
    印钞管理部
    安全保卫部
    设备管理部
    物资管理部
    技术中心
    基建与行政事务部
    人力资源部
    企业文化部
    纪检监察办公室
    群工部
    离退休工作部
    印钞数管部
    胶凹制作部
    印码制作部
    检封制作部
    钞纸制作部
    钞纸成品制作部
    能源环保部
    市场开发部
    采购管理部
    长城公司
    金鼎公司
    物业公司
    中钞金服
    `,
  },
  {
    title: '岗位名称',
    type: 'textarea',
    rows: 1,
  },
  {
    title: '员工姓名',
    type: 'textarea',
    rows: 1,
  },
  {
    title: '性别',
    data: ` 男
    女`,
  },
  {
    title: '身份证号',
    type: 'textarea',
    rows: 1,
    hide: true,
  },
  {
    title: '籍贯',
    type: 'picker',
    data: chinaloc,
    length: 3,
  },
  { type: 'calendar', title: '复工上岗时间', data: dayjs().format('YYYY/MM/DD') }, // DatePicker
  {
    title: '现居住地址（具体到小区、楼幢、单元、门牌号）',
    type: 'textarea',
    rows: 2,
  },
  {
    title: '手机号',
    type: 'textarea',
    rows: 1,
    hide: true,
  },
  {
    title: '春节期间是否离开温江',
    data: ` 是
    否`,
  },
  {
    title: '离温时间、地点、回温时间',
    type: 'textarea',
  },
  {
    title: '是否与湖北籍人员有往来史',
    data: ` 是
    否`,
  },
];

let expenses: IPaper[] = [
  // {
  //   // type: '',
  //   title: '请问您过去一年，平均月收入是____元',
  //   data: `1000元及以下
  //     1001~3000元
  //     3001~5000元
  //     5001~7000元
  //     7001~10000元
  //     10001~20000元
  //     20000元以上`,
  // },
  // {
  //   type: 'moneyGroup',
  //   title: '请问您在家中常备现金的具体面值和张数是多少(不填写默认为0)',
  //   data: [],
  // },
  // {
  //   type: 'group',
  //   title: '对于不同的消费金额，您常用的支付方式是什么',
  //   subTitle: `现金
  //   银行卡（POS）机
  //   手机
  //   其他`,
  //   data: `10元及以下
  //   11~100元
  //   101元~1000元
  //   1001~5000元
  //   5000元以上`,
  // },
  // {
  //   type: 'moneyGroup',
  //   title: '您平时一般随身携带现金的具体面值和张数是（不填写默认为0,不包括外币）',
  //   data: [],
  // },
];

export let paperData = lib.handlePaper(paper);
export let expensesData = lib.handlePaper(expenses);

export default paperData;
