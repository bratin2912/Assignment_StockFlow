import { useState } from 'react';
import type { CreateProductInput } from '../api/product.api';
import { Form, Input, InputNumber, Button, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

interface ProductFormProps {
  onSubmit: (data: CreateProductInput) => void;
  loading?: boolean;
}

const ProductForm = ({ onSubmit, loading = false }: ProductFormProps) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
      message.success('Product created successfully');
    } catch (error) {
      message.error('Error creating product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      initialValues={{
        quantityOnHand: 0,
        costPrice: 0,
        sellingPrice: 0,
        lowStockThreshold: 5,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          name="sku"
          label="SKU"
          rules={[{ required: true, message: 'Please enter SKU' }]}
        >
          <Input placeholder="Enter SKU" />
        </Form.Item>

        <Form.Item
          name="quantityOnHand"
          label="Quantity On Hand"
          rules={[{ required: true, message: 'Please enter quantity' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
        </Form.Item>

        <Form.Item
          name="lowStockThreshold"
          label="Low Stock Threshold"
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="5" />
        </Form.Item>

        <Form.Item
          name="costPrice"
          label="Cost Price"
        >
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} placeholder="0.00" />
        </Form.Item>

        <Form.Item
          name="sellingPrice"
          label="Selling Price"
        >
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} placeholder="0.00" />
        </Form.Item>
      </div>

      <Form.Item
        name="description"
        label="Description"
      >
        <Input.TextArea rows={3} placeholder="Enter product description" />
      </Form.Item>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <Button
          onClick={() => form.resetFields()}
          icon={<CloseOutlined />}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading || isLoading}
          icon={<SaveOutlined />}
        >
          {loading || isLoading ? 'Creating...' : 'Create Product'}
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;