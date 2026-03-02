from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Avg, Count, Q, F
from django.contrib.auth.models import User
from django.utils import timezone
from collections import defaultdict
import logging
from .models import Classroom, Student, Subject, Result
from .serializers import *

logger = logging.getLogger(__name__)

class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all().order_by('level', 'name')
    serializer_class = ClassroomSerializer

    def get_queryset(self):
        queryset = Classroom.objects.all().order_by('level', 'name')
        level = self.request.query_params.get('level', None)
        if level is not None:
            queryset = queryset.filter(level=level)
        return queryset

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by('fullName')
    serializer_class = StudentSerializer

    def get_queryset(self):
        queryset = Student.objects.all().order_by('fullName')
        class_id = self.request.query_params.get('classId', None)
        if class_id is not None:
            queryset = queryset.filter(classId_id=class_id)
        return queryset

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error in bulk_create students: {str(e)}", exc_info=True)
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by('level', 'name')
    serializer_class = SubjectSerializer

    def get_queryset(self):
        queryset = Subject.objects.all().order_by('level', 'name')
        level = self.request.query_params.get('level', None)
        if level is not None:
            queryset = queryset.filter(level=level)
        return queryset

class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all().order_by('-id')
    serializer_class = ResultSerializer

    def get_queryset(self):
        queryset = Result.objects.all().order_by('-id')
        student_id = self.request.query_params.get('studentId', None)
        subject_id = self.request.query_params.get('subjectId', None)
        semester = self.request.query_params.get('semester', None)
        result_status = self.request.query_params.get('status', None)
        
        if student_id is not None:
            queryset = queryset.filter(studentId_id=student_id)
        if subject_id is not None:
            queryset = queryset.filter(subjectId_id=subject_id)
        if semester is not None:
            queryset = queryset.filter(semester=semester)
        if result_status is not None:
            queryset = queryset.filter(status=result_status)
        return queryset
    
    def perform_create(self, serializer):
        # عند إنشاء نتيجة جديدة، يتم تعيين المستخدم الحالي كـ submittedBy
        if self.request.user.is_authenticated:
            serializer.save(submittedBy=self.request.user)
        else:
            serializer.save()
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """موافقة على نتيجة"""
        if not request.user.is_authenticated:
            return Response({'error': 'يجب تسجيل الدخول'}, status=status.HTTP_401_UNAUTHORIZED)
        
        result = self.get_object()
        result.status = 'approved'
        result.approvedBy = request.user
        result.reviewedAt = timezone.now()
        result.rejectionReason = None  # مسح سبب الرفض إن وجد
        result.save()
        
        serializer = self.get_serializer(result)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """رفض نتيجة"""
        if not request.user.is_authenticated:
            return Response({'error': 'يجب تسجيل الدخول'}, status=status.HTTP_401_UNAUTHORIZED)
        
        rejection_reason = request.data.get('reason', '')
        result = self.get_object()
        result.status = 'rejected'
        result.approvedBy = request.user
        result.reviewedAt = timezone.now()
        result.rejectionReason = rejection_reason
        result.save()
        
        serializer = self.get_serializer(result)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """الحصول على جميع النتائج قيد المراجعة"""
        pending_results = Result.objects.filter(status='pending').order_by('-submittedAt')
        serializer = self.get_serializer(pending_results, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        # ميزة تحديث النقاط إذا كانت موجودة أو إنشاء جديدة
        data = request.data
        if not isinstance(data, list):
            return Response({'error': 'Expected a list of results'}, status=status.HTTP_400_BAD_REQUEST)
        
        created_count = 0
        errors = []
        
        try:
            with transaction.atomic():
                for idx, item in enumerate(data):
                    try:
                        # Validate score against subject's totalPoints
                        subject_id = item.get('subjectId')
                        score = item.get('score')
                        
                        if subject_id and score is not None:
                            try:
                                subject = Subject.objects.get(pk=subject_id)
                                if score < 0 or score > subject.totalPoints:
                                    errors.append(f'Item {idx + 1}: النقطة ({score}) يجب أن تكون بين 0 و {subject.totalPoints} للمادة {subject.name}')
                                    continue
                            except Subject.DoesNotExist:
                                errors.append(f'Item {idx + 1}: المادة غير موجودة')
                                continue
                        
                        Result.objects.update_or_create(
                            studentId_id=item.get('studentId'),
                            subjectId_id=item.get('subjectId'),
                            semester=item.get('semester'),
                            type=item.get('type'),
                            defaults={
                                'score': item.get('score'),
                                'status': item.get('status', 'pending'),
                                'submittedBy_id': request.user.id if request.user.is_authenticated else None,
                                'comment': item.get('comment', '')
                            }
                        )
                        created_count += 1
                    except Exception as e:
                        errors.append(f'Item {idx + 1}: {str(e)}')
                
                if errors:
                    return Response({
                        'message': f'تم حفظ {created_count} نقطة بنجاح',
                        'errors': errors
                    }, status=status.HTTP_207_MULTI_STATUS)
                
                return Response({
                    'message': f'تم حفظ {created_count} نقطة بنجاح'
                }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error in bulk_create results: {str(e)}", exc_info=True)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class StatisticsView(APIView):
    """
    API endpoint for statistics calculations
    Calculates averages using (test + exam) / 2 if both exist, otherwise uses available one
    """
    
    def get(self, request):
        semester = request.query_params.get('semester', 1)
        try:
            semester = int(semester)
        except (ValueError, TypeError):
            semester = 1
        
        # Get all data
        students = Student.objects.select_related('classId').all()
        classes = Classroom.objects.all()
        subjects = Subject.objects.all()
        # Filter results by semester and prefetch related objects for better performance
        results = Result.objects.filter(semester=semester).select_related('studentId', 'subjectId')
        
        # Debug: Log total results count
        logger.info(f"Statistics calculation for semester {semester}: {results.count()} results found")
        
        # Calculate student averages
        student_averages = []
        for student in students:
            current_class = student.classId
            if not current_class:
                student_averages.append({
                    'studentId': str(student.id),
                    'average': 0
                })
                continue
            
            # Get subjects for this student's level only
            level_subjects = subjects.filter(level=current_class.level)
            if not level_subjects.exists():
                student_averages.append({
                    'studentId': str(student.id),
                    'average': 0
                })
                continue
            
            # Get results for this student (already filtered by semester)
            semester_results = results.filter(studentId_id=student.id)
            
            total_weighted_score = 0
            total_coefficients = 0
            
            for subj in level_subjects:
                # Find both test and exam results for this subject
                test_res = semester_results.filter(subjectId_id=subj.id, type='test').first()
                exam_res = semester_results.filter(subjectId_id=subj.id, type='exam').first()
                
                # Calculate subject score: average if both exist, otherwise use available one
                subj_score = None
                if test_res and exam_res:
                    # If both exist, use average of both
                    subj_score = (test_res.score + exam_res.score) / 2
                elif exam_res:
                    subj_score = exam_res.score
                elif test_res:
                    subj_score = test_res.score
                
                # Only add to calculation if we have a score (don't count subjects with no results)
                if subj_score is not None:
                    total_weighted_score += subj_score * subj.coefficient
                    total_coefficients += subj.coefficient
            
            # Calculate average only if we have at least one subject with results
            average = total_weighted_score / total_coefficients if total_coefficients > 0 else 0
            student_averages.append({
                'studentId': str(student.id),
                'average': round(average, 2)
            })
        
        # Global Stats
        # Count all students for total, but only calculate averages from those with results
        total_students = len(student_averages)
        students_with_results = [s for s in student_averages if s['average'] > 0]
        passed_students = sum(1 for s in student_averages if s['average'] >= 10)
        failed_students = total_students - passed_students
        pass_rate = round((passed_students / total_students * 100), 1) if total_students > 0 else 0
        # Calculate global average only from students with actual results (average > 0)
        global_average = round(
            sum(s['average'] for s in students_with_results) / len(students_with_results), 2
        ) if students_with_results else 0
        
        # Class Performance
        class_performance = []
        for cls in classes:
            # Get student IDs for this class - FIXED: Use filter correctly
            class_student_ids = set(students.filter(classId_id=cls.id).values_list('id', flat=True))
            class_students_avg = [
                s for s in student_averages 
                if int(s['studentId']) in class_student_ids
            ]
            
            class_avg = round(
                sum(s['average'] for s in class_students_avg) / len(class_students_avg), 2
            ) if class_students_avg else 0
            
            class_pass_count = sum(1 for s in class_students_avg if s['average'] >= 10)
            class_pass_rate = round(
                (class_pass_count / len(class_students_avg) * 100), 1
            ) if class_students_avg else 0
            
            class_performance.append({
                'name': cls.name,
                'avg': class_avg,
                'passRate': class_pass_rate,
                'studentCount': len(class_students_avg)
            })
        
        class_performance.sort(key=lambda x: x['avg'], reverse=True)
        
        # Subject Performance
        subject_performance = []
        for subj in subjects:
            # Get all results for this subject (already filtered by semester)
            subj_results = results.filter(subjectId_id=subj.id)
            
            # Group by student and calculate average (test + exam) / 2 if both exist
            student_scores = defaultdict(list)
            for res in subj_results:
                student_scores[res.studentId_id].append({
                    'type': res.type,
                    'score': res.score
                })
            
            scores = []
            for student_id, res_list in student_scores.items():
                test_score = next((r['score'] for r in res_list if r['type'] == 'test'), None)
                exam_score = next((r['score'] for r in res_list if r['type'] == 'exam'), None)
                
                if test_score is not None and exam_score is not None:
                    # Average if both exist
                    scores.append((test_score + exam_score) / 2)
                elif exam_score is not None:
                    scores.append(exam_score)
                elif test_score is not None:
                    scores.append(test_score)
            
            subj_avg = round(sum(scores) / len(scores), 2) if scores else 0
            
            subject_performance.append({
                'name': subj.name,
                'avg': subj_avg
            })
        
        subject_performance.sort(key=lambda x: x['avg'], reverse=True)
        
        best_class = class_performance[0] if class_performance else None
        
        return Response({
            'semester': semester,
            'totalStudents': total_students,
            'passRate': pass_rate,
            'globalAverage': global_average,
            'failedStudents': failed_students,
            'passedStudents': passed_students,
            'classPerformance': class_performance,
            'subjectPerformance': subject_performance,
            'bestClass': best_class,
            'passFailData': [
                {'name': 'ناجح', 'value': passed_students},
                {'name': 'راسب', 'value': failed_students}
            ],
            'studentAverages': student_averages
        }, status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    """
    API endpoint to get current authenticated user information
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # تحديد الدور بناءً على الصلاحيات
        if user.is_superuser:
            role = 'admin'
        elif user.is_staff:
            role = 'teacher'
        else:
            role = 'secretary'
        
        return Response({
            'id': str(user.id),
            'username': user.username,
            'fullName': f"{user.first_name} {user.last_name}".strip() or user.username,
            'email': user.email or '',
            'role': role,
            'status': 'active' if user.is_active else 'inactive'
        }, status=status.HTTP_200_OK)