from django.db import models
from django.contrib.auth.models import User

class Classroom(models.Model):
    name = models.CharField(max_length=100)
    level = models.IntegerField() # من 1 إلى 6

    def __str__(self):
        return self.name

class Student(models.Model):
    fullName = models.CharField(max_length=255)
    birthDate = models.DateField()
    gender = models.CharField(max_length=1, choices=[('M', 'ذكر'), ('F', 'أنثى')])
    parentPhone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    notes = models.TextField(blank=True, null=True)
    classId = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='students')

class Subject(models.Model):
    name = models.CharField(max_length=100)
    totalPoints = models.IntegerField(default=20)  # عدد النقاط الإجمالي للمادة (مثلاً: 50 للرياضيات، 30 للفرنسية)
    level = models.IntegerField() # يربط بالمستوى (1-6) وليس بالقسم الفردي

class Result(models.Model):
    STATUS_CHOICES = [
        ('pending', 'قيد المراجعة'),
        ('approved', 'موافق عليه'),
        ('rejected', 'مرفوض'),
    ]
    
    studentId = models.ForeignKey(Student, on_delete=models.CASCADE)
    subjectId = models.ForeignKey(Subject, on_delete=models.CASCADE)
    score = models.FloatField()
    semester = models.IntegerField()
    type = models.CharField(max_length=10, choices=[('test', 'اختبار'), ('exam', 'امتحان')])
    
    # نظام الموافقة
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    submittedBy = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='submitted_results', verbose_name='أضافه')
    approvedBy = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_results', verbose_name='وافق عليه')
    rejectionReason = models.TextField(blank=True, null=True, verbose_name='سبب الرفض')
    submittedAt = models.DateTimeField(auto_now_add=True, null=True, blank=True, verbose_name='تاريخ الإضافة')
    reviewedAt = models.DateTimeField(null=True, blank=True, verbose_name='تاريخ المراجعة')
    
    # ملاحظة على النتيجة
    comment = models.TextField(blank=True, null=True, verbose_name='ملاحظة')

    class Meta:
        unique_together = ('studentId', 'subjectId', 'semester', 'type')
    
    def __str__(self):
        return f"{self.studentId.fullName} - {self.subjectId.name} - {self.score}"