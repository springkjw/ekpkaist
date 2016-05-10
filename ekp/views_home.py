#-*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
import urllib2
import urllib
import ast
def home(request):
    url = 'http://kecidev.kaist.ac.kr:50000/cases?limit=30'
    query = urllib2.urlopen(url).read()

    serialized_obj = json.loads(query)

    if request.is_ajax():
        if(request.GET.get('id', False)):
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
            if ',' in request.GET['rule_id']:
                serialized_obj_rule_data = []
                for ids in request.GET['rule_id'].split(','):
                    url_rule_data = 'http://kecidev.kaist.ac.kr:50000/rules/' + ids
                    query_rule_data = urllib2.urlopen(url_rule_data).read()
                    serialized_obj_rule_data.append(json.loads(query_rule_data))
            else:
                url_rule_data = 'http://kecidev.kaist.ac.kr:50000/rules/' + request.GET['rule_id']

                query_rule_data = urllib2.urlopen(url_rule_data).read()
                serialized_obj_rule_data = json.loads(query_rule_data)

            keyword = urllib.quote_plus(request.GET['text'].encode('utf-8'))

            try:
                url_book_data = 'http://ekp.kaist.ac.kr/apis/getBooks?q=' + keyword + "&prev=1&next=2"

                query_book_data = urllib2.urlopen(url_book_data).read()
                serialized_obj_book_data = json.loads(query_book_data)
            except ValueError:
                serialized_obj_book_data = {
                    'books': [],
                    'keywords': [],
                    'topics': [],
                    'total_doc': 0
                }

            context = {
                "rule" : serialized_obj_rule_data,
                "book" : serialized_obj_book_data
            }
            return JsonResponse(context)

    else:
        context = {
            "object" : serialized_obj
        }

    template = 'home.html'

    return render(request, template, context)





def home_patient(request, patient, rule):
    url = 'http://kecidev.kaist.ac.kr:50000/cases?limit=30'
    query = urllib2.urlopen(url).read()

    serialized_obj = json.loads(query)

    url_data = 'http://kecidev.kaist.ac.kr:50000/cases/' + patient
    url_test_data = 'http://kecidev.kaist.ac.kr:50000/cases/' + patient + "/tests"
    url_conclusion_data = 'http://kecidev.kaist.ac.kr:50000/cases/' + patient + "/conclusions"
    url_rule_data = 'http://kecidev.kaist.ac.kr:50000/rules/' + rule
    query_data = urllib2.urlopen(url_data).read()
    query_test_data = urllib2.urlopen(url_test_data).read()
    query_conclusion_data = urllib2.urlopen(url_conclusion_data).read()
    query_rule_data = urllib2.urlopen(url_rule_data).read()


    serialized_patient_data = json.loads(query_data)
    serialized_obj_test_data = json.loads(query_test_data)
    serialized_obj_conclusion_data = json.loads(query_conclusion_data)
    serialized_obj_rule_data = json.loads(query_rule_data)

    keyword_data = ''
    for item in serialized_obj_conclusion_data["conclusions"]:
        if item["id"] == int(rule):
            keyword_data = item["text"]

    keyword = urllib.quote_plus(keyword_data.encode('utf-8'))

    url_book_data = 'http://ekp.kaist.ac.kr/apis/getBooks?q=' + keyword + "&prev=1&next=2"
    query_book_data = urllib2.urlopen(url_book_data).read()
    serialized_obj_book_data = json.loads(query_book_data)

    obj_data = []
    object_data = serialized_obj_rule_data['conditions']

    for obj in object_data:
        obj_data.append(obj['component'])

    obj_data = list(set(obj_data))

    template = 'home_patient.html'
    context = {
        "object" : serialized_obj,
        "patient" : patient,
        "rule_id" : int(rule),
        "obj_data" : obj_data,
        "patient_data" : serialized_patient_data,
        "conclusion" : serialized_obj_conclusion_data,
        "rule" : serialized_obj_rule_data,
        "test" : serialized_obj_test_data,
        "book" : serialized_obj_book_data
    }

    return render(request, template, context)