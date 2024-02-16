const mongoose = require('mongoose');

const accessoryCategorySchema = new mongoose.Schema({
    form1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form1',
    },
    form2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form2',
    },
    form3: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form3',
    },
    form4: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form4',
    },
    form5: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form5',
    },
    form6: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form6',
    },
    form7: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form7',
    },
    image: {
        type: String,
    },
    facebookLink: {
        type: String,
    },
    twiterLink: {
        type: String,
    },
    instagramLink: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const AccessoryCategory = mongoose.model('Form8', accessoryCategorySchema);

module.exports = AccessoryCategory;
