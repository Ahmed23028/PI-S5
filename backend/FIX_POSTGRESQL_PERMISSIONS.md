# إصلاح مشكلة الصلاحيات في PostgreSQL

## المشكلة:
```
permission denied for schema public
```

هذا يعني أن المستخدم `school_user` لا يملك الصلاحيات الكافية لإنشاء الجداول.

## الحل 1: إعطاء الصلاحيات للمستخدم (موصى به)

### الخطوة 1: الاتصال بـ PostgreSQL كـ superuser

```bash
psql -U postgres
```

### الخطوة 2: إعطاء الصلاحيات

```sql
-- إعطاء جميع الصلاحيات على قاعدة البيانات
GRANT ALL PRIVILEGES ON DATABASE school_db2 TO school_user;

-- الاتصال بقاعدة البيانات
\c school_db2

-- إعطاء الصلاحيات على schema public
GRANT ALL ON SCHEMA public TO school_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO school_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO school_user;

-- إعطاء الصلاحيات للجداول المستقبلية
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO school_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO school_user;

-- الخروج
\q
```

## الحل 2: التبديل إلى SQLite (أسهل للتطوير)

### الخطوة 1: إنشاء ملف .env

أنشئ ملف `backend/.env`:

```env
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```

### الخطوة 2: حذف ملف SQLite القديم (إن وجد)

```bash
cd backend\school_backend
del db.sqlite3
```

### الخطوة 3: تشغيل migrations

```bash
..\venv\Scripts\python.exe manage.py migrate
```

## الحل 3: إعادة إنشاء قاعدة البيانات مع الصلاحيات الصحيحة

```sql
-- كـ postgres superuser
DROP DATABASE IF EXISTS school_db2;
CREATE DATABASE school_db2 OWNER school_user;
GRANT ALL PRIVILEGES ON DATABASE school_db2 TO school_user;

\c school_db2
GRANT ALL ON SCHEMA public TO school_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO school_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO school_user;
```
