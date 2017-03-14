//obslužné scripty pro mailchimp integraci na stráce /pripoj-se/index.html
$(document).ready(function(){

	$( '*[data-name="odberatel"]' ).click(function() {
		//console.log('tab-odberatel');
		RemoveFieldsRequired();
		SwitchRadio(this);

	});

	$( '*[data-name="priznivec"]' ).click(function() {
		//console.log('tab-priznivec');
		MakeFieldsRequired();
		SwitchRadio(this);

	});

	$( '*[data-name="uchazec"]' ).click(function() {
		//console.log('tab-uchazec');
		MakeFieldsRequired();
		SwitchRadio(this);
	});


}); //!document ready

	function MakeFieldsRequired(){
		$('#mce-FNAME').addClass('required');
		$('#mce-MMERGE3').addClass('required');
		$('.asterisk-switch').show();
	}

	function RemoveFieldsRequired(){
		$('#mce-FNAME').removeClass('required');
		$('#mce-MMERGE3').removeClass('required');
		$('.asterisk-switch').hide();
		window.mc.mce_validator.element( "#mce-FNAME" ); // volá objekt tvořený v mc-validate.js, jquery plugin validate
		window.mc.mce_validator.element( "#mce-MMERGE3" ); // volá objekt tvořený v mc-validate.js, jquery plugin validate
	}

	function SwitchRadio(clicked){
		$('*[name="group[28469]"]').prop('checked', false);  // nastavení hodnoty v radio pro mailchimp
		$('.hlaska-detail').hide(); // detail děkovné hlášky
		//console.log('radio');
		//console.log($(clicked).attr('data-name'));

		val = $(clicked).attr('data-name')
		switch(val) {
			case 'odberatel':
				//console.log('odberatel-nastav');
				$('.radio-' + val).prop('checked', true);
				break;
			case 'priznivec':
				//console.log('priznivec-nastav');
				$('.radio-' + val).prop('checked', true);
				$('.hlaska-priznivec').show();
				break;
			default:
				//console.log('uchazec-nastav');
				$('.radio-' + val).prop('checked', true);
				$('.hlaska-uchazec').show();
		}

	}

  // Submit the form with an ajax/jsonp request.
  // Based on http://stackoverflow.com/a/15120409/215821
  function submitSubscribeForm($form, $resultElement) {
  		//console.log($form);

	if (window.mc.mce_validator.element( "#mce-FNAME" ) == false || window.mc.mce_validator.element( "#mce-MMERGE3" ) == false || window.mc.mce_validator.element( "#mce-EMAIL" ) == false){
		return;
	}


      $.ajax({
          type: "POST",
          url: $form.attr("action"),
          data: $form.serialize(),
          cache: false,
          dataType: "jsonp",
          jsonp: "c", // trigger MailChimp to return a JSONP response
          contentType: "application/json; charset=utf-8",

          error: function(error){
              // According to jquery docs, this is never called for cross-domain JSONP requests
          },

          success: function(data){
              if (data.result != "success") {
                  var message = data.msg || "Omlouváme se. Registrace se nepovedla. Zkuste to prosím později.";
                  $resultElement.css("color", "red");

                  if (data.msg && data.msg.indexOf("already subscribed") >= 0) {
                      message = "Tento email je již registrovaný. Děkujeme.";
                      $resultElement.css("color", "black");
                  }

                  $resultElement.html(message);

              } else {
                  $resultElement.css("color", "black");
                  $resultElement.html("Pro dokončení registrace klikněte, prosím, na link zaslaný na Vámi zadaný email.");
				  $('#hlaska-uspech').show();
				  $('#tlacitko').hide();
              }
          }
      });
  }
