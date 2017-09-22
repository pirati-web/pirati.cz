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

<img src="{{'/assets/img/brand/logo.svg' | relative_url}}" alt="Logo Piráti" style="width: 80px;"/>

**Logo bílé:** {% for e in page.filexts1 %} [{{e}}]({{e | prepend: '/assets/img/brand/logo_white.' | relative_url}}), {% endfor %}

<img src="{{'/assets/img/brand/logo_white.png' | relative_url}}" alt="Logo Piráti" style="width: 80px; background-color: black; padding: 10px;" />

**Logo s textem:** {% for e in page.filexts1 %} [{{e}}]({{e | prepend: '/assets/img/brand/logo_napis.' | relative_url}}), {% endfor %}

![logo]({{'/assets/img/brand/logo_napis.svg' | relative_url}})

**Logo bílé s textem:** {% for e in page.filexts1 %} [{{e}}]({{e | prepend: '/assets/img/brand/logo_napis_white.' | relative_url}}), {% endfor %}

<img src="{{'/assets/img/brand/logo_napis_white.png' | relative_url}}" alt="Logo Piráti bilé" style="width: 190px; background-color: black; padding: 10px;" />
