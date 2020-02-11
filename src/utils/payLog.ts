import * as lib from './lib';
import dayjs from 'dayjs';

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
    type: 'DatePicker',
    mode: 'datetime',
    title: '记录时间',
    data: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    type: 'textarea',
    title: '体温(℃)',
    rows: 1,
  },
  {
    title: '复工上岗期间身体是否正常',
    data: ` 是
    否`,
  },
  {
    type: 'textarea',
    title: '备注',
    rows: 2,
  },
];

export let paperData = lib.handlePaper(paper);

export default paperData;
