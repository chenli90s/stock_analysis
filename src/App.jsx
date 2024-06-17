import { ConfigProvider } from 'antd';
import './App.css'
import Router from './router';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear'

dayjs.extend(quarterOfYear)

function App() {

  return (
    <ConfigProvider
    locale={zhCN}
    theme={{
      token: {
        // Seed Token，影响范围大
        colorPrimary: '#f44336',
        borderRadius: 2,

        // 派生变量，影响范围小
        colorBgContainer: '#f6f1f1',
      }
    }}
  >
    {<Router />}
  </ConfigProvider>
  )
}

export default App
