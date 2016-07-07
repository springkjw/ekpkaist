#-*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
import urllib2
import urllib


# 종합보기 view
def home(request):
    # 환자 데이터 30개 가져오기
    url = 'http://kecidev.kaist.ac.kr:50000/cases?limit=30'
    query = urllib2.urlopen(url).read()

    # 환자 데이터 serialize
    serialized_obj = json.loads(query)

    if request.is_ajax():
        # 환자 클릭 시 진단 결과 데이터 가져오기
        if(request.GET.get('id', False)):
            # case 데이터
            url_data = 'http://kecidev.kaist.ac.kr:50000/cases/' + request.GET['id']
            # test 데이터
            url_test_data = 'http://kecidev.kaist.ac.kr:50000/cases/' + request.GET['id'] + "/tests"
            # conclusion 데이터
            url_conclusion_data = 'http://kecidev.kaist.ac.kr:50000/cases/' + request.GET['id'] + "/conclusions"

            # 각 데이터 query
            query_data = urllib2.urlopen(url_data).read()
            query_test_data = urllib2.urlopen(url_test_data).read()
            query_conclusion_data = urllib2.urlopen(url_conclusion_data).read()

            # 각 query json으로 변환
            serialized_obj_data = json.loads(query_data)
            serialized_obj_test_data = json.loads(query_test_data)
            serialized_obj_conclusion_data = json.loads(query_conclusion_data)

            context = {
                "patient_data" : serialized_obj_data,
                "test_data" : serialized_obj_test_data,
                "conclusion" : serialized_obj_conclusion_data
            }
            # ajax 결과 반환
            return JsonResponse(context)
        # conclusion 클릭시 rule과 book 데이터 가져오기
        else:
            # rule이 여러 개인 경우
            if ',' in request.GET['rule_id']:
                # 각 rule을 저장
                serialized_obj_rule_data = []
                for ids in request.GET['rule_id'].split(','):
                    url_rule_data = 'http://kecidev.kaist.ac.kr:50000/rules/' + ids
                    query_rule_data = urllib2.urlopen(url_rule_data).read()
                    serialized_obj_rule_data.append(json.loads(query_rule_data))
            # rule이 하나인 경우
            else:
                url_rule_data = 'http://kecidev.kaist.ac.kr:50000/rules/' + request.GET['rule_id']

                query_rule_data = urllib2.urlopen(url_rule_data).read()
                serialized_obj_rule_data = json.loads(query_rule_data)

            # book의 keyword 데이터 가져오기
            keyword = urllib.quote_plus(request.GET['text'].encode('utf-8'))

            # book 데이터 가져오기
            try:
                print keyword
                url_book_data = 'http://ekp.kaist.ac.kr/apis/getBooks?q=' + keyword + "&prev=1&next=2"

                query_book_data = urllib2.urlopen(url_book_data).read()
                serialized_obj_book_data = json.loads(query_book_data)
            # book 데이터가 없는 경우
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
            # rule과 book 데이터 반환
            return JsonResponse(context)

    else:
        context = {
            "object" : serialized_obj
        }

    template = 'home.html'

    return render(request, template, context)


# 상세보기 view
def home_patient(request, patient, rule):
    url = 'http://kecidev.kaist.ac.kr:50000/cases?limit=30'
    query = urllib2.urlopen(url).read()

    serialized_obj = json.loads(query)

    # 특정 환자에 대한 case, test, conclusion, rule, book 데이터 가져오기
    url_data = 'http://kecidev.kaist.ac.kr:50000/cases/' + patient
    url_test_data = 'http://kecidev.kaist.ac.kr:50000/cases/' + patient + "/tests"
    url_conclusion_data = 'http://kecidev.kaist.ac.kr:50000/cases/' + patient + "/conclusions"

    query_data = urllib2.urlopen(url_data).read()
    query_test_data = urllib2.urlopen(url_test_data).read()
    query_conclusion_data = urllib2.urlopen(url_conclusion_data).read()

    serialized_patient_data = json.loads(query_data)
    serialized_obj_test_data = json.loads(query_test_data)
    serialized_obj_conclusion_data = json.loads(query_conclusion_data)

    rule_ids = []
    for obj in serialized_obj_conclusion_data["conclusions"]:
        if obj["id"] == int(rule):
            rule_ids = obj["rule_ids"]

    obj_data = []
    obj_data_ = []
    # rule이 여러개인 경우
    if len(rule_ids) != 1:
        serialized_obj_rule_data = []
        for i in xrange(0, len(rule_ids)):
            url_rule_data = 'http://kecidev.kaist.ac.kr:50000/rules/' + str(rule_ids[i])
            query_rule_data = urllib2.urlopen(url_rule_data).read()
            serialized_obj_rule_data.append(json.loads(query_rule_data))

        for i in xrange(0, len(serialized_obj_rule_data)):
            object_data = serialized_obj_rule_data[i]['conditions']
            for obj in object_data:
                obj_data.append(obj['component'])

        obj_data = list(set(obj_data))

        for item in serialized_obj_rule_data:
            for i in item['conditions']:
                for j in obj_data:
                    if i['component'] is j:
                        data_ = {
                            'component' : j,
                            'attritube' : i['attribute']
                        }
                        obj_data_.append(data_)
    # rule이 하나인 경우
    else:
        url_rule_data = 'http://kecidev.kaist.ac.kr:50000/rules/' + str(rule_ids[0])
        query_rule_data = urllib2.urlopen(url_rule_data).read()
        serialized_obj_rule_data = json.loads(query_rule_data)

        object_data = serialized_obj_rule_data['conditions']

        for obj in object_data:
            obj_data.append(obj['component'])

        obj_data = list(set(obj_data))

        for i in object_data:
            for j in obj_data:
                if i['component'] is j:
                    data_ = {
                        'component' : j,
                        'attritube' : i['attribute']
                    }
                    obj_data_.append(data_)

    keyword_data = ''
    for item in serialized_obj_conclusion_data["conclusions"]:
        if item["id"] == int(rule):
            keyword_data = item["text"]

    keyword = urllib.quote_plus(keyword_data.encode('utf-8'))

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

    template = 'home_patient.html'
    context = {
        "object" : serialized_obj,
        "patient" : patient,
        "rule_id" : int(rule),
        "obj_data" : obj_data_,
        "patient_data" : serialized_patient_data,
        "conclusion" : serialized_obj_conclusion_data,
        "rule" : serialized_obj_rule_data,
        "test" : serialized_obj_test_data,
        "book" : serialized_obj_book_data
    }

    return render(request, template, context)