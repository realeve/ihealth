import React, { useState, useEffect } from 'react';
import { Button, WingBlank } from 'antd-mobile';
import * as db from '@/utils/db.js';
import { connect } from 'dva';
import * as R from 'ramda';
import { List } from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;

function StatisticPage() {
  useEffect(() => {
    db.getCashSurvey2019CommonList().then(res => {
      setList([res.data, [], []]);
    });
  }, []);

  const [curLevel, setCurLevel] = useState(0);

  const [curName, setCurName] = useState([null, null, null]);
  const [list, setList] = useState([[], [], []]);

  useEffect(() => {
    let prevState = R.clone(list);
    switch (curLevel) {
      case 0:
        break;
      case 1:
        prevState[curLevel] = [];
        db.getCashSurvey2019CommonByProv(curName[curLevel]).then(res => {
          prevState[curLevel] = res.data;
          setList(prevState);
        });
        break;
      case 2:
        prevState[curLevel] = [];
        db.getCashSurvey2019Common(curName[curLevel]).then(res => {
          prevState[curLevel] = res.data;
          setList(prevState);
        });
        break;
    }
  }, [curLevel]);
  return (
    <div>
      <List
        renderHeader={() =>
          (curLevel == 0 ? '全国' : curLevel === 1 ? curName[1] : curName[1] + curName[2]) +
          '参与情况汇总'
        }
        className="my-list"
      >
        {list[curLevel].map(({ name, value }) => (
          <Item
            arrow={curLevel < 2 ? 'horizontal' : 'empty'}
            key={name}
            multipleLine
            onClick={() => {
              if (curLevel == 2) {
                return;
              }
              let prevName = R.clone(curName);
              prevName[curLevel + 1] = name;
              setCurName(prevName);
              setCurLevel(curLevel => curLevel + 1);
            }}
          >
            {name} <Brief>{value} 人</Brief>
          </Item>
        ))}
      </List>
      {[1, 2].includes(curLevel) && (
        <WingBlank>
          <Button
            style={{ marginTop: 20 }}
            onClick={() => {
              setCurLevel(curLevel => curLevel - 1);
            }}
          >
            返回
          </Button>
        </WingBlank>
      )}
    </div>
  );
}

export default connect(({ common }: any) => ({ ...common }))(StatisticPage);
