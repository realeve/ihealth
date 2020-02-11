import React, { useState, useEffect } from 'react';
import { Button, WingBlank } from 'antd-mobile';
import * as db from '@/utils/db.js';
import { connect } from 'dva';
import * as R from 'ramda';
import { List } from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;

function StatisticPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    db.getCbpc2020NcovWorkStatic().then(res => {
      setList(res.data);
    });
  }, []);

  const [curName, setCurName] = useState('');

  console.log(curName);
  return (
    <div>
      <List renderHeader="各部门信息填写情况" className="my-list">
        {list.map(({ name, value, usernum }) => (
          <Item
            arrow={usernum > 0 ? 'horizontal' : 'empty'}
            key={name}
            multipleLine
            onClick={() => {
              setCurName(name);
            }}
          >
            {name}
            <Brief>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>基础信息: {value} 人</span>
                <span>今日健康上报: {usernum} 人</span>
              </div>
            </Brief>
          </Item>
        ))}
      </List>

      <WingBlank>
        <Button
          style={{ marginTop: 20 }}
          onClick={() => {
            console.log('back');
          }}
        >
          返回
        </Button>
      </WingBlank>
    </div>
  );
}

export default connect(({ common }: any) => ({ ...common }))(StatisticPage);
