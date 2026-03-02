# دليل البدء السريع - Quick Start Guide

## ✅ تم التثبيت بنجاح!

جميع المتطلبات مثبتة في virtual environment.

## 🚀 كيفية تشغيل المشروع

### 1. تفعيل Virtual Environment

**Windows (PowerShell):**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
cd backend
venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
cd backend
source venv/bin/activate
```

### 2. التحقق من ملف .env

تأكد من وجود ملف `.env` في مجلد `backend/`:
```powershell
# إذا لم يكن موجوداً، انسخه من القالب:
cp env_template.txt .env
```

ثم عدّل القيم في `.env` حسب حاجتك.

### 3. تشغيل Migrations

```powershell
cd school_backend
python manage.py migrate
```

### 4. إنشاء Superuser (اختياري)

```powershell
python manage.py createsuperuser
```

### 5. تشغيل السيرفر

```powershell
python manage.py runserver
```

السيرفر سيعمل على: `http://127.0.0.1:8000`

## 📝 ملاحظات مهمة

### استخدام Virtual Environment دائماً

**❌ خطأ:**
```powershell
pip install -r requirements.txt  # يثبت في النظام العام
```

**✅ صحيح:**
```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
# أو بعد تفعيل venv:
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### إذا واجهت مشكلة في تفعيل venv في PowerShell

قم بتشغيل هذا الأمر أولاً:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🔧 استكشاف الأخطاء

### مشكلة: "django-admin.exe is in use"

**الحل:** استخدم virtual environment بدلاً من النظام العام:
```powershell
.\venv\Scripts\python.exe manage.py [command]
```

### مشكلة: "ModuleNotFoundError"

**الحل:** تأكد من تفعيل virtual environment:
```powershell
.\venv\Scripts\Activate.ps1
```

### مشكلة: "Could not load .env file"

**الحل:** تأكد من وجود ملف `.env` في مجلد `backend/`:
```powershell
cd backend
cp env_template.txt .env
```

## 📚 الأوامر المفيدة

```powershell
# تفعيل venv
.\venv\Scripts\Activate.ps1

# تثبيت متطلبات جديدة
pip install package-name

# تحديث requirements.txt
pip freeze > requirements.txt

# تشغيل migrations
python manage.py migrate

# إنشاء migrations جديدة
python manage.py makemigrations

# تشغيل السيرفر
python manage.py runserver

# فحص المشروع
python manage.py check
```

## 🎯 الخطوات التالية

1. ✅ تم تثبيت المتطلبات
2. ✅ تم إنشاء ملف .env
3. ⏭️ قم بتشغيل migrations
4. ⏭️ أنشئ superuser
5. ⏭️ شغّل السيرفر

## 💡 نصيحة

احفظ هذا الأمر لتفعيل venv بسرعة:
```powershell
cd C:\Users\HP\Desktop\S5\pii\backend; .\venv\Scripts\Activate.ps1
```

أو أنشئ ملف `activate.ps1` في جذر المشروع:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
cd school_backend
```
