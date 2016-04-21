#-*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
import urllib2
import urllib

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
            url_rule_data = 'http://kecidev.kaist.ac.kr:50000/rules/' + request.GET['rule_id']

            query_rule_data = urllib2.urlopen(url_rule_data).read()
            serialized_obj_rule_data = json.loads(query_rule_data)

            keyword = urllib.quote_plus(request.GET['text'].encode('utf-8'))

            url_book_data = 'http://ekp.kaist.ac.kr/apis/getBooks?q=' + keyword + "&prev=1&next=2"

            query_book_data = urllib2.urlopen(url_book_data).read()
            serialized_obj_book_data = json.loads(query_book_data)

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





def home_patient(request):
    keyword = u'알부민'
    keyword_quote = urllib.quote_plus(keyword.encode('utf-8'))
    print keyword_quote
    url = "http://ekp.kaist.ac.kr/apis/getBooks?q=" + keyword_quote + "&prev=" + str(10) + "&next=" + str(20)
    url_decode = url.decode('utf-8')
    query = urllib2.urlopen(url).read()

    print type(url)
    print type(url_decode)

    template = 'home_patient.html'
    context = {
        "url" : url,
        "url_decode" : url_decode,
        "query": query
    }

    return render(request, template, context)