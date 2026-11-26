(function () {
  'use strict';

  var SUPPORTED = ['en', 'da', 'de', 'es', 'fr', 'it', 'nl', 'nb', 'sv', 'fi', 'pl', 'pt', 'pt-BR', 'tr', 'ar'];
  var LANG_LABELS = {
    'en': 'English',
    'da': 'Dansk',
    'de': 'Deutsch',
    'es': 'Español',
    'fr': 'Français',
    'it': 'Italiano',
    'nl': 'Nederlands',
    'nb': 'Norsk',
    'sv': 'Svenska',
    'fi': 'Suomi',
    'pl': 'Polski',
    'pt': 'Português',
    'pt-BR': 'Português (BR)',
    'tr': 'Türkçe',
    'ar': 'العربية'
  };
  var STORAGE_KEY = 'smartstream_site_lang';
  var DEFAULT_LANG = 'en';

  function normalizeLang(code) {
    if (!code) return DEFAULT_LANG;
    var raw = String(code).trim().toLowerCase().replace('_', '-');
    if (raw === 'pt-br' || raw.indexOf('pt-br-') === 0) return 'pt-BR';
    var base = raw.split('-')[0];
    if (base === 'no' || base === 'nn') base = 'nb';
    return SUPPORTED.indexOf(base) >= 0 ? base : DEFAULT_LANG;
  }

  function detectLang() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('lang')) return normalizeLang(params.get('lang'));
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return normalizeLang(stored);
    } catch (_) { /* private browsing */ }
    if (navigator.languages && navigator.languages.length) {
      for (var i = 0; i < navigator.languages.length; i++) {
        var guess = normalizeLang(navigator.languages[i]);
        if (SUPPORTED.indexOf(guess) >= 0) return guess;
      }
    }
    return DEFAULT_LANG;
  }

  function t(lang, key) {
    var pack = window.SMARTSTREAM_I18N;
    if (!pack) return null;
    if (pack[lang] && pack[lang][key]) return pack[lang][key];
    if (pack.en && pack.en[key]) return pack.en[key];
    return null;
  }

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar' ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var value = t(lang, key);
      if (value != null) el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var value = t(lang, key);
      if (value != null) el.innerHTML = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var value = t(lang, key);
      if (value != null) el.setAttribute('placeholder', value);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      var value = t(lang, key);
      if (value != null) el.setAttribute('alt', value);
    });
    var titleKey = document.body.getAttribute('data-title-key');
    if (titleKey) {
      document.title = t(lang, titleKey) || document.title;
    }
    var select = document.getElementById('langSelect');
    if (select && select.value !== lang) select.value = lang;
  }

  function setLang(lang) {
    lang = normalizeLang(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* ignore */ }
    applyLang(lang);
  }

  function buildLangSelect() {
    var host = document.getElementById('langSwitch');
    if (!host) return;
    var select = document.createElement('select');
    select.id = 'langSelect';
    select.setAttribute('aria-label', 'Language');
    SUPPORTED.forEach(function (code) {
      var opt = document.createElement('option');
      opt.value = code;
      opt.textContent = LANG_LABELS[code] || code.toUpperCase();
      select.appendChild(opt);
    });
    select.addEventListener('change', function () { setLang(select.value); });
    host.appendChild(select);
  }

  function initManualReveal() {
    var main = document.querySelector('main');
    if (!main) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    if (document.documentElement.classList.contains('js-reveal')) return;

    document.documentElement.classList.add('js-reveal');
    var nodes = main.querySelectorAll('h2, h3, .figure, .toc, table.data, .note');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    nodes.forEach(function (el) { io.observe(el); });
  }

  window.SmartStreamSite = {
    setLang: setLang,
    getLang: function () { return normalizeLang(detectLang()); }
  };

  document.addEventListener('DOMContentLoaded', function () {
    initManualReveal();
    buildLangSelect();
    setLang(detectLang());
  });
})();
