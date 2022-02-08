const mongoose = require('mongoose');
const { Schema } = mongoose;

const perfumeSchema = new Schema({
    _id: Schema.Types.ObjectId,

    product: {
        type: String,
        required: true,
    },

    house: {
        type: String,
        required: true,
    },

    launch: {
        type: Number,
    },

    available: {
        type: String,
        enum: ['T', 'F']
    },

    perfumer: String,

    gender: {
        type: String,
        enum: ['all', 'f', 'm']
    },

    type: String,

    single_notes: [String],
    top_notes: [String],
    middle_notes: [String],
    bottom_notes: [String],

    image_name:{
        type:String,
        required: true
    },

    spring: {
        type: Number,
        min: 0,
        max:100
    },
    summer: {
        type: Number,
        min: 0,
        max:100
    },
    fall: {
        type: Number,
        min: 0,
        max:100
    },
    winter: {
        type: Number,
        min: 0,
        max:100
    },

    weather_code: String,
    weather_code_value: Number,

    view_count: {
        type: Number,
        default: 0
    },

    like_count: {
        type: Number,
        default: 0
    }

});

// 중복 검사
perfumeSchema.pre('save', function(next) {
    const perfume = this;
    Perfume.findOne({product: perfume.product, house: perfume.house}).then((result) => {
        if(result !== null)
           throw '중복된 데이터입니다.';
        else
            next();
    })
});

const Perfume = mongoose.model('Perfume', perfumeSchema);
module.exports = Perfume;
