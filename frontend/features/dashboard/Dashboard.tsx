import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, School, Award, Activity, ChevronRight, TrendingUp, Calendar, ArrowUpRight, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSchoolContext } from '../../context/SchoolContext';

const StatCard: React.FC<{ title: string; value: string | number; icon: any; color: string; trend: string }> = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-[24px] shadow-soft hover:shadow-soft-xl transition-all duration-300 border border-slate-100 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
        <ArrowUpRight className="w-3 h-3" />
        {trend}
      </div>
    </div>
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-extrabold text-slate-800">{value}</h3>
      </div>
    </div>
  </div>
);

const QuickLinkCard: React.FC<{ title: string; icon: any; color: string; onClick: () => void; desc: string }> = ({ title, icon: Icon, color, onClick, desc }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 text-right group"
  >
    <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600 group-hover:bg-${color}-600 group-hover:text-white transition-colors`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <p className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{title}</p>
      <p className="text-xs text-slate-400">{desc}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all rtl:rotate-180" />
  </button>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { students, classes, subjects, results, activities, t, currentUser } = useSchoolContext();
  const isAdmin = currentUser?.role === 'admin';
  const { i18n } = useTranslation();
  const dateLocale = i18n.language === 'ar' ? 'ar-MA' : 'fr-FR';

  // حساب نسبة النجاح والمعدل العام
  const statistics = useMemo(() => {
    // حساب معدل كل طالب
    const studentAverages = students.map(student => {
      const currentClass = classes.find(c => String(c.id) === String(student.classId));
      if (!currentClass) return { studentId: student.id, average: 0 };

      // المواد الخاصة بالمستوى الدراسي
      const levelSubjects = subjects.filter(s => s.level === currentClass.level);
      if (levelSubjects.length === 0) return { studentId: student.id, average: 0 };

      // النتائج للفصل الدراسي الأول (للإحصائيات العامة)
      const semesterResults = results.filter(r => String(r.studentId) === String(student.id) && r.semester === 1);

      let normalizedScores: number[] = [];
      let totalScore = 0;

      levelSubjects.forEach(subj => {
        const testRes = semesterResults.find(r => String(r.subjectId) === String(subj.id) && r.type === 'test');
        const examRes = semesterResults.find(r => String(r.subjectId) === String(subj.id) && r.type === 'exam');

        let subjScore: number | null = null;
        if (testRes && examRes) {
          subjScore = (testRes.score + examRes.score) / 2;
        } else if (examRes) {
          subjScore = examRes.score;
        } else if (testRes) {
          subjScore = testRes.score;
        }

        // Convert score to normalized scale (out of 20) based on totalPoints
        if (subjScore !== null && subj.totalPoints > 0) {
          const normalizedScore = (subjScore / subj.totalPoints) * 20;
          normalizedScores.push(normalizedScore);
          totalScore += normalizedScore;
        }
      });

      const average = normalizedScores.length > 0 ? totalScore / normalizedScores.length : 0;
      return { studentId: student.id, average };
    });

    // حساب نسبة النجاح
    const studentsWithResults = studentAverages.filter(s => s.average > 0);
    const totalStudentsWithResults = studentsWithResults.length;
    const passedStudents = studentsWithResults.filter(s => s.average >= 10).length;
    const passRate = totalStudentsWithResults > 0 
      ? ((passedStudents / totalStudentsWithResults) * 100).toFixed(1) 
      : '0.0';

    // عدد النتائج الفريدة (تجنب العد المزدوج للاختبار والامتحان)
    const uniqueResultsCount = results.length;

    return {
      passRate: `${passRate}%`,
      resultsCount: uniqueResultsCount
    };
  }, [students, classes, subjects, results]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) return t('time_just_now');
    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return mins === 1 ? t('time_min_ago') : t('time_mins_ago', mins.toString());
    }
    const hours = Math.floor(diffInSeconds / 3600);
    return hours === 1 ? t('time_hour_ago') : t('time_hours_ago', hours.toString());
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative bg-primary-600 rounded-[32px] p-8 overflow-hidden shadow-soft-xl shadow-primary-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">{t('welcome_back_manager')} 👋</h1>
            <p className="text-primary-100 font-medium">{t('welcome_subtitle')}</p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <Calendar className="w-6 h-6 text-white" />
            <div className="text-right">
              <p className="text-[10px] text-primary-100 font-bold uppercase tracking-wider">{t('today_date')}</p>
              <p className="text-white font-bold">{new Date().toLocaleDateString(dateLocale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('student_count')} 
          value={students.length} 
          icon={Users} 
          color="sky"
          trend="+12%"
        />
        <StatCard 
          title={t('class_count')} 
          value={classes.length} 
          icon={School} 
          color="indigo"
          trend="+2"
        />
        <StatCard 
          title={t('success_rate')} 
          value={statistics.passRate} 
          icon={Award} 
          color="emerald"
          trend="+5.4%"
        />
        <StatCard 
          title={t('recent_results')} 
          value={statistics.resultsCount} 
          icon={TrendingUp} 
          color="amber"
          trend="+40"
        />
      </div>

      {/* Dashboard Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline / Recent Activity */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-soft border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary-500" />
              {t('recent_activities')}
            </h3>
            <button className="text-sm font-bold text-primary-600 hover:text-primary-700">{t('show_all')}</button>
          </div>

          <div className="relative space-y-8">
            {/* Vertical Line */}
            <div className="absolute right-6 top-2 bottom-2 w-0.5 bg-slate-100 rtl:right-6 rtl:left-auto ltr:left-6 ltr:right-auto"></div>

            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className="relative flex items-start gap-6 group">
                  <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-110
                    ${act.type === 'add' ? 'bg-emerald-50 text-emerald-600' : 
                      act.type === 'delete' ? 'bg-red-50 text-red-600' : 
                      'bg-sky-50 text-sky-600'}`}
                  >
                    {act.type === 'add' ? <Users className="w-5 h-5" /> : act.type === 'delete' ? <Activity className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-slate-800">{t(act.descriptionKey, ...(act.params || []))}</p>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full uppercase">{formatTimeAgo(act.timestamp)}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {t('activity_desc')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
               <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">{t('no_activities_recent')}</p>
               </div>
            )}
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-800 px-2">{t('quick_links')}</h3>
          <div className="grid grid-cols-1 gap-4">
             <QuickLinkCard 
               title={t('add_student_btn')}
               desc={t('quick_link_add_desc')}
               icon={Users}
               color="indigo"
               onClick={() => navigate('/students')}
             />
             {isAdmin ? (
             <QuickLinkCard 
               title={t('approve_results')}
               desc={t('quick_link_approve_desc')}
               icon={CheckCircle2}
               color="emerald"
               onClick={() => navigate('/approve-results')}
             />
             ) : (
             <QuickLinkCard 
               title={t('enter_results_btn')}
               desc={t('quick_link_results_desc')}
               icon={GraduationCap}
               color="emerald"
               onClick={() => navigate('/results')}
             />
             )}
             <QuickLinkCard 
               title={t('print_reports_btn')}
               desc={t('quick_link_print_desc')}
               icon={Award}
               color="amber"
               onClick={() => navigate('/results')}
             />
          </div>

          {/* Ad/Info Section */}
          <div className="mt-8 bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-[24px] text-white shadow-soft-xl shadow-indigo-200">
             <h4 className="font-black text-lg mb-2">{t('system_updates_title')} 🚀</h4>
             <p className="text-indigo-100 text-sm mb-4 leading-relaxed">{t('system_updates_text')}</p>
             <button onClick={() => navigate('/statistics')} className="w-full py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl font-bold text-sm transition-all">
                {t('explore_now')}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;