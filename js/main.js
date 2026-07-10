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
      var base = parseFloat(getComputedStyle(card).getPropertyValue('--tilt')) || 0;
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

  /* ---------- Project card scroll-in stacking reveal ---------- */
  (function () {
    var cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;
    if (reduceMotion) {
      cards.forEach(function (el) {
        var base = getComputedStyle(el).getPropertyValue('--tilt').trim() || '0deg';
        el.style.opacity = '1';
        el.style.transform = 'rotate(' + base + ')';
      });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var base = getComputedStyle(el).getPropertyValue('--tilt').trim() || '0deg';
          el.style.transition = 'none';
          el.style.animation = 'cardStackIn 0.7s cubic-bezier(0.16,1,0.3,1) both';
          el.style.opacity = '1';
          requestAnimationFrame(function () {
            el.style.transform = 'rotate(' + base + ')';
            el.style.transition = 'transform 0.2s ease-out, box-shadow 0.2s ease-out';
          });
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------- Services: flip on hover (desktop), tap (mobile), auto-demo ---------- */
  (function () {
    var serviceCards = document.querySelectorAll('.service-card');
    var serviceSlides = document.querySelectorAll('.service-slide');
    if (!serviceCards.length && !serviceSlides.length) return;

    if (finePointer) {
      serviceCards.forEach(function (card) {
        card.addEventListener('mouseenter', function () { card.classList.add('flipped'); });
        card.addEventListener('mouseleave', function () { card.classList.remove('flipped'); });
      });
    }
    serviceSlides.forEach(function (slide) {
      slide.addEventListener('click', function () { slide.classList.toggle('flipped'); });
    });

    if (!reduceMotion && serviceCards.length) {
      var autoFlipTimer = setInterval(function () {
        var idle = Array.prototype.filter.call(serviceCards, function (c) { return !c.classList.contains('flipped'); });
        if (!idle.length) return;
        var pick = idle[Math.floor(Math.random() * idle.length)];
        pick.classList.add('flipped');
        setTimeout(function () { pick.classList.remove('flipped'); }, 1300);
      }, 2600);
      window.addEventListener('pagehide', function () { clearInterval(autoFlipTimer); });
    }

    if (serviceSlides.length) {
      if (reduceMotion) {
        serviceSlides.forEach(function (el) { el.classList.add('in-view'); });
      } else {
        var slideObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              slideObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.25, rootMargin: '0px 0px -60px 0px' });
        serviceSlides.forEach(function (el) { slideObserver.observe(el); });
      }
    }
  })();

  /* ---------- Hamburger mobile menu ---------- */
  (function () {
    var nav = document.querySelector('.hamburger-nav');
    if (!nav) return;
    var btn = nav.querySelector('.hamburger-btn');
    var backdrop = nav.querySelector('.menu-backdrop');
    var closeMenu = function () { nav.classList.remove('open'); };
    btn.addEventListener('click', function () { nav.classList.toggle('open'); });
    if (backdrop) backdrop.addEventListener('click', closeMenu);
    nav.querySelectorAll('.menu-row').forEach(function (row) {
      row.addEventListener('click', closeMenu);
    });
  })();

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
