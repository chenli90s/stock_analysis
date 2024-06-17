import { Button, Checkbox, Form, Input, message } from 'antd';
import http from '../http';
import { useNavigate } from 'react-router-dom'

function Login() {
  const nav = useNavigate()
  const onFinish = async (values) => {
    // console.log('Success:', values);
    const resp  = await http.post('/userLogin', values)
    // console.log(resp)
    if(resp.code === 200){
      localStorage.setItem('token', resp.data.token)
      nav('/search')
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.warning('不能为空')
  };
  return (<div className='login' style={{display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
    <Form
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
      flex: '1'
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="用户名"
      name="user_name"
      rules={[
        {
          required: true,
          message: '请输入用户名!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="密码"
      name="password"
      rules={[
        {
          required: true,
          message: '请输入密码!',
        },
      ]}
    >
      <Input.Password />
    </Form.Item>

    {/* <Form.Item
      name="remember"
      valuePropName="checked"
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Checkbox>Remember me</Checkbox>
    </Form.Item> */}

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        登录
      </Button>
    </Form.Item>
  </Form>
  </div>
  );
}

export default Login;
