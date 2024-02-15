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
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const AccessoryCategory = mongoose.model('Form7', accessoryCategorySchema);

module.exports = AccessoryCategory;
