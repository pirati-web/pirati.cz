(function(w, $) {
  "use strict";

  var Politespace = function(element) {
    if (!element) {
      throw new Error("Politespace requires an element argument.");
    }

    if (!element.getAttribute || window.operamini) {
      // Cut the mustard
      return;
    }

    this.element = element;
    this.$element = $(element);
    this.delimiter = this.$element.attr("data-delimiter") || " ";
    this.decimalMark = this.$element.attr("data-decimal-mark") || "";
    this.reverse = this.$element.is("[data-reverse]");
    this.strip = this.$element.attr("data-politespace-strip");
    this.groupLength = this.$element.attr("data-grouplength") || 3;

    var proxyAnchorSelector = this.$element.attr("data-proxy-anchor");
    this.$proxyAnchor = this.$element;
    this.$proxy = null;

    if (proxyAnchorSelector) {
      this.$proxyAnchor = this.$element.closest(proxyAnchorSelector);
    }
  };

  Politespace.prototype._divideIntoArray = function(value) {
    var split = ('' + this.groupLength).split(','),
      isUniformSplit = split.length === 1,
      dividedValue = [],
      loopIndex = 0,
      groupLength,
      substrStart,
      useCharCount;

    while (split.length && loopIndex < value.length) {
      if (isUniformSplit) {
        groupLength = split[0];
      } else {
        // use the next split or the rest of the string if open ended, ala "3,3,"
        groupLength = split.shift() || value.length - loopIndex;
      }

      // Use min if weâ€™re at the end of a reversed string
      // (substrStart below grows larger than the string length)
      useCharCount = Math.min(parseInt(groupLength, 10), value.length - loopIndex);

      if (this.reverse) {
        substrStart = -1 * (useCharCount + loopIndex);
      } else {
        substrStart = loopIndex;
      }
      dividedValue.push(value.substr(substrStart, useCharCount));
      loopIndex += useCharCount;
    }

    if (this.reverse) {
      dividedValue.reverse();
    }

    return dividedValue;
  };

  Politespace.prototype.format = function(value) {
    var split;
    var val = this.unformat(value);
    if (this.strip) {
      val = val.replace(new RegExp(this.strip, 'g'), "");
    }
    var suffix = '';

    if (this.decimalMark) {
      split = val.split(this.decimalMark);
      suffix = split.length > 1 ? this.decimalMark + split[1] : '';
      val = split[0];
    }

    return this._divideIntoArray(val).join(this.delimiter) + suffix;
  };

  Politespace.prototype.trimMaxlength = function(value) {
    var maxlength = this.element.getAttribute("maxlength");
    // Note input type="number" maxlength does nothing
    if (maxlength) {
      value = value.substr(0, maxlength);
    }
    return value;
  };

  Politespace.prototype.getValue = function() {
    return this.trimMaxlength(this.element.value);
  };

  Politespace.prototype.update = function() {
    this.element.value = this.useProxy() || this.$element.attr("type") === "password" ?
      this.getValue() :
      this.format(this.getValue());
  };

  Politespace.prototype.unformat = function(value) {
    return value.replace(new RegExp(this.delimiter, 'g'), '');
  };

  Politespace.prototype.reset = function() {
    this.element.value = this.unformat(this.element.value);
  };

  Politespace.prototype.useProxy = function() {
    var pattern = this.$element.attr("pattern");
    var type = this.$element.attr("type");


    return type === "number" ||

      (pattern ? !(new RegExp("^" + pattern + "$")).test(this.delimiter) : false);
  };

  Politespace.prototype.updateProxy = function() {
    if (this.useProxy() && this.$proxy.length) {
      var html = this.format(this.getValue());
      var width = this.element.offsetWidth;

      this.$proxy.html(html);

      if (width) {
        this.$proxy.css("width", width + "px");
      }


      this.$proxy.closest(".politespace-proxy")[html ? 'addClass' : 'removeClass']("notempty");
    }
  };

  Politespace.prototype.createProxy = function() {
    if (!this.useProxy()) {
      return;
    }

    function sumStyles(el, props) {
      var total = 0;
      var $el = $(el);
      for (var j = 0, k = props.length; j < k; j++) {
        total += parseFloat($el.css(props[j]));
      }
      return total;
    }

    var $el = $("<div>").addClass("politespace-proxy active");
    var $nextSibling = this.$proxyAnchor.next();
    var $parent = this.$proxyAnchor.parent();

    this.$proxy = $("<div>").addClass("politespace-proxy-val").css({
      font: this.$element.css("font"),
      "padding-left": sumStyles(this.element, ["padding-left", "border-left-width"]) + "px",
      "padding-right": sumStyles(this.element, ["padding-right", "border-right-width"]) + "px",
      top: sumStyles(this.element, ["padding-top", "border-top-width", "margin-top"]) + "px"
    });
    $el.append(this.$proxy);
    $el.append(this.$proxyAnchor);

    if ($nextSibling.length) {
      $el.insertBefore($nextSibling);
    } else {
      $parent.append($el);
    }

    this.updateProxy();
  };

  Politespace.prototype.setGroupLength = function(length) {
    this.groupLength = length;
    this.$element.attr("data-grouplength", length);
  };

  w.Politespace = Politespace;

}(this, jQuery));

