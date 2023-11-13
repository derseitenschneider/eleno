const express = require('express');
const { getHomework } = require('../controllers/homeworkController');

const router = express.Router();

router.route('/:studentId/:homeworkKey').get(getHomework);

module.exports = router;
