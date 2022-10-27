import { Layout } from 'antd';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

export default function VoidLayout() {
  return (
    <Layout className="layout-page">
      {/* <Content className="layout-page-content">
          <TagsView /> */}
      <Content className="layout-page-content">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </Content>
      {/* </Suspense>
        </Content>
      </Layout> */}
    </Layout>
  );
}
