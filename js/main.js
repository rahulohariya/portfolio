/* Rahul Ohariya — Portfolio interactions
   Vanilla JS only. Motion is gated on prefers-reduced-motion and pointer type. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- Magnetic elements ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      var strength = 0.3;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + dx * strength + 'px,' + dy * strength + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.transform = 'translate(0, 0)';
        setTimeout(function () { el.style.transition = ''; }, 400);
      });
    });
  }

  /* ---------- Project card tilt ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.project-card').forEach(function (card) {
      var base = parseFloat(card.style.getPropertyValue('--tilt')) || 0;
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(1000px) rotate(' + (base * 0.3) + 'deg) rotateY(' + (px * 4) + 'deg) rotateX(' + (-py * 4) + 'deg) translateY(-4px)';
        card.style.boxShadow = '6px 8px 0 rgba(17,17,17,0.9)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
        card.style.transform = 'rotate(' + base + 'deg)';
        card.style.boxShadow = 'none';
        setTimeout(function () { card.style.transition = ''; }, 300);
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
