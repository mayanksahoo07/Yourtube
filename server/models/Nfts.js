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
        default : "0x7092fEc8e45547Fe789f7E11626a069c5248A40e",
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
