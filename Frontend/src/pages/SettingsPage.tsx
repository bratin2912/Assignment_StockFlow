import { useEffect, useState } from 'react';
import { settingsStore } from '../stores/settings.store';
import { observer } from 'mobx-react-lite';
import { Form, InputNumber, Button, Card, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const SettingsPage = observer(() => {
  const [defaultLowStockThreshold, setDefaultLowStockThreshold] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setIsLoading(true);
    settingsStore.fetchSettings().then(() => {
      if (settingsStore.settings) {
        setDefaultLowStockThreshold(settingsStore.settings.defaultLowStockThreshold);
        form.setFieldsValue({
          defaultLowStockThreshold: settingsStore.settings.defaultLowStockThreshold,
        });
      }
      setIsLoading(false);
    });
  }, []);

  const handleSave = async (values: any) => {
    setIsSaving(true);
    try {
      await settingsStore.updateSettings(values);
      message.success('Settings updated successfully');
    } catch (error) {
      message.error('Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ color: '#8c8c8c' }}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 32 }}>Settings</h1>

      <div style={{ display: 'grid', gap: 24 }}>
        {/* Organization Settings */}
        <Card title="Organization Settings" bordered={false}>
          <Form
            form={form}
            onFinish={handleSave}
            layout="vertical"
            initialValues={{
              defaultLowStockThreshold,
            }}
          >
            <Form.Item
              name="defaultLowStockThreshold"
              label="Default Low Stock Threshold"
              help="Products without a specific low stock threshold will use this default value (in units)."
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="Enter default threshold"
                disabled={isSaving}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSaving}
                icon={<SaveOutlined />}
                size="large"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Account Info */}
        <Card title="Account Information" bordered={false}>
          {settingsStore.settings && (
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: 14, 
                  fontWeight: 'bold', 
                  marginBottom: 8, 
                  color: '#1a1a1a' 
                }}>
                  Organization Name
                </label>
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f5f5f5', 
                  borderRadius: 4,
                  color: '#1a1a1a'
                }}>
                  {settingsStore.settings.name}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: 14, 
                  fontWeight: 'bold', 
                  marginBottom: 8, 
                  color: '#1a1a1a' 
                }}>
                  Current Default Threshold
                </label>
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f5f5f5', 
                  borderRadius: 4,
                  color: '#1a1a1a'
                }}>
                  {settingsStore.settings.defaultLowStockThreshold} units
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: 14, 
                  fontWeight: 'bold', 
                  marginBottom: 8, 
                  color: '#1a1a1a' 
                }}>
                  Account Created
                </label>
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f5f5f5', 
                  borderRadius: 4,
                  color: '#1a1a1a'
                }}>
                  {new Date(settingsStore.settings.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
});

export default SettingsPage;