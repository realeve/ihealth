import React from 'react';
import { TextareaItem, List, DatePicker } from 'antd-mobile';
import RadioComponent from '@/components/RadioComponent';
import CheckboxComponent from '@/components/CheckboxComponent';
import PickerComponent from '@/components/PickerComponent';
import NestRadio from '@/components/NestRadio';
import Select from '@/components/SelectComponent';
import MoneyGroup from '@/components/MoneyGroup';
import * as R from 'ramda';
import { IPaper } from '@/utils/paperData';
import dayjs from 'dayjs';

export interface IPropsForm {
  data: any;
  onChange: any;
  state: any;
  showErr: any;
  [key: string]: any;
}
export default function FormComponent({ data, onChange, state, showErr }: IPropsForm) {
  return data.map(({ title, data, type = 'radio', subTitle, ...props }: IPaper, key: number) => {
    let idxTitle = `${key + 1}.${title}`;

    let prop = {
      onChange,
      title: idxTitle,
      idx: key,
      key,
      state,
      data: typeof data === 'string' ? [data] : data,
      length: props.length,
      sort: props.sort,
      maxLength: props.maxLength,
      showErr: !R.equals(showErr, {}),
    };

    switch (type) {
      case 'radio':
        return <RadioComponent {...prop} />;
      case 'select':
        return <Select {...prop} />;
      case 'checkbox':
        if (typeof subTitle !== 'undefined' && typeof subTitle !== 'string') {
        }
        prop.title += props.length ? '' : '(可多选)';
        return <CheckboxComponent {...prop} />;
      case 'group':
        if (typeof subTitle !== 'undefined' && typeof subTitle !== 'string') {
          return <NestRadio subTitle={subTitle} {...prop} />;
        }
        return null;
      case 'textarea':
        let cascade = typeof props.cascade === 'number';
        let needRemark = cascade && Number(state[key - 1]) === props.cascade;
        return (
          <List renderHeader={prop.title} key={key}>
            <TextareaItem
              disabled={cascade && !needRemark}
              value={
                cascade && !needRemark
                  ? '无'
                  : typeof state[key] === 'undefined'
                  ? ''
                  : String(state[key])
              }
              onChange={val => {
                let nextState: (string | string[])[] = R.clone(state);
                let res: string =
                  (props.cascade && state[key - 1] == '1') || typeof val === 'undefined'
                    ? '无'
                    : val;
                nextState[key] = res; //.trim();
                onChange(nextState);
              }}
              rows={props.rows || 3}
              placeholder="请在此输入"
              clear={true}
            />
          </List>
        );
      case 'picker':
        return (
          <PickerComponent
            {...prop}
            onChange={(val: string[]) => {
              let nextState: (string | string[])[] = R.clone(state);
              nextState[key] = val;
              onChange(nextState);
            }}
          />
        );
      case 'moneyGroup':
        return (
          <MoneyGroup title={idxTitle} value={state} idx={key} key={key} onChange={onChange} />
        );
      case 'DatePicker':
        return (
          <DatePicker
            minDate={new Date('2020-02-01')}
            maxDate={new Date()}
            mode={props.mode || 'date'}
            title={idxTitle}
            value={new Date(state[key])}
            key={key}
            onChange={(e: Date) => {
              console.log(e);
              let nextState: (string | string[])[] = R.clone(state);
              nextState[key] = dayjs(e).format(
                props.mode === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm',
              );
              onChange(nextState);
            }}
            // onValueChange={(vals: any, index: number) => {
            //   let nextState: (string | string[])[] = R.clone(state);
            //   let [y, m, d] = vals;
            //   nextState[key] = `${y}-${String(1 + Number(m)).padStart(2, '0')}-${d.padStart(
            //     2,
            //     '0',
            //   )}`;
            //   console.log(nextState);
            //   onChange(nextState);
            // }}
          >
            <List.Item arrow="horizontal">{prop.title}</List.Item>
          </DatePicker>
        );
      default:
        return prop.title;
    }
  });
}
