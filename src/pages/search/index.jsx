import { useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons'
import './style.less'
import http from '../../http';

function Search() {

  const [tags, setTags] = useState([])
  const [indi, setIndi] = useState([])

  const getTags = async ()=>{
    const resp = await http.get('/indi/getIndiTags')
    console.log(resp)
  }

  const getIndi = async ()=>{
    const resp = await http.get('/indi/selectIndicatorList')
    console.log(resp)
  }

  useEffect(()=>{
    // getTags()
    // getIndi()
  }, [])


  return (
    <div className='search'>
      <div className="input-search">
        <input type="text" />
        <SearchOutlined className='search-icon'/>
      </div>
      <div className="tips">

      </div>
    </div>
  );
}

export default Search;
