---
layout: program
title: Dlouhodobý program
---

{% assign program = site.program | group_by:"topic" %}
{% for topic in program %}
  {% include accordeon/accordeon-column.html param='topic' %}
{% endfor %}


<div class="medium-12 large-4 columns o-section-block--medium">
  <ul class="c-widget-accordion c-widget-accordion--unstacksibling c-widget-accordion--topspace" data-accordion="" data-allow-all-closed="true">
    <li class="c-widget-accordion-item" data-accordion-item="">
      <a href="http://www.seznam.cz" class="c-widget-accordion-link">
        <span class="c-widget-accordion__title c-widget-accordion__title--noicon c-widget-accordion__title--plain">Nadpis</span>
      </a>
    </li>
  </ul>
</div>
