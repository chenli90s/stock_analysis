import { useEffect, useState, useMemo } from 'react';
import http from '../http';
import { Select, Button, Form, Space, DatePicker, Checkbox, Tabs, Tag, Modal, Input, message } from 'antd'
import { debounce, } from 'lodash'
import LineChart from '../components/charts/line';
import BarChart from '../components/charts/bar';
import Table from '../components/charts/table';
import { CloseCircleOutlined } from '@ant-design/icons'



function Analysis() {

  const [ids, setIds] = useState([])

  const [codes, setCodes] = useState([])

  const [indis, setIndis] = useState([])

  const [data, setData] = useState([])

  const [tags, setTags] = useState([])

  const [currentTag, setCurrentTag] = useState()

  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState([])

  const getIds = async () => {
    const resp = await http.get('/indi/selectIndicatorList')
    if (resp.code === 200) {
      // console.log(resp.data)
      setIds(resp.data.indicatorLists ? resp.data.indicatorLists : [])
    }
  }

  const getTag = async ()=>{
    const resp = await http.get('/indi/getIndiTags')
    console.log(resp)
    if(resp.code === 200 && resp.data && resp.data.indicatorTags){
      setTags(resp.data.indicatorTags)
    }else{
      setTags([])
    }
  }

  useEffect(() => {
    // getIds()
    getTag()
  }, [])

  const trans = resp => {
    const opts = []
    if (resp.code === 200 && resp.data.keyValues) {
      resp.data.keyValues.forEach(element => {
        opts.push({
          label: element.value,
          value: element.key,
        })
      });
    }
    return opts
  }

  const searchCode = useMemo(() => {
    // console.log(value)
    const filter = async value => {
      // if(!value)setOptions([])
      if (!value) {
        setCodes([])
        return
      }
      const resp = await http.get('/indi/getSecList', { para: value })
      // console.log(resp)
      setCodes(trans(resp))
    }
    return debounce(filter, 800)
  }, [])

  const searchIndi = useMemo(() => {
    // console.log(value)
    const filter = async value => {
      if (!value) {
        setIndis([])
        return
      }
      const resp = await http.get('/indi/getIndiList', { para: value.toLocaleUpperCase() })
      setIndis([...indis, ...trans(resp)])
    }
    return debounce(filter, 800)
  }, [])



  const onFinish = async values => {
    console.log(values)
    const resp = await http.put('/indi/getIndicators01', {
      "item_ids": values.indis,
      "mode": values.mode ? 'YoY' : null,
      "quarter": values.date.quarter(),
      "sec_codes": values.codes,
      "year": values.date.year()
    })
    // console.log(resp)
    function fixData(data){
      const fixs = []
      const items = ['v00', 'v01', 'v02', 'v03', 'v04', 'v05', 'v06', 'v07', 'v08', 'v09', 'v10', 'v11', 'v12', 'v13', 'v14', 'v15', 'v16', 'v17', 'v18', 'v19']
      for (let index = 0; index < items.length; index++) {
        const key = items[index];
        fixs.push({
          value: data[key],
          subject: data['sec_name'] + ':' + data['item_name'],
          date: values.date.subtract(index +1, 'Q').startOf('month'),
          证券: data['sec_name'], 
          指标: data['item_name']
        })
      }
    
      return fixs
    }
    if(resp.code === 200 && resp.data.indicatorData01s){
      const dts = resp.data.indicatorData01s.map(fixData)
      const tmp = []
      for (let index = 0; index < dts.length; index++) {
        const element = dts[index];
        for (let index = 0; index < element.length; index++) {
          const item = element[index];
          tmp.push(item)
        }
      }
      setData(tmp)
    }else{
      setData([])
    }
  }


  const items = [
    {
      key: 'line',
      label: '线图',
      children: <LineChart data={data} />
    },
    {
      key: 'bar',
      label: '柱状图',
      children: <BarChart data={data} />
    },
    {
      key: 'table',
      label: '表格',
      children: <Table data={data} />
    },
  ]

  const save = async()=>{
    if(!name)return
    const resp = await http.post('/indi/saveIndiTag', {
        "subject_ids": form.getFieldValue('indis'),
        "tag_name": name,
      }
    )
    if(resp.code===200){
      message.success('保存成功')
      setName('')
      setIsModalOpen(false)
      getTag()
    }
  }

  return (
    <div className='analysis'>
      <Space>
        {
          tags.map(item=>{
            return <Tag key={item.id} color={currentTag && currentTag.id === item.id ? '#87d068' : ''} 
            // closeIcon={<CloseCircleOutlined />} 
            onClick={()=>{
              setCurrentTag(item)
              form.setFieldValue('indis', item.subject_ids)
              // console.log(form.getFieldsValue())
            }}
            onClose={()=>{

            }}
            >{item.tag_name}</Tag>
          })
        }
      </Space>
      <div style={{height: 10}}></div>
      <Form
        name="basic"
        form={form}
        labelCol={{
          span: 2,
        }}
        wrapperCol={{
          span: 22,
        }}
        style={{
          maxWidth: '100%',
          flex: '1'
        }}
        // initialValues={{
        //   remember: true,
        // }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        // autoComplete="off"
      >
        <Form.Item
          label="证券"
          name="codes"
          rules={[
            {
              required: true,
              message: '请输入证券!',
            },
          ]}
        >
          <Select mode="multiple" allowClear style={{
            width: '100%',
          }} onSearch={searchCode}
            options={codes}
            filterOption={false}
          />
        </Form.Item>

        <Form.Item
          label="指标"
          name="indis"
          rules={[
            {
              required: true,
              message: '请输入指标!',
            },
          ]}
        >
          <Select mode="multiple" allowClear style={{
            width: '100%',
          }} onSearch={searchIndi}
            options={indis}
            filterOption={false}
          />
        </Form.Item>

        <Form.Item
          label="时间"
          name="date"
          rules={[
            {
              required: true,
              message: '请输入时间!',
            },
          ]}
        >
          <DatePicker placeholder='请输入时间' picker="quarter" />
        </Form.Item>

        <Form.Item
          label="同比"
          name="mode"
          valuePropName="checked"
          wrapperCol={{
            offset: 0,
            span: 24,
          }}
        >
      <Checkbox></Checkbox>
    </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 20,
            span: 4,
          }}
        >
          <Space>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>

            <Button type="primary" onClick={()=>form.getFieldValue('indis') && setIsModalOpen(true)}>
              保存
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Tabs defaultActiveKey="1" items={items} destroyInactiveTabPane/>
      <Modal title="创建标签" open={isModalOpen} onOk={save} onCancel={()=>setIsModalOpen(false)}>
        标签名称：<Input value={name} onChange={e=>{
          // console.log(e)
          setName(e.target.value)
        }}></Input>
      </Modal>
    </div>
  );
}

export default Analysis;
