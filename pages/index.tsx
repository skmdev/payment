import React from 'react';
import Link from 'next/link';
import { List } from 'antd';

const pageData = [
  {
    name: 'Payment page',
    path: '/payment'
  },
  {
    name: 'Payment Search page',
    path: '/payment/search'
  }
];

export default () => (
  <React.Fragment>
    <h1>Testing route page</h1>
    <List
      itemLayout="horizontal"
      dataSource={pageData}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Link href={item.path}>
              <a>Go</a>
            </Link>
          ]}
        >
          <List.Item.Meta title={item.name} description="" />
        </List.Item>
      )}
    />
  </React.Fragment>
);
