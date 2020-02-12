import React from 'react';
import { List, Modal, WhiteSpace, Icon, Button, Toast } from 'antd-mobile';
import { connect } from 'dva';
import styles from './log.less';
import router from 'umi/router';
import * as db from '@/utils/db.js';

import Chart from '@/components/Charts';

const Item = List.Item;
const alert = Modal.alert;

interface ILogItem {
  id: number;
  date_name: string;
  sence: string;
  total: string | number;
  pay_way: string;
  [key: string]: any;
}

function LogPage({
  logs,
  user: { openid },
  ...props
}: {
  logs: ILogItem[];
  user: {
    openid: string;
  };
}) {
  return (
    <div className={styles.content}>
      <Chart
        data={logs
          .slice(0, 8)
          .map(item => ({
            id: item.id,
            name: item.rec_date,
            value: item.temprature,
            remark: item.remark,
          }))
          .sort((a, b) => a.id - b.id)}
        type="line"
        title="个人近期体温记录"
        style={{
          width: '100%',
          height: 250,
          borderRadius: 5,
          margin: '0px 0 30px 0',
          backgroundImage:
            'linear-gradient(-135deg, #874BFF 0%, #6854EE 43%, #6052F2 63%, #534FFA 100%)',
        }}
      />
      <div
        className={styles.new}
        onClick={() => {
          router.push('/new');
        }}
      >
        <Icon size="xxs" type="plus" color="#fff" /> 新增个人身体状况
      </div>
      {logs.map(item => (
        <List className={styles.item} key={item.id} renderHeader={() => item.date_name}>
          <Item extra={item.temprature}>体温</Item>
          <Item extra={item.rec_date.replace('2020-', '')}>测量时间</Item>
          <Item extra={['是', '否'][item.health_info]}>身体状况正常</Item>
          {item.remark.length > 0 && <Item extra={item.remark}>备注</Item>}
          <Item
            extra={
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="warning"
                  size="small"
                  style={{ width: 80 }}
                  onClick={() => {
                    alert('删除', '确定要删除这条记录?', [
                      { text: '取消', onPress: () => {}, style: 'default' },
                      {
                        text: 'OK',
                        onPress: () => {
                          props.dispatch({
                            type: 'setStore',
                            payload: {
                              logs: [],
                            },
                          });
                          db.delCbpc2020NcovWorkLog({
                            userid: openid,
                            _id: item.id,
                          })
                            .catch(e => {
                              Toast.fail('删除失败', 2);
                            })
                            .then(e => {
                              props.dispatch({
                                type: 'common/getPayLog',
                              });
                            });
                        },
                      },
                    ]);
                  }}
                >
                  删除
                </Button>
              </div>
            }
          >
            操作
          </Item>
        </List>
      ))}
      <WhiteSpace size="lg" />
    </div>
  );
}

export default connect(({ common }: any) => ({ ...common }))(LogPage);
