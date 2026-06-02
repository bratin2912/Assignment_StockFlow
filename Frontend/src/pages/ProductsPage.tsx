import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import { productStore } from '../stores/product.store';
import { Button, Card, Input } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

function ProductsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    productStore.fetchProducts(searchTerm);
  }, [searchTerm]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', margin: 0 }}>Products</h1>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          type="primary"
          icon={<PlusOutlined />}
          size="large"
        >
          {showAddForm ? 'Cancel' : 'Add Product'}
        </Button>
      </div>

      {showAddForm && (
        <Card style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 24 }}>Add New Product</h2>
          <ProductForm onSubmit={(data) => {
            productStore.createProduct(data)
              .then(() => {
                productStore.fetchProducts(searchTerm);
                setShowAddForm(false);
              })
              .catch((error) => {
                console.error('Error creating product:', error);
              });
          }} />
        </Card>
      )}

      <div style={{ marginBottom: 24 }}>
        <Input.Search
          placeholder="Search by product name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
        />
      </div>

      <ProductTable
        products={productStore.products}
        onEdit={(id, data) => {
          productStore.updateProduct(id, data)
            .then(() => {
              productStore.fetchProducts(searchTerm);
            })
            .catch((error) => {
              console.error('Error updating product:', error);
            });
        }}
        onDelete={(id) => {
          productStore.deleteProduct(id)
            .then(() => {
              productStore.fetchProducts(searchTerm);
            })
            .catch((error) => {
              console.error('Error deleting product:', error);
            });
        }}
        loading={productStore.isLoadingProducts}
      />
    </div>
  );
}

export default observer(ProductsPage);
