const mongoose = require('mongoose');

const AnswerSchema = mongoose.Schema({
    answer: {
        type: String,
        required: true
    }

});

const QuizSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answers: [AnswerSchema]

});



module.exports = mongoose.model('Quiz', QuizSchema);