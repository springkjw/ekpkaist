#-*- coding: utf-8 -*-
from django.shortcuts import render
import json
import urllib2

def book_list(request, keyword, page):
    page_first = int(page) * 6  - 5
    page_last = int(page) * 6

    url = "http://ekp.kaist.ac.kr/apis/getBooks?q=" + keyword.replace(" ", "%20").replace(",", "%20") + "&prev=" + str(page_first) + "&next=" + str(page_last)

    query = urllib2.urlopen(url).read()

    serialized_obj = json.loads(query)

    if serialized_obj['total_doc'] % 6 is 0:
        count = serialized_obj['total_doc']/6 + 1
    else:
        count = serialized_obj['total_doc']/6 + 2

    count_data = divmod(int(page) - 1, 10)

    if divmod(count, 10)[0] != count_data[0]:
        range_data = range(10 * count_data[0] + 1, 10 * count_data[0] + 11)
    else:
        range_data = range(10 * count_data[0] + 1, 10 * count_data[0] + divmod(count - 1, 10)[1] + 1)

    num = (int(page) - 1) * 6

    template = 'book_list.html'
    context = {
        "object" : serialized_obj,
        "range" : range_data,
        "count" : count,
        "num" :num,
        "count_data" : count_data[0],
        "count_mod" : divmod(count, 10)[0],
        "count_1" : (count_data[0]) * 10,
        "count_2" : (count_data[0] + 1) * 10,
        "page" : int(page),
        "keyword" : keyword
    }

    return render(request, template, context)

def book_detail(request, keyword, num):

    url = "http://ekp.kaist.ac.kr/apis/getBooks?q=" + keyword.replace(" ", "%20").replace(",", "%20") + "&prev=" + str(num) + "&next=" + str(num)

    query = urllib2.urlopen(url).read()

    serialized_obj = json.loads(query)

    page = divmod(int(num), 6)[0] + 1

    template = 'book_detail.html'
    context = {
        "object" : serialized_obj,
        "keyword" : keyword,
        "page" : page
    }

    return render(request, template, context)