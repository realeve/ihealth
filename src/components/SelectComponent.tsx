import React from 'react';
import { IQuestion } from '../pages/Paper';
import * as lib from '@/utils/lib';
import * as R from 'ramda';
import { Picker, List } from 'antd-mobile';
// const CheckboxItem = Checkbox.CheckboxItem;
// 使用多选框组件的样式处理单选逻辑

const SelectComponent = function({
  idx: key,
  title,
  data,
  onChange,
  state,
  showErr,
  render = (e: any) => e,
  ...props
}: IQuestion) {
  const onRadioChange = (value: number | string, key: number) => {
    let nextState = R.clone(state);
    nextState[key] = String(value);
    onChange(nextState);
    console.log(value);
  };

  const answerStr = lib.parseAnswer(state, key, title, showErr);

  return (
    // <List renderHeader={answerStr} {...props}>
    // </List>

    <Picker
      data={data.map(label => ({ value: label, label }))}
      cols={1}
      value={[state[key]]}
      onChange={val => onRadioChange((val && val[0]) || '', key)}
    >
      <List.Item arrow="horizontal">{title}</List.Item>
    </Picker>
  );
};
export default SelectComponent;