(function(w) {
  "use strict";

  var types = {
    MASTERCARD: /^(2[2-7]|5[1-5])/, // 22-27 and 51-55
    VISA: /^4/,
    DISCOVER: /^6(011|5)/, // 6011 or 65
    AMEX: /^3[47]/ // 34 or 37
  };

  function CreditableCardType(val) {
    for (var j in types) {
      if (!!val.match(types[j])) {
        return j;
      }
    }

    return -1;
  }

  CreditableCardType.TYPES = types;
  w.CreditableCardType = CreditableCardType;

}(typeof global !== "undefined" ? global : this));

// jQuery Plugin
(function(w, $) {
  "use strict";

  $(document).bind("politespace-init politespace-input", function(event) {
    var $t = $(event.target);
    if (!$t.is("[data-politespace-creditcard]")) {
      return;
    }
    var pspace = $t.data("politespace");
    var val = $t.val();
    var adjustMaxlength = $t.is("[data-politespace-creditcard-maxlength]");
    var type = w.CreditableCardType(val);

    if (type === "AMEX") {
      pspace.setGroupLength(adjustMaxlength ? "4,6,5" : "4,6,");

      if (adjustMaxlength) {
        $t.attr("maxlength", 15);
      }
    } else if (type === "DISCOVER" || type === "VISA" || type === "MASTERCARD") {
      pspace.setGroupLength(adjustMaxlength ? "4,4,4,4" : "4");

      if (adjustMaxlength) {
        $t.attr("maxlength", 16);
      }
    }
  });

}(typeof global !== "undefined" ? global : this, jQuery));

// jQuery Plugin
(function(w, $) {
  "use strict";

  var maxlengthCacheKey = "politespace-us-telephone-maxlength";
  var eventName = "politespace-beforeblur.politespace-us-telephone";

  function cleanup(el) {
    var $t = $(el);
    var val = $t.val();

    $t.val(val.replace(/^1/, ""));
  }

  // On init
  $(document).bind("politespace-init", function(event) {
    var $t = $(event.target);
    if (!$t.is("[data-politespace-us-telephone]")) {
      return;
    }

    // Adjust maxlength
    var maxlength = $t.attr("maxlength");

    if (maxlength) {
      $t.data(maxlengthCacheKey, parseInt(maxlength, 10));

      cleanup($t[0]);
      $t.off(eventName).on(eventName, function() {
        $(this).attr("maxlength", $t.data(maxlengthCacheKey));
        cleanup(this);
      });
    }
  });

  // On input
  $(document).bind("politespace-input", function(event) {
    var $t = $(event.target);
    if (!$t.is("[data-politespace-us-telephone]")) {
      return;
    }

    if ($t.val().indexOf('1') === 0) {
      $t.attr("maxlength", $t.data(maxlengthCacheKey) + 1);
    }
  });

}(typeof global !== "undefined" ? global : this, jQuery));

(function($) {
  "use strict";

  // jQuery Plugin

  var componentName = "politespace",
    initSelector = "[data-" + componentName + "]";

  $.fn[componentName] = function() {
    return this.each(function() {
      var $t = $(this);
      if ($t.data(componentName)) {
        return;
      }

      var polite = new Politespace(this);
      if (polite.useProxy()) {
        polite.createProxy();
      }

      $t.bind("politespace-hide-proxy", function() {
          $(this).closest(".politespace-proxy").removeClass("active");
        })
        .bind("politespace-show-proxy", function() {
          $(this).closest(".politespace-proxy").addClass("active");

          polite.update();
          polite.updateProxy();
        })
        .bind("input keydown", function() {
          $(this).trigger("politespace-input");

          polite.updateProxy();
        })
        .bind("blur", function() {
          $(this).trigger("politespace-beforeblur");

          polite.update();

          if (polite.useProxy()) {
            $(this).trigger("politespace-show-proxy");
          }
        })
        .bind("focus", function() {
          $(this).trigger("politespace-hide-proxy");
          polite.reset();
        })
        .data(componentName, polite)
        .trigger("politespace-init");

      polite.update();
      polite.updateProxy();
    });
  };

  // auto-init on enhance (which is called on domready)
  $(document).bind("enhance", function(e) {
    var $sel = $(e.target).is(initSelector) ? $(e.target) : $(initSelector, e.target);
    $sel[componentName]();
  });

}(jQuery));
