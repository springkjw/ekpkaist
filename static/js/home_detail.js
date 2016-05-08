$(function() {
    $('.ui.dropdown').dropdown();

    $('.final').on('click', function() {
        $('.modal .description').html('');
        var patient_name = $('.modal .name_data').val();
        var final_conclusion_html_title = '<br/><p>' + patient_name + '님의 검진 결과는 다음과 같습니다.</p><br/>';

        $('.modal .description').append(final_conclusion_html_title);
        $('tbody.conclusion .conclusion_content').each(function () {
            if ($(this).find('#is_print').checkbox('is checked')) {
                var conclusion = $(this).find('.content').text();

                var final_conclusion_html = '<p>' + conclusion + '</p>';

                $('.modal .description').append(final_conclusion_html);
            }
        });

        $('.ui.modal').modal('show');
    });

    $('.move_back').click(function(){
		parent.history.back();
		return false;
	});
});