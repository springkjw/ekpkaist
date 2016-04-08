"""ekp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Import the include() function: from django.conf.urls import url, include
    3. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import url
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', 'ekp.views_home.home', name='home'),
    url(r'^patient/', 'ekp.views_home.home_patient', name='home_patient'),

    url(r'^books/(?P<keyword>[\w.\ ]+)/page=(?P<page>\d+)$', 'ekp.views.book_list', name='book_list'),
    url(r'^papers/(?P<keyword>[\w.\ ]+)/page=(?P<page>\d+)$', 'ekp.views.paper_list', name='paper_list'),
    url(r'^book/(?P<keyword>[\w.\ ]+)/num=(?P<num>\d+)$', 'ekp.views.book_detail', name='book_detail'),
]
