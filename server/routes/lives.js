const express = require("express")
const router = express.Router()
const Live = require('../models/Live')
const StreamChat = require('../models/StreamChat')
const {verifyAccessToken} = require('../helpers/ApiAccess')




// Get homePage lives
router.get("/home/lives",verifyAccessToken, async(req, res) => {
    try {
        const lives =  await Live.find({}).limit(4).populate('creator','userId username ProfileAvatar isVerified isOnline followers')
                                .sort({ currentlyWatching: -1 })     
        res.send(lives)

    }
    catch(error) {
        res.send(error)
    }
})

// Get all lives
router.get("/all/:skip/:limit",verifyAccessToken, async(req, res) => {
    try {
        const skip = req.params.skip
        const limit = req.params.limit
        const lives =  await Live.find({}).skip(skip * limit).limit(limit).populate('creator','userId username ProfileAvatar isVerified isOnline followers')
                                .sort({ currentlyWatching: -1 })
        res.send(lives)

    }
    catch(error) {
        res.send(error)
    }
})


// Get user lives

router.get("/user/:id",verifyAccessToken, async(req, res) => {
    try {
        const lives =  await Live.find({creator : req.params.id}).sort({ createdAt: -1 })
        if(lives == null)
        res.send({status : 'not found'});
        else {
            res.send(lives)
        }
    }
    catch(error) {
        res.send({status : 'not found'});
    }
})


// get all stream chats
router.get("/chat/:id",verifyAccessToken, async(req, res) => {
    try {
        const chat =  await StreamChat.find({liveId : req.params.id}).populate('creator', 'userId username ProfileAvatar')
      
            res.send(chat)
        }
    catch(error) {
        res.send({status : 'not found'});
    }
})



// post message to chat
router.post("/chat",verifyAccessToken, async(req, res) => {
    try {
        const chat =   await new StreamChat(req.body).save()
            res.send(chat)
        }
    catch(error) {
        res.send({status : 'not found'});
    }
})



// get specific live

router.get("/:id",verifyAccessToken, async(req, res) => {
    try {
        const live =  await Live.findOne({streamUrl : req.params.id}).populate('creator','userId username ProfileAvatar isVerified isOnline followers')
        if(live == null)
        res.send({status : 'not found'});
        else {
            res.send(live)
        }
    }
    catch(error) {
        res.send({status : 'not found'});
    }
})

// create new live

router.post("/new",verifyAccessToken, async(req, res) => {
    try {
        const live = await new Live(req.body).save()
        res.send(live)
    }
    catch(error) {
        res.send(error)
    }
})


// edit liveStream
router.put("/:id", verifyAccessToken, async(req,res) => {
    try {
        const live = await Live.findOneAndUpdate({_id : req.params.id}, req.body,{ new: true })
        res.send(live)
        
    } catch (error) {
        res.send(error)
    }
})


module.exports = router