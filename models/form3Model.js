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
    name: {
        type: String,
    },
    image: {
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

const AccessoryCategory = mongoose.model('Form3', accessoryCategorySchema);

module.exports = AccessoryCategory;
