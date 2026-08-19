(function () {
  var langs = ['en', 'da', 'de', 'es', 'fr'];
  var out = {};
  langs.forEach(function (l) {
    out[l] = Object.assign(
      {},
      (window.SMARTSTREAM_I18N_PRODUCT || {})[l] || {},
      (window.SMARTSTREAM_I18N_MANUAL || {})[l] || {}
    );
  });
  window.SMARTSTREAM_I18N = out;
})();
