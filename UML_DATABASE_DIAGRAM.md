# 🗄️ Database Class Diagram (UML) - Schéma de Base de Données
## مخطط قاعدة البيانات - School Management System

---

## 📊 PlantUML Source Code

الملف: `UML_DATABASE_DIAGRAM.puml`

يمكنك استخدام هذا الملف مباشرة في [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/) لتوليد الصورة.

---

## 🎨 Visual Representation

### Database Schema Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                    BASE DE DONNÉES (Database)                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                   Classroom (Table)                        │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │                   Classroom (Table)                        │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ PK  │ id: Integer                                          │   │
│  ├─────┼──────────────────────────────────────────────────────┤   │
│  │     │ name: String(100) [NOT NULL]                         │   │
│  │     │ level: Integer [NOT NULL, CHECK: 1-6]                │   │
│  └─────┼──────────────────────────────────────────────────────┘   │
│        │                                                          │
│        │ 1                                                        │
│        │                                                          │
│        │ N                                                        │
│        ▼                                                          │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    Student (Table)                         │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ PK  │ id: Integer                                          │   │
│  ├─────┼──────────────────────────────────────────────────────┤   │
│  │ FK  │ classId_id: Integer → Classroom.id                   │   │
│  ├─────┼──────────────────────────────────────────────────────┤   │
│  │     │ fullName: String(255) [NOT NULL]                     │   │
│  │     │ birthDate: Date [NOT NULL]                           │   │
│  │     │ gender: Char(1) [NOT NULL, CHECK: 'M'|'F']           │   │
│  │     │ parentPhone: String(20) [NULL]                       │   │
│  │     │ address: Text [NULL]                                 │   │
│  │     │ notes: Text [NULL]                                   │   │
│  └─────┼──────────────────────────────────────────────────────┘   │
│        │                                                          │
│        │ 1                                                        │
│        │                                                          │
│        │ N                                                        │
│        ▼                                                          │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    Result (Table)                          │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ PK  │ id: Integer                                          │   │
│  ├─────┼──────────────────────────────────────────────────────┤   │
│  │ FK  │ studentId_id: Integer → Student.id                   │   │
│  │ FK  │ subjectId_id: Integer → Subject.id                   │   │
│  ├─────┼──────────────────────────────────────────────────────┤   │
│  │     │ score: Float [NOT NULL, CHECK: 0-20]                 │   │
│  │     │ semester: Integer [NOT NULL, CHECK: 1|2|3]           │   │
│  │     │ type: String(10) [NOT NULL, CHECK: 'test'|'exam']    │   │
│  ├─────┼──────────────────────────────────────────────────────┤   │
│  │UNIQUE│ (studentId_id, subjectId_id, semester, type)        │   │
│  └─────┼──────────────────────────────────────────────────────┘   │
│        │                                                          │
│        │ N                                                        │
│        │                                                          │
│        │ 1                                                        │
│        ▲                                                          │
│  ┌─────┼──────────────────────────────────────────────────────┐   │
│  │     │              Subject (Table)                         │   │
│  ├─────┼──────────────────────────────────────────────────────┤   │
│  │ PK  │ id: Integer                                          │   │
│  ├─────┼──────────────────────────────────────────────────────┤   │
│  │     │ name: String(100) [NOT NULL]                         │   │
│  │     │ coefficient: Integer [DEFAULT: 1]                    │   │
│  │     │ level: Integer [NOT NULL, CHECK: 1-6]                │   │
│  └─────┴──────────────────────────────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Tables Description

### 1. **Classroom** (القسم/الصف)
```sql
Table: api_classroom

Columns:
- id (PK): Integer, Auto-increment
- name: String(100), NOT NULL
- level: Integer, NOT NULL, CHECK (level >= 1 AND level <= 6)

Indexes:
- idx_classroom_level ON level
```

**Purpose**: يمثل القسم أو الصف الدراسي  
**Example**: "قسم 1 أ", "قسم 2 ب"

---

### 2. **Student** (الطالب)
```sql
Table: api_student

Columns:
- id (PK): Integer, Auto-increment
- classId_id (FK): Integer → api_classroom.id, NOT NULL, CASCADE DELETE
- fullName: String(255), NOT NULL
- birthDate: Date, NOT NULL
- gender: Char(1), NOT NULL, CHECK (gender IN ('M', 'F'))
- parentPhone: String(20), NULL
- address: Text, NULL
- notes: Text, NULL

Indexes:
- idx_student_class ON classId_id
- idx_student_name ON fullName

Foreign Key:
- classId_id REFERENCES api_classroom(id) ON DELETE CASCADE
```

