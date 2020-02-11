import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import styles from './paper.less';
import { paperData, IPaper } from '@/utils/payLog';
import * as db from '@/utils/db.js';
import * as user from '@/utils/user';
import { connect } from 'dva';
import FormComponent from '@/components/FormComponent';
import { getTotal } from '@/components/MoneyGroup';
import * as R from 'ramda';
import dayjs from 'dayjs';
import router from 'umi/router';

// 问题
export interface IQuestion extends IPaper {
  idx: number;
  data: string[];
  subTitle?: string[];
  onChange: Function;
}
export type TAnswer = string;
export type TAnswerList = string[] | string[][];
export interface ILog {
  user: string;
  status: number;
  start_time: string;
}

let getInitState = (pay: string[]) => {
  if (R.isNil(pay[0])) {
    pay[0] = dayjs().format('YYYY-MM-DD HH:mm:ss');
  }
  return pay;
};

function NewPage({ pay, user: initLog, dispatch }: any) {
  const [state, setState]: [TAnswerList, any] = useState(getInitState(pay));
  const onChange = (v: string[] | string[][]) => {
    // if ((v[2] && !(Number(v[2]) > 0 && /^\d+(\.\d{0,2})?$/.test(String(v[2]))) || (Number(v[2]) * 100) % 50 !== 0)) {
    if (v[2] && !(Number(v[2]) >= 0)) {
      //(Number(v[2]) * 100) % 50 === 0 &&
      // 判断：是否是最多两位小数的数字，且最小面额必须是5角的倍数
      // 去掉5毛判断

      Toast.fail('无效的金额', 2);
      return;
    }
    console.log(v);
    setState(v);
  };

  useEffect(() => {
    // 存储答卷
    user.savePaper(state, 'pay');
    dispatch({ type: 'common/setStore', payload: { pay: state } });
  }, [state]);

  const [loading, setLoading] = useState(false);
  const [showErr, setShowErr] = useState(pay.length === 0 ? {} : { msg: '' });

  const [paper, setPaper] = useState(paperData);

  useEffect(() => {
    let nextPaper = paperData;
    if (state[3] != '0') {
      nextPaper = R.remove(4, 3, paperData);
    }

    setPaper(nextPaper);
  }, [state]);

  const onSubmmit = async () => {
    if (loading) {
      // 不重复提交
      return;
    }
    setLoading(true);
    let pay = R.clone(state);

    // return;
    for (let i = 0; i < Math.min(pay.length - 1, 6); i++) {
      if (R.isNil(pay[i]) || pay[i].length === 0) {
        Toast.fail('内容填写不完整', 2);
        setLoading(false);
        return;
      }
    }

    if (pay.length === 5 && R.type(pay[5]) == 'String') {
      pay[5] = pay[4] || '';
      pay[4] = new Array(11).fill(0);
    } else {
      pay[4] = pay[4] || new Array(11).fill(0);
      pay[5] = pay[5] || new Array(11).fill(0);
      pay[6] = R.type(pay[6]) == 'String' ? pay[6] : '';

      // 校验金额输入一致否
      let total = getTotal(pay[4]);
      let totalIncome = getTotal(pay[5]);

      if (pay[3] == '0') {
        // 支付额异常
        let invalidPayNum = total < Number(pay[2]);
        let tips = '';
        if (invalidPayNum) {
          tips = '支付金额不能小于总消费';
        }
        // // 找零金额异常
        // let invalidExtraNum = totalIncome !== Number(pay[5]);
        // if (invalidExtraNum) {
        //   tips = '找零金额无效';
        // }

        // 消费金额 = 支付金额-找零金额
        let invalidConsumeNum = Number(pay[2]) !== total - totalIncome;

        // console.log(pay[2], total, totalIncome);

        if (invalidConsumeNum) {
          tips = '支付金额减找零金额不等于消费金额';
        }

        if (tips.length > 0) {
          Toast.fail(tips, 2);
          setLoading(false);
          return;
        }
      }
    }

    let params = {
      userInfo: initLog,
      pay,
    };
    // console.log(params);

    let id = await db.addPayInfo(params);
    dispatch({
      type: 'common/setStore',
      payload: {
        result: { title: id > 0 ? '提交成功' : '提交失败', status: id > 0 ? 'success' : 'error' },
      },
    });
    if (id) {
      dispatch({ type: 'common/clearPay' });
    }
    user.gotoSuccess();
  };

  return (
    <div>
      <div className={styles.content}>
        <div style={{ paddingLeft: 20, marginBottom: 10 }}>请如实填报个人健康情况</div>
        <FormComponent data={paper} onChange={onChange} state={state} showErr={showErr} />
        <WhiteSpace size="lg" />
      </div>
      {/* {user._dev && !R.isNil(showErr.company_id) && JSON.stringify(showErr).replace(/",/g, '",\n')} */}
      <WingBlank>
        <Button type="primary" onClick={onSubmmit} loading={loading} disabled={loading}>
          提交
        </Button>
        <Button
          style={{ marginTop: 20 }}
          onClick={() => {
            router.push('/log');
          }}
        >
          返回主页
        </Button>
      </WingBlank>
    </div>
  );
}

export default connect(({ common }: any) => ({ ...common }))(NewPage);
