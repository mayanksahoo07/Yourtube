const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NftSchema = new Schema({

    name : {
        type: String,
        required : true
    },

    creator: {
        type: String,
        required : true
    }, 

    contract: {
        type: String,
        default : "0xB01fD79B3D39E57FA94B482Cce5AffCe91842195",
        required: true
    }, 

    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        unique : true
    },
    price: {
        type: Number,
        default : 10
    },

    quantity: {
        type: Number,
        default : 1
    },

    description: {
        type: String,
        default : ""
    }, 

    ipfsUrl: {
        type: String,
        default : ""
    }, 

    ipfsThumbnail: {
        type: String,
        default : ""
    }, 

    minted: {
        type: Number,
        default : 0
    },

    available: {
        type: Number,
        default : 0
    },

    owners: [{
        userId: { type: String, default: "" },
        nftTitle : { type: String, default: "" },
        tokenId : { type: Number },
        }],

},{timestamps : true});

const Nfts = mongoose.model('Nfts',NftSchema);
module.exports = Nfts;