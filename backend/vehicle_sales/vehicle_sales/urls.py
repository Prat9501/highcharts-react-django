from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from .views import (
    get_yearly_vehicle_sales, home,
    get_yearly_gross_profit, get_types_of_deal_made,
    create_age_groups, get_sales_type,
    get_monthly_vehicle_sales_yearly,
    get_monthly_gross_profit_yearwise,
    create_age_groups, reports_section_data)

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^$', home, name='home'),
    url(r'^yearly_sales/', get_yearly_vehicle_sales, name='get_yearly_sales'),
    url(r'^yearly_profit/', get_yearly_gross_profit, name='get_yearly_profit'),
    url(r'^deal_type/', get_types_of_deal_made, name='deal_type'),
    url(r'^age_groups/', create_age_groups, name='age_group'),
    url(r'^monthly_sales/', get_monthly_vehicle_sales_yearly, name='monthly_sales'),
    url(r'^monthly_profit/', get_monthly_gross_profit_yearwise, name='monthly_profit'),
    url(r'^age_groups/', create_age_groups, name='age_groups'),
    url(r'^report_data/', reports_section_data, name='report_data'),
    url(r'^sales_type/', get_sales_type, name='sales_type'),
]
