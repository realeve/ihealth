import React from 'react';
import { List, Modal, WhiteSpace, Icon, Button, Toast } from 'antd-mobile';
import { connect } from 'dva';
import styles from './log.less';
import router from 'umi/router';
import * as db from '@/utils/db.js';

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
      <div
        className={styles.new}
        onClick={() => {
          router.push('/new');
        }}
      >
        <Icon size="xs" type="plus" color="#fff" /> 新增个人身体状况
      </div>
      {logs.map(item => (
        <List className={styles.item} key={item.id} renderHeader={() => item.date_name}>
          <Item extra={item.sence}>支付场景</Item>
          <Item extra={item.pay_way}>支付方式</Item>
          <Item extra={item.total}>支付金额</Item>
          <Item extra={item.note}>备注</Item>
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
                          db.delCashSurvey2019Pay({
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
