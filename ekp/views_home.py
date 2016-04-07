#-*- coding: utf-8 -*-
from django.shortcuts import render
import json
import urllib2

def home(request):
    url = 'http://kecidev.kaist.ac.kr:5000/cases'
    query = urllib2.urlopen(url).read()

    serialized_obj = json.loads(query)

    template = 'home.html'
    context = {
        "object" : serialized_obj
    }

    return render(request, template, context)
