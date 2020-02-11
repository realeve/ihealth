import React, { useState, useEffect } from 'react';
import { IQuestion } from '../pages/paper';
import { List, Picker } from 'antd-mobile';
import * as lib from '@/utils/lib';

const PickerItem = props => (
  <div onClick={props.onClick} style={{ backgroundColor: '#fff', paddingLeft: 15 }}>
    <div
      className="test"
      style={{
        display: 'flex',
        height: '45px',
        lineHeight: '45px',
        position: 'relative',
        borderBottom: 0,
      }}
    >
      <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {props.children}
      </div>
      <div style={{ textAlign: 'right', color: '#888', marginRight: 15 }}>
        {props.value ? props.value : props.extra}
      </div>
    </div>
  </div>
);

export interface ICityItem {
  value?: string;
  label?: string;
  [key: string]: any;
}
export interface IPickerData extends ICityItem {
  children: ICityItem[];
}

const PickerComponent = function({
  idx: key,
  title,
  data,
  onChange,
  state,
  sort,
  length,
  maxLength,
  showErr,
  ...props
}: IQuestion) {
  const [pickerValue, setPickerValue]: [string[], any] = useState(state[key] || ['', '', '']);
  const [curProv, setCurProc]: [string, any] = useState('请选择');

  const [initData, setInitData]: [IPickerData[], any] = useState([]);

  useEffect(() => {
    let nextPicker: IPickerData[] = lib.convertProvinceData(data);
    setInitData(nextPicker);
  }, []);

  return (
    <List renderHeader={title} {...props}>
      <Picker
        title="选择地区"
        extra={curProv}
        data={initData}
        value={pickerValue}
        onOk={v => {
          // 不用转换
          // let provName = lib.getProvName(v, data);
          // setCurProc(provName);
          // onChange(provName === '请选择' ? ['', '', ''] : provName.split(' '));

          setCurProc(v);
          setPickerValue(v);
          onChange(v);
        }}
      >
        <PickerItem>省 / 市 / 区</PickerItem>
      </Picker>
    </List>
  );
};

export default PickerComponent;
