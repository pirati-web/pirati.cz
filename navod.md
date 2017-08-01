# Návod pro Pirátský web

Zdrojové kódy webu: **https://github.com/pirati-web/pirati.cz**

Web je staticky kompilovaný v době změny, čili v repozitáři je opravdu všechno.

Správci webu: Ondřej Profant, Stanislav Štipl, Jakub Michálek, Vojta Pikal, Jan Loužek

## 1. Markdown a yaml

Je třeba znát značkovací **markdown**, který je velmi podobný grafickému plaintextu.
Markdown si můžete vyzkoušet i v [online editoru](http://dillinger.io/) s náhledem.

```md
# Nadpis 1. úrovně

## Nadpis 2. úrovně

### Odstavce

Samostatný odstavec. Lorem ipsum. **Tučně**, *kurzíva*, [link](https://www.pirati.cz)

Odstavec se zalomením se provede  
pomocí dvou mezer na konci řádku.

1\. odstavec začínající řadovou číslovkou.

### Seznamy

1. číslovaný seznam 1
2. číslovaný seznam 2

- nečíslovaný seznam 1
- nečíslovaný seznam 2

### Obrázky

![Popisek obrázku](assets/img/brand/logo.svg)

### Citace

> Pro kratší citace zcela dostačují české úvozovky, popřípadě v kurzivě. Nicméně pro delší citace je dobré větší zdůraznění.

```

**Yaml** se používá pro zanesení metadat k článkům (stránkám). Yaml hlavičku umístíme před markdown:

```Yaml
key1: hodnota
key2:
  - pole
  - hodnot
key3:
  key4: val1
  key5: val2
```

Nejlépe je to srozumitelné na [příkladu](https://raw.githubusercontent.com/pirati-web/pirati.cz/gh-pages/_people/ondrej-profant.md).

## Github

Jedná se o systém pro sdílení verzítextových dokumentů (jako např. náš web). Umí toho mnohem více. Pro vás je důležité vytvořit si registraci.

Návrhy na změnu (pull request) se projeví až po schválení. Ale i pokud máte přímo právo zápisu, tak se změny neobjeví zcela okamžitě.

## Články

Články (aktuality) je možno přidávat v grafickém rozhraní:

[**www.pirati.cz/admin**](https://www.pirati.cz/admin)

### Tagy

Tagy neoddělujeme čárkami, ale pouze mezerou. Zvolit správný tag není jednoduché - musí být vystižný, ale zároveň dost obecný, aby dával smysl i u dalších článků.

## Lidé a další stránky

Pro jednoduchou úpravu textu stačí tlačítko vpravo dole nad patičkou "Navrhni úpravu".

![Animace znázorňující navržení úpravy](/assets/img/navod/uprava.gif)

## Složitější změny

Zatím jsme prošli základy. Ale většinou není více potřeba. Pro opravdové změny je třeba ještě znát:

- HTML, CSS, JS
- git
- jekyll (liquid template)

### HTML

Některé stránky jsou složitější a je potřeba znalost HTML. Seznámení s HTML není obsahem tohoto návodu.

### Struktura webu

1. Kolekce začínají podtržítkem a jsou definovány v config.yaml. Včetně některých defaultních hodnot (např. obsah pravého sloupce).
2. Stránky jsou obvykle samostatné složky obsahující soubor `index.html` nebo `index.md`. Mohou zde být i další stránky např. `pripoj-se/kalendar.html`.
3. Hlavička, patička, pravý sloupec jsou ve složce `_includes`
