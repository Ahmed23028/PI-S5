# إعداد PostgreSQL

## الخطوة 1: إصلاح الصلاحيات في PostgreSQL

### الطريقة 1: استخدام ملف SQL (موصى بها)

```bash
# كـ postgres superuser
psql -U postgres -f backend/setup_postgresql.sql
```

### الطريقة 2: يدوياً من psql

```bash
psql -U postgres
```

ثم نفذ:

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
```

## الخطوة 2: تحديث ملف .env

تم تحديث ملف `.env` تلقائياً لاستخدام PostgreSQL.

## الخطوة 3: تشغيل Migrations

```bash
cd backend\school_backend
..\venv\Scripts\python.exe manage.py migrate
```

## الخطوة 4: إنشاء Superuser

```bash
..\venv\Scripts\python.exe manage.py createsuperuser
```

## التحقق من الاتصال

```bash
..\venv\Scripts\python.exe manage.py shell -c "from django.db import connection; print('Database:', connection.vendor); print('Name:', connection.settings_dict['NAME'])"
```

## ملاحظات:

- تأكد من أن PostgreSQL يعمل: `pg_ctl status` أو من Services
- تأكد من أن المستخدم `school_user` موجود
- إذا لم يكن موجوداً، أنشئه:
  ```sql
  CREATE USER school_user WITH PASSWORD 'password123';
  ```
