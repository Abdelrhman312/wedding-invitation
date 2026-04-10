(function () {
    var cfg = window.WEDDING_CONFIG;
    var RSVP_LS_KEY = 'wedding_invite_rsvp_sent';

    var form = document.getElementById('rsvp-form');
    if (!form) return;

    var btn = form.querySelector('[type="submit"]');
    var statusEl = document.getElementById('rsvp-status');
    var formWrap = document.getElementById('rsvp-form-wrap');
    var alreadyEl = document.getElementById('rsvp-already');
    var introEl = document.getElementById('rsvp-intro');

    function showAlreadyConfirmed() {
        if (formWrap) formWrap.classList.add('hidden');
        if (alreadyEl) alreadyEl.classList.remove('hidden');
        if (introEl) introEl.classList.add('hidden');
    }

    function persistAlreadyConfirmed() {
        try {
            localStorage.setItem(RSVP_LS_KEY, String(Date.now()));
        } catch (e) {}
    }

    try {
        if (localStorage.getItem(RSVP_LS_KEY)) {
            showAlreadyConfirmed();
        }
    } catch (e) {}

    function setStatus(msg, isError) {
        if (!statusEl) return;
        statusEl.textContent = msg;
        statusEl.className =
            'mt-4 text-sm min-h-[1.25rem] ' +
            (isError ? 'text-red-400' : 'text-[#d4af37]');
    }

    function buildMessage(name, attendanceLabel) {
        return (
            'تأكيد حضور دعوة زفاف\n' +
            'الاسم: ' +
            name +
            '\n' +
            'الحضور: ' +
            (attendanceLabel || '—')
        );
    }

    function sendWeb3Forms(name, attendanceLabel, messageBody) {
        var key = cfg && cfg.web3formsAccessKey;
        if (!key) return Promise.resolve(null);

        return fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                access_key: key,
                subject: 'تأكيد حضور — ' + name,
                name: name,
                message: messageBody,
                from_name: 'دعوة زفاف',
            }),
        })
            .then(function (r) {
                return r.json();
            })
            .then(function (data) {
                if (!data || !data.success) {
                    throw new Error((data && data.message) || 'فشل إرسال البريد');
                }
                return true;
            });
    }

    /**
     * CallMeBot يتوقع:
     * - apikey: الأرقام فقط (مثلاً 9618991) وليس رابطاً كاملاً
     * - phone: الرقم بصيغة دولية مع + مثل +201012345678
     * لو لصقت الرابط كاملاً في callmebotApiKey نستخرج المفتاح والرقم تلقائياً.
     */
    function resolveCallMeBotCredentials() {
        var rawKey = cfg && cfg.callmebotApiKey;
        var rawPhone = cfg && cfg.whatsappPhone;
        if (!rawKey) return null;

        rawKey = String(rawKey).trim();
        var apiKey = rawKey;
        var phoneDigits = rawPhone ? String(rawPhone).replace(/\D/g, '') : '';

        if (/^https?:\/\//i.test(rawKey)) {
            try {
                var u = new URL(rawKey);
                var k = u.searchParams.get('apikey');
                var p = u.searchParams.get('phone');
                if (k) apiKey = String(k).replace(/[\[\]]/g, '').trim();
                if (p) phoneDigits = String(p).replace(/[\[\]]/g, '').replace(/\D/g, '');
            } catch (e) {
                return null;
            }
        }

        apiKey = String(apiKey).replace(/[\[\]]/g, '').trim();
        if (!apiKey || !/^\d+$/.test(apiKey)) return null;

        if (!phoneDigits) return null;
        var phoneE164 = '+' + phoneDigits;

        return { apiKey: apiKey, phoneE164: phoneE164 };
    }

    function buildCallMeBotUrl(phoneE164, apiKey, messageBody) {
        return (
            'https://api.callmebot.com/whatsapp.php?phone=' +
            encodeURIComponent(phoneE164) +
            '&apikey=' +
            encodeURIComponent(apiKey) +
            '&text=' +
            encodeURIComponent(messageBody)
        );
    }

    function callMeBotBodyIsKnownError(text) {
        if (!text || typeof text !== 'string') return false;
        var s = text.toLowerCase();
        if (s.indexOf('apikey is invalid') !== -1) return true;
        if (s.indexOf('phone number format is incorrect') !== -1) return true;
        return false;
    }

    function shortCallMeBotError(text) {
        var t = (text || '').replace(/\s+/g, ' ').trim();
        if (t.length > 220) t = t.slice(0, 220) + '…';
        return t || 'رفض CallMeBot الطلب — راجع المفتاح والرقم في wedding-config.js';
    }

    /** طلب GET بدون اعتماد على CORS (يعمل حتى لو الصفحة file://) */
    function sendCallMeBotViaImageGet(url) {
        return new Promise(function (resolve) {
            var img = new Image();
            var done = false;
            function end() {
                if (done) return;
                done = true;
                resolve(true);
            }
            img.onload = end;
            img.onerror = end;
            img.src = url;
            setTimeout(end, 3500);
        });
    }

    function sendCallMeBotWhatsApp(messageBody) {
        var cred = resolveCallMeBotCredentials();
        if (!cred) return Promise.resolve(null);

        var url = buildCallMeBotUrl(cred.phoneE164, cred.apiKey, messageBody);

        return fetch(url, { method: 'GET', cache: 'no-store' })
            .then(function (r) {
                return r.text();
            })
            .then(function (text) {
                if (callMeBotBodyIsKnownError(text)) {
                    var err = new Error(shortCallMeBotError(text));
                    err._callmebotReject = true;
                    throw err;
                }
                return true;
            })
            .catch(function (err) {
                if (err && err._callmebotReject) {
                    throw err;
                }
                return sendCallMeBotViaImageGet(url);
            });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        setStatus('');

        var nameInput = document.getElementById('rsvp-name');
        var attendance = document.getElementById('rsvp-attendance');
        var name = nameInput ? nameInput.value.trim() : '';
        if (!name) {
            setStatus('من فضلك اكتب الاسم بالكامل.', true);
            if (nameInput) nameInput.focus();
            return;
        }

        var attendanceLabel = '';
        if (attendance) {
            var opt = attendance.options[attendance.selectedIndex];
            attendanceLabel = opt ? opt.textContent.trim() : '';
        }

        var messageBody = buildMessage(name, attendanceLabel);

        var hasEmail = cfg && cfg.web3formsAccessKey;
        var hasWa = !!resolveCallMeBotCredentials();

        if (!hasEmail && !hasWa) {
            setStatus(
                'لم يُضبط الإرسال التلقائي: أضف callmebotApiKey وwhatsappPhone للواتساب، أو web3formsAccessKey للإيميل — راجع wedding-config.js',
                true
            );
            return;
        }

        var prevLabel = '';
        if (btn) {
            prevLabel = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'جاري الإرسال...';
        }

        var pEmail = hasEmail ? sendWeb3Forms(name, attendanceLabel, messageBody) : Promise.resolve(null);
        var pWa = hasWa ? sendCallMeBotWhatsApp(messageBody) : Promise.resolve(null);

        Promise.all([pEmail, pWa])
            .then(function () {
                var parts = [];
                if (hasEmail) parts.push('تم إرسال نسخة إلى بريدك');
                if (hasWa) parts.push('تم إشعارك على واتساب');
                setStatus(parts.join(' — ') || 'تم التأكيد.', false);
                form.reset();
                persistAlreadyConfirmed();
                showAlreadyConfirmed();
            })
            .catch(function (err) {
                setStatus(err.message || 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.', true);
            })
            .finally(function () {
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = prevLabel || 'تأكيد الحضور';
                }
            });
    });
})();
