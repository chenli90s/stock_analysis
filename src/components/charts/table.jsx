import { PivotSheet } from '@antv/s2';
import { useEffect, useRef } from 'react';
import { debounce } from 'lodash'

function Table(props) {
  const { data } = props

  const ref = useRef()
  const p = useRef()

  const render = ()=>{
    if(ref.current&&data&&data.length){
      const s2Options = {
        // width: 100,
        // height: 480
      }
      const s2DataConfig = {
        "describe": "标准交叉表数据。",
        fields: {
          rows: ['证券', '指标'],
          columns: ['date'],
          values: ['value']
        }, 
        data: data.map(val=>{
          return {...val, date: val.date.format('YYYY-MM')}
        }), 
        meta: [
          {
            field: '证券',
            name: '证券',
          },
          {
            field: '指标',
            name: '指标',
          },
          {
            field: 'date',
            name: '时间',
          },
          {
            field: 'value',
            name: '金额',
          }
        ]
      }
      const s2 = new PivotSheet(ref.current, s2DataConfig, s2Options);
      s2.render()
      const debounceRender = debounce(async (width, height) => {
        s2.changeSheetSize(width, height)
        await s2.render(false) // 不重新加载数据
      }, 200)
      
      const resizeObserver = new ResizeObserver(([entry] = []) => {
        const [size] = entry.borderBoxSize || [];
        debounceRender(size.inlineSize, size.blockSize)
      });
      
      resizeObserver.observe(p.current);
      
      return ()=>{
        s2.destroy()
      }
    }else{
      return 
    }
  }

  useEffect(()=>{
    return render()
  }, [data])

  return (
    <div className='tb-chart' ref={p} style={{width: '100%', minHeight: 200}}>
      <div className="s2-table" ref={ref}></div>
    </div>
  );
}

export default Table;
