'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. Header shadow on scroll
     ============================================================ */
  const header = document.querySelector('header');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }, { passive: true });


  /* ============================================================
     2. Smooth scroll (for anchor links)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
      closeMobileMenu();
    });
  });


  /* ============================================================
     3. Mobile hamburger menu
     ============================================================ */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu   = document.getElementById('mobile-menu');
  const closeMenuBtn = document.getElementById('close-menu');
  const menuOverlay  = document.getElementById('menu-overlay');

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.classList.add('translate-x-0');
    if (menuOverlay) {
      menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
      menuOverlay.classList.add('opacity-100');
    }
    document.body.classList.add('overflow-hidden');
    hamburgerBtn && hamburgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.classList.remove('translate-x-0');
    if (menuOverlay) {
      menuOverlay.classList.add('opacity-0', 'pointer-events-none');
      menuOverlay.classList.remove('opacity-100');
    }
    document.body.classList.remove('overflow-hidden');
    hamburgerBtn && hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  hamburgerBtn  && hamburgerBtn.addEventListener('click', openMobileMenu);
  closeMenuBtn  && closeMenuBtn.addEventListener('click', closeMobileMenu);
  menuOverlay   && menuOverlay.addEventListener('click', closeMobileMenu);

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });


  /* ============================================================
     4. FAQ Accordion
     ============================================================ */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item   = this.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const icon   = this.querySelector('.faq-icon');
      const isOpen = item.classList.contains('faq-open');

      // Close all open items
      document.querySelectorAll('.faq-item.faq-open').forEach(function (openItem) {
        openItem.classList.remove('faq-open');
        const ans = openItem.querySelector('.faq-answer');
        const ic  = openItem.querySelector('.faq-icon');
        if (ans) {
          ans.style.maxHeight    = '0';
          ans.style.paddingTop   = '0';
          ans.style.paddingBottom = '0';
        }
        if (ic) ic.style.transform = 'rotate(0deg)';
      });

      // Open clicked item if it was closed
      if (!isOpen) {
        item.classList.add('faq-open');
        answer.style.maxHeight    = answer.scrollHeight + 'px';
        answer.style.paddingTop   = '0.625rem';
        answer.style.paddingBottom = '1.5rem';
        if (icon) icon.style.transform = 'rotate(45deg)';
      }
    });
  });


  /* ============================================================
     5. Contact form validation
     ============================================================ */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      this.querySelectorAll('.error-msg').forEach(function (el) { el.remove(); });
      this.querySelectorAll('.error-field').forEach(function (el) {
        el.classList.remove('error-field');
      });

      let valid = true;

      // Required text fields
      [
        { id: 'name',  label: 'お名前' },
        { id: 'phone', label: 'お電話番号' },
      ].forEach(function (f) {
        const input = document.getElementById(f.id);
        if (input && !input.value.trim()) {
          valid = false;
          appendError(input, f.label + 'を入力してください。');
        }
      });

      // Optional email — validate format only if filled
      const emailInput = document.getElementById('email');
      if (emailInput && emailInput.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
          valid = false;
          appendError(emailInput, '有効なメールアドレスを入力してください。');
        }
      }

      // Privacy checkbox
      const privacyCheck = document.getElementById('privacy');
      if (privacyCheck && !privacyCheck.checked) {
        valid = false;
        const wrap = document.getElementById('privacy-wrap') || privacyCheck.parentElement;
        const errEl = document.createElement('p');
        errEl.className = 'error-msg';
        errEl.textContent = '個人情報保護方針への同意が必要です。';
        wrap.appendChild(errEl);
      }

      if (valid) {
        showFormSuccess();
      }
    });
  }

  function appendError(input, message) {
    input.classList.add('error-field');
    const p = document.createElement('p');
    p.className = 'error-msg';
    p.textContent = message;
    input.parentElement.appendChild(p);
  }

  function showFormSuccess() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.innerHTML = `
      <div style="text-align:center; padding: 3rem 1rem;">
        <div style="
          width: 72px; height: 72px;
          background: linear-gradient(135deg, #888, #aaa);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
          font-size: 2rem; color: white;
        ">!</div>
        <h3 style="font-family:'Noto Serif JP',serif; font-size:1.375rem; font-weight:700; color:#333; margin-bottom:0.75rem;">
          デモ表示です
        </h3>
        <p style="color:#666; font-size:1rem; line-height:1.9;">
          こちらはデザインモックのため、実際の送信は行われません。<br>
          フォームのバリデーション動作の確認用です。
        </p>
      </div>
    `;
  }


  /* ============================================================
     6. Scroll fade-in (IntersectionObserver)
     ============================================================ */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeEls.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ============================================================
     7. Scroll to top button
     ============================================================ */
  const scrollTopBtn = document.getElementById('scroll-top');

  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        scrollTopBtn.classList.add('opacity-100');
      } else {
        scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
        scrollTopBtn.classList.remove('opacity-100');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
