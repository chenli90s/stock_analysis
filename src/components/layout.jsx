import { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
const { Header, Sider, Content } = Layout;
import { Outlet, useNavigate } from 'react-router-dom'
const App = (props) => {
  const { items } = props
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const nav = useNavigate()

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{height: '100vh', background: colorBgContainer}}>
        <div className="logo-vertical" />
        <Menu
          theme="light"
          mode="inline"
          onClick={e=>{
            const res = items.filter(val=>val.key===e.key)
            // console.log(res)
            if(res.length)nav(res[0].path)
          }}
          defaultSelectedKeys={items.filter(val=>val.path===location.pathname).map(val=>val.key)}
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;