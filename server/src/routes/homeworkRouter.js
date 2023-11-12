const express = require('express');
const { getHomework } = require('../controllers/homeworkController');

const router = express.Router();

router.route('/:studentId/:homework_key').get(getHomework);

module.exports = router;
