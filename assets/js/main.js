/**
* Template Name: Dewi
* Template URL: https://bootstrapmade.com/dewi-free-multi-purpose-html-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  // Cache DOM elements
  const selectBody = document.querySelector('body');
  const selectHeader = document.querySelector('#header');
  
  function toggleScrolled() {
    if (!selectHeader || (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top'))) return;
    if (window.scrollY > 100) {
      selectBody.classList.add('scrolled');
    } else {
      selectBody.classList.remove('scrolled');
    }
  }

  // Debounce scroll event for better performance
  let scrollTimeout;
  document.addEventListener('scroll', function() {
    if (scrollTimeout) {
      cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(toggleScrolled);
  });
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    selectBody.classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      if (window.scrollY > 100) {
        scrollTop.classList.add('active');
      } else {
        scrollTop.classList.remove('active');
      }
    }
  }
  
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  // Use same debounced scroll handler
  document.addEventListener('scroll', function() {
    if (scrollTimeout) {
      cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(toggleScrollTop);
  });

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox – YouTube opens as iframe (type: external) to avoid Plyr error
   */
  // YouTube iframe attributes constant
  const YOUTUBE_IFRAME_ATTRS = {
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    allowfullscreen: '',
    frameborder: '0',
    referrerpolicy: 'strict-origin-when-cross-origin',
    title: 'YouTube video player'
  };
  
  // Function to set iframe attributes
  function setIframeAttributes(iframe) {
    Object.keys(YOUTUBE_IFRAME_ATTRS).forEach(key => {
      iframe.setAttribute(key, YOUTUBE_IFRAME_ATTRS[key]);
    });
    Object.assign(iframe.style, {
      width: '100%',
      height: '100%',
      border: 'none',
      minHeight: '315px',
      minWidth: '560px'
    });
  }
  
  // Patch GLightbox's sourceType to check for data-glightbox attribute first
  if (typeof GLightbox !== 'undefined' && GLightbox.prototype && GLightbox.prototype.sourceType) {
    const originalSourceType = GLightbox.prototype.sourceType;
    const glightboxLinks = document.querySelectorAll('a.glightbox');
    
    GLightbox.prototype.sourceType = function(url) {
      const urlBase = url.split('?')[0];
      for (let i = 0; i < glightboxLinks.length; i++) {
        const href = glightboxLinks[i].getAttribute('href');
        if (href && (href === url || href.includes(urlBase))) {
          const glightboxAttr = glightboxLinks[i].getAttribute('data-glightbox');
          if (glightboxAttr && glightboxAttr.includes('type: external')) {
            return 'external';
          }
        }
      }
      return originalSourceType.call(this, url);
    };
  }
  
  const glightbox = GLightbox({
    selector: '.glightbox',
    beforeSlideLoad: function(data) {
      if (data.href && (data.href.includes('youtube.com/embed') || data.href.includes('youtube.com/watch'))) {
        data.type = 'external';
        if (data.href.includes('youtube.com/watch')) {
          const videoId = data.href.match(/[?&]v=([^&]+)/);
          if (videoId) {
            data.href = 'https://www.youtube.com/embed/' + videoId[1] + '?si=VPq6OgAar1k1ZJ62';
          }
        } else if (data.href.includes('youtube.com/embed') && !data.href.includes('si=')) {
          data.href += (data.href.includes('?') ? '&' : '?') + 'si=VPq6OgAar1k1ZJ62';
        }
      }
    },
    afterSlideLoad: function(data) {
      setTimeout(function() {
        const slide = document.querySelector('.gslide.current');
        if (!slide) return;
        
        const plyrWrapper = slide.querySelector('.plyr, [data-plyr-provider="youtube"]');
        if (plyrWrapper && plyrWrapper.parentNode) {
          const wrapper = plyrWrapper.closest('.gvideo-wrapper');
          if (wrapper) {
            const iframe = document.createElement('iframe');
            const url = data.href || slide.querySelector('a')?.getAttribute('href') || 'https://www.youtube.com/embed/6i3WU4rznXQ?si=VPq6OgAar1k1ZJ62';
            iframe.src = url;
            setIframeAttributes(iframe);
            wrapper.innerHTML = '';
            wrapper.appendChild(iframe);
            return;
          }
        }
        
        const iframe = slide.querySelector('iframe[src*="youtube"]');
        if (iframe) {
          setIframeAttributes(iframe);
        }
      }, 300);
    }
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  const navmenulinks = document.querySelectorAll('.navmenu a');
  const navmenuActiveLinks = document.querySelectorAll('.navmenu a.active');

  function navmenuScrollspy() {
    const scrollPosition = window.scrollY + 200;
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      const section = document.querySelector(navmenulink.hash);
      if (!section) return;
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
        navmenuActiveLinks.forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  // Use debounced scroll handler
  document.addEventListener('scroll', function() {
    if (scrollTimeout) {
      cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(navmenuScrollspy);
  });

})();