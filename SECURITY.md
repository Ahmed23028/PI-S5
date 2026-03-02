# دليل الأمان - Security Guide

## التحسينات الأمنية المطبقة

### 1. Environment Variables
- ✅ نقل جميع المعلومات الحساسة إلى ملف `.env`
- ✅ إضافة `.env.example` كقالب
- ✅ إضافة `.env` إلى `.gitignore`

### 2. Django Settings
- ✅ استخدام `python-dotenv` لتحميل المتغيرات
- ✅ `SECRET_KEY` من environment variable
- ✅ `DEBUG` من environment variable
- ✅ `ALLOWED_HOSTS` قابلة للتكوين
- ✅ `CORS_ALLOW_ALL_ORIGINS` يعتمد على `DEBUG`

### 3. JWT Security
- ✅ تقليل `ACCESS_TOKEN_LIFETIME` من يوم إلى ساعة
- ✅ إضافة `REFRESH_TOKEN_LIFETIME`
- ✅ تفعيل `ROTATE_REFRESH_TOKENS`
- ✅ تفعيل `BLACKLIST_AFTER_ROTATION`

### 4. Frontend Security
- ✅ إزالة demo mode من Login
- ✅ استخدام environment variables للـ API URL
- ✅ تحسين error handling

### 5. API Improvements
- ✅ إضافة query parameters للتصفية
- ✅ تحسين error handling مع transactions
- ✅ إضافة validation للبيانات

## قبل النشر في الإنتاج

### Backend (.env)
```env
SECRET_KEY=<generate-new-secret-key>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
DB_PASSWORD=<strong-password>
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### خطوات إضافية
1. استخدم HTTPS فقط
2. فعّل rate limiting
3. أضف logging و monitoring
4. راجع Django security checklist
5. استخدم PostgreSQL في الإنتاج
6. فعّل database backups

## توليد SECRET_KEY جديد

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```
