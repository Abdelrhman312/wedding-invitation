/**
 * إعدادات التاريخ والوقت — غيّر هذا الملف فقط لكل عميل جديد.
 *
 * eventDateTime: تاريخ ووقت بداية الحفل بصيغة ISO 8601 (يُستخدم للعد التنازلي).
 *   أمثلة للمنطقة الزمنية (مصر عادةً +02:00 أو +03:00 حسب التوقيت الصيفي):
 *   '2026-05-15T19:00:00+02:00'
 *
 * dateLineAr: النص الظاهر في «متى وأين» — سطر التاريخ. اتركه '' ليُبنى تلقائياً بالعربي من eventDateTime.
 * timeLineAr: سطر وصف الوقت. اتركه '' ليُبنى تلقائياً من eventDateTime (تقريبي).
 */
window.WEDDING_CONFIG = {
    eventDateTime: '2026-04-30T19:00:00+02:00',

    dateLineAr: 'الخميس، 30 ابريل 2026',
    timeLineAr: 'في تمام الساعة السابعة مساءً',

    /**
     * رابط خرائط جوجل (أو أي رابط خريطة) للقاعة — انسخه من «مشاركة» في خرائط Google.
     * مثال: https://www.google.com/maps?q=30.0444,31.2357 أو رابط مكان محدد
     */
    venueMapUrl:
        'https://maps.app.goo.gl/c4aZ8uzTjmWwURvh7',

    /**
     * رقم واتسابك لاستقبال الإشعارات (كود الدولة + الرقم بدون + وبدون مسافات).
     * مثال مصر: 201012345678
     * يُستخدم مع callmebotApiKey لإرسال واتساب تلقائي لك عند كل تأكيد.
     */
    whatsappPhone: '201069047415',

    /**
     * مفتاح CallMeBot فقط (أرقام، بدون رابط). لا تلصق رابط api كامل هنا.
     * التفعيل: https://www.callmebot.com/blog/free-api-whatsapp-messages/
     */
    callmebotApiKey: '9618991',

    /**
     * مفتاح Web3Forms لإرسال نسخة على بريدك تلقائياً (بديل أو إضافة للواتساب).
     * سجّل مجاناً: https://web3forms.com — انسخ Access Key هنا.
     */
    web3formsAccessKey: '',
};
// 1. كائن الترجمة
const translations = {
    ar: {
        page_title: "دعوة زفاف ملكية",
        intro_sub: "معًا نبدأ القصة",
        skip: "تخطي ←",
        hero_title: "دعوة زفاف",
        hero_msg: "نتشرف بدعوتكم لمشاركتنا فرحتنا",
        countdown_title: "متبقي على اليوم الكبير",
        days_label: "أيام",
        hours_label: "ساعة",
        mins_label: "دقيقة",
        when_where: "متى وأين",
        date: "الجمعة، 15 مايو 2026",
        time: "في تمام الساعة السابعة مساءً",
        hotel: "قاعة اللوتس",
        city: "القاهرة، مصر",
        map_btn: "عرض الموقع على الخريطة",
        rsvp_title: "تأكيد الحضور",
        rsvp_msg: "يسعدنا أن نعرف بقدومكم قبل نهاية شهر أبريل",
        ph_name: "الاسم بالكامل",
        rsvp_yes: "سأحضر بالتأكيد",
        rsvp_no: "للأسف لن أتمكن من الحضور",
        rsvp_btn: "تأكيد الحضور",
        rsvp_thank_you_msg: "تم استلام تأكيد حضورك مسبقاً من هذا الجهاز. نتطلع لرؤيتك."
    },
    en: {
        page_title: "Royal Wedding Invitation",
        intro_sub: "Together we begin the story",
        skip: "Skip →",
        hero_title: "Wedding Invitation",
        hero_msg: "We are honored to invite you to our wedding",
        countdown_title: "Countdown to the big day",
        days_label: "Days",
        hours_label: "Hours",
        mins_label: "Mins",
        when_where: "When & Where",
        date: "Friday, May 15, 2026",
        time: "At 7:00 PM",
        hotel: "Lotus Hall",
        city: "Cairo, Egypt",
        map_btn: "View Map Location",
        rsvp_title: "Confirmation",
        rsvp_msg: "Please let us know your response by end of April",
        ph_name: "Full Name",
        rsvp_yes: "I will attend",
        rsvp_no: "I can't attend",
        rsvp_btn: "Confirm Attendance",
        rsvp_thank_you_msg: "Thank you for your confirmation. We look forward to seeing you"
    }
};

// 2. إدارة اللغة
const langToggle = document.getElementById('lang-toggle');
function setLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // ترجمة النصوص
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(translations[lang][key]) el.innerText = translations[lang][key];
    });
    
    // ترجمة الـ Placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if(translations[lang][key]) el.placeholder = translations[lang][key];
    });

    langToggle.innerText = lang === 'ar' ? 'EN' : 'AR';
    localStorage.setItem('wedding-lang', lang);
}

langToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('lang');
    setLanguage(current === 'ar' ? 'en' : 'ar');
});

// 3. إدارة الثيم (Dark/Light)
const themeToggle = document.getElementById('theme-toggle');
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wedding-theme', theme);
    themeToggle.innerText = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// 4. العداد التنازلي (Countdown)
function updateCountdown() {
    const weddingDate = new Date("May 15, 2026 19:00:00").getTime();
    const now = new Date().getTime();
    const diff = weddingDate - now;

    if (diff > 0) {
        document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
        document.getElementById('hours').innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById('minutes').innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    }
}
setInterval(updateCountdown, 1000);
updateCountdown();

// 5. التحكم في الافتتاحية (Intro)
const intro = document.getElementById('wedding-intro');
const skipBtn = document.getElementById('intro-skip');
if (intro) {
    const introTimer = setTimeout(() => intro.classList.add('intro-hide'), 4000);
    skipBtn.addEventListener('click', () => {
        clearTimeout(introTimer);
        intro.classList.add('intro-hide');
    });
}

// 6. أنيميشن الظهور (Scroll Reveal)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('is-visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 7. تشغيل الإعدادات المحفوظة عند التحميل
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('wedding-lang') || 'ar';
    const savedTheme = localStorage.getItem('wedding-theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    setLanguage(savedLang);
    setTheme(savedTheme);
});