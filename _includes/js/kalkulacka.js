 function formatNumber(number, sign) {
      var stringValue = '';
      if (number != null) {
          stringValue = number.toString();
          blockCount = Math.floor((stringValue.length - 1) / 3);
          for (var index = 0; index < blockCount; index++) {
              stringValue = stringValue.slice(0, stringValue.length - 3 * (index + 1) - index) + " " + stringValue.slice(stringValue.length - 3 * (index + 1) - index);
          }
          if (number != 0 && sign != null) {
              stringValue = sign + stringValue + ",-";
          } else {
              stringValue += ",-";
          }
      }
      return stringValue;
  }

  function formatPercent(number) {
      var stringValue = '';
      if (number != null) {
          stringValue = Math.abs(number).toString();
          stringValue.replace('.', ',');
          stringValue = (number > 0 ? "-" : "+") + stringValue + " %";
      }
      return stringValue;
  }

        function calculate() {

            var inputMzda = $('#dane-akt-hruba-in');
            var inputDeti = $('#dane-akt-deti');
            var inputStudent = $('#dane-akt-student');

            var spanAktSuper = $('#dane-akt-superhruba');
            var spanAktSocialni = $('#dane-akt-socialni');
            var spanAktZdravotni = $('#dane-akt-zdravotni');
            var spanAktHruba = $('#dane-akt-hruba');
            var spanAktSocialniObc = $('#dane-akt-socialni-obc');
            var spanAktZdravotniObc = $('#dane-akt-zdravotni-obc');
            var spanAktDan = $('#dane-akt-dan');
            var spanAktSolidarni = $('#dane-akt-solidarni');
            var spanAktSlevy = $('#dane-akt-slevy');
            var spanAktBonus = $('#dane-akt-bonus');
            var spanAktCista = $('#dane-akt-cista');
            var spanAktEfektivni = $('#dane-akt-efektivni');

            var spanPirHruba = $('#dane-pir-hruba');
            var spanPirDan = $('#dane-pir-dan');
            var spanPirSlevy = $('#dane-pir-slevy');
            var spanPirBonus = $('#dane-pir-bonus');
            var spanPirCista = $('#dane-pir-cista');
            var spanPirEfektivni = $('#dane-pir-efektivni');

            var spanRozdil = $('#dane-rozdil');

            var hrubaMzda = inputMzda.val();
            var deti = inputDeti.val();
            if (deti == null) {
                deti = 0;
            }
            var student = inputStudent.is(':checked');

            if (hrubaMzda != null && hrubaMzda >= 11000) {
                hrubaMzda = Math.ceil(hrubaMzda);
                deti = Math.ceil(deti);
                var socialniAkt = Math.ceil(hrubaMzda * 0.25);
                if (socialniAkt > 28232) {
                    socialniAkt = 28232;
                }
                var zdravotniAkt = Math.ceil(hrubaMzda * 0.09);
                var superHruba = hrubaMzda + socialniAkt + zdravotniAkt;

                var solidarniAkt = 0;
                var zakladSocialni = hrubaMzda;
                if (zakladSocialni > 112928) {
                    zakladSocialni = 112928;
                    solidarniAkt = Math.ceil((hrubaMzda - 112928) * 0.07);
                }
                var socialniAktObc = Math.ceil(zakladSocialni * 0.065);
                var zdravotniAktObc = Math.ceil(hrubaMzda * 0.045);
                var zakladDane = Math.ceil(superHruba / 100) * 100;
                var danAkt = Math.ceil(zakladDane * 0.15);
                var slevy = 2070;
                if (student) {
                    slevy += 335;
                }
                var danovaPovinnostAkt = danAkt - slevy;
                if (danovaPovinnostAkt < 0) {
                    danovaPovinnostAkt = 0;
                }
                var zvyhodneni = 0;
                for (var index = 0; index < deti; index++) {
                    zvyhodneni += index == 0 ? 1117 : index == 1 ? 1617 : 2017;
                }

                danovaPovinnostAkt -= zvyhodneni;

                var cistaAkt = hrubaMzda - socialniAktObc - zdravotniAktObc - danovaPovinnostAkt - solidarniAkt;
                var efektivniAkt = Math.ceil((1 - (cistaAkt / superHruba)) * 10000) / 100;

                var danPir = Math.ceil(superHruba * 0.47);
                var danovaPovinnostPir = danPir - slevy;
                if (danovaPovinnostPir < 0) {
                    danovaPovinnostPir = 0;
                }
                danovaPovinnostPir -= zvyhodneni;

                var cistaPir = superHruba - danovaPovinnostPir;
                var efektivniPir = Math.ceil((1 - (cistaPir / superHruba)) * 10000) / 100;

                var rozdil = cistaPir - cistaAkt;

                spanAktSuper.text(formatNumber(superHruba));
                spanAktSocialni.text(formatNumber(socialniAkt, '+'));
                spanAktZdravotni.text(formatNumber(zdravotniAkt, '+'));
                spanAktHruba.text(formatNumber(hrubaMzda, ''));
                spanAktSocialniObc.text(formatNumber(socialniAktObc, '-'));
                spanAktZdravotniObc.text(formatNumber(zdravotniAktObc, '-'));
                spanAktDan.text(formatNumber(danAkt, '-'));
                spanAktSolidarni.text(formatNumber(solidarniAkt, '-'));
                spanAktSlevy.text(formatNumber(slevy, '+'));
                spanAktBonus.text(formatNumber(zvyhodneni, '+'));
                spanAktCista.text(formatNumber(cistaAkt));
                spanAktEfektivni.text(formatPercent(efektivniAkt));

                spanPirHruba.text(formatNumber(superHruba));
                spanPirDan.text(formatNumber(danPir, '-'));
                spanPirSlevy.text(formatNumber(slevy, '+'));
                spanPirBonus.text(formatNumber(zvyhodneni, '+'));
                spanPirCista.text(formatNumber(cistaPir));
                spanPirEfektivni.text(formatPercent(efektivniPir));

                spanRozdil.text(formatNumber(rozdil, rozdil > 0 ? '+' : ''));
                if (rozdil >= 0) {
                    if (spanRozdil.hasClass('dane-result-minus')) {
                        spanRozdil.removeClass('dane-result-minus');
                    }
                    if (!spanRozdil.hasClass('dane-result-plus')) {
                        spanRozdil.addClass('dane-result-plus');
                    }
                } else {
                    if (!spanRozdil.hasClass('dane-result-minus')) {
                        spanRozdil.addClass('dane-result-minus');
                    }
                    if (spanRozdil.hasClass('dane-result-plus')) {
                        spanRozdil.removeClass('dane-result-plus');
                    }
                }
            } else {
                spanAktSuper.text('');
                spanAktSocialni.text('');
                spanAktZdravotni.text('');
                spanAktHruba.text('');
                spanAktSocialniObc.text('');
                spanAktZdravotniObc.text('');
                spanAktDan.text('');
                spanAktSolidarni.text('');
                spanAktSlevy.text('');
                spanAktBonus.text('');
                spanAktCista.text('');
                spanAktEfektivni.text('');

                spanPirHruba.text('');
                spanPirDan.text('');
                spanPirSlevy.text('');
                spanPirBonus.text('');
                spanPirCista.text('');
                spanPirEfektivni.text('');

                spanRozdil.text('');
            }
        }

function calculateClick() {
    var inputMzda = $('#dane-akt-hruba-in');
    var hrubaMzda = inputMzda.val();
    if (hrubaMzda != null && hrubaMzda >= 11000) {
        $('#div-calculator').removeClass('hidden-start');
        $('#div-calculator-info').removeClass('hidden-start');
        $('#div-calculator-text').removeClass('hidden-start');
        $('#div-chcete-vedet-vic').removeClass('hidden-start');
        calculate();
        $('html, body').animate({
            scrollTop: $("#div-calculator").offset().top
        }, 500);
    } else {
        $('#dane-error-in').removeClass('hidden');
    }
}

$().ready(function () {
    $('#dane-button-calculate').on("click", calculateClick);
    $('#dane-akt-hruba-in').on("keyup", calculate).on("change", calculate);
    $('#dane-akt-deti').on("keyup", calculate).on("change", calculate);
    $('#dane-akt-student').on("change", calculate);
    $('#dane-akt-hruba-in').on("focus", function () {
        if (!$(this).hasClass("hidden")) {
            $('#dane-error-in').addClass('hidden');
        }
    });
});
