import React, { useState, useEffect } from 'react';
import { Button, WingBlank, Toast } from 'antd-mobile';
import styles from './paper.less';
import { paperData, IPaper } from '@/utils/paperData';
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

function PaperPage({ basic, hasSubmitted, user: initLog, dispatch, ...rest }: any) {
  const [state, setState]: [TAnswerList, any] = useState(basic);

  const [basicInited, setBasicInited] = useState(false);

  useEffect(() => {
    if (basicInited || basic.lendth === 0) {
      return;
    }
    setBasicInited(true);
    setState(basic);
  }, [basic]);

  useEffect(() => {
    // 存储答卷
    user.savePaper(state, 'basic');
    dispatch({ type: 'common/setStore', payload: { basic: state } });
  }, [state]);

  const [loading, setLoading] = useState(false);
  const [showErr, setShowErr] = useState(basic.length === 0 ? {} : { msg: '' });

  const onSubmmit = async () => {
    if (loading) {
      // 不重复提交
      return;
    }
    setLoading(true);

    let basicInfo: TAnswerList = R.clone(state);

    if (!basicInfo[5]) {
      Toast.fail('基础信息填写不完整', 2);
      setLoading(false);
      return;
    }
    basicInfo[5] = lib.handleProvName(basicInfo[5]);

    let params = {
      basicInfo,
      userInfo: initLog,
    };

    for (let i = 0; i < paperData.length; i++) {
      if (!params.basicInfo[i] || params.basicInfo[i].length === 0) {
        Toast.fail('问卷填写不完整', 2);
        setLoading(false);
        return;
      }
    }

    if (
      !/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(
        params.basicInfo[8],
      )
    ) {
      Toast.fail('联系电话无效', 2);
      setLoading(false);
      return;
    }

    if (!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(params.basicInfo[4])) {
      Toast.fail('身份证信息无效', 2);
      setLoading(false);
      return;
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
            payload: { result: { title: '数据已提交，请勿重复填写', status: 'error' } },
          });
          user.gotoSuccess();
          setLoading(false);
        }
      });
  };

  return (
    <div>
      <div className={styles.content}>
        {/* <div style={{ paddingLeft: 20 }}> 
          {hasSubmitted > 0 && <span>(您已填写)</span>}
        </div> */}

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
  return { ...common };
})(PaperPage);
