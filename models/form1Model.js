const mongoose = require('mongoose');

const accessoryCategorySchema = new mongoose.Schema({
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

const AccessoryCategory = mongoose.model('Form1', accessoryCategorySchema);

module.exports = AccessoryCategory;
