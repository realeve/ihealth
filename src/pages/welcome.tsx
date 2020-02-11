import React from 'react';
import HomeImg from '@/assets/img/main.jpg';
import { Button } from 'antd-mobile';
import router from 'umi/router';

export default function headerPage() {
  const onStart = () => {
    router.push('/home');
  };
  return (
    <div style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <img src={HomeImg} alt="" style={{ width: '100%', height: '100vh' }} />
      <Button
        type="warning"
        onClick={onStart}
        style={{
          position: 'absolute',
          width: 120,
          bottom: '45%',
          left: 0,
          right: 0,
          margin: '0 auto',
          borderRadius: 30,
          opacity: 0.8,
        }}
      >
        开始记录
      </Button>
    </div>
  );
}
