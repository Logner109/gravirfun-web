/* GravirFun – správanie stránky
   1. tieň navigácie pri skrolovaní
   2. zatvorenie mobilného menu po kliknutí
   3. predvyplnenie typu dopytu (firma) z tlačidiel
   4. odoslanie kontaktného formulára cez Web3Forms, s náhradným riešením cez e-mail
*/

(function () {
  'use strict';

  // DOPLNIŤ: prístupový kľúč z https://web3forms.com (zadáš e-mail, kľúč príde poštou).
  // Kým je tu zástupný text, formulár otvorí e-mailový program s predvyplnenou správou.
  var WEB3FORMS_KEY = 'DOPLNIT_ACCESS_KEY';

  // --- navigácia --------------------------------------------------------
  var nav = document.getElementById('mainNav');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#navMenu .nav-link[href^="#"]'));
  var sections = navLinks.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  function updateActiveLink() {
    var y = window.scrollY + 140;
    var current = null;
    sections.forEach(function (section) {
      if (section.offsetTop <= y) current = section;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', !!current && link.getAttribute('href') === '#' + current.id);
    });
  }

  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
    updateActiveLink();
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateActiveLink);

  var menu = document.getElementById('navMenu');
  if (menu) {
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (menu.classList.contains('show') && window.bootstrap) {
          window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
        }
      });
    });
  }

  // --- rok v pätičke ----------------------------------------------------
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // --- predvyplnenie "Som: firma" -----------------------------------------
  var typSelect = document.getElementById('typ');
  document.querySelectorAll('[data-typ]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (typSelect) typSelect.value = el.getAttribute('data-typ');
    });
  });

  // --- kontaktný formulár ------------------------------------------------
  var form = document.getElementById('dopytForm');
  if (!form) return;

  var status = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');
  var emailLink = document.querySelector('[data-contact-email]');
  var contactEmail = emailLink ? emailLink.getAttribute('href').replace(/^mailto:/, '') : '';

  function setStatus(message, kind) {
    if (!status) return;
    status.className = 'alert mb-0 alert-' + kind;
    status.textContent = message;
  }

  function hasKey() {
    return WEB3FORMS_KEY && WEB3FORMS_KEY.indexOf('DOPLNIT') !== 0;
  }

  function collect() {
    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = value; });
    return data;
  }

  function typLabel(value) {
    return value === 'firma' ? 'Firma alebo organizácia' : 'Súkromná osoba';
  }

  function sendByMail(data) {
    var subject = 'Dopyt z webu GravirFun – ' + data.meno;
    var body = [
      'Meno: ' + data.meno,
      'E-mail: ' + data.email,
      'Telefón: ' + (data.telefon || '-'),
      'Som: ' + typLabel(data.typ),
      '',
      'Čo potrebujem gravírovať:',
      data.sprava
    ].join('\n');
    window.location.href = 'mailto:' + contactEmail +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    setStatus('Otvorili sme váš e-mailový program s predvyplneným dopytom. Ak sa neotvoril, napíšte nám priamo na ' + contactEmail + '.', 'warning');
  }

  function sendByWeb3Forms(data) {
    submitBtn.disabled = true;
    setStatus('Odosielame…', 'info');
    var payload = {
      access_key: WEB3FORMS_KEY,
      subject: 'Dopyt z webu GravirFun – ' + data.meno,
      from_name: 'GravirFun web',
      'Meno': data.meno,
      'E-mail': data.email,
      'Telefón': data.telefon || '-',
      'Som': typLabel(data.typ),
      'Správa': data.sprava,
      botcheck: data.botcheck || ''
    };
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.success) throw new Error(json.message || 'Odoslanie zlyhalo');
        form.reset();
        form.classList.remove('was-validated');
        setStatus('Ďakujeme! Dopyt sme prijali a čoskoro sa vám ozveme.', 'success');
      })
      .catch(function () {
        setStatus('Dopyt sa nepodarilo odoslať. Napíšte nám, prosím, priamo na ' + contactEmail + '.', 'danger');
      })
      .finally(function () { submitBtn.disabled = false; });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      var firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    var data = collect();
    if (data.botcheck) return; // spam
    if (hasKey()) sendByWeb3Forms(data);
    else sendByMail(data);
  });
})();
