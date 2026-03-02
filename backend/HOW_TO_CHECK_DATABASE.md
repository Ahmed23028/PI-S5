# كيفية معرفة نوع قاعدة البيانات المستخدمة

## الطريقة 1: فحص الإعدادات من Django Shell

```bash
cd backend/school_backend
..\venv\Scripts\python.exe manage.py shell
```

ثم في الـ shell:
```python
from django.conf import settings
db = settings.DATABASES['default']
print('Database Engine:', db['ENGINE'])
print('Database Name:', db['NAME'])
print('Database Host:', db.get('HOST', 'N/A'))
```

## الطريقة 2: فحص اتصال قاعدة البيانات الفعلي

```bash
cd backend/school_backend
..\venv\Scripts\python.exe manage.py shell
```

ثم في الـ shell:
```python
from django.db import connection
print('Database Vendor:', connection.vendor)
print('Database Name:', connection.settings_dict['NAME'])
```

## الطريقة 3: فحص ملف settings.py

افتح ملف `backend/school_backend/school_backend/settings.py` وابحث عن:

```python
DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.postgresql'),
        ...
    }
}
```

- إذا كان `ENGINE` يحتوي على `postgresql` → **PostgreSQL**
- إذا كان `ENGINE` يحتوي على `sqlite3` → **SQLite**

## الطريقة 4: فحص ملف .env

افتح ملف `backend/.env` (إن وجد) وابحث عن:

```
DB_ENGINE=django.db.backends.postgresql  # PostgreSQL
# أو
DB_ENGINE=django.db.backends.sqlite3     # SQLite
```

## الطريقة 5: فحص الملفات الموجودة

- إذا وجدت ملف `db.sqlite3` في `backend/school_backend/` → **SQLite**
- إذا لم تجد `db.sqlite3` وكانت البيانات في PostgreSQL → **PostgreSQL**

## الحالة الحالية

بناءً على الفحص:
- **النظام محدد لاستخدام PostgreSQL** (`django.db.backends.postgresql`)
- **اسم قاعدة البيانات**: `school_db2`
- **الخادم**: `localhost:5432`
- **ملف SQLite موجود** (`db.sqlite3`) لكنه قديم أو غير مستخدم حالياً

## للتحقق من اتصال PostgreSQL

```bash
# تحقق من أن PostgreSQL يعمل
psql -U school_user -d school_db2 -h localhost

# أو من Django
cd backend/school_backend
..\venv\Scripts\python.exe manage.py dbshell
```

## للتبديل إلى SQLite (للتطوير)

أنشئ ملف `.env` في `backend/`:

```
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```

ثم أعد تشغيل السيرفر.