**Purpose**: يمثل الطالب المسجل في المدرسة  
**Relationship**: ينتمي إلى قسم واحد (Classroom)  
**Cascade**: عند حذف القسم، يتم حذف جميع الطلاب تلقائياً

---

### 3. **Subject** (المادة الدراسية)
```sql
Table: api_subject

Columns:
- id (PK): Integer, Auto-increment
- name: String(100), NOT NULL
- coefficient: Integer, DEFAULT 1
- level: Integer, NOT NULL, CHECK (level >= 1 AND level <= 6)

Indexes:
- idx_subject_level ON level
```

**Purpose**: يمثل المادة الدراسية  
**Coefficient**: يُستخدم لحساب المعدل الموزون  
**Level**: يحدد المستوى الدراسي للمادة (1-6)

---

### 4. **Result** (النتيجة)
```sql
Table: api_result

Columns:
- id (PK): Integer, Auto-increment
- studentId_id (FK): Integer → api_student.id, NOT NULL, CASCADE DELETE
- subjectId_id (FK): Integer → api_subject.id, NOT NULL, CASCADE DELETE
- score: Float, NOT NULL, CHECK (score >= 0 AND score <= 20)
- semester: Integer, NOT NULL, CHECK (semester IN (1, 2, 3))
- type: String(10), NOT NULL, CHECK (type IN ('test', 'exam'))

Indexes:
- idx_result_student ON studentId_id
- idx_result_subject ON subjectId_id
- idx_result_semester ON semester

Unique Constraint:
- UNIQUE (studentId_id, subjectId_id, semester, type)

Foreign Keys:
- studentId_id REFERENCES api_student(id) ON DELETE CASCADE
- subjectId_id REFERENCES api_subject(id) ON DELETE CASCADE
```

**Purpose**: يمثل نتيجة الاختبار أو الامتحان  
**Relationships**: 
- ينتمي إلى طالب واحد (Student)
- ينتمي إلى مادة واحدة (Subject)

**Unique Constraint**: 
- لا يمكن للطالب أن يكون لديه أكثر من نتيجة واحدة لنفس المادة، نفس الفصل، نفس النوع (test أو exam)

**Cascade**: عند حذف الطالب أو المادة، يتم حذف جميع النتائج المرتبطة تلقائياً

---

## 🔗 Relationships Summary

### 1. Classroom → Student (1 to N)
- **Relationship**: One-to-Many
- **Description**: قسم واحد يحتوي على العديد من الطلاب
- **Foreign Key**: `Student.classId_id` → `Classroom.id`
- **Cascade**: DELETE CASCADE

### 2. Student → Result (1 to N)
- **Relationship**: One-to-Many
- **Description**: طالب واحد لديه العديد من النتائج
- **Foreign Key**: `Result.studentId_id` → `Student.id`
- **Cascade**: DELETE CASCADE

### 3. Subject → Result (1 to N)
- **Relationship**: One-to-Many
- **Description**: مادة واحدة لها العديد من النتائج
- **Foreign Key**: `Result.subjectId_id` → `Subject.id`
- **Cascade**: DELETE CASCADE

---

## 📐 Entity Relationship Diagram (ERD)

```
    ┌─────────────┐                    ┌─────────────┐
    │  Classroom  │                    │   Subject   │
    ├─────────────┤                    ├─────────────┤
    │ id (PK)     │                    │ id (PK)     │
    │ name        │                    │ name        │
    │ level       │                    │ coefficient │
    └──────┬──────┘                    │ level       │
           │                           └──────┬──────┘
           │ 1                                 │
           │                                   │
           │ N                                 │ N
    ┌──────▼──────┐                    ┌──────▼──────┐
    │   Student   │                    │   Result    │
    ├─────────────┤                    ├─────────────┤
    │ id (PK)     │◄───────────────────┤ id (PK)     │
    │ fullName    │      N             │ studentId   │
    │ birthDate   │      │             │ subjectId   │
    │ gender      │      │             │ score       │
    │ parentPhone │      │             │ semester    │
    │ address     │      │             │ type        │
    │ notes       │      │             │             │
    │ classId (FK)│      │             │ UNIQUE:     │
    └─────────────┘      └─────────────┤ (studentId, │
                                       │  subjectId, │
                                       │  semester,  │
                                       │  type)      │
                                       └─────────────┘
```

---

## 🎯 Business Rules

