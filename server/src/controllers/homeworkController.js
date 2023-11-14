const supabase = require('../db');

exports.getHomework = async (req, res) => {
  try {
    const {
      data: [lesson],
    } = await supabase
      .from('lessons')
      .select('*, students(firstName, lastName)')
      .eq('homeworkKey', req.params.homeworkKey);

    console.log(lesson);

    const studentId = +req.params.studentId;

    if (studentId !== lesson.studentId) {
      return res.status(404).json({
        status: 'fail',
        message: 'No matching keys',
      });
    }

    res.status(200).render('homework', lesson);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
