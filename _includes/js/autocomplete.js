$( function() {
  var availableNames = [
    { value: "www.foo.com",
      label: "Spencer Kline"
    },
    { value: "www.example.com",
      label: "James Bond"
    }
  ];
  $( "#search" ).autocomplete({
    source: availableNames,
    select: function( event, ui ) {
      window.location.href = ui.item.value;
    }
  });
});
