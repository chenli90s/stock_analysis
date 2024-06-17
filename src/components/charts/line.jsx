import { Line } from '@ant-design/charts'
function LineChart(props) {
  const {data} = props
  const config = {
    data,
    xField: val=>{
      // console.log(val)
      return val.date.toDate()
    },
    yField: 'value',
    colorField: 'subject',
    // seriesField: 'division',
  };
  return (
    <div className='chart'>
      <Line {...config} />
    </div>
  );
}

export default LineChart;
