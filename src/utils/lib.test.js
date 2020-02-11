import * as lib from './lib';
import * as R from 'ramda';
import paper from './paperData';
test('字母表', () => {
  let alpha = lib.alphaRange;
  expect(R.head(alpha)).toBe('A');
  expect(R.last(alpha)).toBe('Z');
});

test('表单结构处理', () => {
  let paper = [
    {
      title: 'a',
      data: ` b
    c`,
    },
  ];
  expect(lib.handlePaper(paper)).toMatchObject([
    {
      title: 'a',
      data: ['b', 'c'],
    },
  ]);
  expect(
    lib.handlePaper([
      {
        title: 'a',
        data: ['b', 'c'],
        subTitle: ` b
    c`,
      },
    ]),
  ).toMatchObject([
    {
      title: 'a',
      data: ['b', 'c'],
      subTitle: ['b', 'c'],
    },
  ]);
});

test('答案转换', () => {
  expect(lib.parseAnswer(['0'], 0)).toBe(' ( A ) ');
  expect(lib.parseAnswer([['0', '1']], 0)).toBe(' ( A,B ) ');
  expect(lib.parseAnswer([['0', '1']], 1)).toBe(' (  ) ');
});

test('多选答案处理', () => {
  expect(lib.handleMultipleChange([['0', '1']], 0, 0)).toMatchObject([['1']]);
  expect(lib.handleMultipleChange([['0', '1']], 3, 0)).toMatchObject([['0', '1', '3']]);
  expect(lib.handleMultipleChange([['0', '1']], 3, 3)).toMatchObject([
    ['0', '1'],
    undefined,
    undefined,
    ['3'],
  ]);
  expect(lib.handleMultipleChange([['0', '1'], '1'], 3, 1)).toMatchObject([['0', '1'], '3']);
  expect(lib.handleMultipleChange([['0', '3']], 1, 0, false)).toMatchObject([['0', '3', '1']]);
  expect(lib.handleMultipleChange([['0', '1', '2']], 2, 0, false, 2, 2)).toMatchObject([
    ['0', '1'],
  ]);
});

test('ymd', () => {
  expect(lib.now()).toHaveLength(19);
  expect(lib.ymd()).toHaveLength(8);
});

test('数据转换', () => {
  let res = lib.getParams(
    [
      '0',
      '2',
      '3',
      '2',
      '1',
      '2',
      '1',
      '2',
      '2',
      '0',
      '2',
      '1',
      '1',
      '1',
      ['1', '2'],
      ['0', '2'],
      ['1', '2', '3'],
      ['2', '3'],
      ['2', '5', '9'],
      ['2', '5', '8'],
      ['3', '5', '8'],
      ['0', '2'],
      '0',
      ['2', '4'],
      '2',
      ['2', '4', '7'],
      '3',
      '2',
      '1',
      ['2', '5', '8'],
      ['1', '3', '8'],
      '12',
      '21',
      '0',
      '21',
      '1',
      '1',
    ],
    {
      user: '02fd25fa-4782-56f6-a0e2-4472c369b8d4',
      start_time: '2019',
    },
    paper,
  );
  expect(res).toMatchObject({
    company_id: '1',
    remark_1: '12',
    remark_10: '',
    remark_2: '21',
    remark_3: '21',
    remark_4: '1',
    remark_5: '',
    remark_6: '',
    remark_7: '',
    remark_8: '',
    remark_9: '',
    start_time: '2019',
    uuid: '02fd25fa-4782-56f6-a0e2-4472c369b8d4',
    vote_detail:
      '["0","2","3","2","1","2","1","2","2","0","2","1","1","1",["1","2"],["0","2"],["1","2","3"],["2","3"],["2","5","9"],["2","5","8"],["3","5","8"],["0","2"],"0",["2","4"],"2",["2","4","7"],"3","2","1",["2","5","8"],["1","3","8"],"","","0","","1",""]',
  });

  expect(
    lib.getParams(
      [
        '',
        '2',
        '3',
        '2',
        '1',
        '2',
        '1',
        '2',
        '2',
        '',
        '2',
        '1',
        '1',
        '1',
        ['1', '2'],
        ['0', '2'],
        [],
        ['2', '3'],
        ['2', '5', '9'],
        ['2', '5', '8'],
        ['3', '5', '8'],
        ['0', '2'],
        '0',
        ['2', '4'],
        '2',
        ['2', '4', '7'],
        '3',
        '2',
        '1',
        ['2', '5', '8'],
        ['1', '3', '8'],
        '12',
        undefined,
        '0',
        undefined,
        '1',
        undefined,
      ],
      {
        user: '02fd25fa-4782-56f6-a0e2-4472c369b8d4',
        start_time: '2019',
      },
      paper,
    ),
  ).toBeFalsy();
});

test('store存储测试', () => {
  expect(lib.setStore({ a: 1 }, { payload: { b: 2 } })).toEqual({
    a: 1,
    b: 2,
  });
  expect(lib.setStore({ a: 1 }, { payload: { b: 2, c: 2 } })).toEqual({
    a: 1,
    b: 2,
    c: 2,
  });
  expect(lib.setStore({ a: 1 }, { payload: { a: 2 } })).toEqual({ a: 2 });

  expect(lib.setStore({ a: { b: 2 } }, { payload: { a: { b: 3, c: 2 } } })).toEqual({
    a: { b: 3, c: 2 },
  });

  // throw error报错
  // expect(lib.setStore({ a: 1 }, { b: 2 })).toThrow(/payload/);
  expect(lib.setStore({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
});
