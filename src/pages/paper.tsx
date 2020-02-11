import React, { useState, useEffect } from 'react';
import { Button, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import styles from './paper.less';
import { paperData, expensesData, IPaper } from '@/utils/paperData';
import * as db from '@/utils/db.js';
import * as user from '@/utils/user';
import * as lib from '@/utils/lib';
import * as R from 'ramda';
import { connect } from 'dva';

import FormComponent from '@/components/FormComponent';

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

function PaperPage({ basic, income, hasSubmitted, user: initLog, dispatch, ...rest }: any) {
  const [state, setState]: [TAnswerList, any] = useState(basic);
  const [state2, setState2]: [TAnswerList, any] = useState(income);

  const [basicInited, setBasicInited] = useState(false);
  const [incomeInited, setIncomeInited] = useState(false);

  useEffect(() => {
    if (basicInited || basic.lendth === 0) {
      return;
    }
    setBasicInited(true);
    setState(basic);
  }, [basic]);

  useEffect(() => {
    if (incomeInited || income.lendth === 0) {
      return;
    }
    setIncomeInited(true);
    setState2(income);
  }, [income]);

  useEffect(() => {
    // 存储答卷
    user.savePaper(state, 'basic');
    dispatch({ type: 'common/setStore', payload: { basic: state } });
  }, [state]);

  useEffect(() => {
    // 存储答卷
    user.savePaper(state2, 'income');
    dispatch({ type: 'common/setStore', payload: { income: state2 } });
  }, [state2]);

  const [loading, setLoading] = useState(false);
  const [showErr, setShowErr] = useState(basic.length === 0 ? {} : { msg: '' });

  const onSubmmit = async () => {
    if (loading) {
      // 不重复提交
      return;
    }
    setLoading(true);

    let basicInfo: TAnswerList = R.clone(state);

    // console.log(basicInfo[2]);

    if (!basicInfo[2]) {
      Toast.fail('问卷填写不完整', 2);
      setLoading(false);
      return;
    }
    basicInfo[2] = lib.handleProvName(basicInfo[2]);

    let params = {
      basicInfo,
      income: R.clone(state2),
      userInfo: initLog,
    };
    if (!params.income[1]) {
      params.income[1] = new Array(11).fill(0);
    }
    if (!params.income[3]) {
      params.income[3] = new Array(11).fill(0);
    }

    for (let i = 0; i < 5; i++) {
      if (!params.basicInfo[i] || params.basicInfo[i].length === 0) {
        Toast.fail('问卷填写不完整', 2);
        setLoading(false);
        return;
      }
    }

    for (let i = 0; i < 3; i++) {
      if (!params.income[i] || params.income[i].length === 0) {
        Toast.fail('问卷填写不完整', 2);
        setLoading(false);
        return;
      }
    }

    db.addBasicInfo(params)
      .then(id => {
        if (id) {
          user.setBasicStatus();
          dispatch({
            type: 'common/setStore',
            payload: { result: { title: '提交成功', status: 'success' } },
          });
          user.gotoSuccess();
        }
      })
      .catch(({ response }) => {
        console.log(response.data);
        if (response.data['Error Message'].includes('1062 Duplicate entry')) {
          // Toast.fail('已经提交数据', 3);
          dispatch({
            type: 'common/setStore',
            payload: { result: { title: '数据已提交，请勿重复提交', status: 'error' } },
          });
          user.gotoSuccess();
          setLoading(false);
        }
      });
  };

  return (
    <div>
      <div className={styles.content}>
        <div style={{ paddingLeft: 20 }}>
          {/* 第一部分 基本情况 */}
          {hasSubmitted > 0 && <span>(您已填写)</span>}
        </div>

        <FormComponent data={paperData} onChange={setState} state={state} showErr={showErr} />
      </div>
      {/* {user._dev && !R.isNil(showErr.company_id) && JSON.stringify(showErr).replace(/",/g, '",\n')} */}
      <WingBlank>
        <Button disabled={hasSubmitted} type="primary" onClick={onSubmmit} loading={loading}>
          提交
        </Button>
      </WingBlank>
    </div>
  );
}

export default connect(({ common }: any) => {
  // console.log(common)
  return { ...common };
})(PaperPage);
