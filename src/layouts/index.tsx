import React from 'react';
import styles from './index.less';
import SurveyHeader from './header';
import { Tabs } from 'antd-mobile';
import { TabBarPropsType } from 'rmc-tabs';
import router from 'umi/router';

function renderTabBar(props: TabBarPropsType) {
  return <Tabs.DefaultTabBar {...props} />;
}

const tabs = [
  { title: '基础信息', key: 'paper' },
  { title: '健康状况', key: 'log' },
  { title: '数据汇总', key: 'statistic' },
]; //];

interface IPropsLayout {
  location: { pathname: string };
  [key: string]: any;
}
const BasicLayout: (props: IPropsLayout) => React.ReactElement = (props: IPropsLayout) => {
  let { pathname } = props.location;
  let activeTab = pathname.replace('/', '');

  const MainLayout = ({ showHeader = false }) => (
    <div className={styles.app}>
      {showHeader && <SurveyHeader />}
      <div className={styles.container}>{props.children}</div>
      <footer className={styles.footer}>
        <div>成都印钞有限公司</div>
        <div> 2020 &copy; CBPM All Rights Reserved</div>
      </footer>
    </div>
  );

  const onTabChange = (_: any, idx: number) => {
    switch (idx) {
      case 0:
        router.push('/paper');
        break;
      case 1:
        router.push('/log');
        break;
      case 2:
      default:
        router.push('/statistic');
        break;
    }
  };
  if ('/' == pathname) {
    return <div className={styles.app}>{props.children}</div>;
  } else if (['/result', '/new', '/home'].includes(pathname)) {
    return <MainLayout showHeader={pathname === '/home'} />;
  }

  return (
    <div style={{ height: '100%' }}>
      <Tabs
        tabs={tabs}
        renderTab={tab => tab.title}
        tabBarPosition={'top'}
        renderTabBar={renderTabBar}
        onChange={onTabChange}
        initialPage={activeTab}
      >
        <MainLayout />
      </Tabs>
    </div>
  );
};
export default BasicLayout;
