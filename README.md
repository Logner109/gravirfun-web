# GravirFun – webová stránka

Prezentačný web pre GravirFun (laserové gravírovanie na mieru). Statická stránka v slovenčine, postavená na Bootstrape 5.3, hostovaná na GitHub Pages.

- Adresa: https://logner109.github.io/gravirfun-web/
- Každá zmena v branchi `main` sa zverejní automaticky, zvyčajne do minúty.

## Štruktúra

```
index.html                    hlavná stránka (všetky sekcie)
ochrana-osobnych-udajov.html  informácie o spracovaní osobných údajov (GDPR)
404.html                      stránka pre neexistujúcu adresu
assets/css/style.css          vlastné štýly (farby, sekcie)
assets/js/main.js             navigácia a kontaktný formulár
assets/img/                   logo, ikony, obrázky
assets/vendor/bootstrap/      Bootstrap 5.3 (lokálna kópia, bez externých služieb)
site.webmanifest, robots.txt, sitemap.xml
```

## Ako upraviť text

1. Na GitHube otvor súbor (napr. `index.html`) a klikni na ceruzku **Edit**.
2. Uprav text medzi značkami, napr. `<p>…</p>`.
3. Klikni **Commit changes**. Stránka sa sama obnoví do minúty.

Texty sú v `index.html` usporiadané po sekciách: Úvod, Materiály, Produkty, Pre firmy, Ako to funguje, Galéria, Kontakt, Pätička. Každá sekcia začína komentárom `<!-- Názov -->`.

## Čo treba doplniť (zástupné údaje)

Všetky miesta sú v kóde označené komentárom `<!-- DOPLNIŤ: … -->`.

| Čo | Kde |
| --- | --- |
| E-mail (skontrolovať adresu) | `index.html` sekcia Kontakt a Pätička, `ochrana-osobnych-udajov.html` časť 1 a 7 |
| Telefón (teraz +421 900 000 000) | `index.html` sekcia Kontakt a Pätička, `ochrana-osobnych-udajov.html` časť 1 |
| Jomi Lux: právna forma, adresa, IČO, DIČ | `index.html` Pätička, `ochrana-osobnych-udajov.html` časť 1 |
| Mesto alebo región, kde sa vyrába | `index.html` sekcia Kontakt („Kde vyrábame“) |
| Kľúč pre kontaktný formulár | `assets/js/main.js`, premenná `WEB3FORMS_KEY` (pozri nižšie) |
| Fotky produktov a galérie | pozri nižšie |

## Kontaktný formulár

GitHub Pages nevie spracovať formuláre, preto web používa bezplatnú službu [Web3Forms](https://web3forms.com):

1. Na web3forms.com zadaj e-mail, na ktorý majú chodiť dopyty. Príde ti **Access Key**.
2. V súbore `assets/js/main.js` nahraď `DOPLNIT_ACCESS_KEY` týmto kľúčom.

Kým kľúč nie je doplnený, formulár otvorí e-mailový program návštevníka s predvyplnenou správou, takže funguje aj teraz.

## Ako pridať fotky

Fotky ulož do `assets/img/produkty/` alebo `assets/img/galeria/` (ideálne pomer 4:3, šírka okolo 1200 px, JPG do 300 kB).

**Produkt** – v `index.html` nahraď blok `<div class="ph …">…</div>` v karte produktu týmto:

```html
<img class="product-img" src="assets/img/produkty/darceky.jpg" alt="Drevený lopárik s venovaním">
```

**Galéria** – nahraď celý `<figure class="gallery-item">…</figure>` týmto:

```html
<figure class="gallery-item">
  <img src="assets/img/galeria/01.jpg" alt="Lopárik s venovaním">
  <figcaption>Lopárik s venovaním</figcaption>
</figure>
```

Ďalšie dlaždice pridáš skopírovaním celého `<div class="col-6 col-lg-4">…</div>`.

## Vlastná doména (napr. gravirfun.sk)

1. U registrátora domény nastav DNS:
   - `A` záznamy pre `gravirfun.sk` na 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `CNAME` pre `www` na `logner109.github.io`
2. V repozitári vytvor súbor `CNAME` s obsahom `gravirfun.sk` (alebo ho nastav v Settings → Pages → Custom domain a zapni Enforce HTTPS).
3. V `index.html` zmeň adresy v `canonical`, `og:url` a `og:image`, v `robots.txt` a `sitemap.xml` tiež. Odkazy v kóde sú relatívne, takže nič iné meniť netreba.

## Lokálne zobrazenie

Stačí otvoriť `index.html` v prehliadači. Formulár s Web3Forms kľúčom vyžaduje spustenie cez `http://`, napr.:

```
python3 -m http.server 8000
```

a potom otvoriť http://localhost:8000.

## Ochrana osobných údajov

Stránka `ochrana-osobnych-udajov.html` je všeobecný vzor informačnej povinnosti pre kontaktný formulár. Pred ostrým spustením si doplň údaje prevádzkovateľa a text skontroluj.
