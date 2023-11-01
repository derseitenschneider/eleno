const supabase = require('../db');

exports.getHomework = async (req, res) => {
  try {
    const lesson = await supabase
      .from('lessons')
      .select('*')
      .eq('api_key', req.params.api_key);

    const studentId = +req.params.studentId;

    if (studentId !== lesson.data[0].studentId) {
      return res.status(404).json({
        status: 'fail',
        message: 'No matching keys',
      });
    }

    res.status(200).json({
      status: 'success',
      data: lesson,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
