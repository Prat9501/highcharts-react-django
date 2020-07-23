import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {Link} from 'react-router-dom';
import './dashboard.css';
import api from '../../services/api';


export default function Dashboard(){
  const [yearlySales, setYearlySales] = useState({});
  const [yearlyProfit, setYearlyProfit] = useState({});
  const [ageGroup, setAgeGroup] = useState({});
  const [dealType, setDealType] = useState({});
  useEffect(() => {
    getYearlyData();
    getYearlyProfit();
    getAgeGroups();
    getDealTypes();
  }, []);
    
  const getYearlyData = async () => {
    try {
        const response = await api.get('/yearly_sales');
        setYearlySales(response.data);
    } catch (error) {
        console.log(error);
    }
  }

  const getYearlyProfit = async () => {
    try {
      const response = await api.get('/yearly_profit');
      setYearlyProfit(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getAgeGroups = async () => {
    try {
      const response = await api.get('/age_groups');
      setAgeGroup(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getDealTypes = async () => {
    try {
      const response = await api.get('/deal_type');
      setDealType(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const yearly_vehicle_sale = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Yearly Vehicles Sold'
    },
    xAxis: {
      categories: Object.keys(yearlySales),
      title: {
          text: 'Years'
      }
    },
    yAxis: {
      min: 0,
      title: {
          text: 'Vehicles sold'
      }
    },
    series: [
      {
        name: "Vehicles sold",
        data: Object.values(yearlySales)
      }
    ]
  };

  const yearly_gross_profit = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Yearly Gross Profit'
    },
    xAxis: {
      categories: Object.keys(yearlyProfit),
      title: {
          text: 'Years'
      }
    },
    yAxis: {
      min: 0,
      title: {
          text: 'Profit in Rs.'
      }
    },
    series: [
      {
        name: "Profit",
        data: Object.values(yearlyProfit)
      }
    ]
  };

  const age_group = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Age Group wise vehicles sold.'
    },
    xAxis: {
      categories: Object.keys(ageGroup),
      title: {
          text: 'Age Groups'
      }
    },
    series: [
      {
        name: 'Age',
        data: Object.values(ageGroup)
      }
    ]
  };

  const deal_type = {
    title: {
      text: 'Types of deal made'
    },
    xAxis: {
      categories: Object.keys(dealType),
      title: {
          text: 'Type'
      }
    },
    yAxis: {
      min: 0,
      title: {
          text: 'Quantity'
      }
    },
    series: [
      {
        name: "Vehicle category",
        data: Object.values(dealType)
      }
    ]
  };

  return(
    <div>
      <h1>Charts</h1>
      <div className='container'>
          <HighchartsReact highcharts={Highcharts} options={yearly_vehicle_sale} />
          <HighchartsReact highcharts={Highcharts} options={yearly_gross_profit} />
          <HighchartsReact highcharts={Highcharts} options={deal_type} />
          <HighchartsReact highcharts={Highcharts} options={age_group} />
      </div>
      <Link to="/reports"><h2>Go to reports page</h2></Link>
    </div>
  )
}