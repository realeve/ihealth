import React, { useState } from 'react';
import styles from './index.less';
import SurveyHeader from './header';
import { Tabs, TabBar } from 'antd-mobile';
// import { TabBarPropsType } from 'rmc-tabs';
// import router from 'umi/router';

import Paper from '@/pages/paper';
import Log from '@/pages/Log';
import Statistic from '@/pages/statistic';

import Basic from './img/01_basic.svg';
import BasicA from './img/01_basic_active.svg';
import Health from './img/02_health.svg';
import HealthA from './img/02_health_active.svg';
import Stat from './img/03_statistics.svg';
import StatA from './img/03_statistics_active.svg';

// function renderTabBar(props: TabBarPropsType) {
//   return <Tabs.DefaultTabBar {...props} />;
// }

// import VConsole from 'vconsole';
// var vConsole = new VConsole();

const tabs = [
  {
    title: '基础信息',
    key: 'paper',
    img: Basic,
    active: BasicA,
    render: <Paper />,
  },
  {
    title: '健康状况',
    img: Health,
    active: HealthA,
    key: 'log',
    render: <Log />,
  },
  {
    title: '数据汇总',
    img: Stat,
    active: StatA,
    key: 'statistic',
    render: <Statistic />,
  },
]; //];

interface IPropsLayout {
  location: { pathname: string };
  [key: string]: any;
}
const BasicLayout: (props: IPropsLayout) => React.ReactElement = (props: IPropsLayout) => {
  let { pathname } = props.location;
  // let activeTab = pathname.replace('/', '');

  const [selectedTab, setSelectTab] = useState(tabs[0].key);

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

  // const onTabChange = (_: any, idx: number) => {
  //   switch (idx) {
  //     case 0:
  //       router.push('/paper');
  //       break;
  //     case 1:
  //       router.push('/log');
  //       break;
  //     case 2:
  //     default:
  //       router.push('/statistic');
  //       break;
  //   }
  // };
  if ('/' == pathname) {
    return <div className={styles.app}>{props.children}</div>;
  } else if (['/result', '/new', '/home'].includes(pathname)) {
    return <MainLayout showHeader={pathname === '/home'} />;
  }

  return (
    <div style={{ height: '100%' }}>
      {/* <Tabs
        tabs={tabs}
        renderTab={tab => tab.title}
        tabBarPosition={'top'}
        renderTabBar={renderTabBar}
        onChange={onTabChange}
        initialPage={activeTab}
      >
        <MainLayout />
      </Tabs> */}
      <TabBar unselectedTintColor="#949494" tintColor="#33A3F4" barTintColor="white">
        {tabs.map(item => (
          <TabBar.Item
            title={item.title}
            key={item.key}
            icon={{ uri: item.img }}
            selectedIcon={{ uri: item.active }}
            selected={selectedTab === item.key}
            onPress={() => {
              setSelectTab(item.key);
            }}
            data-seed={item.key}
          >
            <div style={{ marginBottom: 20 }}>{item.render}</div>
          </TabBar.Item>
        ))}
      </TabBar>
    </div>
  );
};
export default BasicLayout;
