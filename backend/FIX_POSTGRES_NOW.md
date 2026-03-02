# 🔧 إصلاح صلاحيات PostgreSQL - خطوات سريعة

## ✅ تم التبديل إلى PostgreSQL بنجاح!

المشكلة الآن: **صلاحيات المستخدم `school_user` غير كافية**

## الحل السريع:

### الطريقة 1: استخدام ملف SQL (موصى بها)

```bash
# 1. افتح PowerShell أو Command Prompt
# 2. نفذ هذا الأمر (ستُطلب منك كلمة مرور postgres):
psql -U postgres -f backend\setup_postgresql.sql
```

### الطريقة 2: يدوياً من psql

```bash
# 1. الاتصال بـ PostgreSQL كـ superuser
psql -U postgres

# 2. نفذ هذه الأوامر SQL واحدة تلو الأخرى:
```

```sql
-- إنشاء قاعدة البيانات (إذا لم تكن موجودة)
CREATE DATABASE school_db2 OWNER school_user;

-- الاتصال بقاعدة البيانات
\c school_db2

-- إعطاء جميع الصلاحيات
GRANT ALL ON SCHEMA public TO school_user;
ALTER SCHEMA public OWNER TO school_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO school_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO school_user;

-- التحقق
\du school_user
\l school_db2

-- الخروج
\q
```

### الطريقة 3: إذا لم يكن المستخدم موجوداً

```sql
-- كـ postgres superuser
CREATE USER school_user WITH PASSWORD 'password123';
CREATE DATABASE school_db2 OWNER school_user;

\c school_db2
GRANT ALL ON SCHEMA public TO school_user;
ALTER SCHEMA public OWNER TO school_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO school_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO school_user;
```

## بعد إصلاح الصلاحيات:

```bash
cd backend\school_backend
..\venv\Scripts\python.exe manage.py migrate
```

## التحقق من الاتصال:

```bash
..\venv\Scripts\python.exe manage.py shell -c "from django.db import connection; print('Database:', connection.vendor); print('Connected:', connection.is_usable())"
```

## ملاحظات:

- ✅ ملف `.env` محدث لاستخدام PostgreSQL
- ✅ Django يقرأ الإعدادات بشكل صحيح
- ⚠️ فقط الصلاحيات تحتاج إلى إصلاح
