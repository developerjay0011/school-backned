const express = require('express');
const router = express.Router();
const quizController = require('../../controllers/student/quizController');
const { authenticateStudentToken } = require('../../middleware/auth');
// All routes are protected and require student authentication
router.use(authenticateStudentToken);

// Get all quiz topics
router.get('/topics', quizController.getTopics);

// Get all quiz results for the authenticated student
// Example: GET /api/student/quizzes/results
router.get('/results', quizController.getResults);

// Get random questions from all topics
// Example: GET /api/student/quizzes/questions?count=10&isExam=true
// If isExam=true, returns 82 questions with specific counts and weightages per topic
router.get('/questions', quizController.getRandomQuestions);

// Get quiz info by topic
// Example: GET /api/student/quizzes/Topic1
router.get('/:topic', quizController.getQuizByTopic);

// Get random questions from a specific topic
// Example: GET /api/student/quizzes/Topic1/questions?count=10&isExam=true
// If isExam=true, returns topic-specific number of questions with weightages
router.get('/:topic/questions', quizController.getRandomQuestions);

// Submit answers for any topic
// Example: POST /api/student/quizzes/submit
// Body: {
//   "answers": [
//     { "topic": "Topic1", "questionId": 1, "selectedOption": "A" },
//     { "topic": "Topic2", "questionId": 2, "selectedOption": "B" }
//   ],
//   "isExam": false
// }
router.post('/submit', quizController.submitAnswers);

// Submit answers for a specific topic (legacy endpoint)
// Example: POST /api/student/quizzes/Topic1/submit
// Body: {
//   "answers": [
//     { "questionId": 1, "selectedOption": "A" },
//     { "questionId": 2, "selectedOption": "B" }
//   ],
//   "isExam": false
// }
router.post('/:topic/submit', quizController.submitAnswers);

module.exports = router;
