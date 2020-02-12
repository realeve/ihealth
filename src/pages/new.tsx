import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import styles from './paper.less';
import { paperData, IPaper } from '@/utils/payLog';
import * as db from '@/utils/db.js';
import * as user from '@/utils/user';
import { connect } from 'dva';
import FormComponent from '@/components/FormComponent';
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
    pay[0] = dayjs().format('YYYY/MM/DD HH:mm:ss');
  }
  return pay;
};

function NewPage({ pay, user: initLog, dispatch }: any) {
  const [state, setState]: [TAnswerList, any] = useState(getInitState(pay));

  useEffect(() => {
    setPaper(paperData);
    // 存储答卷
    user.savePaper(state, 'pay');
    dispatch({ type: 'common/setStore', payload: { pay: state } });
  }, [state]);

  const [loading, setLoading] = useState(false);
  const [showErr, setShowErr] = useState(pay.length === 0 ? {} : { msg: '' });

  const [paper, setPaper] = useState(paperData);

  console.log('userInfo:', initLog);

  const onSubmmit = async () => {
    if (loading) {
      // 不重复提交
      return;
    }
    setLoading(true);
    let pay = R.clone(state);

    for (let i = 0; i < paperData.length - 1; i++) {
      if (R.isNil(pay[i]) || pay[i].length === 0) {
        Toast.fail('内容填写不完整', 2);
        setLoading(false);
        return;
      }
    }

    let params = {
      userInfo: initLog,
      pay,
    };

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
        <FormComponent data={paper} onChange={setState} state={state} showErr={showErr} />
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
