/* SparkleClean — instant estimate calculator (concept demo) */
(function () {
  'use strict';
  var type = document.getElementById('estType'), beds = document.getElementById('estBeds'), baths = document.getElementById('estBaths');
  var out = document.getElementById('estOut'), bedsOut = document.getElementById('estBedsOut'), bathsOut = document.getElementById('estBathsOut');
  if (!type || !out) return;
  var base = { standard: 89, deep: 149, move: 249, office: 129 };
  function calc() {
    var total = base[type.value] + Math.max(0, beds.value - 1) * 18 + Math.max(0, baths.value - 1) * 14;
    out.textContent = '$' + total;
    bedsOut.textContent = beds.value;
    bathsOut.textContent = baths.value;
  }
  [type, beds, baths].forEach(function (el) { el.addEventListener('input', calc); });
  calc();
})();
