# متطلبات Comet X Ultimate v4

## الأساسيات
- Manifest V3
- Side Panel API
- Service Worker (Background)

## الصلاحيات
- `sidePanel`: لفتح اللوحة الجانبية.
- `storage`: لحفظ الإعدادات والملاحظات والكاش.
- `host_permissions`: للوصول لـ GitHub API.

## الهيكل
- `manifest.json`: ملف التكوين الرئيسي.
- `service_worker.js`: معالجة الطلبات الخلفية (GitHub Fetch).
- `sidebar.html/js/css`: واجهة المستخدم.
- `options.html/js`: صفحة الإعدادات.
