#-*- coding: utf-8 -*-
from django.shortcuts import render, HttpResponse
import json
import urllib
import urllib2

# 도서 정보 가져오기
def book_list(request, keyword, page, rel):
    # Pagination 기능 구현
    page_first = int(page) * 6  - 5
    page_last = int(page) * 6

    # 검색한 내용 바탕으로 API 호출
    keyword_quote = urllib.quote_plus(keyword.encode('utf-8'))
    # 검색 타입이 기본이거나 없을 경우
    if rel == 'none' or rel == 'default':
        url = "http://ekp.kaist.ac.kr/apis/getBooks?q=" + keyword_quote + "&prev=" + str(page_first) + "&next=" + str(page_last)
    # 검색 타입이 있을 경우
    else:
        rel_quote = urllib.quote_plus(rel.encode('utf-8'))
        url = "http://ekp.kaist.ac.kr/apis/getBooksbyCLI?q=" + keyword_quote + "&prev=" + str(page_first) + "&next=" + str(page_last) + "&rel=" + rel_quote

    url_paper = "http://ekp.kaist.ac.kr/apis/getPapers?q=" + keyword_quote + "&prev=" + str(page_first) + "&next=" + str(page_last)

    # API에서 받은 데이터 serialize
    query = urllib2.urlopen(url).read()
    query_paper = urllib2.urlopen(url_paper).read()

    serialized_obj = json.loads(query)
    serialized_obj_paper = json.loads(query_paper)

    # 전체 검색 도서수 계산
    if serialized_obj['total_doc'] % 6 is 0:
        count = serialized_obj['total_doc']/6 + 1
    else:
        count = serialized_obj['total_doc']/6 + 2

    count_data = divmod(int(page) - 1, 10)

    # 현재 페이지 계산
    if divmod(count, 10)[0] != count_data[0]:
        range_data = range(10 * count_data[0] + 1, 10 * count_data[0] + 11)
    else:
        range_data = range(10 * count_data[0] + 1, 10 * count_data[0] + divmod(count - 1, 10)[1] + 1)

    num = (int(page) - 1) * 6

    template = 'book_list.html'
    context = {
        "object" : serialized_obj,
        "paper" : serialized_obj_paper,
        "range" : range_data,
        "count" : count,
        "num" :num,
        "count_data" : count_data[0],
        "count_mod" : divmod(count, 10)[0],
        "count_1" : (count_data[0]) * 10,
        "count_2" : (count_data[0] + 1) * 10,
        "page" : int(page),
        "keyword" : keyword,
        "rel" : rel
    }

    return render(request, template, context)

# 도서 상세보기 view
def book_detail(request, keyword, num, rel):
    # 해당 도서에 대해 API 호출
    keyword_quote = urllib.quote_plus(keyword.encode('utf-8'))

    url = "http://ekp.kaist.ac.kr/apis/getBooks?q=" + keyword_quote + "&prev=" + str(num) + "&next=" + str(num)

    query = urllib2.urlopen(url).read()
    # 호출된 API에서 데이터 받은 후 serialize
    serialized_obj = json.loads(query)
    # 뒤로 다시 갈 때를 대비하여 현재 페이지 반환
    page = divmod(int(num), 6)[0] + 1

    if request.is_ajax():
        id = request.GET.get('id')
        isbn = request.GET.get('isbn')

        url_p = "http://ekp.kaist.ac.kr/apis/getdetails?id=" + id + "&isbn=" + isbn
        query_p = urllib2.urlopen(url_p).read()
        serialized_obj_p = json.loads(query_p)

        data_p = {
            "content": serialized_obj_p['book_contents'],
            "book_id": serialized_obj_p['book_id']
        }

        return HttpResponse(json.dumps(data_p), content_type='application/json')

    template = 'book_detail.html'
    context = {
        "object" : serialized_obj,
        "keyword" : keyword,
        "page" : page,
        "rel" : rel
    }

    return render(request, template, context)

# 논문 정보 가져오기
def paper_list(request, keyword, page):
    page_first = int(page) * 6 - 5
    page_last = int(page) * 6

    keyword_quote = urllib.quote_plus(keyword.encode('utf-8'))

    url = "http://ekp.kaist.ac.kr/apis/getPapers?q=" + keyword_quote + "&prev=" + str(page_first) + "&next=" + str(page_last)
    url_book = "http://ekp.kaist.ac.kr/apis/getBooks?q=" + keyword_quote + "&prev=" + str(page_first) + "&next=" + str(page_last)

    query = urllib2.urlopen(url).read()
    query_book = urllib2.urlopen(url_book).read()

    serialized_obj = json.loads(query)
    serialized_obj_book = json.loads(query_book)

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

    template = 'paper_list.html'
    context = {
        "object" : serialized_obj,
        "book": serialized_obj_book,
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

#도서 정렬
def sortedBytype(json_result):
    sort_result = sorted(json_result['books'], reverse=True, key=lambda  x: classifyBytype(x))
    return sort_result

#도서 분류
def classifyBytype(row):
    return json.loads(row['book_contents_stats'])[1]['relations'][0].values()[0]
