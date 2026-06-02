import { useState } from 'react';
import type { Product } from '../api/product.api';
import { Table, Button, Input, InputNumber, Tag, Popconfirm, message, Skeleton } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';

interface Props {
  products: Product[];
  onEdit?: (id: string, data: Partial<Product>) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  loading = false,
}: Props) {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});

  const handleEditClick = (product: Product) => {
    setEditingProduct(product.id);
    setEditFormData({ ...product });
  };

  const handleSaveEdit = () => {
    if (editingProduct && onEdit) {
      onEdit(editingProduct, editFormData);
      setEditingProduct(null);
      message.success('Product updated successfully');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const isLowStock = (product: Product) => {
    const threshold = product.lowStockThreshold ?? 5;
    return product.quantityOnHand <= threshold;
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Product) => {
        if (editingProduct === record.id) {
          return (
            <Input
              value={editFormData.name || ''}
              onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          );
        }
        return text;
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (text: string, record: Product) => {
        if (editingProduct === record.id) {
          return (
            <Input
              value={editFormData.sku || ''}
              onChange={(e) => setEditFormData(prev => ({ ...prev, sku: e.target.value }))}
            />
          );
        }
        return text;
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantityOnHand',
      key: 'quantityOnHand',
      render: (value: number, record: Product) => {
        if (editingProduct === record.id) {
          return (
            <InputNumber
              value={editFormData.quantityOnHand || 0}
              onChange={(value) => setEditFormData(prev => ({ ...prev, quantityOnHand: value || 0 }))}
              min={0}
              style={{ width: '100%' }}
            />
          );
        }
        return (
          <Tag color={isLowStock(record) ? 'red' : 'green'}>
            {value}
          </Tag>
        );
      },
    },
    {
      title: 'Selling Price',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      render: (value: number, record: Product) => {
        if (editingProduct === record.id) {
          return (
            <InputNumber
              value={editFormData.sellingPrice || 0}
              onChange={(value) => setEditFormData(prev => ({ ...prev, sellingPrice: value || 0 }))}
              min={0}
              step={0.01}
              style={{ width: '100%' }}
            />
          );
        }
        return typeof value === 'number' ? `$${value.toFixed(2)}` : '-';
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: Product) => (
        <Tag color={isLowStock(record) ? 'red' : 'green'}>
          {isLowStock(record) ? 'Low Stock' : 'In Stock'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => {
        if (editingProduct === record.id) {
          return (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                onClick={handleSaveEdit}
                type="primary"
                size="small"
                icon={<SaveOutlined />}
              >
                Save
              </Button>
              <Button
                onClick={handleCancelEdit}
                size="small"
                icon={<CloseOutlined />}
              >
                Cancel
              </Button>
            </div>
          );
        }

        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              onClick={() => handleEditClick(record)}
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
            >
              Edit
            </Button>
            {onDelete && (
              <Popconfirm
                title="Are you sure you want to delete this product?"
                onConfirm={() => onDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  danger
                  ghost
                  size="small"
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Button>
              </Popconfirm>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '20px 0' }}>
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} style={{ 
            display: 'flex', 
            gap: 16, 
            padding: '16px 0', 
            borderBottom: '1px solid #f0f0f0' 
          }}>
            <div style={{ flex: 2 }}>
              <Skeleton.Input active style={{ width: '80%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Skeleton.Input active style={{ width: '60%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Skeleton.Input active style={{ width: '40%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Skeleton.Input active style={{ width: '50%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Skeleton.Input active style={{ width: '40%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Skeleton.Button active size="small" style={{ marginRight: 8 }} />
              <Skeleton.Button active size="small" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      locale={{
        emptyText: 'No products found',
      }}
    />
  );
}
