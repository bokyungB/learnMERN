const mongoose = require('mongoose');
const { Schema } = mongoose;

const likeSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    perfume_id: {
        type: Schema.Types.ObjectId,
        ref: 'Perfume',
        required: true
    }
})

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
