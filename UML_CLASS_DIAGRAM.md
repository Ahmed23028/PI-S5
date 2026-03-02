# 📊 Class Diagram (UML) - School Management System
## مخطط الكلاسات - نظام إدارة المدرسة

---

## 📐 PlantUML Source Code

يمكنك استخدام الكود التالي في [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/) أو أي محرر يدعم PlantUML لإنشاء الصورة.

الملف: `UML_CLASS_DIAGRAM.puml`

---

## 🎨 Visual Representation

### Backend Classes (Django)

```
┌─────────────────────────────────────────────────────────────────────┐
│                          BACKEND (Django)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐      ┌──────────────────┐                   │
│  │   Classroom      │      │     Student      │                   │
│  ├──────────────────┤      ├──────────────────┤                   │
│  │ - id: Integer    │◄─────│ - id: Integer    │                   │
│  │ - name: String   │  1   │ - fullName       │                   │
│  │ - level: Integer │      │ - birthDate      │                   │
│  └──────────────────┘      │ - gender         │                   │
│                            │ - parentPhone    │                   │
│                            │ - address        │                   │
│                            │ - notes          │                   │
│                            │ - classId: FK    │                   │
│                            └────────┬─────────┘                   │
│                                     │ 1                            │
│                                     │                              │
│                                     │ N                            │
│                            ┌────────▼─────────┐                   │
│                            │      Result      │                   │
│                            ├──────────────────┤                   │
│                            │ - id: Integer    │                   │
│                            │ - studentId: FK  │                   │
│                            │ - subjectId: FK  │                   │
│                            │ - score: Float   │                   │
│                            │ - semester: Int  │                   │
│                            │ - type: String   │                   │
│                            └────────┬─────────┘                   │
│                                     │ N                            │
│                                     │                              │
│                            ┌────────▼─────────┐                   │
│                            │     Subject      │                   │
│                            ├──────────────────┤                   │
│                            │ - id: Integer    │                   │
│                            │ - name: String   │                   │
│                            │ - coefficient    │                   │
│                            │ - level: Integer │                   │
│                            └──────────────────┘                   │
│                                                                     │
│  ┌──────────────────┐      ┌──────────────────┐                   │
│  │ClassroomViewSet  │      │  StudentViewSet  │                   │
│  ├──────────────────┤      ├──────────────────┤                   │
│  │ + list()         │      │ + list()         │                   │
│  │ + create()       │      │ + create()       │                   │
│  │ + retrieve()     │      │ + bulk_create()  │                   │
│  │ + update()       │      │ + retrieve()     │                   │
│  │ + destroy()      │      │ + update()       │                   │
│  └──────────────────┘      │ + destroy()      │                   │
│                            └──────────────────┘                   │
│                                                                     │
│  ┌──────────────────┐      ┌──────────────────┐                   │
│  │ SubjectViewSet   │      │  ResultViewSet   │                   │
│  ├──────────────────┤      ├──────────────────┤                   │
│  │ + list()         │      │ + list()         │                   │
│  │ + create()       │      │ + create()       │                   │
│  │ + retrieve()     │      │ + retrieve()     │                   │
│  │ + update()       │      │ + update()       │                   │
│  │ + destroy()      │      │ + destroy()      │                   │
│  └──────────────────┘      └──────────────────┘                   │
│                                                                     │
│  ┌──────────────────┐                                              │
│  │ StatisticsView   │                                              │
│  ├──────────────────┤                                              │
│  │ + get()          │                                              │
│  │ - calculate_...  │                                              │
│  └──────────────────┘                                              │
│                                                                     │
│  ┌──────────────────┐      ┌──────────────────┐                   │
│  │ClassroomSerializer│     │StudentSerializer │                   │
│  │ResultSerializer  │      │SubjectSerializer │                   │
│  └──────────────────┘      └──────────────────┘                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Frontend Classes (React + TypeScript)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + TypeScript)                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    SchoolContext                            │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │ - students: Student[]                                       │   │
│  │ - classes: Classroom[]                                      │   │
│  │ - subjects: Subject[]                                       │   │
│  │ - results: Result[]                                         │   │
│  │ - loading: boolean                                          │   │
│  │ - error: string | null                                      │   │
│  │                                                             │   │
│  │ + fetchData(): Promise<void>                                │   │
│  │ + addStudent(student): Promise<void>                        │   │
│  │ + updateStudent(student): Promise<void>                     │   │
│  │ + deleteStudent(id): Promise<void>                          │   │
│  │ + saveResults(results): Promise<void>                       │   │
│  │ + fetchStatistics(semester): Promise<Object>                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                            │                                        │
│                            │ uses                                   │
│                            ▼                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Student    │  │  Classroom   │  │   Subject    │            │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤            │
│  │ + id: string │  │ + id: string │  │ + id: string │            │
│  │ + fullName   │  │ + name       │  │ + name       │            │
│  │ + birthDate  │  │ + level      │  │ + coefficient│            │
│  │ + gender     │  │ + studentCount│ │ + level      │            │
│  │ + classId    │  └──────────────┘  └──────────────┘            │
│  └──────────────┘                                                 │
│                                                                     │
│  ┌──────────────┐                                                  │
│  │    Result    │                                                  │
│  ├──────────────┤                                                  │
│  │ + id?: string│                                                  │
│  │ + studentId  │                                                  │
│  │ + subjectId  │                                                  │
│  │ + score      │                                                  │
│  │ + semester   │                                                  │
│  │ + type       │                                                  │
│  └──────────────┘                                                  │
│                                                                     │
│  ┌──────────────────┐      ┌──────────────────┐                  │
│  │  StudentsPage    │      │   ResultsPage    │                  │
│  ├──────────────────┤      ├──────────────────┤                  │
│  │ + handleAdd()    │      │ + handleSave()   │                  │
│  │ + handleEdit()   │      │ + handlePrint()  │                  │
│  │ + handleDelete() │      │ + handleUpload() │                  │
│  │ + calculateAvg() │      │ + handleDownload()│                 │
│  └──────────────────┘      └──────────────────┘                  │
│                                                                     │
│  ┌──────────────────┐                                              │
│  │ StatisticsPage   │                                              │
│  ├──────────────────┤                                              │
│  │ + loadStatistics()│                                             │
│  │ + handleSemester()│                                             │
│  └──────────────────┘                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Relationships Summary

### Database Relationships:
1. **Classroom 1 ─── N Student**
   - One classroom has many students
   - Student belongs to one classroom

2. **Student 1 ─── N Result**
   - One student has many results
   - Result belongs to one student

3. **Subject 1 ─── N Result**
   - One subject has many results
   - Result belongs to one subject

### Backend Relationships:
- **ViewSets** use **Models** and **Serializers**
- **StatisticsView** uses all Models for calculations
- **Serializers** convert Models to/from JSON

### Frontend Relationships:
- **SchoolContext** manages all data types
- **Pages** use **SchoolContext** to get/update data
- **Pages** display **Student**, **Result**, etc. instances

---

## 📝 How to Generate Image

### Option 1: PlantUML Online
1. افتح: http://www.plantuml.com/plantuml/uml/
2. انسخ محتوى ملف `UML_CLASS_DIAGRAM.puml`
3. الصق في المحرر
4. اضغط "Submit" لرؤية الصورة
5. احفظ الصورة (PNG, SVG, أو PDF)

### Option 2: PlantUML Local
```bash
# تثبيت PlantUML
npm install -g node-plantuml

