# Piratsky admin jekyll based webu

Je build [Netlify CMS](https://www.netlifycms.org/) ktery si muzes pomoci git submodules pripojit k tvemu webu.

## Postup

- udelej si branch teto repository pojmenovanou, aby bylo jasne, kteremu webu patri (napr. jihocesky)
```
git branch jihocesky
```
- pokud nutne potrebujes nejake extra kolekce nebo jine extra veci, uprav si [config.yml](config.yml)
- uprav si index.html k obrazu svemu (napr. [takto](https://github.com/pirati-web/admin/commit/6d98a3486fe9d08c35cf9f6c8bf43299e665ff19))
- pushni branch
```
git push origin jihocesky
```
- pripoj si branch ke svemu webu:

```
cd <tam, kde mas vyclonovanou repo s webem>
git submodule add https://github.com/pirati-web/admin admin
# checkout your branch
cd admin
git checkout jihocesky
cd ..
```
- pushni zmeny (pripojeny submodul)
```
git add admin
git commit -m "admin submodule added"
git push origin gh-pages
```
