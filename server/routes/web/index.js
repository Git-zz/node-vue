module.exports=app=>{
    const router=require('express').Router()
    const mongoose=require('mongoose')
    const Article=mongoose.model('Article')
    const Category=mongoose.model('Category')
    const Hero=mongoose.model('Hero')
    const Video=mongoose.model('Video')
    const Way=mongoose.model('Way')
    const Race=mongoose.model('Race')
    const Game=mongoose.model('Game')
    const Comment=require('../../models/Comment')
    const AdminUser = require('../../models/AdminUser')
    const jwt=require('jsonwebtoken')

    router.post('/comments',async (req,res)=>{
        const model=await Comment.create(req.body)
        res.send(model)
    })
    router.get('/comments',async (req,res)=>{
        const items=await Comment.find().limit(10)
        res.send(items)
    })

    router.get('/news/init', async (reqw, res) => {
        const parent = await Category.findOne({
            name: '新闻分类'
        })
        const cats = await Category.find().where({
            parent: parent
        }).lean()
        const newsTitles = ["夏日新版本“稷下星之队”即将6月上线", "王者荣耀携手两大博物馆 走进稷下学宫", "王者大陆第一学院【稷下】档案", "跨界合作丨控油神装登场，唤醒无限护肤力量！", "像素游戏时代“老四强”重聚《魂斗罗：归来》，新版本、新英雄燃爆两周年庆", "新皮肤爆料丨孔雀开屏，雀灵翩飞！峡谷最“绣”的皮肤来了~", "【已修复】王者大陆的端午宝藏活动页面异常问题说明", "6月7日体验服停机更新公告", "6月4日全服不停机更新公告", "关于2019年KPL春季赛总决赛 RNG.M vs eStarPro 补赛、赛果及世界冠军杯安排公告", "活力夏日活动周 王者峡谷好礼多", "王者大陆的端午宝藏活动公告", "峡谷庆端午 惊喜礼不断", "【场里场外，一起开黑】感恩礼包放送", "KPL总决赛来临之际 场里场外一起开黑/观赛活动开启！", "【6月15日 再战西安 · 2019年KPL春季赛总决赛重启公告】", "王者荣耀世界冠军杯荣耀来袭，KPL赛区选拔赛谁能突围而出？", "【关于2019年KPL春季赛总决赛门票退换及异地用户现场观赛补贴公告】", "KRKPL：还在用庄周打辅助？JY边路庄周带你越塔莽！", "世冠KPL赛区战队出征名单公布 王者，无惧挑战！"]
        const newsList = newsTitles.map(title => {
            const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5)
            return {
                categories: randomCats.slice(0, 2),
                title: title
            }
        })
        await Article.deleteMany({})
        await Article.insertMany(newsList)
        res.send(newsList)
    })

    // 新闻列表接口
    router.get('/news/list', async (req, res) => {

        const parent = await Category.findOne({
            name: '新闻分类'
        })
        const cats = await Category.aggregate([
            { $match: { parent: parent._id } },
            {
                $lookup: {
                    from: 'articles',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'newsList'
                }
            },
            {
                $addFields: {
                    newsList: { $slice: ['$newsList', 5] }
                }
            }
        ])
        const subCats = cats.map(v => v._id)
        cats.unshift({
            name: '热门',
            newsList: await Article.find().where({
                categories: { $in: subCats }
            }).populate('categories').limit(5).lean()
        })

        cats.map(cat => {
            cat.newsList.map(news => {
                news.categoryName = (cat.name === '热门')
                    ? news.categories[0].name : cat.name
                return news
            })
            return cat
        })
        res.send(cats)

    })

    router.get('/heroes/init',async (req,res)=>{
        await Hero.deleteMany({})
        const rawData=[{ "name": "热门", "heroes": [{ "name": "后羿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg" }, { "name": "孙悟空", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg" }, { "name": "铠", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg" }, { "name": "鲁班七号", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg" }, { "name": "亚瑟", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg" }, { "name": "甄姬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg" }, { "name": "孙尚香", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg" }, { "name": "典韦", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/129/129.jpg" }, { "name": "韩信", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg" }, { "name": "庄周", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg" }] }, { "name": "战士", "heroes": [{ "name": "赵云", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg" }, { "name": "钟无艳", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg" }, { "name": "吕布", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg" }, { "name": "曹操", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/128/128.jpg" }, { "name": "典韦", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/129/129.jpg" }, { "name": "宫本武藏", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/130/130.jpg" }, { "name": "达摩", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg" }, { "name": "老夫子", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/139/139.jpg" }, { "name": "关羽", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/140/140.jpg" }, { "name": "露娜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg" }, { "name": "花木兰", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg" }, { "name": "亚瑟", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg" }, { "name": "孙悟空", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg" }, { "name": "刘备", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/170/170.jpg" }, { "name": "杨戬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/178/178.jpg" }, { "name": "雅典娜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/183/183.jpg" }, { "name": "哪吒", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/180/180.jpg" }, { "name": "铠", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg" }, { "name": "狂铁", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/503/503.jpg" }, { "name": "李信", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/507/507.jpg" }, { "name": "盘古", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/529/529.jpg" }] }, { "name": "法师", "heroes": [{ "name": "小乔", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/106/106.jpg" }, { "name": "墨子", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg" }, { "name": "妲己", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg" }, { "name": "嬴政", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/110/110.jpg" }, { "name": "高渐离", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/115/115.jpg" }, { "name": "扁鹊", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/119/119.jpg" }, { "name": "芈月", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg" }, { "name": "周瑜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/124/124.jpg" }, { "name": "甄姬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg" }, { "name": "武则天", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/136/136.jpg" }, { "name": "貂蝉", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg" }, { "name": "安琪拉", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg" }, { "name": "姜子牙", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/148/148.jpg" }, { "name": "王昭君", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/152/152.jpg" }, { "name": "张良", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/156/156.jpg" }, { "name": "不知火舞", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg" }, { "name": "钟馗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg" }, { "name": "诸葛亮", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190.jpg" }, { "name": "干将莫邪", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/182/182.jpg" }, { "name": "女娲", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/179/179.jpg" }, { "name": "杨玉环", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/176/176.jpg" }, { "name": "弈星", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/197/197.jpg" }, { "name": "米莱狄", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/504/504.jpg" }, { "name": "沈梦溪", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/312/312.jpg" }, { "name": "上官婉儿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg" }, { "name": "嫦娥", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg" }] }, { "name": "坦克", "heroes": [{ "name": "廉颇", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/105/105.jpg" }, { "name": "刘禅", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg" }, { "name": "白起", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/120/120.jpg" }, { "name": "夏侯惇", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg" }, { "name": "项羽", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135.jpg" }, { "name": "程咬金", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg" }, { "name": "刘邦", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/149/149.jpg" }, { "name": "牛魔", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg" }, { "name": "张飞", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg" }, { "name": "东皇太一", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg" }, { "name": "苏烈", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg" }, { "name": "梦奇", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg" }, { "name": "孙策", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg" }, { "name": "猪八戒", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/511/511.jpg" }] }, { "name": "刺客", "heroes": [{ "name": "阿轲", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/116/116.jpg" }, { "name": "李白", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131.jpg" }, { "name": "韩信", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg" }, { "name": "兰陵王", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/153/153.jpg" }, { "name": "娜可露露", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/162/162.jpg" }, { "name": "橘右京", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg" }, { "name": "百里玄策", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/195/195.jpg" }, { "name": "裴擒虎", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg" }, { "name": "元歌", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/125/125.jpg" }, { "name": "司马懿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg" }, { "name": "云中君", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg" }] }, { "name": "射手", "heroes": [{ "name": "孙尚香", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg" }, { "name": "鲁班七号", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg" }, { "name": "马可波罗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/132/132.jpg" }, { "name": "狄仁杰", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/133/133.jpg" }, { "name": "后羿", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg" }, { "name": "李元芳", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/173/173.jpg" }, { "name": "虞姬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/174/174.jpg" }, { "name": "成吉思汗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/177/177.jpg" }, { "name": "黄忠", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/192/192.jpg" }, { "name": "百里守约", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg" }, { "name": "公孙离", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/199/199.jpg" }, { "name": "伽罗", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/508/508.jpg" }] }, { "name": "辅助", "heroes": [{ "name": "庄周", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg" }, { "name": "孙膑", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg" }, { "name": "蔡文姬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184.jpg" }, { "name": "太乙真人", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg" }, { "name": "大乔", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/191/191.jpg" }, { "name": "鬼谷子", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/189/189.jpg" }, { "name": "明世隐", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/501/501.jpg" }, { "name": "盾山", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg" }, { "name": "瑶", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg" }] }]
        for (let cat of rawData){
            if (cat.name==='热门'){
                continue
            }
            const category=await Category.findOne({
                name:cat.name
            })
            cat.heroes=cat.heroes.map(hero=>{
                hero.categories=[category]
                return hero
            })
            await Hero.insertMany(cat.heroes)
        }
        res.send(await Hero.find())
    })

    router.get('/heroes/list',async (req,res)=>{
        const parent=await Category.findOne({
            name: '英雄分类'
        })
        const cats=await Category.aggregate([
            {$match:{parent:parent._id}},
            {
                $lookup:{
                    from:'heroes',
                    localField:'_id',
                    foreignField:'categories',
                    as:'heroList'
                }
            }
        ])
        const subCats=cats.map(v=>v._id)
        cats.unshift({
            name:'热门',
            heroList:await Hero.find().where({
                categories:{$in:subCats}
            }).limit(10).lean()
        })

        res.send(cats)
    })

    router.get('/videos/init',async (req,res)=>{
            await Video.deleteMany({})
            const rawData = [{"name":"精品栏目","videos":[{"title":"【百星王者带你飞】103期：沈梦溪的暴躁节奏，炸翻峡谷喵计划","cover":"https://itea-cdn.qq.com/file/tgl/20190820/a8f73a12cdddf0f835c47d97c73a52de.1566304750.55f590b89a1621eef9a7ab2c2d8cd52c.230x140_12119.jpg"},{"title":"【峡谷情报局】第76期：胜率战神英勇无畏，真神觉醒勇夺第一","cover":"https://itea-cdn.qq.com/file/tgl/20190820/a8f73a12cdddf0f835c47d97c73a52de.1566230619.36cfa493b60475d546bc7a2b91183f83.230x140_14401.jpg"},{"title":"【峡谷重案组】S3 大结局 重案组绝地反击 大魔头真身揭晓","cover":"https://itea-cdn.qq.com/file/tgl/20190816/6d293e21e04e26d44dcf96946bfdf528.1565923143.f781e266902ec0bb77f375558c355e6a.960x600_375188.jpg"},{"title":"【上分拍档】第94期：大乔+公孙离 宿命之海 进退自如","cover":"https://itea-cdn.qq.com/file/tgl/20190815/a8f73a12cdddf0f835c47d97c73a52de.1565855885.4e9ba16a7946942e5036d34bd872727d.230x140_12828.jpg"}]},{"name":"英雄攻略","videos":[{"title":"王者荣耀：伽罗第二件出无尽战刃？难怪你发育慢","cover":"https://itea-cdn.qq.com/file/tgl/20190818/674ec7fc6e8ad425df0939fd53566ed6.1566135849.4804b4a324d506be0d12bc0bbd6bbc49.230x140_18801.jpg"},{"title":"王者荣耀：半小时拉锯战，意识流关羽一刀双杀扭转乾坤！","cover":"https://itea-cdn.qq.com/file/tgl/20190818/6b13feeeef661950af3ce2faa491cf78.1566104722.536336804e6fed92612121938dd9fc29.230x140_16118.jpg"},{"title":"我玩刘邦还是可以的，比你强妥妥的！","cover":"https://itea-cdn.qq.com/file/tgl/20190817/db9eeb7e678863649bce209842e0d164.1566026512.c19f4d1c9e03945430d5beeb0f1453a3.230x140_14238.jpg"},{"title":"王者荣耀：张大仙讲解上官婉儿基础连招，详细分析细节难点！","cover":"https://itea-cdn.qq.com/file/tgl/20190819/7856453c72507885a7dee4327475f978.1566185424.2a8f1a980278bff03b73e3ba667dd7e3.230x140_18705.jpg"}]},{"name":"赛事精品","videos":[{"title":"荣耀美少女第三期：美少女淘汰赛纷纷落泪，COS美少女美翻！","cover":"https://shp.qpic.cn/cfwebcap/0/c4c4624fb7fa564a700b2e3ac6d7614a/0/?width=230&height=140"},{"title":"红蓝阵营欢乐团建！踢球唱歌团魂燃起备战残酷赛制","cover":"https://shp.qpic.cn/cfwebcap/0/f53cb2d3f1ddb551065fc82150c65762/0/?width=230&height=140"},{"title":"残酷淘汰赛开启！各队磨合不顺问题频发，谁能留到最后？","cover":"https://shp.qpic.cn/cfwebcap/0/a3ebe003a914bec16fb66a029f805c3b/0/?width=230&height=140"},{"title":"自由组队矛盾突发，美少女情绪失控齐落泪！","cover":"https://shp.qpic.cn/cfwebcap/0/b4763f8856158efd2de835fad4d82add/0/?width=230&height=140"}]},{"name":"赛事视频","videos":[{"title":"这曜简直太秀了！花里胡哨连招不要太强","cover":"https://puui.qpic.cn/qqvideo_ori/0/k0915ajebvc_1280_720/0"},{"title":"这关羽简直无法无天！防御塔：我不要面子的吗？","cover":"https://puui.qpic.cn/qqvideo_ori/0/n0915a7ge4d_1280_720/0"},{"title":"【课间10分钟】话痨“曜”的隐藏触发语音","cover":"https://shp.qpic.cn/cfwebcap/0/eeaad7a100c1e3c7cbf751fa04b6738a/0/?width=230&height=140"},{"title":"【JC Vlog】有时间搞这些有的没的，还不如","cover":"https://shp.qpic.cn/cfwebcap/0/7a786a26f5feec81728c7a3240bea320/0/?width=230&height=140"}]}]
            for (let cat of rawData){
                const category=await Category.findOne({
                    name:cat.name
                })
                cat.videos=cat.videos.map(video=>{
                    video.categories=[category]
                    return video
                })
                await Video.insertMany(cat.videos)
            }
            res.send(await Video.find())
    })

    router.get('/videos/list',async (req,res)=>{
        const parent=await Category.findOne({
            name: '视频分类'
        })
        const cats=await Category.aggregate([
            {$match:{parent:parent._id}},
            {
                $lookup:{
                    from:'videos',
                    localField:'_id',
                    foreignField:'categories',
                    as:'videoList'
                }
            }
        ])
        res.send(cats)
    })

    router.get('/ways/init',async (req,res)=>{
        await Way.deleteMany({})
        const rawData = [{"name":"最新","ways":[{"title":"关于白起，别再乱出装了，这套S16最新出装，轻松上星耀和王者","cover":"https://itea-cdn.qq.com/file/tgl/20190823/ded64243d56630eab334606844ef9021.1566517902.498111b40320d4fa014d11b95a129f09.230x140_59591.png"},{"title":"张良：前期快速清线，四级频繁抓边，后期控制伤害双重打击！","cover":"https://itea-cdn.qq.com/file/tgl/20190823/851936dbc11daf7e2b147304033e219d.1566523723.999ea9f8f6d94ad0a3b737812ef79609.230x140_65963.png"},{"title":"王者荣耀cos：杨玉环cos：看一眼月牙泉就回头","cover":"https://itea-cdn.qq.com/file/tgl/20190821/01a016267700a6756fb73c1e8da6b334.1566400218.46220979492874337676224451ed46af.230x140_11966.jpg"},{"title":"“电梯流”大乔怎么玩？老夫子不是绝配，组合才是王道！","cover":"https://itea-cdn.qq.com/file/tgl/20190808/df86a6350e54cf59d5303d3090ef094a.1565251146.b95bc899e5b1ed69292720609fe75e90.184x124_49419.jpg"},{"title":"4个简单的克制关系，一般人想不到，司马懿克制百里守约","cover":"https://itea-cdn.qq.com/file/tgl/20190821/8a993752e9658af101972ed98de10a8c.1566370496.b397e31b93dc57404cedcad163aa0e4e.184x124_51340.jpg"},{"title":" 王者荣耀：登场率之最的T0射手鲁班七号，会不会玩看这一点","cover":"https://itea-cdn.qq.com/file/tgl/20190818/8a59f74c875593c0f306d297e67490c3.1566095738.3790492e055b2109ce83c928646cc535.184x124_11862.jpg"},{"title":"虞姬这样的暴力出装，大神打C位一秒不到！坦克不知道能坚持几秒","cover":"https://itea-cdn.qq.com/file/tgl/20190821/6cdd60ea0045eb7a6ec44c54d29ed402.1566387497.21e5e48dc0640dcfd3341101746cf4b9.184x124_11668.jpg"},{"title":"《王者荣耀之纵横星缘》第二十七章 暴君（原创王者小说连载中）","cover":"https://itea-cdn.qq.com/file/tgl/20190819/a904df1d9ba37f076a0eefc798f8ea84.1566216041.754e1e11450186427957b1ac0e7e5e84.184x124_8933.jpg"},{"title":"高端局上分首选公孙离，这套梦泪的六神装，让她轻松凯瑞全场","cover":"https://itea-cdn.qq.com/file/tgl/20190823/6da9003b743b65f4c0ccd295cc484e57.1566539557.027d6d28f4dd135a807aeff9381526b2.230x140_23132.jpg"},{"title":"《稷下游》第七章：曜靠在走廊墙上都能睡着，简直就是刷新了认知","cover":"https://itea-cdn.qq.com/file/tgl/20190822/cd8d9855d1a1d8e156124243f6ce0867.1566429961.1db52a6d84f1aff890c360cb223c7210.184x124_58991.jpg"},{"title":"王者荣耀：后羿成排位宠儿，“双刀流”不惧刺客，逆风也能拿五杀","cover":"https://itea-cdn.qq.com/file/tgl/20190620/64689bba125e18b02b5e130fb98b4506.1561046336.d110e2c2bc151416fc61e3dedec79b7f.184x124_33711.jpg"},{"title":"诸葛亮闪爆全场，射手炙手可热疯狂输出，齐天大圣能否王者归来？","cover":"https://itea-cdn.qq.com/file/tgl/20190807/3d4e211cea36e46b822b9dafc8fe6626.1565141079.fcc8d9de0cd612f9f2b772f54811def2.184x124_44712.jpg"},{"title":"大乔要坦边，牛魔是百搭，辅助的详细分类：不同阵容拿不同辅助","cover":"https://itea-cdn.qq.com/file/tgl/20190821/ed45e85d76082370aab5d319016534b8.1566374065.5b36fbe8f176094e5da68eae3e604ae4.184x124_29870.jpg"},{"title":"21日体验服：嫦娥大乔下调，改动最大的还是这位隐身刺客","cover":"https://itea-cdn.qq.com/file/tgl/20190821/6b53f70e800940e4c2701e0295295423.1566364448.977636981f0496ca0154e806ccfd3852.184x124_54783.jpg"},{"title":"王者荣耀：羞涩的男孩子也可以拥有绚丽多彩的翅膀","cover":"https://itea-cdn.qq.com/file/tgl/20190821/dc891325f7efdc0bab2c425db1b70e54.1566390035.c812cf274e767e2cbd269893039845dc.184x124_14081.jpg"},{"title":"五虎上将归来马超上线！","cover":"https://itea-cdn.qq.com/file/tgl/20190821/6f4a28e69baddf078857f9a1b9f474ff.1566364414.2945163954e313301ef1d43cdd4b9325.184x124_33423.jpg"},{"title":"新赛季辅助上分优选，没有坦克选廉颇，选孙膑不用看阵容","cover":"https://itea-cdn.qq.com/file/tgl/20190807/d3d9446802a44259755d38e6d163e820.1565174139.3a8f697382408c962d68db29594e8c43.184x124_66404.jpg"},{"title":"S16上分法师首选诸葛亮，安琪拉一控到死，她团控全场！","cover":"https://itea-cdn.qq.com/file/tgl/20190807/b93e5dee4a244e287388983768cc9e0a.1565192507.db0887289226b225c731b9e837014842.230x140_23723.jpg"},{"title":"高端局法师T队，上官婉儿和嫦娥竞争T1,依靠更灵活的技能略胜","cover":"https://itea-cdn.qq.com/file/tgl/20190805/b7eab6088df1336ae87f97f6e75151d0.1564994302.78ce6d1e26a3cfac9531c4a61a81a36b.230x140_78932.png"},{"title":"世冠上路都用啥？孙策橘右京已经不是首选，最强势的根本猜不到","cover":"https://itea-cdn.qq.com/file/tgl/20190803/9d70f1cf5e7587ab741eaef46597c305.1564839804.47e16b7bbe41d270aba329d78b45d22f.230x140_57850.jpg"},{"title":"S16一个合格辅助需要完成的六件事，能全部完成的不超过10%！","cover":"https://shp.qpic.cn/cfwebcap/0/425196ebdeca54b84c54a20c0c5c7cae/0/?width=230&height=140"},{"title":"Hero兵法讲堂：刺客篇","cover":"https://shp.qpic.cn/cfwebcap/0/760ea7e6667ce5065b305b0134e8041a/0/?width=230&height=140"},{"title":"王者荣耀：射手遇到兰陵王都颤抖？，这几位却让他有来无回","cover":"https://itea-cdn.qq.com/file/tgl/20190802/22348f642503adaf7d3641928e6ef285.1564728271.05622b4e034fc6ddd20662b94fc3444f.230x140_17371.jpg"},{"title":"营地数据榜：射手榜首易主，狄仁杰微调第二都没保住，他后来居上","cover":"https://itea-cdn.qq.com/file/tgl/20190802/c8070d27b86aa1bc7489142aa8d82a55.1564753294.ef6375f0e332fb24e691953f741a5f05.230x140_19218.jpg"},{"title":"王者荣耀：最考验意识的三位辅助，新手玩不好，大神当成宝！","cover":"https://itea-cdn.qq.com/file/tgl/20190802/6da9003b743b65f4c0ccd295cc484e57.1564734748.c412f7ff79ce5118fc6c0f2dc7bc21f8.230x140_22324.jpg"},{"title":"8月初射手T度排行榜，看看你心仪的射手进入了榜几","cover":"https://itea-cdn.qq.com/file/tgl/20190803/9c870b08abc2bbef571b43cf4e7bab45.1564829953.f3fe6cd752cc6e65e61dda6f78b95258.230x140_15761.jpg"},{"title":"王者荣耀：射手出肉会更强？打惯了输出装的，不妨来看看吧！","cover":"https://itea-cdn.qq.com/file/tgl/20190801/6da9003b743b65f4c0ccd295cc484e57.1564635606.8cf7fc5a37204778f7abb641d3396c36.230x140_22161.jpg"},{"title":"上分秘诀之射手，站桩射手的三件法宝！后羿实战打法简介！","cover":"https://itea-cdn.qq.com/file/tgl/20190731/b0ca4eff978167e0f1953fcea8832d3f.1564566213.f0663874be6d1c54418f87519ae9c4b4.230x140_44966.jpg"},{"title":"草丛两个小可爱喜迎增强，妲己安琪拉下限再次提升，中路上分首选","cover":"https://itea-cdn.qq.com/file/tgl/20190801/cfcd208495d565ef66e7dff9f98764da.1564663108.3ae6598382d0152ff4ecdeaff5c05109.230x140_23155.jpg"},{"title":"S16辅助国服荣耀战力排榜|鬼谷子稳居前三，黑马的她排在榜首","cover":"https://itea-cdn.qq.com/file/tgl/20190731/6da9003b743b65f4c0ccd295cc484e57.1564558615.656819319d1c8b7b96b6be2137fb78b5.230x140_62701.jpg"},{"title":"辅助英雄又引玩家们吐槽，三种出门思路到底该选哪一种好？","cover":"https://itea-cdn.qq.com/file/tgl/20190731/903ce9225fca3e988c2af215d4e544d3.1564562825.6823dae008c0961396585188126858ce.230x140_14746.jpg"},{"title":"峡谷小短腿，输出扛大旗——鲁班七号 进阶攻略","cover":"https://shp.qpic.cn/cfwebcap/0/a8c46a69d38abc5c9892261e38185773/0/?width=230&height=140"},{"title":"王者荣耀除了需要熟练度，常见细节技巧分享，高端局玩家都知道","cover":"https://itea-cdn.qq.com/file/tgl/20190724/bf58dde0eae7ed9a9d0f34398114b549.1563953637.749d4f23ff7944ce316231955293f7f4.230x140_64704.jpg"},{"title":"王者荣耀：超强实战中路游走技巧，学好三大原则轻松上分","cover":"https://itea-cdn.qq.com/file/tgl/20190715/02e74f10e0327ad868d138f2b4fdd6f0.1563167064.84d08c51c719aea1ab113f9b80921bb6.230x140_88394.jpg"},{"title":"全英雄铭文搭配思路，干货教程-战士篇","cover":"https://itea-cdn.qq.com/file/tgl/20190713/22c25c4f633efd5c33709cc12e60ac9b.1562949914.01a72a26af86b805b1cbde5c6fda25fe.230x140_18586.jpg"},{"title":"全英雄铭文搭配思路，干货教程-刺客+辅助篇","cover":"https://itea-cdn.qq.com/file/tgl/20190713/cd53d53ef16137b6446a595b0c09b808.1562950751.0786380e3ce07bee8ce71cd7ee82f1e3.230x140_16668.jpg"},{"title":"鞋子作为6大神装之一，每人必出，但你真的对它研究过吗？","cover":"https://itea-cdn.qq.com/file/tgl/20190713/ccb3d22a44e997e6b33296013a6383b3.1562987847.75d1dc343f85e661887755df3db8ef76.230x140_20839.jpg"},{"title":"王者荣耀：领悟装备中“唯一被动”的意思，别再被说不会出装了","cover":"https://itea-cdn.qq.com/file/tgl/20190709/4134d9e2acb614ea98c12902490a8541.1562656487.ad2289a391fbeb879ae38941f82af8bf.230x140_16538.jpg"},{"title":"王者荣耀：如何成为一名优秀的上单玩家？这十点意识你必须掌握！","cover":"https://itea-cdn.qq.com/file/tgl/20190710/0ac88cfa3358a41a848a0996ba2980d1.1562760261.c6b7c09ebef1df462c7df296aa94cc46.230x140_7096.jpg"},{"title":"王者荣耀：常用铭文搭配，真的很详细啦","cover":"https://itea-cdn.qq.com/file/tgl/20190628/4134d9e2acb614ea98c12902490a8541.1561707086.1aea7d895e4c6afdca57e1547e6becfd.230x140_16538.jpg"},{"title":"上分攻略︱这件装备虽然冷门，但却是射手英雄的翻盘利器！","cover":"https://itea-cdn.qq.com/file/tgl/20190623/c81e728d9d4c2f636f067f89cc14862c.1561227097.8ed946a29c732181c6c469af7bd4a3ff.230x140_49973.jpg"},{"title":"王者荣耀：上单第一件出暗影战斧，难怪守塔守不住","cover":"https://itea-cdn.qq.com/file/tgl/20190618/d612ae2e1245a287f727b3b758d70e9f.1560835832.6ea731298b68e947584a4a511fcf84f3.230x140_12022.jpg"},{"title":"王者荣耀：很难出的装备，破晓ADC必出，破军看情况，贤者尴尬","cover":"https://itea-cdn.qq.com/file/tgl/20190613/c81e728d9d4c2f636f067f89cc14862c.1560392596.4ac5f197c8c25020e1fec1e540afdf83.230x140_19684.jpg"},{"title":"王者荣耀S15法师通用铭文 新赛季法师铭文怎么搭配","cover":"https://itea-cdn.qq.com/file/tgl/20190614/d64288cca2eed9b7fa8762d4822490f7.1560500295.0b3a8d01ce4aa02db7571f43e92598a1.230x140_19501.jpg"},{"title":"王者荣耀中鲜少有人掌握的四个技巧，学会两个轻松上王者！","cover":"https://itea-cdn.qq.com/file/tgl/20190526/6944498554deb588b04967b079a1cf8a.1558843731.b6a783488e1bf58eadf1cb4e3ce2b7ab.230x140_54587.jpg"},{"title":"打野修炼手册：作为打野，如何呼风唤雨，掌控节奏，拿下胜利？","cover":"https://itea-cdn.qq.com/file/tgl/20190524/4dd8f10a65df6c0daadd17d9785d257f.1558712716.32f439e02d6092b071215d7b89d32355.230x140_5469.jpg"},{"title":"【虎扑攻略】S15五排最简单上分法则：拒绝花里胡哨，保护我方输出","cover":"https://shp.qpic.cn/cfwebcap/0/0b32c8593bcb7baf62365634c0c7493c/0/?width=230&height=140"},{"title":"玩辅助不会站位开视野？这里教你轻松学会辅助的所有视野站位","cover":"https://itea-cdn.qq.com/file/tgl/20190517/424de7a8a3c9bb09f108f4f24d597297.1558087000.ade3dafb7c7a4f67049e151830a3f768.230x140_9427.jpg"},{"title":"马超：兄弟的热血不会白流，西凉的纯洁我来守护","cover":"https://shp.qpic.cn/cfwebcap/0/6a1420625349827f075de3b38d89ff3d/0/?width=230&height=140"},{"title":"王者荣耀首批金牌特权门店现已上线","cover":"https://shp.qpic.cn/cfwebcap/0/952e1b385c626f1a6f54bf12d974c25a/0/?width=230&height=140"},{"title":"吃喝玩 赚一夏 来王者人生享暑期豪礼！","cover":"https://shp.qpic.cn/cfwebcap/0/7cd4951fdcf9a47779a8175fa73c7af1/0/?width=230&height=140"},{"title":"英雄故事 | 孙膑：为了我的挚友，流动吧，时间之力！","cover":"https://shp.qpic.cn/cfwebcap/0/b0bfa37d5549734d96debd154358888b/0/?width=230&height=140"},{"title":"云中君vs瑶：隔着一颗眼泪，也看不清生死的羁绊","cover":"https://shp.qpic.cn/cfwebcap/0/27cdca796c0f520fbce6f61536d1cb51/0/?width=230&height=140"},{"title":"中二少年的独白：我就是想证明自己","cover":"https://shp.qpic.cn/cfwebcap/0/0b2742a68d0c30046a9b751b2c1733ae/0/?width=230&height=140"},{"title":"王者世界观体验站更新！绝密档案已曝光","cover":"https://shp.qpic.cn/cfwebcap/0/b179d7510c7e2a1087c043766a972c3f/0/?width=230&height=140"},{"title":"英雄故事 | 曜-星辰之子","cover":"https://shp.qpic.cn/cfwebcap/0/8006f57e49f156441ca43784b8644d04/0/?width=230&height=140"},{"title":"稷下学院 | 诸葛学长带你逛母校","cover":"https://shp.qpic.cn/cfwebcap/0/9e5fbde7944361ae0a81c01142a11c1e/0/?width=230&height=140"},{"title":"王者大陆行 | 云中漠地-都护府","cover":"https://shp.qpic.cn/cfwebcap/0/baea4fbea5add7ab7404e23d7650e104/0/?width=230&height=140"},{"title":"王者大陆行 | 云中漠地-千窟城","cover":"https://shp.qpic.cn/cfwebcap/0/a75eca0408b2ef7a81f0ad4add6b611a/0/?width=230&height=140"},{"title":"英雄故事 | 云中君：小鹿女，你的谎言我都懂","cover":"https://shp.qpic.cn/cfwebcap/0/150adce63d4d8f0c7575f3e88d852255/0/?width=230&height=140"},{"title":"英雄故事 | 云中君：不是天使，胜是天使","cover":"https://shp.qpic.cn/cfwebcap/0/4994706713e802d3b4985bfe52e51a2a/0/?width=230&height=140"},{"title":"英雄小传 | 第一个全程飞的英雄，必承受更多痛苦！","cover":"https://shp.qpic.cn/cfwebcap/0/3a877748232c96c1711904f872b88737/0/?width=230&height=140"},{"title":"王者大陆行 | 云中漠地-玉城","cover":"https://shp.qpic.cn/cfwebcap/0/adade14f5990bc18d0e024dd8a175d27/0/?width=230&height=140"},{"title":"英雄故事 | 瑶-过去生于未来","cover":"https://shp.qpic.cn/cfwebcap/0/33b05fb59efff9b2a4619dc3e1ea4ff7/0/?width=230&height=140"},{"title":"王者荣耀cos：杨玉环cos：看一眼月牙泉就回头","cover":"https://itea-cdn.qq.com/file/tgl/20190821/01a016267700a6756fb73c1e8da6b334.1566400218.46220979492874337676224451ed46af.230x140_11966.jpg"},{"title":"《稷下游》第七章：曜靠在走廊墙上都能睡着，简直就是刷新了认知","cover":"https://itea-cdn.qq.com/file/tgl/20190822/cd8d9855d1a1d8e156124243f6ce0867.1566429961.1db52a6d84f1aff890c360cb223c7210.184x124_58991.jpg"},{"title":"李元芳传之治安官的必经之路（十四）恩，开更","cover":"https://itea-cdn.qq.com/file/tgl/20190821/96ee39e86e4efcb79f0a5fed5f17b02b.1566400535.6b910ce0e0745a5fbbe6083475ac89db.230x140_63312.jpg"},{"title":"王者荣耀cos：嫦娥cos：银色的神他心中并不冷","cover":"https://itea-cdn.qq.com/file/tgl/20190821/931f35b35cba35d410f38628521e46f4.1566399662.1299e8d0640bab99b532ee8aaa116506.230x140_7814.jpg"},{"title":"嫦娥cos：夜晚的太阳，保护属于他的人","cover":"https://itea-cdn.qq.com/file/tgl/20190821/eccbc87e4b5ce2fe28308fd9f2a7baf3.1566366263.ca09472ced7668fbae1d2aa9d9b51213.230x140_15517.jpg"},{"title":"王者荣耀：小说《剑仙荣耀》第1章 青莲剑仙","cover":"https://itea-cdn.qq.com/file/tgl/20190820/c81e728d9d4c2f636f067f89cc14862c.1566316218.37c35bffd22b5623a935188ac09b8a52.230x140_16736.jpg"},{"title":"铠：寒星下的别离，斩不断的羁绊","cover":"https://itea-cdn.qq.com/file/tgl/20190820/a7e4f67bd4672ea1d3b1023804556473.1566298775.4af6392a8ddd16a9af455f6bc563928e.230x140_20370.jpg"},{"title":"打开这个小妲己，王者峡谷爱心发射没有CD~","cover":"https://itea-cdn.qq.com/file/tgl/20190820/5d518828ff221e17893fa8ebbb65a39e.1566282196.2fad9363bf6cdb132f7eb9efa6b88382.230x140_73418.png"},{"title":"王者荣耀cos:阿轲:cos:节奏热浪","cover":"https://itea-cdn.qq.com/file/tgl/20190817/ba6130882945b025360775470d9eb7de.1566028102.5a34409340ff7b4579b9444c48375003.230x140_7985.jpg"},{"title":"王者荣耀同人小说《元歌传》第二章：骑鲲的贤者","cover":"https://itea-cdn.qq.com/file/tgl/20190819/eed2236fd0f59ec1de93d41ec19cb8da.1566207272.d883801f566be00b7f6f5a5d7f856198.230x140_9052.jpg"},{"title":"王者小漫画：小乔亲手给周瑜做的巧克力被孙尚香吃了，很生气","cover":"https://itea-cdn.qq.com/file/tgl/20190819/20f9c4c9262ec81071e1f5c73060cec9.1566179353.5f80d8a65102908cea93da4b582e9794.230x140_31272.jpg"},{"title":"王者荣耀：第47章 王昭君大战太乙真人","cover":"https://itea-cdn.qq.com/file/tgl/20190818/8a1add9877eb89b7f8cb2f0bb27cbdb8.1566121701.22ae4361657dafb063bb8f12003685c4.230x140_99672.png"},{"title":"我的稷下学院  第五章  在你头上暴扣","cover":"https://itea-cdn.qq.com/file/tgl/20190819/966a68ce35b7d043edb64b212c0cc441.1566229791.5ee0a7d79016decb2653adf8b8f2a7db.230x140_16875.jpg"},{"title":"【COS偶像季】第38期：长安的告白","cover":"https://itea-cdn.qq.com/file/tgl/20190820/6e7665f0778696a59cdc87c4ce9da604.1566289344.82fca956a35de0ec8fe43c988b976853.128x128_7045.jpg"},{"title":"王者小漫画：安琪拉不小心弄碎了李元芳的杯子，还好李元芳不怪她","cover":"https://itea-cdn.qq.com/file/tgl/20190820/7ac4b28783598768eb1c78addaff5b19.1566264659.9881a35045739ee5f03f659d4f14f8ee.184x124_42779.jpg"},{"title":"曾有惊鸿，但望长安（三）今夏暖心原创连载中","cover":"https://itea-cdn.qq.com/file/tgl/20190820/553bb51d82f3d19015cbeeb8f1a13874.1566275473.048905f16c8b195e93c51966d33a76ac.184x124_15542.jpg"}]},{"name":"英雄","ways":[{"title":"关于白起，别再乱出装了，这套S16最新出装，轻松上星耀和王者","cover":"https://itea-cdn.qq.com/file/tgl/20190823/ded64243d56630eab334606844ef9021.1566517902.498111b40320d4fa014d11b95a129f09.230x140_59591.png"},{"title":"张良：前期快速清线，四级频繁抓边，后期控制伤害双重打击！","cover":"https://itea-cdn.qq.com/file/tgl/20190823/851936dbc11daf7e2b147304033e219d.1566523723.999ea9f8f6d94ad0a3b737812ef79609.230x140_65963.png"},{"title":"王者荣耀cos：杨玉环cos：看一眼月牙泉就回头","cover":"https://itea-cdn.qq.com/file/tgl/20190821/01a016267700a6756fb73c1e8da6b334.1566400218.46220979492874337676224451ed46af.230x140_11966.jpg"},{"title":"“电梯流”大乔怎么玩？老夫子不是绝配，组合才是王道！","cover":"https://itea-cdn.qq.com/file/tgl/20190808/df86a6350e54cf59d5303d3090ef094a.1565251146.b95bc899e5b1ed69292720609fe75e90.184x124_49419.jpg"},{"title":"4个简单的克制关系，一般人想不到，司马懿克制百里守约","cover":"https://itea-cdn.qq.com/file/tgl/20190821/8a993752e9658af101972ed98de10a8c.1566370496.b397e31b93dc57404cedcad163aa0e4e.184x124_51340.jpg"},{"title":" 王者荣耀：登场率之最的T0射手鲁班七号，会不会玩看这一点","cover":"https://itea-cdn.qq.com/file/tgl/20190818/8a59f74c875593c0f306d297e67490c3.1566095738.3790492e055b2109ce83c928646cc535.184x124_11862.jpg"},{"title":"虞姬这样的暴力出装，大神打C位一秒不到！坦克不知道能坚持几秒","cover":"https://itea-cdn.qq.com/file/tgl/20190821/6cdd60ea0045eb7a6ec44c54d29ed402.1566387497.21e5e48dc0640dcfd3341101746cf4b9.184x124_11668.jpg"},{"title":"《王者荣耀之纵横星缘》第二十七章 暴君（原创王者小说连载中）","cover":"https://itea-cdn.qq.com/file/tgl/20190819/a904df1d9ba37f076a0eefc798f8ea84.1566216041.754e1e11450186427957b1ac0e7e5e84.184x124_8933.jpg"},{"title":"高端局上分首选公孙离，这套梦泪的六神装，让她轻松凯瑞全场","cover":"https://itea-cdn.qq.com/file/tgl/20190823/6da9003b743b65f4c0ccd295cc484e57.1566539557.027d6d28f4dd135a807aeff9381526b2.230x140_23132.jpg"},{"title":"《稷下游》第七章：曜靠在走廊墙上都能睡着，简直就是刷新了认知","cover":"https://itea-cdn.qq.com/file/tgl/20190822/cd8d9855d1a1d8e156124243f6ce0867.1566429961.1db52a6d84f1aff890c360cb223c7210.184x124_58991.jpg"},{"title":"王者荣耀：后羿成排位宠儿，“双刀流”不惧刺客，逆风也能拿五杀","cover":"https://itea-cdn.qq.com/file/tgl/20190620/64689bba125e18b02b5e130fb98b4506.1561046336.d110e2c2bc151416fc61e3dedec79b7f.184x124_33711.jpg"},{"title":"诸葛亮闪爆全场，射手炙手可热疯狂输出，齐天大圣能否王者归来？","cover":"https://itea-cdn.qq.com/file/tgl/20190807/3d4e211cea36e46b822b9dafc8fe6626.1565141079.fcc8d9de0cd612f9f2b772f54811def2.184x124_44712.jpg"},{"title":"大乔要坦边，牛魔是百搭，辅助的详细分类：不同阵容拿不同辅助","cover":"https://itea-cdn.qq.com/file/tgl/20190821/ed45e85d76082370aab5d319016534b8.1566374065.5b36fbe8f176094e5da68eae3e604ae4.184x124_29870.jpg"},{"title":"21日体验服：嫦娥大乔下调，改动最大的还是这位隐身刺客","cover":"https://itea-cdn.qq.com/file/tgl/20190821/6b53f70e800940e4c2701e0295295423.1566364448.977636981f0496ca0154e806ccfd3852.184x124_54783.jpg"},{"title":"王者荣耀：羞涩的男孩子也可以拥有绚丽多彩的翅膀","cover":"https://itea-cdn.qq.com/file/tgl/20190821/dc891325f7efdc0bab2c425db1b70e54.1566390035.c812cf274e767e2cbd269893039845dc.184x124_14081.jpg"},{"title":"五虎上将归来马超上线！","cover":"https://itea-cdn.qq.com/file/tgl/20190821/6f4a28e69baddf078857f9a1b9f474ff.1566364414.2945163954e313301ef1d43cdd4b9325.184x124_33423.jpg"}]},{"name":"新手","ways":[{"title":"新赛季辅助上分优选，没有坦克选廉颇，选孙膑不用看阵容","cover":"https://itea-cdn.qq.com/file/tgl/20190807/d3d9446802a44259755d38e6d163e820.1565174139.3a8f697382408c962d68db29594e8c43.184x124_66404.jpg"},{"title":"S16上分法师首选诸葛亮，安琪拉一控到死，她团控全场！","cover":"https://itea-cdn.qq.com/file/tgl/20190807/b93e5dee4a244e287388983768cc9e0a.1565192507.db0887289226b225c731b9e837014842.230x140_23723.jpg"},{"title":"高端局法师T队，上官婉儿和嫦娥竞争T1,依靠更灵活的技能略胜","cover":"https://itea-cdn.qq.com/file/tgl/20190805/b7eab6088df1336ae87f97f6e75151d0.1564994302.78ce6d1e26a3cfac9531c4a61a81a36b.230x140_78932.png"},{"title":"世冠上路都用啥？孙策橘右京已经不是首选，最强势的根本猜不到","cover":"https://itea-cdn.qq.com/file/tgl/20190803/9d70f1cf5e7587ab741eaef46597c305.1564839804.47e16b7bbe41d270aba329d78b45d22f.230x140_57850.jpg"},{"title":"S16一个合格辅助需要完成的六件事，能全部完成的不超过10%！","cover":"https://shp.qpic.cn/cfwebcap/0/425196ebdeca54b84c54a20c0c5c7cae/0/?width=230&height=140"},{"title":"Hero兵法讲堂：刺客篇","cover":"https://shp.qpic.cn/cfwebcap/0/760ea7e6667ce5065b305b0134e8041a/0/?width=230&height=140"},{"title":"王者荣耀：射手遇到兰陵王都颤抖？，这几位却让他有来无回","cover":"https://itea-cdn.qq.com/file/tgl/20190802/22348f642503adaf7d3641928e6ef285.1564728271.05622b4e034fc6ddd20662b94fc3444f.230x140_17371.jpg"},{"title":"营地数据榜：射手榜首易主，狄仁杰微调第二都没保住，他后来居上","cover":"https://itea-cdn.qq.com/file/tgl/20190802/c8070d27b86aa1bc7489142aa8d82a55.1564753294.ef6375f0e332fb24e691953f741a5f05.230x140_19218.jpg"},{"title":"王者荣耀：最考验意识的三位辅助，新手玩不好，大神当成宝！","cover":"https://itea-cdn.qq.com/file/tgl/20190802/6da9003b743b65f4c0ccd295cc484e57.1564734748.c412f7ff79ce5118fc6c0f2dc7bc21f8.230x140_22324.jpg"},{"title":"8月初射手T度排行榜，看看你心仪的射手进入了榜几","cover":"https://itea-cdn.qq.com/file/tgl/20190803/9c870b08abc2bbef571b43cf4e7bab45.1564829953.f3fe6cd752cc6e65e61dda6f78b95258.230x140_15761.jpg"},{"title":"王者荣耀：射手出肉会更强？打惯了输出装的，不妨来看看吧！","cover":"https://itea-cdn.qq.com/file/tgl/20190801/6da9003b743b65f4c0ccd295cc484e57.1564635606.8cf7fc5a37204778f7abb641d3396c36.230x140_22161.jpg"},{"title":"上分秘诀之射手，站桩射手的三件法宝！后羿实战打法简介！","cover":"https://itea-cdn.qq.com/file/tgl/20190731/b0ca4eff978167e0f1953fcea8832d3f.1564566213.f0663874be6d1c54418f87519ae9c4b4.230x140_44966.jpg"},{"title":"草丛两个小可爱喜迎增强，妲己安琪拉下限再次提升，中路上分首选","cover":"https://itea-cdn.qq.com/file/tgl/20190801/cfcd208495d565ef66e7dff9f98764da.1564663108.3ae6598382d0152ff4ecdeaff5c05109.230x140_23155.jpg"},{"title":"S16辅助国服荣耀战力排榜|鬼谷子稳居前三，黑马的她排在榜首","cover":"https://itea-cdn.qq.com/file/tgl/20190731/6da9003b743b65f4c0ccd295cc484e57.1564558615.656819319d1c8b7b96b6be2137fb78b5.230x140_62701.jpg"},{"title":"辅助英雄又引玩家们吐槽，三种出门思路到底该选哪一种好？","cover":"https://itea-cdn.qq.com/file/tgl/20190731/903ce9225fca3e988c2af215d4e544d3.1564562825.6823dae008c0961396585188126858ce.230x140_14746.jpg"},{"title":"峡谷小短腿，输出扛大旗——鲁班七号 进阶攻略","cover":"https://shp.qpic.cn/cfwebcap/0/a8c46a69d38abc5c9892261e38185773/0/?width=230&height=140"}]},{"name":"官方","ways":[{"title":"王者荣耀除了需要熟练度，常见细节技巧分享，高端局玩家都知道","cover":"https://itea-cdn.qq.com/file/tgl/20190724/bf58dde0eae7ed9a9d0f34398114b549.1563953637.749d4f23ff7944ce316231955293f7f4.230x140_64704.jpg"},{"title":"王者荣耀：超强实战中路游走技巧，学好三大原则轻松上分","cover":"https://itea-cdn.qq.com/file/tgl/20190715/02e74f10e0327ad868d138f2b4fdd6f0.1563167064.84d08c51c719aea1ab113f9b80921bb6.230x140_88394.jpg"},{"title":"全英雄铭文搭配思路，干货教程-战士篇","cover":"https://itea-cdn.qq.com/file/tgl/20190713/22c25c4f633efd5c33709cc12e60ac9b.1562949914.01a72a26af86b805b1cbde5c6fda25fe.230x140_18586.jpg"},{"title":"全英雄铭文搭配思路，干货教程-刺客+辅助篇","cover":"https://itea-cdn.qq.com/file/tgl/20190713/cd53d53ef16137b6446a595b0c09b808.1562950751.0786380e3ce07bee8ce71cd7ee82f1e3.230x140_16668.jpg"},{"title":"鞋子作为6大神装之一，每人必出，但你真的对它研究过吗？","cover":"https://itea-cdn.qq.com/file/tgl/20190713/ccb3d22a44e997e6b33296013a6383b3.1562987847.75d1dc343f85e661887755df3db8ef76.230x140_20839.jpg"},{"title":"王者荣耀：领悟装备中“唯一被动”的意思，别再被说不会出装了","cover":"https://itea-cdn.qq.com/file/tgl/20190709/4134d9e2acb614ea98c12902490a8541.1562656487.ad2289a391fbeb879ae38941f82af8bf.230x140_16538.jpg"},{"title":"王者荣耀：如何成为一名优秀的上单玩家？这十点意识你必须掌握！","cover":"https://itea-cdn.qq.com/file/tgl/20190710/0ac88cfa3358a41a848a0996ba2980d1.1562760261.c6b7c09ebef1df462c7df296aa94cc46.230x140_7096.jpg"},{"title":"王者荣耀：常用铭文搭配，真的很详细啦","cover":"https://itea-cdn.qq.com/file/tgl/20190628/4134d9e2acb614ea98c12902490a8541.1561707086.1aea7d895e4c6afdca57e1547e6becfd.230x140_16538.jpg"},{"title":"上分攻略︱这件装备虽然冷门，但却是射手英雄的翻盘利器！","cover":"https://itea-cdn.qq.com/file/tgl/20190623/c81e728d9d4c2f636f067f89cc14862c.1561227097.8ed946a29c732181c6c469af7bd4a3ff.230x140_49973.jpg"},{"title":"王者荣耀：上单第一件出暗影战斧，难怪守塔守不住","cover":"https://itea-cdn.qq.com/file/tgl/20190618/d612ae2e1245a287f727b3b758d70e9f.1560835832.6ea731298b68e947584a4a511fcf84f3.230x140_12022.jpg"},{"title":"王者荣耀：很难出的装备，破晓ADC必出，破军看情况，贤者尴尬","cover":"https://itea-cdn.qq.com/file/tgl/20190613/c81e728d9d4c2f636f067f89cc14862c.1560392596.4ac5f197c8c25020e1fec1e540afdf83.230x140_19684.jpg"},{"title":"王者荣耀S15法师通用铭文 新赛季法师铭文怎么搭配","cover":"https://itea-cdn.qq.com/file/tgl/20190614/d64288cca2eed9b7fa8762d4822490f7.1560500295.0b3a8d01ce4aa02db7571f43e92598a1.230x140_19501.jpg"},{"title":"王者荣耀中鲜少有人掌握的四个技巧，学会两个轻松上王者！","cover":"https://itea-cdn.qq.com/file/tgl/20190526/6944498554deb588b04967b079a1cf8a.1558843731.b6a783488e1bf58eadf1cb4e3ce2b7ab.230x140_54587.jpg"},{"title":"打野修炼手册：作为打野，如何呼风唤雨，掌控节奏，拿下胜利？","cover":"https://itea-cdn.qq.com/file/tgl/20190524/4dd8f10a65df6c0daadd17d9785d257f.1558712716.32f439e02d6092b071215d7b89d32355.230x140_5469.jpg"},{"title":"【虎扑攻略】S15五排最简单上分法则：拒绝花里胡哨，保护我方输出","cover":"https://shp.qpic.cn/cfwebcap/0/0b32c8593bcb7baf62365634c0c7493c/0/?width=230&height=140"},{"title":"玩辅助不会站位开视野？这里教你轻松学会辅助的所有视野站位","cover":"https://itea-cdn.qq.com/file/tgl/20190517/424de7a8a3c9bb09f108f4f24d597297.1558087000.ade3dafb7c7a4f67049e151830a3f768.230x140_9427.jpg"}]},{"name":"同人","ways":[{"title":"马超：兄弟的热血不会白流，西凉的纯洁我来守护","cover":"https://shp.qpic.cn/cfwebcap/0/6a1420625349827f075de3b38d89ff3d/0/?width=230&height=140"},{"title":"王者荣耀首批金牌特权门店现已上线","cover":"https://shp.qpic.cn/cfwebcap/0/952e1b385c626f1a6f54bf12d974c25a/0/?width=230&height=140"},{"title":"吃喝玩 赚一夏 来王者人生享暑期豪礼！","cover":"https://shp.qpic.cn/cfwebcap/0/7cd4951fdcf9a47779a8175fa73c7af1/0/?width=230&height=140"},{"title":"英雄故事 | 孙膑：为了我的挚友，流动吧，时间之力！","cover":"https://shp.qpic.cn/cfwebcap/0/b0bfa37d5549734d96debd154358888b/0/?width=230&height=140"},{"title":"云中君vs瑶：隔着一颗眼泪，也看不清生死的羁绊","cover":"https://shp.qpic.cn/cfwebcap/0/27cdca796c0f520fbce6f61536d1cb51/0/?width=230&height=140"},{"title":"中二少年的独白：我就是想证明自己","cover":"https://shp.qpic.cn/cfwebcap/0/0b2742a68d0c30046a9b751b2c1733ae/0/?width=230&height=140"},{"title":"王者世界观体验站更新！绝密档案已曝光","cover":"https://shp.qpic.cn/cfwebcap/0/b179d7510c7e2a1087c043766a972c3f/0/?width=230&height=140"},{"title":"英雄故事 | 曜-星辰之子","cover":"https://shp.qpic.cn/cfwebcap/0/8006f57e49f156441ca43784b8644d04/0/?width=230&height=140"},{"title":"稷下学院 | 诸葛学长带你逛母校","cover":"https://shp.qpic.cn/cfwebcap/0/9e5fbde7944361ae0a81c01142a11c1e/0/?width=230&height=140"},{"title":"王者大陆行 | 云中漠地-都护府","cover":"https://shp.qpic.cn/cfwebcap/0/baea4fbea5add7ab7404e23d7650e104/0/?width=230&height=140"},{"title":"王者大陆行 | 云中漠地-千窟城","cover":"https://shp.qpic.cn/cfwebcap/0/a75eca0408b2ef7a81f0ad4add6b611a/0/?width=230&height=140"},{"title":"英雄故事 | 云中君：小鹿女，你的谎言我都懂","cover":"https://shp.qpic.cn/cfwebcap/0/150adce63d4d8f0c7575f3e88d852255/0/?width=230&height=140"},{"title":"英雄故事 | 云中君：不是天使，胜是天使","cover":"https://shp.qpic.cn/cfwebcap/0/4994706713e802d3b4985bfe52e51a2a/0/?width=230&height=140"},{"title":"英雄小传 | 第一个全程飞的英雄，必承受更多痛苦！","cover":"https://shp.qpic.cn/cfwebcap/0/3a877748232c96c1711904f872b88737/0/?width=230&height=140"},{"title":"王者大陆行 | 云中漠地-玉城","cover":"https://shp.qpic.cn/cfwebcap/0/adade14f5990bc18d0e024dd8a175d27/0/?width=230&height=140"},{"title":"英雄故事 | 瑶-过去生于未来","cover":"https://shp.qpic.cn/cfwebcap/0/33b05fb59efff9b2a4619dc3e1ea4ff7/0/?width=230&height=140"}]}]
        for (let cat of rawData){
            const category=await Category.findOne({
                name:cat.name
            })
            cat.ways=cat.ways.map(way=>{
                way.categories=[category]
                return way
            })
            await Way.insertMany(cat.ways)
        }
        res.send(await Way.find())
    })

    router.get('/ways/list',async (req,res)=>{
        const parent=await Category.findOne({
            name: '攻略分类'
        })
        const cats=await Category.aggregate([
            {$match:{parent:parent._id}},
            {
                $lookup:{
                    from:'ways',
                    localField:'_id',
                    foreignField:'categories',
                    as:'wayList'
                }
            }
        ])
        res.send(cats)
    })

    router.get('/races/init',async (req,res)=>{
        await Race.deleteMany({})
        const rawData = [{"name":"最新","races":[{"title":"转会阶段→小小顶替袁牧青，大王为何发飙？","cover":"https://shp.qpic.cn/cfwebcap/0/120d4823c82b2ef86460998e4ac70cfd/0/?width=230&height=140","click":"31.2万"},{"title":"新阶段转会模式开启，队伍危机逼哭大王？","cover":"https://shp.qpic.cn/cfwebcap/0/1ebebfef92e884e254d0121e4a522416/0/?width=230&height=140","click":"2.0万"},{"title":"姐妹花同台对决生死未定，美少女秀极限操作","cover":"https://shp.qpic.cn/cfwebcap/0/c61556c08aa1209755d1f017d1ab5b19/0/?width=230&height=140","click":"2.2万"},{"title":"美少女观赛KPL现场秒变迷妹","cover":"https://shp.qpic.cn/cfwebcap/0/1606f739fc20186683871b1235acc76e/0/?width=230&height=140","click":"1.5万"}]},{"name":"王者炸麦了","races":[{"title":"【王者炸麦了3】张角逆境骂醒队员，Cat冷静指挥夺冠军","cover":"https://shp.qpic.cn/cfwebcap/0/9bfdb1a81197a93037f2222eb83c2ad6/0/?width=230&height=140","click":"24.4万"},{"title":"【王者炸麦了3】RW兴奋去到最大的舞台，eStar众志成城拿到深圳机票","cover":"https://shp.qpic.cn/cfwebcap/0/dca2f162b0eda7eb8517e2369f7c2ebe/0/?width=230&height=140","click":"12.8万"},{"title":"【王者炸麦了3】世冠淘汰赛名场面 RW天秀曜、RNG.M极限翻盘","cover":"https://shp.qpic.cn/cfwebcap/0/424df8670ee5afb15a8f6a680fb1b8a5/0/?width=230&height=140","click":"9.8万"},{"title":"【王者炸麦了3】Dnan惊叹吕布五杀，花海玄策天秀被叫弟弟","cover":"https://shp.qpic.cn/cfwebcap/0/46e3cba76767cbebcf92ee3562fe0005/0/?width=230&height=140","click":"31.0万"}]},{"name":"KPL观赛指南","races":[{"title":"【观赛指南6】背水一战 谁能问鼎","cover":"https://shp.qpic.cn/cfwebcap/0/96c568eba8c55ae63e931ca3edda6abc/0/?width=230&height=140","click":"110.1万"},{"title":"【观赛指南6】总决赛前瞻 状态才是决定胜负的关键","cover":"https://shp.qpic.cn/cfwebcap/0/bcab4938fe6a84e35274ed08f6a80346/0/?width=230&height=140","click":"8.3万"},{"title":"【观赛指南6】第55期 eStarPro能否成功复仇挺进总决赛？","cover":"https://shp.qpic.cn/cfwebcap/0/969a98cea55ad06157cb561a28fc356f/0/?width=230&height=140","click":"2.5万"},{"title":"【观赛指南6】第54期 RW侠 vs RNG.M 剑指西安 谁能更进一步","cover":"https://shp.qpic.cn/cfwebcap/0/98791460b9b34ccd2f775296407efcce/0/?width=230&height=140","click":"2.3万"}]},{"name":"荣耀进行时","races":[{"title":"再见，SK！记SK与BA黑凤梨的一路风风雨雨","cover":"https://shp.qpic.cn/cfwebcap/0/b2118c77757750e0a11aa0037fafe723/0/?width=230&height=140","click":"7.1万"},{"title":"【荣耀进行时】春季赛15支战队赛季之路，星辰闪耀该我上场","cover":"https://shp.qpic.cn/cfwebcap/0/6e4b84ffc23f7ca15e79d819b861c5c7/0/?width=230&height=140","click":"8.8万"},{"title":"【荣耀进行时】属于RW侠侠客们的KPL江湖，手握刀剑奋勇前行","cover":"https://shp.qpic.cn/cfwebcap/0/e39a182665f3b5565100a9d32539700c/0/?width=230&height=140","click":"8.8万"},{"title":"【荣耀进行时】XQ领队为你讲述战队背后的故事","cover":"https://shp.qpic.cn/cfwebcap/3326576800/92c8dcc3f5f0e94580f561a8990af7af/0/?width=230&height=140","click":"39.5万"}]},{"name":"大葱哥聊KPL","races":[{"title":"大葱哥课代表上线全面解读总决赛重启问题，你都明白了没？","cover":"https://shp.qpic.cn/cfwebcap/0/479704aaa6b66f864b895c627a2aa3c4/0/?width=230&height=140","click":"5.2万"},{"title":"大葱哥详解大明宫观赛攻略，新王加冕文体两开花你确定不来?","cover":"https://shp.qpic.cn/cfwebcap/0/bd5a88c94dd0d7528e62969292ce92ae/0/?width=230&height=140","click":"3.2万"},{"title":"大葱哥聊KPL之荣耀币重磅来袭","cover":"https://shp.qpic.cn/cfwebcap/0/c2be207485860f7595b3b42a27ecf708/0/?width=230&height=140","click":"1.5万"},{"title":"大葱哥解析KRKPL常规赛后三周看点，KZ大魔王或将再拿冠军","cover":"https://shp.qpic.cn/cfwebcap/0/1c4fd025efff9b329952c048d5c681ee/0/?width=230&height=140","click":"1.5万"}]},{"name":"王者职业教学","races":[{"title":"【职业教学第二季】第23期：Yang亚瑟无限游走打法，带爆节奏","cover":"https://itea-cdn.qq.com/file/tgl/20180117/Q750422.1516178581.bb8a035a3fe6bd3832efa4cb1ed51cf1.750x422_27946.jpg","click":"108.3万"},{"title":"【职业教学第二季】第22期：七杀程咬金下单断兵线打法，秀爆全场","cover":"https://itea-cdn.qq.com/file/tgl/20180110/Q750422.1515569787.8387b4634da8cb683007d3f7dc201a2c.750x422_26024.jpg","click":"96.3万"},{"title":"【职业教学第二季】第21期 刺痛马可波罗，激进突脸秀爆全场","cover":"https://itea-cdn.qq.com/file/tgl/20180103/230x140.1514973379.f13b6ae0ad01c866ee2d0f9209f8297a.230x140_13634.jpg","click":"86.8万"},{"title":"【职业教学】第二季20期老王中单姜子牙，零死爆虐完成天下无双","cover":"https://itea-cdn.qq.com/file/tgl/20171228/750x422.1514451464.9ed30c68b166b576269e0c0996f29ea4.750x422_25987.jpg","click":"59.3万"}]},{"name":"QG荣耀学院","races":[{"title":"【QG荣耀学院】第64期 Best上官婉儿 脆皮的噩梦","cover":"https://shp.qpic.cn/cfwebcap/0/1eeb0d6ef5d2cc6f4a795a6ce17e7616/0/?width=230&height=140","click":"8.5万"},{"title":"【QG荣耀学院】第63期 Mojo墨子 一炮一个小朋友","cover":"https://shp.qpic.cn/cfwebcap/0/f1e773084f1c6efc3a861ddeceee9922/0/?width=230&height=140","click":"6.2万"},{"title":"【QG荣耀学院】第62期 Hurt公孙离 最灵活的英雄","cover":"https://shp.qpic.cn/cfwebcap/0/136b62581272ab3906499d2558104896/0/?width=230&height=140","click":"15.4万"},{"title":"【QG荣耀学院】第61期 Song李信 真正的战士","cover":"https://shp.qpic.cn/cfwebcap/2546694651/dd0281a94d5fb8e2a88a22aa7133e549/0/?width=230&height=140","click":"9.0万"}]},{"name":"我来carry","races":[{"title":"【我来CARRY】第三季 第8期 横刀立马 路西法关羽华容道截击QGhappy","cover":"https://shp.qpic.cn/cfwebcap/3146194188/b80539050c322a3947ec5cdd90ba88c9/0/?width=230&height=140","click":"39.5万"},{"title":"【我来CARRY】第三季 第7期 三路推进 迷神花木兰极限逃生","cover":"https://shp.qpic.cn/cfwebcap/3146194188/663df115c54ca1c61433cb2ad6c773d6/0/?width=230&height=140","click":"23.8万"},{"title":"【我来CARRY】第三季 第6期 双黑马巅峰对决 小兽李元芳无间刃风极限双杀","cover":"https://shp.qpic.cn/cfwebcap/3146194188/4d02feb4ffb5be2ac9b3d7de58527b98/0/?width=230&height=140","click":"18.1万"},{"title":"【我来CARRY】第三季 第5期 eStarPro.酷酷虎踞山林打出五连绝世","cover":"https://shp.qpic.cn/cfwebcap/3146194188/d809239f351ee9241c3ac430edfaa052/0/?width=230&height=140","click":"36.4万"}]}]
        for (let cat of rawData){
            const category=await Category.findOne({
                name:cat.name
            })
            cat.races=cat.races.map(race=>{
                race.categories=[category]
                return race
            })
            await Race.insertMany(cat.races)
        }
        res.send(await Race.find())
    })

    router.get('/races/list',async (req,res)=>{
        const parent=await Category.findOne({
            name: '赛事分类'
        })
        const cats=await Category.aggregate([
            {$match:{parent:parent._id}},
            {
                $lookup:{
                    from:'races',
                    localField:'_id',
                    foreignField:'categories',
                    as:'raceList'
                }
            }
        ])
        res.send(cats)
    })

    router.get('/games/list',async (req,res)=>{
        const parent=await Category.findOne({
            name: '比赛分类'
        })
        const cats=await Category.aggregate([
            {$match:{parent:parent._id}},
            {
                $lookup:{
                    from:'games',
                    localField:'_id',
                    foreignField:'categories',
                    as:'gameList'
                }
            }
        ])
        res.send(cats)
    })



    router.get('/articles/:id',async (req,res)=>{
        const data=await Article.findById(req.params.id).lean()
        data.related=await Article.find().where({
            categories:{$in:data.categories}
        }).limit(2)
        res.send(data)
    })

    router.get('/heroes/:id',async (req,res)=>{
        const data=await Hero.findById(req.params.id).populate('categories items1 items2 partners.hero').lean()
        res.send(data)
    })



    router.get('/videos/:id',async (req,res)=>{
        const data=await Video.findById(req.params.id).lean()
        data.related=await Video.find().where({
            categories:{$in:data.categories}
        }).limit(3)
        res.send(data)
    })

    router.get('/ways/:id',async (req,res)=>{
        const data=await Way.findById(req.params.id).lean()
        data.related=await Way.find().where({
            categories:{$in:data.categories}
        }).limit(2)
        res.send(data)
    })

    router.get('/races/:id',async (req,res)=>{
        const data=await Race.findById(req.params.id).lean()
        data.related=await Race.find().where({
            categories:{$in:data.categories}
        }).limit(3)
        res.send(data)
    })

    router.get('/games/:id',async (req,res)=>{
        const data=await Game.findById(req.params.id).lean()
        data.related=await Game.find().where({
            categories:{$in:data.categories}
        }).limit(2)
        res.send(data)
    })


    app.use('/web/api',router)

    app.post('/web/api/login',async (req,res)=>{
        const {username,password}=req.body
        const user=await AdminUser.findOne({username}).select('+password')
        if (!user){
            return res.status(422).send({
                message:'用户不存在'
            })
        }
        const isValid=require('bcrypt').compareSync(password,user.password)
        if (!isValid){
            return res.status(422).send({
                message: '密码错误'
            })
        }

        const token=jwt.sign({id:user._id},app.get('secret'))
        res.send({token})
    })
}