(function () {
    var KEY = 'wedding-theme';
    var root = document.documentElement;

    function getStored() {
        try {
            return localStorage.getItem(KEY);
        } catch (e) {
            return null;
        }
    }

    function setStored(value) {
        try {
            localStorage.setItem(KEY, value);
        } catch (e) {}
    }

    function apply(theme) {
        if (theme !== 'dark' && theme !== 'light') {
            theme =
                window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
        }
        root.setAttribute('data-theme', theme);
        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
            btn.setAttribute(
                'aria-label',
                theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'
            );
            btn.setAttribute('title', theme === 'dark' ? 'وضع فاتح' : 'وضع داكن');
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    function init() {
        var stored = getStored();
        if (stored === 'dark' || stored === 'light') {
            apply(stored);
        } else {
            apply(null);
        }

        var btn = document.getElementById('theme-toggle');
        if (!btn) return;

        btn.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setStored(next);
            apply(next);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
