const supabase = require('../db');

exports.getHomework = async (req, res) => {
  try {
    const {
      data: [lesson],
    } = await supabase
      .from('lessons')
      .select('*, students(firstName, lastName)')
      .eq('homeworkKey', req.params.homeworkKey);

    const studentId = +req.params.studentId;

    if (studentId !== lesson.studentId) {
      return res.status(404).render('error');
    }

    const formattedLesson = {
      ...lesson,
      date: lesson.date
        .split('-')
        .map((el, i) => (i === 0 ? el.slice(2) : el))
        .reverse()
        .join('.'),
    };
    res.status(200).render('homework', formattedLesson);
  } catch (error) {
    console.log(error);
    res.status(404).render('error');
  }
};
