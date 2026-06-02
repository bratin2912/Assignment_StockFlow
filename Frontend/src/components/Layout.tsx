import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { authStore } from '../stores/auth.store';
import { Button, Layout as AntdLayout } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

const { Header, Content } = AntdLayout;

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };

  return (
    <AntdLayout style={{
      minHeight: '100vh', display: 'flex',
      flexDirection: 'row',
    }}>
      <Sidebar />
      <AntdLayout style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header style={{
          background: '#fff',
          borderBottom: '1px solid #e8e8e8',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          height: 64,
          flexShrink: 0
        }}>
          <Button
            onClick={handleLogout}
            type="primary"
            danger
            icon={<LogoutOutlined />}
          >
            Logout
          </Button>
        </Header>
        <Content style={{
          flex: 1,
          margin: '24px',
          padding: 24,
          background: '#f5f5f5',
          borderRadius: 8
        }}>
          <Outlet />
        </Content>
      </AntdLayout>
    </AntdLayout>
  );
}
