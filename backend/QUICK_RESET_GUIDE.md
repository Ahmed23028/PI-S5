# دليل سريع: محو البيانات والبدء من جديد

## ✅ تم التبديل إلى SQLite بنجاح!

النظام الآن يستخدم **SQLite** بدلاً من PostgreSQL (للتطوير).

## خطوات محو البيانات والبدء من جديد:

### 1. حذف جميع البيانات:

```bash
cd backend\school_backend
..\venv\Scripts\python.exe manage.py reset_db
```

### 2. إنشاء superuser جديد:

```bash
..\venv\Scripts\python.exe manage.py createsuperuser
```

أدخل:
- Username: (مثلاً: admin)
- Email: (اختياري)
- Password: (كلمة المرور)

### 3. أعد تشغيل السيرفر:

```bash
..\venv\Scripts\python.exe manage.py runserver
```

## ملاحظات:

- ✅ قاعدة البيانات الآن: **SQLite** (`db.sqlite3`)
- ✅ جميع الجداول تم إنشاؤها بنجاح
- ✅ يمكنك الآن البدء من جديد بإضافة بيانات جديدة

## للعودة إلى PostgreSQL (لاحقاً):

1. أنشئ ملف `.env` في `backend/`:
```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=school_db2
DB_USER=school_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

2. تأكد من إعطاء الصلاحيات للمستخدم في PostgreSQL (راجع `FIX_POSTGRESQL_PERMISSIONS.md`)
