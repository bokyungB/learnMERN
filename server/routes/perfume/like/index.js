const express = require('express');
const Perfume = require('../../../models/Perfume');
const Like = require('../../../models/Like');
const router = express.Router();

/**
 * 좋아요 API
 */
router.post('/', async (req, res) => {
    if(!req.user) {
        return res.status(401).json({
            success: false,
            message: '로그인이 필요합니다.'
        });
    }

    const userId = req.user._id;
    const perfumeId = req.body.perfume_id;

    likePerfume(userId, perfumeId)
        .then((message) => {
            return res.status(200).json({
                success: true,
                message: message // 'like' 혹은 'unLike'
            });
        })
        .catch((err) => {
            return res.status(404).json({
                success: false,
                message: '존재하지 않는 향수 id 입니다.'
            });
        })
})

// 좋아요 기능
async function likePerfume(userId, perfumeId) {
    const like = await findLikeByUserAndPerfume(userId, perfumeId);
    if(like) {
        await Like.deleteOne({user_id: userId, perfume_id: perfumeId});
        await Perfume.findByIdAndUpdate(perfumeId, {$inc: {like_count: -1}});
        return 'unLike';
    } else {
        await Like.create({user_id: userId, perfume_id: perfumeId});
        await Perfume.findByIdAndUpdate(perfumeId, {$inc: {like_count: 1}});
        return 'like';
    }
}

// 좋아요 조회
async function findLikeByUserAndPerfume(userId, perfumeId){
    const like = await Like.findOne({user_id: userId, perfume_id: perfumeId}).exec();
    return like;
}

module.exports = router;
