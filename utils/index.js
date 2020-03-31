'use strict';
const {
    get
} = require('axios')

const getImageBuffer = async (imageUrl) => {
    const response = await get(imageUrl, {
        responseType: 'arraybuffer'
    });
    const buffer = Buffer.from(response.data, 'base64')
    return buffer;
}

module.exports = { getImageBuffer };