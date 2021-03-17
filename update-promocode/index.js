const { default: axios } = require("axios");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let promoCodes = [];
    let promoCode = req.body.promoCode;
    let code = promoCode.code;

    await axios.get(`https://promocode-api-73b8c-default-rtdb.firebaseio.com/promoCodes.json`).then((coupons) => {
        for (let key in coupons.data) {
            promoCode = coupons.data[key].find((coupon, index) => {
                if (coupon.code === code) {
                    merge(coupon, promoCode)
                    axios.put(`https://promocode-api-73b8c-default-rtdb.firebaseio.com/promoCodes/${key}/${index}.json`, coupon);
                }
            })
        }
    })

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {}
    };
}


function merge(source, changes) {
    if (!source)
        source = {};
    if (changes != null)
        Object.keys(changes).forEach((key) => {
            if (!source[key]) {
                source[key] = changes[key];
            } else {
                if (changes[key] == null)
                    delete source[key];
                else if (Array.isArray(changes[key]))
                    source[key] = changes[key];
                else if ((typeof changes[key]) == "object") {
                    merge(source[key], changes[key]);
                }
                else {
                    source[key] = changes[key];
                }
            }
        })
}