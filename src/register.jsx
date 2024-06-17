import { uniqueId } from 'lodash'
import Login from './pages/login'
import Search from './pages/search'
import Layout from './components/layout';
import Analysis from './admin/analysis';

import { LineChartOutlined } from '@ant-design/icons'

const Register = []

const Admins = []

const add = (path, comp,  childs)=>{
  Register.push({
    path, comp, key: uniqueId(), childs
  })
}

const addAdmin = (name, path, comp, icon)=>{
  Admins.push({
    name, path : '/admin' + path, comp, icon, key: uniqueId()
  })
}

add('/login',  <Login/>, null)
add('/search',  <Search/>, null)


//admin router
addAdmin('分析', '/analysis', <Analysis />, <LineChartOutlined />)


add('/admin', <Layout items={Admins.map(val=>({
  icon: val.icon, 
  label: val.name,
  path: val.path,
  key: val.key}))} />, Admins)
export default Register;

