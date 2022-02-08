const express = require('express');
const router = express.Router();
const passport = require('passport');

// 구글 로그인
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
    }), (req, res) => {
        res.status(200).json({success: true, user: req.user});
});

// 로그아웃
router.get('/logout', (req, res) => {
        if(req.user) {
                req.session.destroy();
                res.status(200).json({success: true})
        } else {
                res.status(401).json({success: false, message: "로그인이 필요합니다."})
        }
})

module.exports = router;
