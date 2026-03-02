# كيفية محو البيانات والبدء من جديد

## ⚠️ تحذير: هذا سيمحو جميع البيانات!

## ✅ الطريقة الأسهل: استخدام الأمر المخصص (موصى بها)

```bash
cd backend\school_backend
..\venv\Scripts\python.exe manage.py reset_db
```

### لحذف المستخدمين أيضاً (بما في ذلك superuser):

```bash
..\venv\Scripts\python.exe manage.py reset_db --users
```

**بعد الحذف:**
```bash
# إنشاء superuser جديد
..\venv\Scripts\python.exe manage.py createsuperuser
```

---

## الطريقة 1: حذف البيانات فقط (محافظة)

### للـ PostgreSQL:

```bash
cd backend/school_backend
..\venv\Scripts\python.exe manage.py shell
```

ثم في الـ shell:
```python
from api.models import Student, Classroom, Subject, Result
from django.contrib.auth.models import User

# حذف جميع البيانات
Result.objects.all().delete()
Student.objects.all().delete()
Subject.objects.all().delete()
Classroom.objects.all().delete()

# حذف المستخدمين (اختياري)
# User.objects.all().delete()

print("تم حذف جميع البيانات بنجاح!")
```

### للـ SQLite:

نفس الطريقة أعلاه.

## الطريقة 2: حذف قاعدة البيانات وإعادة إنشائها (أكثر شمولية)

### للـ PostgreSQL:

```bash
# 1. حذف قاعدة البيانات
psql -U postgres -c "DROP DATABASE IF EXISTS school_db2;"

# 2. إنشاء قاعدة بيانات جديدة
psql -U postgres -c "CREATE DATABASE school_db2 OWNER school_user;"

# 3. إعادة تشغيل migrations
cd backend/school_backend
..\venv\Scripts\python.exe manage.py migrate

# 4. إنشاء superuser جديد
..\venv\Scripts\python.exe manage.py createsuperuser
```

### للـ SQLite:

```bash
cd backend/school_backend

# 1. حذف ملف قاعدة البيانات
del db.sqlite3

# 2. حذف migrations (اختياري - فقط إذا أردت إعادة إنشاء الجداول)
# del api\migrations\*.py
# (احتفظ بـ __init__.py)

# 3. إعادة تشغيل migrations
..\venv\Scripts\python.exe manage.py migrate

# 4. إنشاء superuser جديد
..\venv\Scripts\python.exe manage.py createsuperuser
```

## الطريقة 3: استخدام Django Management Command (الأسهل)

### إنشاء ملف management command:

أنشئ ملف `backend/school_backend/api/management/commands/reset_db.py`:

```python
from django.core.management.base import BaseCommand
from api.models import Student, Classroom, Subject, Result

class Command(BaseCommand):
    help = 'حذف جميع البيانات من قاعدة البيانات'

    def handle(self, *args, **options):
        Result.objects.all().delete()
        Student.objects.all().delete()
        Subject.objects.all().delete()
        Classroom.objects.all().delete()
        
        self.stdout.write(
            self.style.SUCCESS('تم حذف جميع البيانات بنجاح!')
        )
```

ثم استخدمه:
```bash
cd backend/school_backend
..\venv\Scripts\python.exe manage.py reset_db
```

## الطريقة 4: استخدام Flush (أسرع طريقة)

```bash
cd backend/school_backend

# حذف جميع البيانات (لكن يحتفظ بالجداول)
..\venv\Scripts\python.exe manage.py flush --noinput

# ثم إنشاء superuser جديد
..\venv\Scripts\python.exe manage.py createsuperuser
```

## ملاحظات مهمة:

1. **احتفظ بنسخة احتياطية** قبل الحذف إذا كانت لديك بيانات مهمة
2. **Superuser** سيتم حذفه أيضاً، ستحتاج لإنشاء واحد جديد
3. **Migrations** لن تتأثر (الجداول ستبقى موجودة)

## بعد الحذف:

1. أنشئ superuser جديد:
```bash
..\venv\Scripts\python.exe manage.py createsuperuser
```

2. أعد تشغيل السيرفر:
```bash
..\venv\Scripts\python.exe manage.py runserver
```

3. سجل دخول بحساب superuser الجديد
