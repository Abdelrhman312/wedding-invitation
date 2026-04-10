(function () {
    var c = window.WEDDING_CONFIG;
    var el = document.getElementById('venue-map-btn');
    if (!el) return;

    var url = c && c.venueMapUrl ? String(c.venueMapUrl).trim() : '';
    if (url) {
        el.href = url;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
    } else {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            alert('لم يُضبط رابط الخريطة في wedding-config.js (venueMapUrl).');
        });
    }
})();
