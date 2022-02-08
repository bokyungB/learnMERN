const express = require('express');
const Perfume = require('../../models/Perfume');
const Like = require('../../models/Like');
const router = express.Router();

/**
 * 전체 향수 조회 API 
 * 
 *  1. 페이징
 *  2. 정렬
 *  3. 향조, 노트, 브랜드별 필터링
 * */


router.get('/', async (req, res) => {

    // 회원의 좋아요 목록 조회
    let likeList = req.user ? await Like.find({user_id: req.user._id}).select('perfume_id').exec(): null;
    if (likeList) {
        likeList = likeList.map(like => like.perfume_id.toString());
    }

    // 쿼리 스트링 처리
    let query = Perfume.find(req.query);
    const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    const limit = req.query.limit === undefined ? 50 : parseInt(req.query.limit);
    const sort = req.query.sort === undefined ? '-view_count' : req.query.sort;
    let group = req.query.group;
    let notes = req.query.notes;
    let house = req.query.house;

    // 향조 쿼리
    if (group) {
        group = group.split(',');
        let groupRegex = '';
        group.map(value => {
            groupRegex += value + '.*';
        });
        query = query.find({'type': {$regex: groupRegex, $options: 'i'}});  // i: 대소문자 무시
    }

    // 노트 쿼리
    if (notes) {
        notes = notes.split(','); // 구분자 ','를 기준으로 파싱
        query = query.or([
            {'single_notes': {$all: notes}},
            {'top_notes': {$all: notes}},
            {'middle_notes': {$all: notes}},
            {'bottom_notes': {$all: notes}},

        ]);
    }

    // 브랜드 쿼리
    if (house) {
        query = query.find({'house': {$regex: house, $options: 'i'}});
    }

    // 정렬 및 페이징 쿼리
    query.sort(sort).skip((page-1)*limit).limit(limit).exec()
        .then(perfumeList => {
            if(req.user) { // 로그인 상태
                const result = perfumeList.map((perfume) => {
                    if (likeList.includes(perfume._id.toString())) {
                        return {
                            id: perfume._id,
                            product: perfume.product,
                            house: perfume.house,
                            image_name: perfume.image_name,
                            liked: true
                        }
                    } else {
                        return {
                            id: perfume._id,
                            product: perfume.product,
                            house: perfume.house,
                            image_name: perfume.image_name,
                            liked: false
                        }
                    }
                });
                return result;
            }
            else { // 비로그인 상태
                const result = perfumeList.map((perfume) => {
                    return {
                        id: perfume._id,
                        product: perfume.product,
                        house: perfume.house,
                        image_name: perfume.image_name,
                        liked: false,
                    }
                });
                return result;
            }
        }).then((result) => {
            return res.status(200).json({success: true, data: result});
        }).catch((err) => {
            console.log(err);
            return res.status(400).json({success: false, message: '잘못된 요청입니다.'});
        });

})

/**
 * 향수 상세 조회 API
 */
router.get('/:id', async (req, res) => {
    const perfumeId = req.params.id;
    Perfume.findById(perfumeId).exec()
        .then((perfume) => {
            let group = perfume.type ? perfume.type.split('-') : []; // 향조 배열
            res.status(200).json({
                success: true,
                data: {
                    product: perfume.product,
                    house: perfume.house,
                    image_name: perfume.image_name,
                    single_notes: perfume.single_notes,
                    top_notes: perfume.top_notes,
                    middle_notes: perfume.middle_notes,
                    bottom_notes: perfume.bottom_notes,
                    group: group,
                    // description:
                }
            });
        }).catch((err) => {
            res.status(404).json({
                success: false,
                message: '존재하지 않는 향수 id 입니다.'
            });
    })
})

router.post('/test', (req,res) =>{

  let limit = req.body.limit ? parseInt(req.body.limit):100;
  let skip = req.body = req.body.skip ? parseInt(req.body.skip):0;

  Perfume.find()
         .skip(skip)
         .limit(limit)
         .exec((err,productInfo)=> {
      if(err) return res.status(400).json({success:false,err})
      return res.status(200).json({success:true,productInfo,
                                    postSize: productInfo.length})
    }  
  )
})

// app.post('/api/product/products',(req,res) => {
//   //test 용 조회 정보 api를 만든다. 
//   Perfume.find().exec((err,proudctInfo) =>{
//     if(err) return res.status(400).json({success:false,err})
//     return res.status(200).json({success:true,proudctInfo})
//   }
//   )

// })
module.exports = router;
