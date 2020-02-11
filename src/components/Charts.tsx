import React, { useRef, useEffect, useState } from 'react';
import ReactEcharts from './ECharts';
import * as R from 'ramda';
let color = [
  '#61A5E8',
  '#7ECF51',
  '#E16757',
  '#9570E5',
  '#605FF0',
  '#85ca36',
  '#1c9925',
  '#0d8b5f',
  '#0f9cd3',
  '#2f7e9b',
  '#2f677d',
  '#9b7fed',
  '#7453d6',
  '#3b1d98',
  '#27abb1',
  '#017377',
  '#015f63',
  '#b86868',
  '#5669b7',
  '#e5aab4',
  '#60b65f',
  '#98d2b2',
  '#c9c8bc',
  '#45c3dc',
  '#e17979',
  '#5baa5a',
  '#eaccc2',
  '#ffaa74',
];

const getPie = (data, text) => ({
  // title: {
  //   left: 'center',
  //   text: R.splitEvery(20, text).join('\r\n'),
  //   y: 10,
  // },
  // toolbox: { feature: { saveAsImage: { type: 'png' } } },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  color,
  series: [
    {
      type: 'pie',
      radius: ['40%', '55%'],
      startAngle: 45,
      data: data.filter(item => item.value > 0),
      label: {
        normal: {
          formatter: function(param) {
            return (
              param.name.replace('(', '\n(') +
              '\n(' +
              param.percent.toFixed(2) +
              '%)\n' +
              param.value +
              '人'
            );
          },
        },
      },
    },
  ],
});

const getBar = (data, text) => ({
  // title: {
  //   left: 'center',
  //   text: R.splitEvery(20, text).join('\r\n'),
  //   y: 10,
  // },
  toolbox: { feature: { saveAsImage: { type: 'svg' } } },
  tooltip: {
    trigger: 'item',
  },
  grid: {
    x: 350,
    x2: 100,
  },
  xAxis: {
    type: 'value',
    show: false,
    min: 0,
    // max: 100,
  },
  yAxis: {
    type: 'category',
    data: data.map(item => R.splitEvery(25, item.name).join('\r\n')).reverse(),
  },
  series: [
    {
      type: 'bar',
      label: {
        normal: {
          show: true,
          position: 'right',
          formatter: a => `${a.value}%(${data[a.dataIndex].value}人)`,
        },
      },
      data: data.reverse(),
      barMaxWidth: 20,
    },
  ],
});

export default function RCharts({ data, renderer = 'svg', title, type, ...props }) {
  let echarts_react = useRef();
  let [option, setOption] = useState({});
  useEffect(() => {
    let method = type === 'pie' ? getPie : getBar;
    let chartOption = method(data, title);
    setOption(chartOption);
    return function cleanup() {
      if (echarts_react && echarts_react.dispose) {
        echarts_react.dispose();
      }
    };
  }, [data]);
  return <ReactEcharts ref={echarts_react} option={option} {...props} opts={{ renderer }} />;
}
