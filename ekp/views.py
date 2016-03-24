#-*- coding: utf-8 -*-
from django.shortcuts import render
import json
import urllib2

import math

def book_list(request, keyword, page):
    page_first = int(page) * 6  - 5
    page_last = int(page) * 6

    url = "http://ekp.kaist.ac.kr/apis/getBooks?q=" + keyword + "&prev=" + str(page_first) + "&next=" + str(page_last)

    query = urllib2.urlopen(url).read()

    serialized_obj = json.loads(query)

    if serialized_obj['total_doc']%6 is 0:
        count = serialized_obj['total_doc']/6 + 1
    else:
        count = serialized_obj['total_doc']/6 + 2

    template = 'book_list.html'
    context = {
        "object" : serialized_obj,
        "range" : range(1, count),
        "keyword" : keyword
    }

    return render(request, template, context)