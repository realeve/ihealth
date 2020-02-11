import React from 'react';
import styles from './home.less';
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';
import router from 'umi/router';
import { sport } from '@/utils/setting.js';

export default function() {
  const onStart = () => {
    router.push('/paper');
  };

  return (
    <WingBlank className={styles.app}>
      <div className={styles.title}>{sport.title}</div>
      <WhiteSpace />
      <div className={styles['sub-title']}>2020.02</div>
      <WhiteSpace />
      <div className={styles.content}>
        {/* <p style={{ textIndent: 0 }}>尊敬的被访者：</p> */}
        <p>
          为促进公司复工后生产、管理等各项工作的平稳有序开展，保障复工后人员的健康安全，各单位要建立员工健康管理台帐，全面适时掌握复工人员的健康状况，进一步排除异常情况；复工上岗的每名人员必须确认自身身体健康，并于复工上岗的第一天签订《企业员工健康情况申报承诺书》，确保复工的生产安全、员工健康。
        </p>
        <small style={{ color: 'red', textIndent: 0 }}>
          注: 员工必须如实填报，部门做到如实登记。
        </small>
      </div>
      <WhiteSpace />
      <WhiteSpace />
      <Button type="primary" onClick={onStart}>
        我知道了
      </Button>
    </WingBlank>
  );
}
