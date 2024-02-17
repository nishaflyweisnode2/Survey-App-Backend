const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

}, { timestamps: true });

const Banner = mongoose.model('SurveyForms', BannerSchema);

module.exports = Banner;
