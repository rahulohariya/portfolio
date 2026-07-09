/* Rahul Ohariya — Portfolio interactions
   Vanilla JS only. All scroll effects use IntersectionObserver.
   Motion is gated on prefers-reduced-motion and pointer type. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- Hero load reveal ---------- */
  window.addEventListener('load', function () {
    document.body.classList.add('loaded');
  });
  // Fallback in case load already fired or hangs on slow assets
  setTimeout(function () { document.body.classList.add('loaded'); }, 900);

  /* ---------- Scroll progress bar ---------- */
  var progress = document.querySelector('.scroll-progress');
  if (progress) {
    var updateProgress = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- Nav: scrolled state + mobile menu ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onNavScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();

    var burger = nav.querySelector('.nav-burger');
    var menu = document.querySelector('.mobile-menu');
    if (burger && menu) {
      burger.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        nav.classList.toggle('menu-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      menu.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          menu.classList.remove('open');
          nav.classList.remove('menu-open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /* ---------- Scroll reveals (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  } else if (revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var runCounter = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (reduceMotion) {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  } else if (counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- Custom cursor (fine pointers only) ---------- */
  if (finePointer && !reduceMotion) {
    var dot = document.createElement('div');
    var ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add('has-cursor');

    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    }, { passive: true });

    (function ringLoop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(ringLoop);
    })();

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, .card')) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, .card')) {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      var strength = 0.35;
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

  /* ---------- 3D tilt cards ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.card').forEach(function (card) {
      var maxTilt = 7;
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(900px) rotateX(' + (-py * maxTilt) + 'deg) rotateY(' + (px * maxTilt) + 'deg) translateZ(0)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s';
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
        setTimeout(function () { card.style.transition = ''; }, 500);
      });
    });
  }

  /* ---------- Blob parallax (scroll + mouse) ---------- */
  if (!reduceMotion) {
    var blobs = document.querySelectorAll('.blob');
    if (blobs.length) {
      var bx = 0, by = 0, targetBx = 0, targetBy = 0, scrollFactor = 0;
      document.addEventListener('mousemove', function (e) {
        targetBx = (e.clientX / window.innerWidth - 0.5) * 2;
        targetBy = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });
      window.addEventListener('scroll', function () {
        scrollFactor = window.scrollY;
      }, { passive: true });
      (function blobLoop() {
        bx += (targetBx - bx) * 0.03;
        by += (targetBy - by) * 0.03;
        blobs.forEach(function (blob, i) {
          var depth = (i + 1) * 8;
          var sy = scrollFactor * (0.02 + i * 0.015);
          blob.style.translate = (bx * depth) + 'px ' + (by * depth - sy) + 'px';
        });
        requestAnimationFrame(blobLoop);
      })();
    }
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