# توليد الصورة
plantuml UML_CLASS_DIAGRAM.puml

# سيُنشئ ملف: UML_CLASS_DIAGRAM.png
```

### Option 3: VS Code Extension
1. تثبيت "PlantUML" extension في VS Code
2. فتح ملف `.puml`
3. اضغط `Alt+D` لعرض الصورة
4. `Ctrl+Shift+P` → "PlantUML: Export Current Diagram"

### Option 4: Online Mermaid (Alternative)
يمكنك أيضًا استخدام Mermaid إذا كنت تفضل ذلك.

---

## 📋 Class Details

### Backend Models

#### Classroom
- **Purpose**: يمثل القسم/الصف الدراسي
- **Key Fields**: `name`, `level`
- **Relationships**: Has many Students

#### Student
- **Purpose**: يمثل الطالب
- **Key Fields**: `fullName`, `birthDate`, `gender`, `classId`
- **Relationships**: Belongs to Classroom, Has many Results

#### Subject
- **Purpose**: يمثل المادة الدراسية
- **Key Fields**: `name`, `coefficient`, `level`
- **Relationships**: Has many Results

#### Result
- **Purpose**: يمثل نتيجة الاختبار أو الامتحان
- **Key Fields**: `studentId`, `subjectId`, `score`, `semester`, `type`
- **Constraints**: Unique (studentId, subjectId, semester, type)
- **Relationships**: Belongs to Student and Subject

### Frontend Components

#### SchoolContext
- **Purpose**: إدارة الحالة العامة للتطبيق
- **Responsibilities**: 
  - تخزين البيانات
  - إجراء API calls
  - إدارة التوكنات
  - إظهار الإشعارات

#### Pages
- **StudentsPage**: إدارة الطلاب
- **ResultsPage**: إدارة النتائج + طباعة + Excel
- **StatisticsPage**: عرض الإحصائيات

---

## 🎯 Legend

```
┌─────────┐
│  Class  │  = Class/Component
├─────────┤
│ - field │  = Private attribute
│ + method│  = Public method
└─────────┘

───>  = Uses/Dependency
◄────  = Ownership (1 to N)
...>  = Implements
```

---

**Version**: 1.0  
**Last Updated**: 2025  
**Format**: PlantUML  
**Recommended Tool**: PlantUML Online Editor
