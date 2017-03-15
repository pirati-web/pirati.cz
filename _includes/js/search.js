$( function() {

  var mail = $("#mail");
  var mailsub = $("#mailsub");
  var search = $("#search");
  var searchsub = $("#searchsub");

  searchsub.click(function() {
    mail.hide();
    search.show();
    searchsub.click(function() {
      console.log("Hledám ", search.val());
    });
  });
  mailsub.click(function() {
    search.hide();
    mail.show();
    mailsub.click(function() {
      console.log("Jste zařazen:", mail.val());
    });
  });
  mailsub.click();

  $.get("{{'api/search.json' | relative_url}}")
      .done(function(availableNames) {
        search.autocomplete({
          source: availableNames,
          select: function( event, ui ) {
            window.location.href = ui.item.value;
          }
        });
      })
      .fail(function(data) {
          console.log('Error in search:');
          console.log(data);
      });
});
