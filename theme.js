// Theme: follows the system setting until the visitor picks one with the toggle; the choice is
// remembered per browser. Loaded in <head> so the saved theme applies before the first paint.
(function () {
    var key = 'koala-theme', root = document.documentElement;
    try {
        var saved = localStorage.getItem(key);
        if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
    } catch (e) { }

    var system = window.matchMedia('(prefers-color-scheme: dark)');
    function current() { return root.getAttribute('data-theme') || (system.matches ? 'dark' : 'light'); }

    function render() {
        var dark = current() === 'dark';
        document.querySelectorAll('.theme-toggle').forEach(function (button) {
            button.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
            button.title = button.getAttribute('aria-label');
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        render();
        document.querySelectorAll('.theme-toggle').forEach(function (button) {
            button.addEventListener('click', function () {
                var next = current() === 'dark' ? 'light' : 'dark';
                root.setAttribute('data-theme', next);
                try { localStorage.setItem(key, next); } catch (e) { }
                render();
            });
        });
        if (system.addEventListener) system.addEventListener('change', render);
    });
})();
