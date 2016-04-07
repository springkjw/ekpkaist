#-*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
import urllib2

def home(request):
    url = 'http://kecidev.kaist.ac.kr:50000/cases?limit=30'
    query = urllib2.urlopen(url).read()

    serialized_obj = json.loads(query)

    if request.is_ajax():
        print request.GET['id']
        url_data = 'http://kecidev.kaist.ac.kr:50000/cases/' + request.GET['id']
        url_test_data = 'http://kecidev.kaist.ac.kr:50000/cases/' + request.GET['id'] + "/tests"
        url_conclusion_data = 'http://kecidev.kaist.ac.kr:50000/cases/' + request.GET['id'] + "/conclusions"

        query_data = urllib2.urlopen(url_data).read()
        query_test_data = urllib2.urlopen(url_test_data).read()
        query_conclusion_data = urllib2.urlopen(url_conclusion_data).read()

        serialized_obj_data = json.loads(query_data)
        serialized_obj_test_data = json.loads(query_test_data)
        serialized_obj_conclusion_data = json.loads(query_conclusion_data)

        context = {
            "patient_data" : serialized_obj_data,
            "test_data" : serialized_obj_test_data,
            "conclusion" : serialized_obj_conclusion_data
        }
        return JsonResponse(context)

    else:
        context = {
            "object" : serialized_obj
        }

    template = 'home.html'

    return render(request, template, context)


def home_patient(request):
    template = 'home_patient.html'
    context = {

    }

    return render(request, template, context)