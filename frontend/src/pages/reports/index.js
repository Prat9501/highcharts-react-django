import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {Link} from 'react-router-dom';
import './report.css';
import api from '../../services/api';


export default function Dashboard(){
  const [deals, setDeals] = useState({});
  const [profit, setProfit] = useState({});
  const [salesDeals, setSalesDeals] = useState({});
  const [salesProfit, setSalesProfit] = useState({});
  useEffect(() => {
    lastSixMonthData();
    salesTypeData();
  },[])
  
  const lastSixMonthData = async () => {
    try {
        const response = await api.get('/report_data');
        setDeals(response.data.deals)
        setProfit(response.data.profit)
    } catch (error) {
        console.log(error);
    }
  }
  
  const salesTypeData = async () => {
    try {
        const response = await api.get('/sales_type');
        console.log(response);
        setSalesDeals(response.data.deals)
        setSalesProfit(response.data.profit)
    } catch (error) {
        console.log(error);
    }
  }

  const deal_data = []
  Object.keys(salesDeals).forEach((key, val) => {
    deal_data.push({"name": key, "data": salesDeals[key]})})

  const profit_data = []
  Object.keys(salesProfit).forEach((key, val) => {
    profit_data.push({"name": key, "data": salesProfit[key]})})

  const deal = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Number of deals done in last 6 months'
    },
    xAxis: {
      categories: Object.keys(deals),
      title: {
          text: 'Months'
      }
    },
    series: [
      {
        name: 'Number of deals',
        data: Object.values(deals)
      }
    ]
  };

  const gross_profit = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Profit made in last 6 months'
    },
    xAxis: {
      categories: Object.keys(profit),
      title: {
          text: 'Months'
      }
    },
    yAxis: {
      min: 0,
      title: {
          text: 'Profit made in Rs.'
      }
    },
    series: [
      {
        name: "Profit",
        data: Object.values(profit)
      }
    ]
  };

  const sale_type_deal = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Sales Type Deals Made'
    },
    xAxis: {
      categories: [
        "2017-05-31", "2017-06-30", "2017-07-31", 
        "2017-08-31", "2017-09-30", "2017-10-31"
      ],
      title: {
          text: 'Type'
      }
    },
    yAxis: {
      min: 0,
      title: {
          text: 'No. of vehicles'
      },
      labels: {
          overflow: 'justify'
      }
    },
    plotOptions: {
      bar: {
          dataLabels: {
              enabled: true
          }
      }
  },
  legend: {
      layout: 'vertical',
      align: 'center',
      verticalAlign: 'top',
      x: 0,
      y: 50,
      floating: true,
      borderWidth: 1,
      backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
      shadow: true
  },
    series: deal_data
  };

  const sale_type_profit = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Profit by sales type'
    },
    xAxis: {
      categories: [
        "2017-05-31", "2017-06-30", "2017-07-31", 
        "2017-08-31", "2017-09-30", "2017-10-31"
      ],
      title: {
          text: 'Type'
      }
    },
    yAxis: {
      title: {
          text: 'Gross Profit in Rs.'
      },
      labels: {
          overflow: 'justify'
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal'
    }
  },
  legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 230,
      floating: true,
      borderWidth: 1,
      backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
      shadow: true
  },
    series: profit_data
  };

  const age_group_division = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Age group distribution'
    },
    xAxis: {
      categories: ["25 - 34","34 - 50", "50+", "Below 25", "nan"],
      title: {
          text: 'Age Groups'
      }
    },
    yAxis: {
      min: 0,
      title: {
          text: 'No. of vehicles'
      },
      labels: {
          overflow: 'justify'
      }
    },
    plotOptions: {
      bar: {
          dataLabels: {
              enabled: true
          }
      }
  },
  legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 60,
      floating: true,
      borderWidth: 1,
      backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
      shadow: true
  },
    series: 
      [{
          name: "2017-05-31",
          data: [7,21,47,3,8]
      }, {
          name: "2017-06-30",
          data: [12,19,40,1,16]
      }, {
          name: "2017-07-31",
          data: [9,14,30,1,41]
      }, {
          name: "2017-08-31",
          data: [12,23,30,3,36]
      },{
          name: "2017-09-30",
          data: [5,6,8,0,46]
      },{
          name: "2017-10-31",
          data: [0,0,1,1,5]
      }]
  };

  return(
      <div>
          <h1>Report Charts</h1>
          <div className='container'>
              <HighchartsReact highcharts={Highcharts} options={deal}/>
              <HighchartsReact highcharts={Highcharts} options={gross_profit} />
              <HighchartsReact highcharts={Highcharts} options={age_group_division} />
              <HighchartsReact highcharts={Highcharts} options={sale_type_deal} />
              <HighchartsReact highcharts={Highcharts} options={sale_type_profit} />
          </div>
          <Link to="/"><h2>Back to dashboard</h2></Link>
      </div>
  )
}