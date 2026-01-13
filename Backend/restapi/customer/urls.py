from django.urls import path
from .views import CustomerAPI, CustomerSignupAPI, CustomerLoginAPI

urlpatterns = [
    path('customer/', CustomerAPI.as_view(), name='uscustomerer-list'),
    path('customer/<int:id>/', CustomerAPI.as_view(), name='usecustomerr-detail'),
    path('customer/signup/', CustomerSignupAPI.as_view(), name='customer-signup'),
    path('customer/login/', CustomerLoginAPI.as_view(), name='customer-login'),
]
