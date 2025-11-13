export const aggregateAttendanceByDate = (attendance, sessions, courses) => {
  const grouped = {};

  attendance.forEach((record) => {
    const session = sessions.find(s => s.id === record.sessionId);
    if (!session) return;

    const course = courses.find(c => c.id === session.courseId);
    if (!course) return;

    const key = `${session.date}-${course.id}`;
    
    if (!grouped[key]) {
      grouped[key] = {
        date: session.date,
        course: course.name,
        present: 0,
        absent: 0,
      };
    }

    if (record.status === 'present') {
      grouped[key].present++;
    } else {
      grouped[key].absent++;
    }
  });

  return Object.values(grouped).map(item => ({
    ...item,
    percentage: Math.round((item.present / (item.present + item.absent)) * 100),
  }));
};

export const aggregateAttendanceForChart = (attendance, sessions) => {
  const grouped = {};

  attendance.forEach((record) => {
    const session = sessions.find(s => s.id === record.sessionId);
    if (!session) return;

    if (!grouped[session.date]) {
      grouped[session.date] = {
        date: session.date,
        present: 0,
        absent: 0,
      };
    }

    if (record.status === 'present') {
      grouped[session.date].present++;
    } else {
      grouped[session.date].absent++;
    }
  });

  return Object.values(grouped);
};
