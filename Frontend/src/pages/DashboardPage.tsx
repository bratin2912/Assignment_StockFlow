import { useEffect } from 'react';
import { productStore } from '../stores/product.store';
import { observer } from 'mobx-react-lite';
import { Card, Table, Tag, Skeleton } from 'antd';
import { ShoppingOutlined, DatabaseOutlined, WarningOutlined } from '@ant-design/icons';

const DashboardPage = observer(() => {
  useEffect(() => {
    productStore.fetchDashboardStats();
    productStore.fetchLowStock();
  }, [productStore]);

  const lowStockColumns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantityOnHand',
      key: 'quantityOnHand',
      render: (value: number) => (
        <Tag color="red">{value}</Tag>
      ),
    },
    {
      title: 'Low Stock Threshold',
      dataIndex: 'lowStockThreshold',
      key: 'lowStockThreshold',
      render: (value: number) => value || 5,
    },
  ];

  const statsCards = [
    {
      title: 'Total Products',
      value: productStore.dashboardStats?.totalProducts || 0,
      icon: <ShoppingOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      bgColor: '#e6f7ff',
    },
    {
      title: 'Total Inventory',
      value: productStore.dashboardStats?.totalInventory || 0,
      icon: <DatabaseOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      bgColor: '#f6ffed',
    },
    {
      title: 'Low Stock Items',
      value: productStore.dashboardStats?.lowStockCount || 0,
      icon: <WarningOutlined style={{ fontSize: 24, color: '#faad14' }} />,
      bgColor: '#fff7e6',
    },
  ];

  if (productStore.isLoadingDashboardStats || productStore.isLoadingLowStock) {
    return (
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>Dashboard</h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 16, 
          marginBottom: 32 
        }}>
          {[1, 2, 3].map((index) => (
            <Card key={index} bordered={false} style={{ borderRadius: 8 }}>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Card>
          ))}
        </div>

        <div>
          <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Low Stock Products</h2>
          <Card bordered={false}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>Dashboard</h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: 16, 
        marginBottom: 32 
      }}>
        {statsCards.map((card, index) => (
          <Card key={index} bordered={false} style={{ borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#8c8c8c', fontSize: 14, margin: 0 }}>{card.title}</p>
                <p style={{ fontSize: 32, fontWeight: 'bold', margin: '8px 0 0' }}>{card.value}</p>
              </div>
              <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: 8, 
                background: card.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {card.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Low Stock Products</h2>
        <Card bordered={false}>
          <Table
            columns={lowStockColumns}
            dataSource={productStore.lowStockProducts}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <WarningOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
                  <div>No low stock products found</div>
                  <div style={{ color: '#8c8c8c', marginTop: 8 }}>Your inventory is well-stocked!</div>
                </div>
              ),
            }}
          />
        </Card>
      </div>
    </div>
  );
});

export default DashboardPage;
