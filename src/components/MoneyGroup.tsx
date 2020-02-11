import React, { useState, useEffect } from 'react';
import { List, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import * as R from 'ramda';

const AmountList = `100元
50元
20元
10元
5元
1元（纸币）
1元（硬币）
5角（纸币）
5角（硬币）
1角（纸币）
1角（硬币）`.split(/\n/);

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps: any;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    // onTouchStart: (e: any) => {
    //   e.preventDefault()
    // },
  };
}

export const getTotal: (data: (number)[]) => number = (data: (number)[]) => {
  let amound = [100, 50, 20, 10, 5, 1, 1, 0.5, 0.5, 0.1, 0.1];
  let sum = 0;
  if (R.type(data) != 'Array') {
    return 0;
  }
  data.forEach((item, i) => {
    sum += item * amound[i];
  });
  return Number(sum.toFixed(1));
};

export interface IDataPaycount {
  data: (number | string)[];
  total: number;
}
interface IPropsPaycount {
  title?: string;
  form: any;
  onChange: (e: IDataPaycount) => void;
  [key: string]: any;
}
function PayCount({ title = '', form, onChange, ...rest }: IPropsPaycount) {
  // R.isNil(rest.value[rest.idx])||
  let [state, setState] = useState(
    R.type(rest.value[rest.idx]) != 'Array'
      ? new Array(AmountList.length).fill(0)
      : rest.value[rest.idx],
  );

  let [total, setTotal] = useState(getTotal(state));

  useEffect(() => {
    if (R.isNil(rest.value[rest.idx])) {
      return;
    }
    setState(rest.value[rest.idx]);
  }, [rest.value[rest.idx]]);

  const { getFieldProps } = form;

  const onNumberChange = (v: string, idx: number) => {
    let nextState = R.clone(state);
    nextState[idx] = v;
    nextState = nextState.map(item => (item.length === 0 ? 0 : Number(item)));
    setState(nextState);

    let total = getTotal(nextState);
    setTotal(total);
    // console.log({ data: nextState, total })

    // 取父组件传入的数值
    let nextValue = R.clone(rest.value);
    nextValue[rest.idx] = nextState;
    onChange(nextValue);
  };

  return (
    <div {...rest}>
      <List renderHeader={() => title + ` (总金额:${total}元)`}>
        {AmountList.map((amount, idx) => (
          <InputItem
            key={amount}
            {...getFieldProps('money' + idx, {
              normalize: (v: string, prev: string) => {
                console.log(v);
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
            })}
            value={(state && state[idx]) || 0}
            type="money"
            placeholder="使用张数"
            onChange={v => onNumberChange(v, idx)}
            // onVirtualKeyboardConfirm={(v) => onNumberChange(v, idx)}
            clear
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            autoAdjustHeight
          >
            {amount}
          </InputItem>
        ))}
      </List>
    </div>
  );
}

export default createForm()(PayCount);
