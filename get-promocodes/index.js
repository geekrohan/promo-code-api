const { default: axios } = require("axios");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let promoCodes = [];

    await axios.get(`https://promocode-api-73b8c-default-rtdb.firebaseio.com/promoCodes.json`).then((coupons) => {
        for (let key in coupons.data) {
            promoCodes = promoCodes.concat(coupons.data[key]);
        }
    })

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: promoCodes
    };
}