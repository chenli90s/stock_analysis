import { Column } from '@ant-design/plots';

function BarChart(props) {
  const { data } = props
  // console.log(data)
  const config = {
    data,
    xField: val=>{
      // console.log(val)
      return val.date.format('YYYY-MM')
    },
    yField: 'value',
    colorField: 'subject',
    group: true,
    style: {
      // 矩形四个方向的内边距
      // inset: 5,
      // 矩形单个方向的内边距
      // insetLeft:5,
      // insetRight:20,
      // insetBottom:10
      // insetTop:10
    },
  };
  return (
    <div>
       <Column {...config} />
    </div>
  );
}

export default BarChart;