### 1. Classroom Level
- **Range**: 1 to 6
- **Meaning**: المستويات الدراسية الابتدائية

### 2. Student Gender
- **Values**: 'M' (ذكر) or 'F' (أنثى)
- **Required**: Yes

### 3. Result Score
- **Range**: 0 to 20
- **Scale**: نظام الدرجات من 0 إلى 20

### 4. Result Semester
- **Values**: 1, 2, or 3
- **Meaning**: الفصول الدراسية (ثلاثة فصول في السنة)

### 5. Result Type
- **Values**: 'test' (اختبار) or 'exam' (امتحان)
- **Purpose**: التمييز بين الاختبارات والامتحانات

### 6. Unique Constraint on Result
- **Rule**: لا يمكن للطالب أن يكون لديه أكثر من نتيجة واحدة لنفس:
  - المادة (Subject)
  - الفصل الدراسي (Semester)
  - النوع (Type: test أو exam)

**Example**: 
- ✅ Valid: Student 1, Subject 1, Semester 1, Type 'test' → Score 15
- ✅ Valid: Student 1, Subject 1, Semester 1, Type 'exam' → Score 18
- ❌ Invalid: Student 1, Subject 1, Semester 1, Type 'test' → Score 16 (Duplicate!)

---

## 📝 SQL Schema (Complete)

```sql
-- Classroom Table
CREATE TABLE api_classroom (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 6)
);

CREATE INDEX idx_classroom_level ON api_classroom(level);

-- Student Table
CREATE TABLE api_student (
    id SERIAL PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    birthDate DATE NOT NULL,
    gender VARCHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
    parentPhone VARCHAR(20),
    address TEXT,
    notes TEXT,
    classId_id INTEGER NOT NULL,
    FOREIGN KEY (classId_id) REFERENCES api_classroom(id) ON DELETE CASCADE
);

CREATE INDEX idx_student_class ON api_student(classId_id);
CREATE INDEX idx_student_name ON api_student(fullName);

-- Subject Table
CREATE TABLE api_subject (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    coefficient INTEGER NOT NULL DEFAULT 1,
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 6)
);

CREATE INDEX idx_subject_level ON api_subject(level);

-- Result Table
CREATE TABLE api_result (
    id SERIAL PRIMARY KEY,
    studentId_id INTEGER NOT NULL,
    subjectId_id INTEGER NOT NULL,
    score FLOAT NOT NULL CHECK (score >= 0 AND score <= 20),
    semester INTEGER NOT NULL CHECK (semester IN (1, 2, 3)),
    type VARCHAR(10) NOT NULL CHECK (type IN ('test', 'exam')),
    FOREIGN KEY (studentId_id) REFERENCES api_student(id) ON DELETE CASCADE,
    FOREIGN KEY (subjectId_id) REFERENCES api_subject(id) ON DELETE CASCADE,
    UNIQUE (studentId_id, subjectId_id, semester, type)
);

CREATE INDEX idx_result_student ON api_result(studentId_id);
CREATE INDEX idx_result_subject ON api_result(subjectId_id);
CREATE INDEX idx_result_semester ON api_result(semester);
```

---

## 🚀 How to Generate Image

### Option 1: PlantUML Online (Recommended)
1. افتح: http://www.plantuml.com/plantuml/uml/
2. افتح ملف `UML_DATABASE_DIAGRAM.puml`
3. انسخ المحتوى والصقه في المحرر
4. اضغط "Submit"
5. احفظ الصورة:
   - **PNG** للعرض العام
   - **SVG** للطباعة عالية الجودة
   - **PDF** للتوثيق

### Option 2: VS Code Extension
1. تثبيت "PlantUML" extension في VS Code
2. فتح ملف `.puml`
3. اضغط `Alt+D` لعرض الصورة
4. `Ctrl+Shift+P` → "PlantUML: Export Current Diagram"

---

## 📊 Summary

| Table | Primary Key | Foreign Keys | Unique Constraints | Indexes |
|-------|-------------|--------------|-------------------|---------|
| **Classroom** | id | - | - | level |
| **Student** | id | classId_id → Classroom | - | classId_id, fullName |
| **Subject** | id | - | - | level |
| **Result** | id | studentId_id → Student<br>subjectId_id → Subject | (studentId_id, subjectId_id, semester, type) | studentId_id, subjectId_id, semester |

---

**Document Version**: 1.0  
**Last Updated**: 2025  
**Format**: PlantUML  
**Focus**: Database Schema Only
