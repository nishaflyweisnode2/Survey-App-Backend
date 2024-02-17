const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    image: {
        type: String,
    },
    header1: {
        type: String,
    },
    header2: {
        type: String,
    },
    header3: {
        type: String,
    },
    rightHeader3: {
        type: String,
    },
    label1: {
        type: String,
    },
    sponserName: {
        type: String,
    },
    sponserPost: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

}, { timestamps: true });

const Banner = mongoose.model('Templates', BannerSchema);

module.exports = Banner;
