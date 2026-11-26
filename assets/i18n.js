(function () {
  var langs = ['en', 'da', 'de', 'es', 'fr', 'it', 'nl', 'nb', 'sv', 'fi', 'pl', 'pt', 'pt-BR', 'tr', 'ar'];
  var out = {};
  langs.forEach(function (l) {
    out[l] = Object.assign(
      {},
      (window.SMARTSTREAM_I18N_PRODUCT || {})[l] || {},
      (window.SMARTSTREAM_I18N_MANUAL || {})[l] || {},
      (window.SMARTSTREAM_I18N_LEGAL || {})[l] || {}
    );
  });
  window.SMARTSTREAM_I18N = out;
})();
