var data_id;

$(function() {


    //var data = $.persist('home');
    //if(data) {
    //    $('body').html(data.html);
    //}

        var now = new Date();
        $('.current_data').val(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate());

        $('tbody.patient_info tr').on('click', function() {
            if($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('.rule_condition').text('');
                $('.rule_content').text('');
                $('.topic').html('');
                $('.book').html('');
                $('.get_test_data').html('');
                $('.conclusion').html('');
            }else {
                $(this).parent().children().removeClass('active');
                $(this).addClass('active');
                $('.rule_condition').text('');
                $('.rule_content').text('');
                $('.topic').html('');
                $('.book').html('');

                data_id = $(this).attr('data-id');

                $.ajax({
                    url : '/',
                    data : {
                        id: data_id
                    },
                    success : function(data) {
                        var record_date = data.patient_data.recorded_date;
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

                        $('.record_date_data').val(record_date);
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

                var data_rule_id = $(this).parent().attr('data-rule-id');
                var data_text = $(this).parent().attr('data-text');

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
                $(this).parent().removeClass('active').find('.button').css('display', 'none').removeClass('teal');
                $('.rule_condition').text('');
                $('.rule_content').text('');
                $('.topic').html('');
                $('.book').html('');
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
        //$.persist('home', {
        //    "html" : $('body').html()
        //});
        var book_url = $(this).attr('data-url');
        window.open(book_url);
    });

    $('.final').on('click', function() {
        $('.modal .description').html('');
        var patient_name = $('.modal .name_data').val();
        var final_conclusion_html_title = '<br/><p>' + patient_name + '님의 검진 결과는 다음과 같습니다.</p><br/>';

        $('.modal .description').append(final_conclusion_html_title);
        $('tbody.conclusion .conclusion_content').each(function() {
            if($(this).find('#is_print').checkbox('is checked')) {
                var conclusion = $(this).find('.content').text();

                var final_conclusion_html = '<p>' + conclusion + '</p>';

                $('.modal .description').append(final_conclusion_html);
            }
        });

        $('.ui.modal').modal('show');
    })

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
            }else{
                if($.inArray('null' , sorted_category) === -1) {
                    sorted_category.push('null');
                }
            }
        });

        $.each(category, function(i, e1) {
            if($.inArray(e1, sorted_category) !== -1) {
                if($.inArray('null' , sorted_category) === -1) {
                    sorted_category.push('null');
                }
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

        for(var i = 0; i < cnt_row; i++) {
            if(jQuery.type(table_data[i]) == 'string') {
                var table_col1 = '<tr><td  class="negative" colspan="3">' + table_data[i] + '</td>';
            }else {
                if(table_data[i].evaluation == 'high') {
                    var css_value = 'style="background-color: red; color: white;"';
                    var evaluation = 'H';
                }else if(table_data[i].evaluation == 'low') {
                    var css_value = 'style="background-color: red; color: white;"';
                    var evaluation = 'L';
                }else {
                    var css_value = 'class="warning"';
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
                var table_col1 = '<tr><td class="positive">' + component + '</td><td ' + css_value + '>' + table_data[i].value + '</td><td>' + evaluation + '</td>';
            }

            if(jQuery.type(table_data[i + cnt_row]) == 'string') {
                var table_col2 = '<td class="negative" colspan="3">' + table_data[i + cnt_row] + '</td>';
            }else {
                if(table_data[i + cnt_row].evaluation == 'high') {
                    var css_value = 'style="background-color: red; color: white;"';
                    var evaluation = 'H';
                }else if(table_data[i + cnt_row].evaluation == 'low') {
                    var css_value = 'style="background-color: red; color: white;"';
                    var evaluation = 'L';
                }else {
                    var css_value = 'class="warning"';
                    var evaluation = '';
                }
                var component;
                if(table_data[i + cnt_row].component === null) {
                    component = table_data[i + cnt_row].name;
                    if(/-/i.test(component)){
                        component = component.split('-')[1];
                    }
                }else{
                    component = table_data[i].component;
                }
                var table_col2 = '<td class="positive">' + component + '</td><td ' + css_value + '>' + table_data[i + cnt_row].value + '</td><td>' + evaluation + '</td>';
            }

            if(jQuery.type(table_data[i + 2 * cnt_row]) == 'string') {
                var table_col3 = '<td class="negative" colspan="3">' + table_data[i + 2 * cnt_row] + '</td>';
            }else {
                if(table_data[i + 2 * cnt_row].evaluation == 'high') {
                    var css_value = 'style="background-color: red; color: white;"';
                    var evaluation = 'H';
                }else if(table_data[i + 2 * cnt_row].evaluation == 'low') {
                    var css_value = 'style="background-color: red; color: white;"';
                    var evaluation = 'L';
                }else {
                    var css_value = 'class="warning"';
                    var evaluation = '';
                }
                var component;
                if(table_data[i + 2 * cnt_row].component === null) {
                    component = table_data[i + 2 * cnt_row].name;
                    if(/-/i.test(component)){
                        component = component.split('-')[1];
                    }
                }else{
                    component = table_data[i].component;
                }
                var table_col3 = '<td class="positive">' + component + '</td><td ' + css_value + '>' + table_data[i + 2 * cnt_row].value + '</td><td>' + evaluation + '</td>';
            }
            if(jQuery.type(table_data[i + 3 * cnt_row]) == 'string') {
                var table_col4 = '<td class="negative" colspan="3">' + table_data[i + 3 * cnt_row] + '</td></tr>';
            }else if(jQuery.type(table_data[i + 3 * cnt_row]) === 'undefined') {
                var table_col4 = '<td colspan="3"></td>';
            }else {
                if (table_data[i + 3 * cnt_row].evaluation == 'high') {
                    var css_value = 'style="background-color: red; color: white;"';
                    var evaluation = 'H';
                } else if (table_data[i + 3 * cnt_row].evaluation == 'low') {
                    var css_value = 'style="background-color: red; color: white;"';
                    var evaluation = 'L';
                } else {
                    var css_value = 'class="warning"';
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
                var table_col4 = '<td class="positive">' + component + '</td><td ' + css_value + '>' + table_data[i + 3 * cnt_row].value + '</td><td>' + evaluation + '</td></tr>';
            }

            var table = table_col1 + table_col2 + table_col3 + table_col4;

            $('.get_test_data').append(table);
        }
    }


    function conclusion(data) {
        var conclusion = data.conclusion.conclusions;
        $('.conclusion').html('');

        for(var i = 0; i < conclusion.length; i++) {
            var html3 = '<tr class="conclusion_content" data-rule-id="' + conclusion[i].rule_ids + '" data-text="' + conclusion[i].text + '"><td class="content">' + conclusion[i].text + '</td><td><button class="mini ui button" style="display:none;" onclick="moveDetail(' + conclusion[i].id + ')">상세보기</button><br/><button class="mini ui button" style="display:none;">현재 Rule 편집</button></td><td class="ui right aligned"><div id="is_print" class="ui checkbox"><input type="checkbox" name="print" checked=""><label></label></div></td></tr>';

            $('.conclusion').append(html3);
        }
    }

    function ruleData(data) {
        var condition = data.rule.conditions;
        var conclusion = data.rule.conclusion.text;

        $('.rule_condition').html('');
        $('.rule_content').html('');

        for(var i = 0; i < condition.length; i++) {
            var html4 = '<span>' + condition[i].component + condition[i].operator + condition[i].value + '</span>';
            if(i != condition.length - 1) {
                html4 += '<br/><div class="ui divider"></div><br/>';
            }

            $('.rule_condition').append(html4);
        }

        var content_conclusion = '<span class="rule_conclusion">' + conclusion + '</span><br/><br/><button class="tiny ui button">현재 Rule 편집</button>&nbsp;&nbsp;&nbsp;<div class="ui checkbox"><input type="checkbox"  id="rule_is_print" name="print" checked="true"><label>출력</label></div>';

        $('.rule_content').append(content_conclusion);
    }

    function bookData(data) {
        $('.topic').html('');
        $('.book').html('');
        var book = data.book
        var topic = book.topics;
        var books = book.books;

        for(var i = 0; i < topic.length; i++) {
            var html5 = '<a href="#" class="ui label" style="margin: 5px;"><span class="keyword">' + topic[i].topic_title + '</span></a>';

            $('.topic').append(html5);
        }

        for(var j = 0; j < books.length; j++) {
            var html6 = '<div class="item"><img class="ui middle aligned tiny image" src="' + books[j].book_image_url + '" style="max-height: 100px;"><div class="middle aligned content"><a class="header" href="#">' + books[j].book_source + '</a><div class="metadata"><strong class="date">' + books[j].book_year + '</strong> by <span class="description">' + books[j].book_author + '</span></div><div class="ui contents" style="padding-top:15px; padding-bottom: 10px;">' + books[j].book_highlighted_contents + '</div></div></div>';

            $('.book').append(html6);
        }

    }

    function moveDetail(id) {
        var data_conclusion_id = id;

        window.location.href = '/patient/' + data_id + '/' + data_conclusion_id;
    }