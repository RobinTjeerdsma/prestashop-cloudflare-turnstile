/**
 * Copyright (c) Since 2022 Pixel Développement and contributors
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// Turnstile only draws the widgets that are in the page when its script runs.
// A form that a script replaces later (e.g. a one-page checkout re-rendering its
// steps after an ajax save) comes back with a fresh, empty widget and no token,
// so draw those as they appear.
(function () {
  'use strict';

  var fromPageLoad = [];

  function renderNewWidgets() {
    if (!window.turnstile) {
      return; // not loaded yet: its own rendering picks them up
    }
    var widgets = document.querySelectorAll('.cf-turnstile');
    for (var i = 0; i < widgets.length; i++) {
      var el = widgets[i];
      if (el.childElementCount !== 0 || fromPageLoad.indexOf(el) !== -1) {
        continue;
      }
      try {
        window.turnstile.render(el, {
          sitekey: el.getAttribute('data-sitekey'),
          theme: el.getAttribute('data-theme') || 'auto',
          appearance: el.getAttribute('data-appearance') || 'always',
          action: el.getAttribute('data-action') || undefined
        });
      } catch (e) {
        // already drawn by Turnstile itself in the meantime
      }
    }
  }

  function start() {
    fromPageLoad = Array.prototype.slice.call(document.querySelectorAll('.cf-turnstile'));
    new MutationObserver(renderNewWidgets).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
