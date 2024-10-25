import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

function HeaderDelivery({ title }) {
  return (
    <div className="mb-6">
      <Title level={2}>{title}</Title>
    </div>
  );
}

export default HeaderDelivery;