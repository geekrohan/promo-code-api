const { default: axios } = require("axios");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let activePromoCodes = [];

    await axios.get(`https://promocode-api-73b8c-default-rtdb.firebaseio.com/promoCodes.json`).then((coupons) => {
        for (let key in coupons.data) {
            activePromoCodes = activePromoCodes.concat(coupons.data[key].filter((promoCode) => promoCode.active));
        }
    })

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: activePromoCodes
    };
}