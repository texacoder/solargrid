/* =========================================================
   SolarGrid Energy Solutions — Global Script
   Handles: mobile nav, scroll reveal, back-to-top,
   FAQ accordion, gallery lightbox, contact form,
   subsidy calculator.
========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navbar = document.querySelector('.navbar');
  if (navToggle && navbar) {
    navToggle.addEventListener('click', function () {
      navbar.classList.toggle('mobile-open');
    });
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        navbar.classList.remove('mobile-open');
      });
    });
  }

  /* ---------- Back to top button ---------- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Animated counters (hero stats / subsidy stats) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- FAQ category filter ---------- */
  const faqCatBtns = document.querySelectorAll('.faq-cats .filter-btn');
  if (faqCatBtns.length) {
    faqCatBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        faqCatBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const cat = btn.getAttribute('data-cat');
        document.querySelectorAll('.faq-item').forEach(function (item) {
          if (cat === 'all' || item.getAttribute('data-cat') === cat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
            item.classList.remove('open');
            item.querySelector('.faq-answer').style.maxHeight = null;
          }
        });
      });
    });
  }

  /* ---------- Product filter (Products page) ---------- */
  const filterBtns = document.querySelectorAll('.product-filter-bar .filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const cat = btn.getAttribute('data-cat');
        document.querySelectorAll('.product-card').forEach(function (card) {
          if (cat === 'all' || card.getAttribute('data-cat') === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------- Gallery filter ---------- */
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-bar .filter-btn');
  if (galleryFilterBtns.length) {
    galleryFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        galleryFilterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const cat = btn.getAttribute('data-cat');
        document.querySelectorAll('.gallery-item').forEach(function (item) {
          if (cat === 'all' || item.getAttribute('data-cat') === cat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------- Gallery lightbox ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  if (galleryItems.length && lightbox) {
    const lbImg = lightbox.querySelector('img');
    const lbClose = lightbox.querySelector('.lightbox-close');
    const lbPrev = lightbox.querySelector('.lightbox-prev');
    const lbNext = lightbox.querySelector('.lightbox-next');
    let currentIndex = 0;
    let visibleItems = [];

    function refreshVisible() {
      visibleItems = Array.from(galleryItems).filter(function (it) {
        return it.style.display !== 'none';
      });
    }

    function openLightbox(item) {
      refreshVisible();
      currentIndex = visibleItems.indexOf(item);
      showCurrent();
      lightbox.classList.add('open');
    }

    function showCurrent() {
      const img = visibleItems[currentIndex].querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () { openLightbox(item); });
    });

    if (lbClose) lbClose.addEventListener('click', function () { lightbox.classList.remove('open'); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
    if (lbPrev) lbPrev.addEventListener('click', function () {
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      showCurrent();
    });
    if (lbNext) lbNext.addEventListener('click', function () {
      currentIndex = (currentIndex + 1) % visibleItems.length;
      showCurrent();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (e.key === 'ArrowLeft' && lbPrev) lbPrev.click();
      if (e.key === 'ArrowRight' && lbNext) lbNext.click();
    });
  }

  /* ---------- Contact form ---------- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const msg = contactForm.querySelector('.form-msg');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';

      msg.classList.remove('show', 'success', 'error');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const formData = new FormData(contactForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
        .then(function (response) { return response.json(); })
        .then(function (result) {
          if (result.success) {
            msg.textContent = "Thank you! Your message has been received. Our team will get back to you within 24 hours.";
            msg.classList.add('show', 'success');
            contactForm.reset();
          } else {
            msg.textContent = "Something went wrong. Please try again or call us directly.";
            msg.classList.add('show', 'error');
          }
        })
        .catch(function () {
          msg.textContent = "Something went wrong. Please check your connection and try again.";
          msg.classList.add('show', 'error');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        });
    });
  }

  /* ---------- Subsidy Calculator ---------- */
  const calcSlider = document.getElementById('billSlider');
  if (calcSlider) {
    const billValue = document.getElementById('billValue');
    const resultCapacity = document.getElementById('resultCapacity');
    const resultSubsidy = document.getElementById('resultSubsidy');
    const resultSavings = document.getElementById('resultSavings');
    const resultCost = document.getElementById('resultCost');

    function calculate() {
      const bill = parseInt(calcSlider.value);
      billValue.textContent = '₹' + bill.toLocaleString('en-IN');

      // Rough estimation logic for illustrative calculator
      const monthlyUnits = bill / 8; // approx cost per unit
      const capacityKw = Math.max(1, Math.round((monthlyUnits * 12) / 1400));
      const systemCost = capacityKw * 55000; // approx per kW cost

      let subsidy = 0;
      if (capacityKw <= 2) {
        subsidy = capacityKw * 30000;
      } else if (capacityKw === 3) {
        subsidy = 60000 + 18000;
      } else {
        subsidy = 78000;
      }
      subsidy = Math.min(subsidy, 78000);

      const netCost = systemCost - subsidy;
      const annualSavings = bill * 12 * 0.85;

      resultCapacity.textContent = capacityKw + ' kW';
      resultSubsidy.textContent = '₹' + subsidy.toLocaleString('en-IN');
      resultCost.textContent = '₹' + netCost.toLocaleString('en-IN');
      resultSavings.textContent = '₹' + Math.round(annualSavings).toLocaleString('en-IN');
    }

    calcSlider.addEventListener('input', calculate);
    calculate();
  }

  /* ---------- Set active nav link based on current page ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

});
