/**
 * TYSON Racing (tr.tysonmediagroup.org) - Single Page Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Settings & Themes
    const settingsModal = document.getElementById('settings-modal');
    const settingsToggleBtn = document.getElementById('settings-toggle-btn');
    const settingsCloseBtn = document.getElementById('settings-modal-close-btn');
    const settingsBackdrop = document.getElementById('settings-modal-backdrop');
    const themeOptionCards = document.querySelectorAll('.theme-option-card');
    const replayIntroBtn = document.getElementById('replay-intro-btn');
    const animatedPage = document.querySelector('.intro-animated-page');

    const savedTheme = localStorage.getItem('tyson_racing_theme') || 'noir';

    function applyTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('tyson_racing_theme', themeName);

        themeOptionCards.forEach(card => {
            if (card.getAttribute('data-theme-choice') === themeName) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }

    applyTheme(savedTheme);

    function openSettingsModal() {
        if (!settingsModal) return;
        settingsModal.classList.add('active');
        settingsModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeSettingsModal() {
        if (!settingsModal) return;
        settingsModal.classList.remove('active');
        settingsModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (settingsToggleBtn) settingsToggleBtn.addEventListener('click', openSettingsModal);
    if (settingsCloseBtn) settingsCloseBtn.addEventListener('click', closeSettingsModal);
    if (settingsBackdrop) settingsBackdrop.addEventListener('click', closeSettingsModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsModal && settingsModal.classList.contains('active')) {
            closeSettingsModal();
        }
    });

    themeOptionCards.forEach(card => {
        card.addEventListener('click', () => {
            const choice = card.getAttribute('data-theme-choice');
            applyTheme(choice);
        });
    });

    // 2. Intro Trace Animation Trigger
    function triggerTraceSequence() {
        if (!animatedPage) return;

        const fontLoadPromise = (document.fonts && document.fonts.load)
            ? Promise.all([
                document.fonts.load('italic 78px "Cormorant Garamond"'),
                document.fonts.ready
              ])
            : Promise.resolve();

        fontLoadPromise.then(() => {
            const traceChars = document.querySelectorAll('.trace-char');
            traceChars.forEach(ch => {
                ch.style.animation = 'none';
                void ch.offsetWidth; // force reflow
                ch.style.animation = '';
            });

            const svgHero = document.querySelector('.domain-hero-svg');
            if (svgHero) {
                svgHero.style.animation = 'none';
                void svgHero.offsetWidth;
                svgHero.style.animation = '';
            }

            setTimeout(() => {
                animatedPage.classList.add('intro-complete');
            }, 1950);
        }).catch(() => {
            setTimeout(() => {
                animatedPage.classList.add('intro-complete');
            }, 1950);
        });
    }

    triggerTraceSequence();

    if (replayIntroBtn && animatedPage) {
        replayIntroBtn.addEventListener('click', () => {
            closeSettingsModal();
            navigateToView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            animatedPage.classList.remove('intro-complete');
            triggerTraceSequence();
        });
    }

    // 3. SPA Router
    const views = document.querySelectorAll('.page-view');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNav = document.getElementById('main-nav');
    const mobileToggle = document.getElementById('mobile-toggle');

    function navigateToView(viewId, pushToHistory = true) {
        const targetId = (viewId || 'home').replace('#', '');
        let targetView = document.getElementById(`view-${targetId}`);

        if (!targetView) {
            targetView = document.getElementById('view-home');
        }

        views.forEach(v => v.classList.remove('active-view'));
        if (targetView) {
            targetView.classList.add('active-view');
        }

        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            if (href === `#${targetId}` || (targetId === 'home' && (href === '#home' || href === '#'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        if (mobileNav) {
            mobileNav.classList.remove('active');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (animatedPage && targetId !== 'home') {
            animatedPage.classList.add('intro-complete');
        }

        if (pushToHistory && window.location.hash !== `#${targetId}`) {
            history.pushState(null, '', `#${targetId}`);
        }
    }

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                navigateToView(href);
            }
        }
    });

    window.addEventListener('popstate', () => {
        const currentHash = window.location.hash || '#home';
        navigateToView(currentHash, false);
    });

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });
    }

    const initialRoute = window.location.hash || '#home';
    navigateToView(initialRoute, false);

    // 4. Hero Background Crossfade Carousel
    const heroSlides = document.querySelectorAll('.hero-bg-slide');
    let currentSlideIdx = 0;

    if (heroSlides.length > 1) {
        setInterval(() => {
            heroSlides[currentSlideIdx].classList.remove('active');
            currentSlideIdx = (currentSlideIdx + 1) % heroSlides.length;
            heroSlides[currentSlideIdx].classList.add('active');
        }, 4200);
    }
});
