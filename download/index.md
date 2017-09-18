---
layout: page
title: Ke stažení
rbar: people
filexts1:
  - png
  - svg
  - pdf
  - ai
---



**Logo:** {% for e in page.filexts1 %} [{{e}}]({{e | prepend: '/assets/img/brand/logo.' | relative_url}}), {% endfor %}

<img src="{{'/assets/img/brand/logo.png' | relative_url}}" alt="Logo Piráti" style="width: 80px;"/>

**Logo s textem:** {% for e in page.filexts1 %} [{{e}}]({{e | prepend: '/assets/img/brand/logo_napis.' | relative_url}}), {% endfor %}

![logo]({{'/assets/img/brand/logo_napis.svg' | relative_url}})
