import { useEffect } from 'react';
import { productStore } from '../stores/product.store';
import { observer } from 'mobx-react-lite';
import { Table, Tag, Card, Badge, Skeleton } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const LowStockPage = observer(() => {
  useEffect(() => {
    productStore.fetchLowStock();
  }, [productStore]);

  const columns = [
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

  if (productStore.isLoadingLowStock) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', margin: 0 }}>Low Stock Products</h1>
          <Skeleton.Button active size="large" style={{ width: 120 }} />
        </div>

        <Card bordered={false}>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', margin: 0 }}>Low Stock Products</h1>
        <Badge
          count={productStore.lowStockProducts.length}
          style={{ backgroundColor: '#ff4d4f', fontSize: 14, borderRadius: 12 }}
        >
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            background: '#fff1f0', 
            padding: '8px 16px', 
            borderRadius: 20,
            border: '1px solid #ffccc7'
          }}>
            <WarningOutlined style={{ color: '#ff4d4f' }} />
            <span style={{ fontSize: 14, fontWeight: 'bold', color: '#ff4d4f' }}>
              {productStore.lowStockProducts.length} products
            </span>
          </span>
        </Badge>
      </div>

      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={productStore.lowStockProducts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
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
  );
});

export default LowStockPage;
