/***********************************************************************************************************************/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	Run on page load

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/***********************************************************************************************************************/

$(function(){
	initialize_dashboard();

	$('.icon_toggle .icon').click(function(){
		$(this).children('div').toggleClass('hidden');
		$(this).siblings('.toggled_text').toggleClass('hidden');
	});
	
	$('#dashboard section h3').click(function(){
		$(this).toggleClass('open');
		$(this).siblings('fieldset').toggleClass('hidden');
	});
});


/***********************************************************************************************************************/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	Initialize Dashboard

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/***********************************************************************************************************************/

function initialize_dashboard(){
	initialize_submit_button();

	initialize_theme_picker();

	initialize_colorpickers();

	initialize_logo_input();

	initialize_text_inputs();

	initialize_font_selector();

	initialize_csv_reader();
}

/************************************************************************************************************************
	Dashboard Sections
/***********************************************************************************************************************/

function initialize_submit_button(){
	$('#invoice_form').submit(function(){
		submit_invoice();
		return false;
	});
}

function initialize_theme_picker(){
	/*$('#theme_picker').change(function(){
		var theme = $(this).val().replace(' ','_');

		var old_spreadsheet = $('#csv_holder').html();

        $.ajax({
		     type: "GET",
		     url: 'includes/themes/' + theme + '/index.php',
	  		 data: { 
	  		 	heading1: $('.heading1').html(), 
	  		 	message1: $('.message1').html(), 
	  		 	heading2: $('.heading2').html(), 
	  		 	message2: $('.message2').html(),
	  		 	business_name: $('.business_name').html(),
	  		 	website_url: $('.website_url').html()
	  		 },
  		     success: function(data) {
		          $('#preview').html(data);
		          $('#csv_holder').html(old_spreadsheet);
		     }
		});

		$('#theme_CSS').attr('href','includes/themes/' + theme + '/css/style.css');
	});*/

	$('.theme_thumbnail').click(function(){
		var theme = $(this).children('div').text().replace(' ','_');

		var old_spreadsheet = $('#csv_holder').html();

        $.ajax({
		     type: "GET",
		     url: 'includes/themes/' + theme + '/index.php',
	  		 data: { 
	  		 	heading1: $('.heading1').html(), 
	  		 	message1: $('.message1').html(), 
	  		 	heading2: $('.heading2').html(), 
	  		 	message2: $('.message2').html(),
	  		 	business_name: $('.business_name').html(),
	  		 	website_url: $('.website_url').html()
	  		 },
  		     success: function(data) {
		          $('#preview').html(data);
		          $('#csv_holder').html(old_spreadsheet);
		     }
		});

		$('#theme_CSS').attr('href','includes/themes/' + theme + '/css/style.css');
	});
}

function initialize_colorpickers(){
    $('head').append('<style id="addedCSS" type="text/css"></style>');

	$('.colorpicker-wrapper').ColorPicker({
		flat: true,
		onChange: function (hsb, hex, rgb) {
			var css_targets = $(this).parent().parent().attr('id').split('-');

			$('#addedCSS').append('#preview .' + css_targets[0] + '{' + css_targets[1] + ': #' + hex + ';}');
		}
	});

	$('.colorpicker').addClass('hidden');

	$('.color-swatch').each(function(){
		if ( $(this).attr('data-color') != 'picker' ){
			$(this).css('background',$(this).attr('data-color')).click( function(){
				 var css_targets = $(this).parent().attr('id').split('-');
				$('#addedCSS').append('#preview .' + css_targets[0] + '{' + css_targets[1] + ':' + $(this).attr('data-color') + '}');
				if(! $(this).siblings('p').children('.colorpicker').hasClass('hidden') ){
					$(this).siblings('p').children('.colorpicker').addClass('hidden')
				}
			});
		} else{
			$(this).click(function(){
				$(this).siblings('p').children('.colorpicker').toggleClass('hidden');
			})
		}
	});
}

function initialize_logo_input(){
	$("#logo_input").change(function(){
	    readURL( this );
	});
}

function initialize_text_inputs(){
	$('.text_input').keyup(function(){
		var target = $('.' + $(this).attr('data_target') );
		var target_type = target.get(0).tagName;
		var text =  $(this).val();
		text = text.replace(/\n\r?/g, '</' + target_type + '>' + '<' + target_type + '>');
		target.html( text );
	});
}

function initialize_font_selector(){
	$('#font option').each(function(){
		$(this).css('font-family',$(this).text());
	})

	$('#font').change(function(){
		$('#preview *').css('font-family', $(this).val());
		$(this).css('font-family', $(this).val());
	});
}

function initialize_csv_reader(){
	$('#csv_input').change(function(){
		readURL2(this);
	});
}

function submit_invoice() {
	if ( $('#copy_me').is(":checked") ){
		var checked = 'true';
	} else{
		var checked = 'false';
	}

    var request = $.ajax({
	     type: "POST",
	     url: 'includes/send_mail.php',
  		 data: { 
  		 	message: $('#preview').html(), 
  		 	subject: $('#subject').val(), 
  		 	from_email: $('#from_email').val(), 
  		 	to_email: $('#to_email').val(),
  		 	copy_me: checked
  		 },
	     success: function() {
			$("#dashboard").html('<h1>Success!</h1><p>Your email has been sent. Sit back and wait to get paid!</p><p>If you do not receive payment make sure to follow up. It\'s possible this email was blocked by a spam filter.');			
		}
	});

	request.fail(function(jqXHR, textStatus) {
		console.log( "Request failed: " + textStatus );
	});
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#logo_preview').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

// Super sloppy. Needs cleaning up

function readURL2(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $.ajax({
			     type: "GET",
			     url: 'includes/csv_as_table.php',
			     data: "path=" + e.target.result,
			     success: function(data) {
			          $('#csv_holder').html(data);
			     }
			});
        }

        reader.readAsDataURL(input.files[0]);
    }
}


/***********************************************************************************************************************/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	Utility Functions

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/***********************************************************************************************************************/

var MAP = { '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'};

function escapeHTML(s, forAttribute) {
    return s.replace(forAttribute ? /[&<>'"]/g : /[&<>]/g, function(c) {
        return MAP[c];
    });
}
