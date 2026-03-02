# School Management System - Backend

نظام إدارة مدرسة - الخلفية (Backend)

## المتطلبات

- Python 3.8+
- PostgreSQL (أو SQLite للتطوير)
- pip

## التثبيت

1. إنشاء virtual environment:
```bash
python -m venv venv
```

2. تفعيل virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. تثبيت المتطلبات:
```bash
pip install -r requirements.txt
```

4. إنشاء ملف `.env` من `.env.example`:
```bash
cp .env.example .env
```

5. تعديل ملف `.env` وإضافة القيم الصحيحة:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_PASSWORD=your-database-password
```

6. تشغيل migrations:
```bash
cd school_backend
python manage.py migrate
```

7. إنشاء superuser:
```bash
python manage.py createsuperuser
```

8. تشغيل السيرفر:
```bash
python manage.py runserver
```

## الأمان

⚠️ **هام**: قبل النشر في الإنتاج:

1. غيّر `SECRET_KEY` في ملف `.env`
2. ضع `DEBUG=False` في الإنتاج
3. حدد `ALLOWED_HOSTS` بشكل صحيح
4. حدد `CORS_ALLOWED_ORIGINS` بدقة
5. استخدم قاعدة بيانات آمنة (PostgreSQL)
6. استخدم HTTPS

## API Endpoints

- `POST /api/token/` - تسجيل الدخول (JWT)
- `POST /api/token/refresh/` - تحديث التوكن
- `GET /api/students/` - قائمة التلاميذ
- `GET /api/classes/` - قائمة الأقسام
- `GET /api/subjects/` - قائمة المواد
- `GET /api/results/` - قائمة النتائج

## Query Parameters

- `?level=1` - تصفية حسب المستوى
- `?classId=1` - تصفية حسب القسم
- `?studentId=1` - تصفية حسب التلميذ
- `?subjectId=1` - تصفية حسب المادة
- `?semester=1` - تصفية حسب الفصل
