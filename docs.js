// Progressive enhancement: chapter links and disclosure controls also work without JavaScript.
(function () {
    'use strict';

    function redirectTopic() {
        if (!document.body.hasAttribute('data-docs-index') || !location.hash) return;
        var id;
        try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { return; }
        var topic = document.getElementById(id);
        if (topic && topic.matches('a[data-topic-redirect]')) location.replace(topic.href);
    }
    redirectTopic();
    window.addEventListener('hashchange', redirectTopic);

    var mobile = window.matchMedia('(max-width: 768px)');
    function setDisclosureLayout() {
        document.querySelectorAll('.docs-menu, .page-toc').forEach(function (menu) {
            menu.open = !mobile.matches;
        });
        if (!mobile.matches) {
            document.querySelectorAll('.mobile-site-menu').forEach(function (menu) { menu.open = false; });
        }
    }
    setDisclosureLayout();
    if (mobile.addEventListener) mobile.addEventListener('change', setDisclosureLayout);

    document.addEventListener('click', function (event) {
        var link = event.target.closest('a');
        if (!link) return;
        var menu = link.closest('.mobile-site-menu');
        if (menu) menu.open = false;
        var contents = link.closest('.page-toc');
        if (contents && mobile.matches) contents.open = false;
    });
    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        document.querySelectorAll('.mobile-site-menu[open]').forEach(function (menu) {
            menu.open = false;
            menu.querySelector('summary').focus();
        });
    });

    var contentsLinks = Array.from(document.querySelectorAll('.page-toc a[href^="#"]'));
    function markSection(id) {
        contentsLinks.forEach(function (link) {
            if (link.getAttribute('href') === '#' + id) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }
    if (location.hash) markSection(location.hash.slice(1));
    if ('IntersectionObserver' in window && contentsLinks.length) {
        var observer = new IntersectionObserver(function (entries) {
            var visible = entries.filter(function (entry) { return entry.isIntersecting; });
            visible.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
            if (visible.length) markSection(visible[0].target.id);
        }, { rootMargin: '-100px 0px -65% 0px' });
        contentsLinks.forEach(function (link) {
            var heading = document.getElementById(link.getAttribute('href').slice(1));
            if (heading) observer.observe(heading);
        });
    }
})();
