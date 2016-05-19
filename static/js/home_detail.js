$(function() {
    $('.ui.dropdown').dropdown();

    $('.final').on('click', function() {
        $('.modal .description').html('');
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
    })

    $('.more-book').on('click', function() {
        var data_text = $('.conclusion_content.active .content').text();
        var book_url = '../../books/' + data_text + '/page=1/rel=none';
        window.open(book_url);
    });

    $('.refresh').on('click', function() {
        location.reload();
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

    if(!$('.result').children().hasClass('result_active')) {
        var html_result = '<h4 style="margin-top:15%;">소견 생성 규칙과 일치하는 검사 결과가 없습니다.</h4>';
        $('.result').append(html_result);
    }

});