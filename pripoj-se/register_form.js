/* global document, $ */
var pscOptions = null
var validationInfo = {
  rules: {
    name: 'required',
    email: {
      required: true,
      email: true
    },
    psc: 'required'
  },
  messages: {
    name: 'prosím zadej své jméno',
    email: {
      required: 'prosím zadej svůj email',
      email: 'zadej platnou emailovou adresu'
    },
    psc: 'prosím zadej své bydliště'
  },
  submitHandler: function (form) {
    $('form[name=registration]').prop('disabled', true)
    // prepare data
    var dataArray = $(form).serializeArray()
    var data = {}
    for (var i = 0; i < dataArray.length; i++) {
      var row = dataArray[i]
      if (row.name in data) {
        data[row.name] = data[row.name] + ',' + row.value
      } else {
        data[row.name] = row.value
      }
    }
    var m = data.psc.match(/[^(]\((\d+)\)/i)
    data.psc = m.length > 1 ? m[1] : data.psc
    // post to server
    $.ajax({
      url: 'https://radiant-chamber-14537.herokuapp.com/register_web',
      data: JSON.stringify(data),
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (result) {
        $('#do_register_button').html(
          '<h3 class=\'text-success\'>Huráá! Jsi na ceste na pirátskou palubu.</h3>'
        )
      },
      error: function (err) {
        var m = err.responseText.indexOf('duplicate key') >= 0
          ? 'Tato emailová adresa je již registrována'
          : 'Je nám líto, došlo k chybě. Zkuste to prosím později'
        $('#do_register_button').html(
          '<h3 class=\'text-danger error\'>' + m + '</h3>'
        )
        console.warn(err)
      }
    })
  }
}

var substringMatcher = function (strs) {
  return function findMatches (q, cb) {
    var matches = []
    var substringRegex = new RegExp(q, 'i')

    $.each(pscOptions, function (i, str) {
      if (substringRegex.test(str.label) || substringRegex.test(str.zip)) {
        var m = str.label
        if (str.dis) {
          m += ' - ' + str.dis
        }
        m += ' (' + str.zip + ')'
        matches.push(m)
      }
    })
    cb(matches)
  }
}

$(document).ready(function () {
  // load psc
  $.ajax({
    url: 'https://czgovopts.herokuapp.com/ico',
    success: function (result) {
      pscOptions = result
    }
  })
  $('#butt').click(function () {
    $.ajax({
      url: 'form.html',
      success: function (result) {
        $('#do_register_button').html(result)
        $('form[name=registration]').validate(validationInfo)
        $('#psccontainer .typeahead').typeahead({
          hint: true,
          highlight: true,
          minLength: 3
        }, {
          name: 'states',
          source: substringMatcher()
        })
      }
    })
  })
})
