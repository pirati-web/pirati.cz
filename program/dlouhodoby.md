---
layout: program
title: Dlouhodobý program
---

<div class="o-section-block">
  <ul class="c-widget-accordion" data-accordion="">
    <li class="c-widget-accordion-item" data-accordion-item="">
      <a href="#" class="c-widget-accordion-link c-widget-accordion-link--fb">
        <span class="c-widget-accordion__title">Daňový systém</span>
      </a>
      <div class="c-widget-accordion-content u-center" data-tab-content="">
      </div>
    </li>
  </ul>
</div>

<div class="row o-section-block o-section-block--fill">

{% assign program = site.program | group_by:"topic" %}
{% for topic in program %}
  {% include accordeon/accordeon-column.html param='topic' %}
{% endfor %}

</div>
