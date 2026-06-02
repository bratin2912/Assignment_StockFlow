import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { DashboardOutlined, ShoppingOutlined, WarningOutlined, SettingOutlined } from '@ant-design/icons';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: '/low-stock',
      icon: <WarningOutlined />,
      label: <Link to="/low-stock">Low Stock</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ];

  return (
    <div style={{ 
      width: 256, 
      height: '100vh',
      borderRight: '1px solid #e8e8e8',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8e8e8' }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>StockFlow</h1>
        <p style={{ fontSize: 12, color: '#8c8c8c', margin: '4px 0 0' }}>Inventory Management</p>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ 
          flex: 1,
          borderRight: 0,
          background: 'transparent'
        }}
      />
    </div>
  );
}
