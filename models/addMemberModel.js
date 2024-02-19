const mongoose = require('mongoose');

const MembersSchema = new mongoose.Schema({
    post: {
        type: String,
    },
    typeOfPost: {
        type: String,
    },
    name: {
        type: String,
    },
    name: {
        type: String,
    },
    age: {
        type: String,
    },
    gender: {
        type: String,
    },
    caste: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },

}, { timestamps: true });

const Members = mongoose.model('Members', MembersSchema);

module.exports = Members;
