(function () {
    var cfg = window.WEDDING_CONFIG;
    if (!cfg || !cfg.eventDateTime) {
        return;
    }

    var target = new Date(cfg.eventDateTime);
    if (isNaN(target.getTime())) {
        console.warn('wedding-date: eventDateTime غير صالح');
        return;
    }

    var daysEl = document.getElementById('days');
    var hoursEl = document.getElementById('hours');
    var minutesEl = document.getElementById('minutes');
    var dateLineEl = document.getElementById('event-date-line');
    var timeLineEl = document.getElementById('event-time-line');

    function pad(n) {
        return String(Math.max(0, n)).padStart(2, '0');
    }

    function tick() {
        var now = Date.now();
        var diff = target.getTime() - now;

        if (diff <= 0) {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            return;
        }

        var days = Math.floor(diff / 86400000);
        diff -= days * 86400000;
        var hours = Math.floor(diff / 3600000);
        diff -= hours * 3600000;
        var minutes = Math.floor(diff / 60000);

        if (daysEl) daysEl.textContent = pad(days);
        if (hoursEl) hoursEl.textContent = pad(hours);
        if (minutesEl) minutesEl.textContent = pad(minutes);
    }

    function setDisplayLines() {
        var dateText = cfg.dateLineAr;
        if (!dateText) {
            dateText = target.toLocaleDateString('ar-EG', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        }

        var timeText = cfg.timeLineAr;
        if (!timeText) {
            timeText =
                'في تمام الساعة ' +
                target.toLocaleTimeString('ar-EG', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                });
        }

        if (dateLineEl) dateLineEl.textContent = dateText;
        if (timeLineEl) timeLineEl.textContent = timeText;
    }

    setDisplayLines();
    tick();
    setInterval(tick, 1000);
})();
