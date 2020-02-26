import React, { useRef, useEffect, useState } from 'react';
import ReactEcharts from './ECharts';
import * as R from 'ramda';
import echarts from 'echarts';
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

const getBar = (data, text) => {
  // console.log(data);

  let res = {};
  let show = {};
  data.forEach((item, idx) => {
    let name = item.name.slice(5, 10);
    let key = item.name.slice(5, 16).replace(' ', '\n');
    if (!res[name]) {
      res[name] = true;
      show[key] = true;
    } else {
      show[key] = false;
    }
  });
  // console.log(JSON.stringify(data), text);

  return {
    title: {
      // left: 'left',
      text,
      x: 10,
      y: 5,
      textStyle: {
        color: '#eee',
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    backgroundColor: 'rgba(0,0,0,0)',
    grid: {
      x: 20,
      x2: 15,
      y: 20,
      y2: 30,
    },
    yAxis: {
      type: 'value',
      // show: true,
      show: false,
      min: 35,
      max: 37.4,
      splitLine: {
        show: false,
      },
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name.slice(5, 16).replace(' ', '\n')),
      axisLabel: {
        color: '#eee',
        formatter(params) {
          if (show[params]) {
            // console.log(params.slice(0, 5));
            return params.slice(0, 5);
          } else {
            return ''; //params.slice(5, 11);
          }
        },
      },
      boundaryGap: false,
    },
    color: ['#CFFFFE'],
    series: [
      {
        type: 'line',
        label: {
          normal: {
            show: true,
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(216,216,216,0.10)',
            },
            {
              offset: 1,
              color: '#6E6CD8',
            },
          ]),
        },
        data: data.map(item => item.value),
        smooth: true,
        // symbol: 'circle',
        symbolSize: 5,
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: '#fbb',
            type: 'dashed',
          },
          label: { show: false },
          data: [
            {
              yAxis: 37.3,
              name: '37.3℃',
            },
          ],
        },
      },
    ],
  };
};

export default function RCharts({ data, renderer = 'svg', title, type, ...props }) {
  let echarts_react = useRef();
  let [option, setOption] = useState({});
  useEffect(() => {
    let method = type === 'pie' ? getPie : getBar;
    let chartOption = method(data, title);
    // console.log(chartOption.xAxis.data);
    setOption(chartOption);
    return function cleanup() {
      if (echarts_react && echarts_react.dispose) {
        echarts_react.dispose();
      }
    };
  }, [data]);
  return <ReactEcharts ref={echarts_react} option={option} {...props} opts={{ renderer }} />;
}
