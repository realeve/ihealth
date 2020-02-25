import React, { useState, useEffect } from 'react';
import { Button, WingBlank, Toast } from 'antd-mobile';
import * as db from '@/utils/db.js';
import { connect } from 'dva';
import * as R from 'ramda';
import { List } from 'antd-mobile';
import * as lib from '@/utils/lib';

const Item = List.Item;
const Brief = Item.Brief;

function StatisticPage(props) {
  const [list, setList] = useState([]);

  useEffect(() => {
    db.getCbpc2020NcovWorkStatic().then(res => {
      setList(res.data);
    });
  }, []);

  const [cur, setCur] = useState(0);
  const [curName, setCurName] = useState('各部门');

  const [dept, setDept] = useState([]);
  useEffect(() => {
    if (curName === '各部门') {
      return;
    }
    db.getCbpc2020NcovWorkTemprature(curName).then(res => {
      setDept(res.data);
    });
  }, [curName]);

  return (
    <div>
      <List renderHeader={`${curName}信息填写情况(${lib.today()})`} className="my-list">
        {curName === '各部门' &&
          list.map(({ name, value, usernum }) => (
            <Item
              arrow={usernum > 0 ? 'horizontal' : 'empty'}
              key={name}
              multipleLine
              onClick={() => {
                if (props.basic[0] !== name) {
                  Toast.fail('只允许查看本部门信息', 2);
                  return;
                }

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
        {curName !== '各部门' &&
          dept.map(({ workname, username, temprature }, idx) => (
            <Item key={idx + username} multipleLine>
              {idx + 1}.{username}
              <Brief>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{workname}</span>
                  <span>
                    {temprature}
                    {temprature.length > 0 ? '℃' : '未填写'}
                  </span>
                </div>
              </Brief>
            </Item>
          ))}
      </List>

      <WingBlank>
        <Button
          style={{ marginTop: 20 }}
          onClick={() => {
            setCurName('各部门');
          }}
          disabled={curName === '各部门'}
        >
          返回
        </Button>
      </WingBlank>
    </div>
  );
}

export default connect(({ common }: any) => ({ ...common }))(StatisticPage);
