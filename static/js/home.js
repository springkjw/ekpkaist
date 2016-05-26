var data_id = '';
var client_id = '';
var conclusion_id = '';
var rule_id = '';

$(function() {
        var data = $.persist('home');
        var data_ = $.cookie('data_');
        if(data) {
            data_id = data.data_id;
            $('body').html(data.html);
            $('input[name="daterange"]').val(data.date_data);
            $.ajax({
                url : '/',
                data : {
                    id: data_id
                },
                success : function(data) {
                    var hospital = data.patient_data.clinic.name;
                    var office = data.patient_data.office.name;
                    var receipt_num = data.patient_data.receipt_number;
                    var name = data.patient_data.patient.name;
                    var sex;
                    if(data.patient_data.patient.sex == 'male') {
                        sex = '남';
                    }else {
                        sex = '여';
                    }
                    var age = data.patient_data.patient.age;

                    //$('.record_date_data').val(record_date);
                    $('.hospital_data').val(hospital);
                    $('.office_data').val(office);
                    $('.receipt_num_data').val(receipt_num);
                    $('.name_data').val(name);
                    $('.sex_data').val(sex);
                    $('.age_data').val(age);
                }
            });
        }else if(data_) {
            data_ = $.parseJSON(data_);
            var date_data_ = data_.date_data;
            var data_id_ = data_.client_id;

            $('input[name="daterange"]').val(date_data_);
            $('.patient_info tr .date').each(function() {
                if($(this).text() == date_data_) {
                    $(this).parent().css('display', 'table-row');
                }else {
                    $(this).parent().css('display', 'none');
                }
            });
            $('.patient_info tr').each(function() {
                if($(this).attr('data-id') == data_id_) {
                    $(this).addClass('active');
                }
            });
            $.ajax({
                url : '/',
                data : {
                    id: data_id_
                },
                success : function(data) {
                    client_id = data.patient_data.id;
                    var hospital = data.patient_data.clinic.name;
                    var office = data.patient_data.office.name;
                    var receipt_num = data.patient_data.receipt_number;
                    var name = data.patient_data.patient.name;
                    var sex;
                    if(data.patient_data.patient.sex == 'male') {
                        sex = '남';
                    }else {
                        sex = '여';
                    }
                    var age = data.patient_data.patient.age;

                    //$('.record_date_data').val(record_date);
                    $('.hospital_data').val(hospital);
                    $('.office_data').val(office);
                    $('.receipt_num_data').val(receipt_num);
                    $('.name_data').val(name);
                    $('.sex_data').val(sex);
                    $('.age_data').val(age);

                    getTest(data);
                    conclusion(data);
                    $('.conclusion').css('display', '');

                    if(data_.conclusion_id) {
                        $('.conclusion .conclusion_content').each(function() {
                            if($(this).attr('data-id') == data_.conclusion_id) {
                                $(this).children('.content').trigger('click');
                            }
                        });
                    }

                    $.removeCookie('data_', { path : '/' });
                }
            });
        }else{
            alert('접수 일자를 선택해 주세요.');
        }

        $('input[name="daterange"]').daterangepicker(
            {
                format: 'YYYY-MM-DD',
                startDate: '2016-05-01',
                singleDatePicker: true
            }
        );

        $('#daterange').on('apply.daterangepicker', function(ev, picker) {
            var date = picker.startDate.format('YYYY-MM-DD');

            $('.patient_info tr .date').each(function() {
                if($(this).text() == date) {
                    $(this).parent().css('display', 'table-row');
                }else {
                    $(this).parent().css('display', 'none');
                }
            });
        });

        $('.create_conclusion').on('click', function() {
            $('.conclusion').css('display', '');
        });

        $('.add_rule').on('click', function() {
            if(client_id != '' && conclusion_id != '') {
                var rds_add_url = 'http://ekp.kaist.ac.kr/rdr-web/index.htm?clientId=' + client_id + '&conclusionId=' + conclusion_id + '&kaMode=add';
                window.open(rds_add_url);
            }else {
                alert('환자 또는 소견을 선택해주세요.');
            }
        });

        $('.edit_rule').on('click', function() {
            if(client_id != '' && conclusion_id != '') {
                var rds_edit_url = 'http://ekp.kaist.ac.kr/rdr-web/index.htm?clientId=' + client_id + '&conclusionId=' + conclusion_id + '&kaMode=edit';
                window.open(rds_edit_url);
            }else {
                alert('환자 또는 소견을 선택해주세요.');
            }
        });

        $('.delete_rule').on('click', function() {
            if(client_id != '' && conclusion_id != '') {
                var rds_delete_url = 'http://ekp.kaist.ac.kr/rdr-web/index.htm?clientId=' + client_id + '&conclusionId=' + conclusion_id + '&kaMode=delete';
                window.open(rds_delete_url);
            }else {
                alert('환자 또는 소견을 선택해주세요.');
            }
        });

        $('.descriptive').on('click', function() {
            if(client_id != '' && rule_id != '') {
                if(/,/i.test(rule_id)) {
                    var newName;
                    var rule_id_ = rule_id.split(',');
                    for(var i = 0; i < rule_id_.length; i++) {
                        newName = 'rds' + rule_id_[i];
                        var descriptive_url_ = 'http://143.248.91.197:8080/front/reasoning.jsp?params=' + client_id + '&params=' + rule_id_[i];
                        window.open(descriptive_url_, newName);
                    }
                }else{
                    var descriptive_url;
                    descriptive_url = 'http://143.248.91.197:8080/front/reasoning.jsp?params=' + client_id + '&params=' + rule_id;
                    window.open(descriptive_url);
                }
            }
        });

        $('.refresh').on('click', function() {
            location.reload();
        });

        $('.ui.dropdown').dropdown();

        $('.final_check').on('click', function() {
            var check_test = false;
            var is_active = false;

            $('.patient_info tr').each(function() {
                if($(this).hasClass('active')) {
                    is_active = true;
                }else if($(this).hasClass('check_active')) {
                    check_test =  true;
                }
            });
            if(is_active) {
                $('.icon_final').removeClass('disabled').addClass('teal');
                $('.patient_info .active').removeClass('active').addClass('check_active');
                $(this).text('확인취소');
            }else if(check_test && !is_active) {
                $('.icon_final').addClass('disabled').removeClass('teal');
                $('.patient_info ._current').addClass('active').removeClass('check_active');
                $(this).text('최종확인');
            }else if(!check_test && !is_active) {
                alert('환자를 선택해주세요.');
            }
        });

        $('tbody.patient_info tr').on('click', function() {
            $('.conclusion').css('display', 'none');
            if($(this).hasClass('active')) {
                client_id = '';
                conclusion_id = '';
                $(this).removeClass('_current');
                $(this).removeClass('active');
                $('.rule_condition').text('');
                $('.rule_content').text('');
                $('.topic').html('');
                $('.book').html('');
                $('.get_test_data').html('');
                $('.conclusion').html('');
                $('.tests_wrong').text('0');
            }else {
                $(this).parent().children().removeClass('active');
                $(this).parent().children().removeClass('_current');
                $(this).addClass('_current');
                if(!$(this).hasClass('check_active')){
                    $(this).addClass('active');
                    $('.final_check').text('최종확인');
                    $('.icon_final').addClass('disabled').removeClass('teal');
                }else{
                    $('.final_check').text('확인취소');
                    $('.icon_final').removeClass('disabled').addClass('teal');
                }
                $('.rule_condition').text('');
                $('.rule_content').text('');
                $('.topic').html('');
                $('.book').html('');

                data_id = $(this).attr('data-id');

                var data = {
                    date_data : $('input[name="daterange"]').val(),
                    client_id : $(this).attr('data-id'),
                };

                $.cookie.json = true;
                $.cookie('data_', data, { path : '/' });

                $.ajax({
                    url : '/',
                    data : {
                        id: data_id
                    },
                    success : function(data) {
                        //var record_date = data.patient_data.recorded_date;
                        client_id = data.patient_data.id;
                        var hospital = data.patient_data.clinic.name;
                        var office = data.patient_data.office.name;
                        var receipt_num = data.patient_data.receipt_number;
                        var name = data.patient_data.patient.name;
                        var sex;
                        if(data.patient_data.patient.sex == 'male') {
                            sex = '남';
                        }else {
                            sex = '여';
                        }
                        var age = data.patient_data.patient.age;

                        //$('.record_date_data').val(record_date);
                        $('.hospital_data').val(hospital);
                        $('.office_data').val(office);
                        $('.receipt_num_data').val(receipt_num);
                        $('.name_data').val(name);
                        $('.sex_data').val(sex);
                        $('.age_data').val(age);

                        getTest(data);
                        conclusion(data);
                    }
                });
            }
        });

        $('.conclusion').on('click', '.conclusion_content .content', function() {
            if(!$(this).parent().hasClass('active')){
                $(this).parent().parent().children().removeClass('active').find('.button').css('display', 'none').removeClass('teal');
                $(this).parent().addClass('active').find('.button').css('display', 'block').addClass('teal');
                conclusion_id = $(this).parent().attr('data-id');
                var check_active = [];
                $('.patient_info tr').each(function() {
                   if($(this).hasClass('check_active')) {
                       check_active.push($(this).attr('data-id'));
                   }
                });

                var data_rule_id = $(this).parent().attr('data-rule-id');
                var data_text = $(this).parent().attr('data-text');
                rule_id = data_rule_id;

                var url = 'books/' + data_text + '/page=1/rel=none';


                $('.more-book').attr('data-url', url);

                $.ajax({
                    url : '/',
                    data : {
                        rule_id: data_rule_id,
                        text : data_text
                    },
                    success : function(data) {
                        ruleData(data);
                        bookData(data);

                        var is_check = $('.conclusion .active .ui.checkbox').checkbox('is checked');

                        if(!is_check) {
                            $('.rule_content .ui.checkbox').checkbox('set unchecked');
                            $('.rule_conclusion').css('text-decoration', 'line-through');
                        }
                    },
                    beforeSend : function() {
                        $('.dimmer').addClass('active');
                    },
                    complete : function() {
                        $('.dimmer').removeClass('active');
                    }
                });

            }else{
                conclusion_id = '';
                $(this).parent().removeClass('active').find('.button').css('display', 'none').removeClass('teal');
                $('.rule_condition').text('');
                $('.rule_content').text('');
                $('.topic').html('');
                $('.book').html('');
                $('.get_test_data td').each(function() {
                    $(this).removeClass('opacity_cell');
                });
            }
        });

    $('.conclusion').on('click', '.ui.checkbox', function() {
        if($(this).parent().parent().hasClass('active')){
            var is_check = $(this).checkbox('is checked');

            if(is_check) {
                $('.rule_content .ui.checkbox').checkbox('set checked');
                $(this).parent().parent().find('.content').css('text-decoration', '');
                $('.rule_conclusion').css('text-decoration', '');
            }else {
                $('.rule_content .ui.checkbox').checkbox('set unchecked');
                $(this).parent().parent().find('.content').css('text-decoration', 'line-through');
                $('.rule_conclusion').css('text-decoration', 'line-through');
            }
        }else {
            var is_check = $(this).checkbox('is checked');

            if(is_check) {
                $(this).parent().parent().find('.content').css('text-decoration', '');
            }else {
                $(this).parent().parent().find('.content').css('text-decoration', 'line-through');
            }
        }
    });

    $('.rule_content').on('click', '.ui.checkbox', function() {
        var is_check = $(this).checkbox('is checked');
        var checkbox = $('tbody.conclusion .active .right .checkbox');

        if(is_check){
            $('.rule_conclusion').css('text-decoration', '');
            checkbox.checkbox('set checked');
            $('tbody.conclusion .active .content').css('text-decoration', '');
        }else{
            $('.rule_conclusion').css('text-decoration', 'line-through');
            checkbox.checkbox('set unchecked');
            $('tbody.conclusion .active .content').css('text-decoration', 'line-through');
        }
    });


    $('.more-book').on('click', function() {
        var book_url = $(this).attr('data-url');
        window.open(book_url);
    });

    $('.final').on('click', function() {
        $('.modal textarea').val('');
        var patient_name = $('.modal .name_data').val();
        var final_conclusion_html_title = patient_name + '님의 검진 결과는 다음과 같습니다.\n\n';

        $('.modal .description').val($('.modal .description').val() + final_conclusion_html_title);
        $('tbody.conclusion .conclusion_content').each(function() {
            if($(this).find('#is_print').checkbox('is checked')) {
                var conclusion = $(this).find('.content').text();
                var final_conclusion_html = conclusion + '\n';

                $('.modal .description').val($('.modal .description').val() + final_conclusion_html);
            }
        });

        $('.ui.modal').modal('show');
    });

});

    function getTest(data) {
        var get_test = data.test_data.tests;
        $('.get_test_data').html('');
        var category = [];
        var sorted_category = [];

        for(var i = 0; i < get_test.length; i++) {
            if(get_test[i].category !== null) {
                category.push(get_test[i].category);
            }
        }

        $.each(category, function(i, e1) {
            if($.inArray(e1, sorted_category) === -1) {
                sorted_category.push(e1);
            }
        });

        var table_data = [];

        for(var i = 0; i < sorted_category.length; i++) {
            table_data.push(sorted_category[i]);

            for(var j = 0; j < data.test_data.tests.length; j++) {
                if(get_test[j].category == sorted_category[i]){
                    table_data.push(get_test[j]);
                }else if(sorted_category[i] == 'null' && get_test[j].category === null) {
                    table_data.push(get_test[j]);
                }
            }
        }

        var cnt_row = Math.ceil(table_data.length / 4);
        var cnt_wrong = 0;
        for(var i = 0; i < cnt_row; i++) {
            if(jQuery.type(table_data[i]) == 'string') {
                var table_col1 = '<tr><td colspan="3" style="background-color:#ffd9f7;color:#db2828;">' + table_data[i] + '</td>';
            }else {
                if(table_data[i].evaluation == 'high') {
                    var css_value = 'style="background-color: #FF0000; color: white;"';
                    var evaluation = 'H';
                    cnt_wrong ++;
                }else if(table_data[i].evaluation == 'low') {
                    var css_value = 'style="background-color: #FF0000; color: white;"';
                    var evaluation = 'L';
                    cnt_wrong ++;
                }else {
                    var css_value = 'style="background-color:#fff7f0;"';
                    var evaluation = '';
                }
                var component;
                if(table_data[i].component === null) {
                    component = table_data[i].name;
                    if(/-/i.test(component)){
                        component = component.split('-')[1];
                    }
                }else{
                    component = table_data[i].component;
                }
                var table_col1 = '<tr><td style="background-color:#dbffd4;" data-category="' + table_data[i].category + '">' + component + '</td><td ' + css_value + '>' + table_data[i].value + '</td><td>' + evaluation + '</td>';
            }

            if(jQuery.type(table_data[i + cnt_row]) == 'string') {
                var table_col2 = '<td colspan="3" style="background-color:#ffd9f7;color:#db2828;">' + table_data[i + cnt_row] + '</td>';
            }else {
                if(table_data[i + cnt_row].evaluation == 'high') {
                    var css_value = 'style="background-color: #FF0000; color: white;"';
                    var evaluation = 'H';
                    cnt_wrong ++;
                }else if(table_data[i + cnt_row].evaluation == 'low') {
                    var css_value = 'style="background-color: #FF0000; color: white;"';
                    var evaluation = 'L';
                    cnt_wrong ++;
                }else {
                    var css_value = 'style="background-color:#fff7f0;"';
                    var evaluation = '';
                }
                var component;
                if(table_data[i + cnt_row].component === null) {
                    component = table_data[i + cnt_row].name;
                    if(/-/i.test(component)){
                        component = component.split('-')[1];
                    }
                }else{
                    component = table_data[i + cnt_row].component;
                }
                var table_col2 = '<td style="background-color:#dbffd4;" data-category="' + table_data[i + cnt_row].category + '">' + component + '</td><td ' + css_value + '>' + table_data[i + cnt_row].value + '</td><td>' + evaluation + '</td>';
            }

            if(jQuery.type(table_data[i + 2 * cnt_row]) == 'string') {
                var table_col3 = '<td colspan="3" style="background-color:#ffd9f7;color:#db2828;">' + table_data[i + 2 * cnt_row] + '</td>';
            }else {
                if(table_data[i + 2 * cnt_row].evaluation == 'high') {
                    var css_value = 'style="background-color: #FF0000; color: white;"';
                    var evaluation = 'H';
                    cnt_wrong ++;
                }else if(table_data[i + 2 * cnt_row].evaluation == 'low') {
                    var css_value = 'style="background-color: #FF0000; color: white;"';
                    var evaluation = 'L';
                    cnt_wrong ++;
                }else {
                    var css_value = 'style="background-color:#fff7f0;"';
                    var evaluation = '';
                }
                var component;
                if(table_data[i + 2 * cnt_row].component === null) {
                    component = table_data[i + 2 * cnt_row].name;
                    if(/-/i.test(component)){
                        component = component.split('-')[1];
                    }
                }else{
                    component = table_data[i + 2 * cnt_row].component;
                }
                var table_col3 = '<td style="background-color:#dbffd4;" data-category="' + table_data[i + 2 * cnt_row].category + '">' + component + '</td><td ' + css_value + '>' + table_data[i + 2 * cnt_row].value + '</td><td>' + evaluation + '</td>';
            }
            if(jQuery.type(table_data[i + 3 * cnt_row]) == 'string') {
                var table_col4 = '<td colspan="3" style="background-color:#ffd9f7;color:#db2828;">' + table_data[i + 3 * cnt_row] + '</td></tr>';
            }else if(jQuery.type(table_data[i + 3 * cnt_row]) === 'undefined') {
                var table_col4 = '<td colspan="3"></td>';
            }else {
                if (table_data[i + 3 * cnt_row].evaluation == 'high') {
                    var css_value = 'style="background-color: #FF0000; color: white;"';
                    var evaluation = 'H';
                    cnt_wrong ++;
                } else if (table_data[i + 3 * cnt_row].evaluation == 'low') {
                    var css_value = 'style="background-color: #FF0000; color: white;"';
                    var evaluation = 'L';
                    cnt_wrong ++;
                } else {
                    var css_value = 'style="background-color:#fff7f0;"';
                    var evaluation = '';
                }
                var component;
                if(table_data[i + 3 * cnt_row].component === null) {
                    component = table_data[i + 3 * cnt_row].name;
                    if(/-/i.test(component)){
                        component = component.split('-')[1];
                    }
                }else{
                    component = table_data[i + 3 * cnt_row].component;
                }
                var table_col4 = '<td style="background-color:#dbffd4;" data-category="' + table_data[i + 3 * cnt_row].category + '">' + component + '</td><td ' + css_value + '>' + table_data[i + 3 * cnt_row].value + '</td><td>' + evaluation + '</td></tr>';
            }

            var table = table_col1 + table_col2 + table_col3 + table_col4;

            $('.get_test_data').append(table);
            $('.tests_wrong').text(cnt_wrong);
        }
    }


    function conclusion(data) {
        var conclusion = data.conclusion.conclusions;
        $('.conclusion').html('');

        for(var i = 0; i < conclusion.length; i++) {
            var conclusion_rule_ids = conclusion[i].rule_ids;

            if(conclusion_rule_ids.length != 1) {
                var conclusion_rule_ids_ = '';
                for(var j = 0; j < conclusion_rule_ids.length; j++) {
                    if(j != conclusion_rule_ids.length -1 ) {
                        conclusion_rule_ids_ += conclusion_rule_ids[j] + ','
                    }else {
                        conclusion_rule_ids_ += conclusion_rule_ids[j]
                    }
                }
                conclusion_rule_ids = conclusion_rule_ids_;
            }

            var html3 = '<tr class="conclusion_content" data-id="' + conclusion[i].id + '" data-rule-id="' + conclusion_rule_ids + '" data-text="' + conclusion[i].text + '">' +
                '<td class="content">' + conclusion[i].text + '</td>' +
                    '<td>' +
                        '<button class="mini ui button" style="display:none;" onclick="moveDetail([' + conclusion[i].rule_ids + '],' + conclusion[i].id + ')">상세보기</button><br/>' +
                    '</td>' +
                    '<td class="ui right aligned">' +
                        '<div id="is_print" class="ui checkbox">' +
                            '<input type="checkbox" name="print" checked=""><label></label>' +
                        '</div>' +
                    '</td>' +
                '</tr>';

            $('.conclusion').append(html3);
        }
    }

    function ruleData(data) {
        $('.rule_condition').html('');
        $('.rule_content').html('');
        var rule_components = [];

        if(data.rule.conditions) {
            var condition = data.rule.conditions;
            var conclusion = data.rule.conclusion.text;

            for(var i = 0; i < condition.length; i++) {
                var html4 = '<span>' + condition[i].component + condition[i].operator + condition[i].value + '</span>';
                if(i != condition.length - 1) {
                    html4 += '<br/>&&<br/>';
                }
                var rule_highlight_data = {
                    component : condition[i].component,
                    category : condition[i].category
                };
                rule_components.push(rule_highlight_data);
                $('.rule_condition').append(html4);
            }

            var content_conclusion = '<span class="rule_conclusion">' + conclusion + '</span>';

            $('.rule_content').append(content_conclusion);

        }else {
            for(var i = 0; i < data.rule.length; i++) {
                for(var j = 0; j < data.rule[i].conditions.length; j++) {
                    var html4_ = '<span>' + data.rule[i].conditions[j].component + data.rule[i].conditions[j].operator + data.rule[i].conditions[j].value + '</span>';
                    if(j != data.rule[i].conditions.length - 1) {
                        html4_ += '<br/>&&<br/>';
                    }

                    var rule_highlight_data_ = {
                        component : data.rule[i].conditions[j].component,
                        category : data.rule[i].conditions[j].category
                    };
                    rule_components.push(rule_highlight_data_);
                    $('.rule_condition').append(html4_);
                }

                if(i != data.rule.length - 1) {
                    var divider = '<div class="ui divider"></div>';
                    $('.rule_condition').append(divider);
                }
            }

            var conclusion_ = data.rule[0].conclusion.text;

            var content_conclusion_ = '<span class="rule_conclusion">' + conclusion_ + '</span>';

            $('.rule_content').append(content_conclusion_);
        }

        var unique_rule_components = [];
        $.each(rule_components, function(i, e1) {
            if($.inArray(e1.component, unique_rule_components) === -1) unique_rule_components.push(e1);
        });

        $('.get_test_data td').each(function() {
            $(this).addClass('opacity_cell');
        });
        $('.get_test_data td').each(function() {
            for(var i = 0; i < unique_rule_components.length; i++) {
               if($(this).text() == unique_rule_components[i].component && $(this).attr('data-category') == unique_rule_components[i].category) {
                   $(this).removeClass('opacity_cell');
                   $(this).next().removeClass('opacity_cell');
                   $(this).next().next().removeClass('opacity_cell');
               }else if($(this).text() == unique_rule_components[i].category) {
                   $(this).removeClass('opacity_cell');
               }
            }
        });

    }

    function bookData(data) {
        $('.topic').html('');
        $('.book').html('');
        var book = data.book
        var topic = book.topics;
        var books = book.books;
        console.log(data);
        if(books.length != 0) {
            for (var i = 0; i < topic.length; i++) {
                var html5 = '<a href="#" class="ui label" style="margin: 5px;"><span class="keyword">' + topic[i].topic_title + '</span></a>';

                $('.topic').append(html5);
            }

            for (var j = 0; j < books.length; j++) {
                var html6 = '<div class="item"><img class="ui middle aligned tiny image" src="' + books[j].book_image_url + '" style="max-height: 100px;"><div class="middle aligned content"><a class="header" href="#">' + books[j].book_source + '</a><div class="metadata"><strong class="date">' + books[j].book_year + '</strong> by <span class="description">' + books[j].book_author + '</span></div><div class="ui contents" style="padding-top:15px; padding-bottom: 10px;">' + books[j].book_highlighted_contents + '</div></div></div>';

                $('.book').append(html6);
            }
        }else {
            var error_m = '<h4>데이터가 없습니다.</h4>';
            $('.book').append(error_m);
        }
    }

    function moveDetail(ruld_ids, id) {
        if(client_id != '' && id != '') {
            $.persist("home", {
                "html": $('body').html(),
                "data_id": client_id,
                "date_data": $('input[name="daterange"]').val()
            });

            window.location.href = '/patient/' + client_id + '/' + id;
        }else {
            alert('환자 및 소견 정보를 불러오고 있습니다 잠시만 기다려주세요.');
        }
    }