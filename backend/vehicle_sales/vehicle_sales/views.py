import os
import ast
import json
import pandas as pd
import numpy as np

from django.conf import settings
from django.shortcuts import redirect, render
from django.http import HttpResponse

from datetime import datetime, timedelta, date

path = settings.DATA_ROOT
data_df = pd.read_csv(os.path.join(path, 'data.csv'))
lookup_df = pd.read_csv(os.path.join(path, 'lookup.csv'))
data_df['AccountingDate'] = pd.to_datetime(data_df.AccountingDate)
data_df['BirthDate'] = pd.to_datetime(data_df.BirthDate)

def get_age_groups():
    dt = datetime.now().date()
    data_df['AgeGroup'] =  dt - pd.to_datetime(data_df['BirthDate']).dt.date
    data_df['AgeGroup'] = data_df['AgeGroup']//timedelta(days=365)

    return data_df

def home(request):
    return render(request, 'home.html', {})

def get_yearly_vehicle_sales(request):
    yearly_sales = data_df.groupby(data_df['AccountingDate'].dt.year)['DealNo'].count()
    return HttpResponse(yearly_sales.to_json())
    # return render(request, 'yearly_sales.html', {'data': yearly_sales.to_dict()})

def get_monthly_vehicle_sales_yearly(request):
    monthly_sales = data_df.groupby([(data_df['AccountingDate'].dt.year),(data_df['AccountingDate'].dt.month)])['DealNo'].count()

    return HttpResponse(monthly_sales.to_json())

def get_yearly_gross_profit(request):
    yearly_profit = data_df.groupby(data_df['AccountingDate'].dt.year)['GrossProfit'].agg('sum').round(2)

    return HttpResponse(yearly_profit.to_json())

def get_monthly_gross_profit_yearwise(request):
    monthly_profit = data_df.groupby([(data_df['AccountingDate'].dt.year),(data_df['AccountingDate'].dt.month)])['GrossProfit'].agg('sum').round(2)

    return HttpResponse(monthly_profit.to_json())

def get_types_of_deal_made(request):
    deals_made = data_df.groupby(data_df['DealType'])['DealNo'].count()

    return HttpResponse(deals_made.to_json())

def create_age_groups(request):
    data_df = get_age_groups()

    for index, age in enumerate(data_df['AgeGroup']):
        if str(age) < '25':
            data_df['AgeGroup'][index] = 'Below 25'
        elif '25' < str(age) < '34':
            data_df['AgeGroup'][index] = '25 - 34'
        elif '34' < str(age) < '50':
            data_df['AgeGroup'][index] = '34 - 50'
        elif str(age) == 'nan':
            data_df['AgeGroup'][index] = 'nan'
        elif str(age) > '50':
            data_df['AgeGroup'][index] = '50+'

    age_groups = data_df.groupby(data_df['AgeGroup'])['DealNo'].count()
    return HttpResponse(age_groups.to_json())

def reports_section_data(request):
    report_data = {}
    data = {}
    data_df = get_age_groups()
    df_sorted = data_df.sort_values(by='AccountingDate').set_index("AccountingDate").last('6M') #Retrieves last 6 months data.
    no_of_deals = df_sorted.groupby(pd.Grouper(freq='M'))['DealNo'].count()
    profit = df_sorted.groupby(pd.Grouper(freq='M'))['GrossProfit'].sum().round(2)
    buyer_age_grp = df_sorted.groupby(pd.Grouper(freq='M'))['AgeGroup'].count()

    report_data['deals'] = no_of_deals.to_json()
    report_data['profit'] = profit.to_json()
    report_data['buyer_age_grp'] = buyer_age_grp.to_json()

    for key, value in report_data.items():
        report_data[key] = ast.literal_eval(value)
    for key, value in report_data.items():
        data[key] = {}
        for ts, val in value.items():
            dt = datetime.fromtimestamp(int(ts[:10])).strftime("%Y-%m-%d")
            data[key][dt] = val

    return HttpResponse(json.dumps(data))

def get_sales_type(request):
    data = {}
    data_df = get_age_groups()
    df = pd.merge(data_df, lookup_df)
    df.rename(columns={'Sale Type': 'SaleType_Clean'}, inplace=True)
    df_sorted = df.sort_values(by='AccountingDate').set_index("AccountingDate").last('6M')
    no_of_deals = df_sorted.groupby([(pd.Grouper(freq='M')), (df_sorted['SaleType_Clean'])])['SaleType_Clean'].count()
    profit = df_sorted.groupby([(pd.Grouper(freq='M')), (df_sorted['SaleType_Clean'])])['GrossProfit'].sum().round(2)

    data['deals'] = no_of_deals.groupby('SaleType_Clean').apply(list).to_dict()
    data['profit'] = profit.groupby('SaleType_Clean').apply(list).to_dict()

    return HttpResponse(json.dumps(data))