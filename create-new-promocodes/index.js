const { default: axios } = require("axios");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let amount = req.body.amount;
    let eventLocation = req.body.location;
    let generatedCoupons = [];
    let todaysDate = new Date();
    for (let i = 0; i < amount; i++) {
        generatedCoupons.push({
            code: coupongenerator(),
            expireDate: todaysDate.setDate(todaysDate.getDate() + 2),
            createdDate: todaysDate,
            validOnLocation: eventLocation,
            active: true,
            validRangeinKms: 5,
            discountAmount: 100
        })
    }
    axios.post(`https://promocode-api-73b8c-default-rtdb.firebaseio.com/promoCodes.json`, generatedCoupons)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: generatedCoupons
    };
}

function coupongenerator() {
    let coupon = "";
    let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i <= 10; i++) {
        coupon += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return coupon;
}