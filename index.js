const initMapByDate = () => {
  const mapByDate = {}
  _.times(12, (index) => {
    mapByDate[dayjs().add(index, 'month').format('YYYY-MM')] = []
  })
  return mapByDate
}

const formatEquipmentData = () => {
  equipmentsData.forEach((equipment) => {
    equipment.points.forEach((point) => {
      const date = dayjs(point.lastChange).add(point.changeOilMonth, 'month').format('YYYY-MM')
      if (mapByDate[date]) {
        let oilType = mapByDate[date].find(item => item.oilType === point.oilType)
        if (oilType) {
          oilType = {...oilType, volume: oilType.volume + point.volume, date}
        } else {
          mapByDate[date].push({...point, date})
        }
      }
    })
  })
}

const mapByDate = initMapByDate()

formatEquipmentData()

const chart = echarts.init(document.getElementById('main'))
const dataByOilType = _.groupBy(_.flattenDeep(Object.values(mapByDate)), 'oilType')
const category = Object.keys(dataByOilType)
const series = category.map((cate) => {
  return {
    name: cate,
    type: 'bar',
    barGap: 0,
    barCategoryGap: '30%',
    data: dataByOilType[cate].map((data) => data.volume)
  }
})

const option = {
  title: {
    text: '近一年各月份, 各类型润滑油需求量'
  },
  color: ['#0058a7', '#ff9e00', '#82e7fa'],
  tooltip : {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: category
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    data: Object.keys(mapByDate)
  }],
  yAxis: [{
    type: 'value'
  }],
  series
}

chart.setOption(option);