#-*- coding: utf-8 -*-
from django.shortcuts import render
from django.core import serializers
import json
import urllib2

def book_list(request):
    url = "http://ekp.kaist.ac.kr/apis/getBooks?q=albumin,%20serum&prev=1&next=10"
    query = urllib2.urlopen(url).read()

    serialized_obj = json.loads(query)

    template = 'book_list.html'
    context = {
        "test" : serialized_obj
    }

    return render(request, template, context)