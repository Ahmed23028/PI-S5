
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { Trophy, TrendingUp, Users, AlertCircle, Calculator, BookOpen, GraduationCap } from 'lucide-react';
import { useSchoolContext } from '../../context/SchoolContext';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-100 shadow-soft-xl rounded-2xl text-right">
        <p className="font-black text-slate-800 mb-2 border-b border-slate-50 pb-2">{label}</p>
        {payload.map((p: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between gap-6 py-1">
             <span className="font-black text-lg" style={{ color: p.color }}>{p.value}</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.name}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard: React.FC<{ title: string; value: string | number; icon: any; color: string; subtext?: string }> = ({ title, value, icon: Icon, color, subtext }) => (
  <div className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100 flex items-center gap-6 hover:shadow-soft-xl hover:-translate-y-1 transition-all group">
    <div className="p-5 rounded-2xl group-hover:scale-110 transition-transform" style={{ backgroundColor: `${color}1A`, color: color }}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-800">{value}</h3>
      {subtext && <p className="text-[10px] text-slate-500 font-bold mt-1.5 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
        {subtext}
      </p>}
    </div>
  </div>
);

const Statistics: React.FC = () => {
  const { students, classes, subjects, results, t } = useSchoolContext();

  const stats = useMemo(() => {
    // حساب معدل كل تلميذ بدقة بناءً على المواد المعتمدة لمستواه (Level Curriculum)
    const studentAverages = students.map(student => {
      const currentClass = classes.find(c => c.id === student.classId);
      if (!currentClass) return { ...student, average: 0 };

      // نجلب مواد المستوى الدراسي لهذا التلميذ
      const levelSubjects = subjects.filter(s => s.level === currentClass.level);
      
      // نجلب النتائج المسجلة له (الفصل الأول افتراضياً للإحصائيات العامة)
      const semesterResults = results.filter(r => r.studentId === student.id && r.semester === 1);

      let normalizedScores: number[] = [];
      let totalScore = 0;

      levelSubjects.forEach(subj => {
        // نبحث عن الاختبار والامتحان
        const testRes = semesterResults.find(r => r.subjectId === subj.id && r.type === 'test');
        const examRes = semesterResults.find(r => r.subjectId === subj.id && r.type === 'exam');

        let subjScore: number | null = null;
        if (testRes && examRes) {
          subjScore = (testRes.score + examRes.score) / 2;
        } else if (testRes || examRes) {
          subjScore = (testRes || examRes)!.score;
        }

        // Convert score to normalized scale (out of 20) based on totalPoints
        if (subjScore !== null && subj.totalPoints > 0) {
          const normalizedScore = (subjScore / subj.totalPoints) * 20;
          normalizedScores.push(normalizedScore);
          totalScore += normalizedScore;
        }
      });

      return {
        ...student,
        average: normalizedScores.length > 0 ? totalScore / normalizedScores.length : 0
      };
    });

    const totalStudents = studentAverages.length;
    const passedStudents = studentAverages.filter(s => s.average >= 10).length;
    const failedStudents = totalStudents - passedStudents;
    const passRate = totalStudents > 0 ? ((passedStudents / totalStudents) * 100).toFixed(1) : 0;
    const globalAverage = totalStudents > 0 
      ? (studentAverages.reduce((acc, curr) => acc + curr.average, 0) / totalStudents).toFixed(2) 
      : "0.00";

    const classPerformance = classes.map(cls => {
      const classStudents = studentAverages.filter(s => s.classId === cls.id);
      const classAvg = classStudents.length > 0 
        ? classStudents.reduce((acc, s) => acc + s.average, 0) / classStudents.length 
        : 0;
      
      return {
        name: cls.name,
        avg: parseFloat(classAvg.toFixed(2)),
        studentCount: classStudents.length
      };
    }).sort((a, b) => b.avg - a.avg);

    // أداء المواد (تجميع المواد المتشابهة في مستويات مختلفة)
    const subjectNames = Array.from(new Set(subjects.map(s => s.name)));
    const subjectPerformance = subjectNames.map(name => {
      const relevantSubjectIds = subjects.filter(s => s.name === name).map(s => s.id);
      const relevantResults = results.filter(r => relevantSubjectIds.includes(r.subjectId) && r.semester === 1);
      
      const avg = relevantResults.length > 0
        ? relevantResults.reduce((acc, r) => acc + r.score, 0) / relevantResults.length
        : 0;
      
      return {
        name,
        avg: parseFloat(avg.toFixed(2))
      };
    }).sort((a, b) => b.avg - a.avg);

    return {
      totalStudents,
      passRate,
      globalAverage,
      failedStudents,
      classPerformance,
      subjectPerformance,
      bestClass: classPerformance.length > 0 ? classPerformance[0] : null,
      passFailData: [
        { name: t('passed'), value: passedStudents },
        { name: t('failed'), value: failedStudents }
      ]
    };
  }, [students, classes, subjects, results, t]);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-100">
               <TrendingUp className="w-8 h-8" />
            </div>
            {t('general_stats')}
          </h2>
          <p className="text-slate-500 font-medium mt-1">تقارير تحليلية شاملة للأداء الأكاديمي لمدرستك (الفصل الدراسي الحالي)</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-soft flex items-center gap-4">
           <div className="flex -space-x-2 rtl:space-x-reverse">
              {students.slice(0, 3).map((s, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">{s.fullName.charAt(0)}</div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-500 flex items-center justify-center text-[10px] font-black text-white">+{students.length}</div>
           </div>
           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('student_count')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('general_average')}
          value={`${stats.globalAverage} / 20`} 
          icon={Calculator} 
          color="#0ea5e9"
          subtext={t('avg_students_desc')}
        />
        <StatCard 
          title={t('success_rate')}
          value={`${stats.passRate}%`} 
          icon={GraduationCap} 
          color="#10b981"
          subtext={`${stats.passFailData[0].value} ${t('passed')}`}
        />
        <StatCard 
          title={t('best_class')}
          value={stats.bestClass?.name || '-'} 
          icon={Trophy} 
          color="#f59e0b"
          subtext={stats.bestClass ? t('class_avg', stats.bestClass.avg.toString()) : ''}
        />
        <StatCard 
          title={t('struggling_students')}
          value={stats.failedStudents} 
          icon={AlertCircle} 
          color="#ef4444"
          subtext={t('struggling_desc')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Class Performance Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-soft border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <div>
               <h3 className="text-xl font-black text-slate-800">{t('class_ranking')}</h3>
               <p className="text-xs text-slate-400 font-bold uppercase mt-1">معدل كل قسم بناءً على نتائج الفصل الأول</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.classPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={15} />
                <YAxis domain={[0, 20]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="avg" name={t('section_avg')} radius={[12, 12, 0, 0]}>
                  {stats.classPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : '#3b82f6'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pass/Fail Pie Chart */}
        <div className="bg-white p-10 rounded-[40px] shadow-soft border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="text-xl font-black text-slate-800 mb-8 w-full text-center">{t('results_distribution')}</h3>
          <div className="h-72 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.passFailData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                    <Cell fill="#10b981" fillOpacity={0.8} />
                    <Cell fill="#ef4444" fillOpacity={0.8} />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-10">
                <span className="text-4xl font-black text-slate-800">{stats.passRate}%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('success_rate')}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Subject Performance Area Chart */}
      <div className="bg-white p-10 rounded-[40px] shadow-soft border border-slate-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">{t('performance_by_subject')}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">متوسط علامات التلاميذ في كل مادة دراسية موحدة</p>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.subjectPerformance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={15} />
              <YAxis domain={[0, 20]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="avg" name={t('avg_score')} stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorAvg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
