import { useState, useEffect } from 'react';
import { authStore } from '../stores/auth.store';
import * as authApi from '../api/auth.api';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<authApi.Organization[]>([]);
  const [organizationsLoading, setOrganizationsLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isSignup) {
      fetchOrganizations();
    }
  }, [isSignup]);

  const fetchOrganizations = async () => {
    setOrganizationsLoading(true);
    try {
      const res = await authApi.getOrganizations();
      setOrganizations(res.data);
    } catch (err: any) {
      message.error('Failed to fetch organizations');
    } finally {
      setOrganizationsLoading(false);
    }
  };

  const handleLogin = async (values: any) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(values);
      authStore.login(res.data.token);
      message.success('Login successful');
      navigate('/');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const res = await authApi.signup(values);
      authStore.login(res.data.token);
      message.success('Account created successfully');
      navigate('/');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f0f2f5' 
    }}>
      <Card 
        style={{ width: '100%', maxWidth: 500 }}
        title={
          <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </div>
        }
      >
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 30 }}>
          {isSignup ? 'Join StockFlow and manage your inventory' : 'Sign in to your StockFlow account'}
        </p>
        
        <Form
          form={form}
          onFinish={isSignup ? handleSignup : handleLogin}
          layout="vertical"
        >
          {isSignup && (
            <Form.Item
              name="organizationId"
              label="Organization"
              rules={[{ required: true, message: 'Please select an organization' }]}
            >
              <Select
                placeholder="Select an organization"
                disabled={isLoading || organizationsLoading}
                loading={organizationsLoading}
              >
                {organizations.map(organization => (
                  <Option key={organization.id} value={organization.id}>
                    {organization.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              type="email"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </Form.Item>

          {isSignup && (
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              rules={[{ required: true, message: 'Please confirm your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
              style={{ height: 48, fontSize: 16 }}
            >
              {isLoading 
                ? (isSignup ? 'Creating Account...' : 'Signing In...') 
                : (isSignup ? 'Sign Up' : 'Login')}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Button
              type="link"
              onClick={() => {
                setIsSignup(!isSignup);
                form.resetFields();
              }}
              disabled={isLoading}
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}