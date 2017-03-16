$( function() {
  var search = $("#search");
  var searchsub = $("#searchsub");

  searchsub.click(function() {
    var exp = search.val();
    var url = "https://www.google.cz/?q=inurl:pirati.cz+" + exp;
    window.location.href = url;
  });

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
