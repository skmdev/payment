import React from 'react';
import { Button } from 'antd';
import { a } from '../server/utils';

export default () => (
  <div>
    {a()}
    <Button>Test</Button>
  </div>
);
