const { default: axios } = require("axios");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const source = req.body.source;
    const destination = req.body.destination;
    const code = req.body.code;
    let promoCode;
    let validCode = false;
    await axios.get(`https://promocode-api-73b8c-default-rtdb.firebaseio.com/promoCodes.json`).then((coupons) => {
        for (let key in coupons.data) {
            promoCode = coupons.data[key].find((coupon, index) => {
                if (coupon.code === code) {
                    return coupon;
                }
            })
        }
    });


    let sourceDistance = getDistanceFromLatLonInKm(source.latitude, source.longitude, promoCode.validOnLocation.latitude, promoCode.validOnLocation.longitude)
    let destinationDistance = getDistanceFromLatLonInKm(destination.latitude, destination.longitude, promoCode.validOnLocation.latitude, promoCode.validOnLocation.longitude)

    const expiryDate = new Date(promoCode.expireDate);
    const currentDate = new Date();
    if ((promoCode.validRangeinKms >= sourceDistance || promoCode.validRangeinKms >= destinationDistance) && expiryDate > currentDate && promoCode.active) {
        validCode = true;
    }


    if (validCode) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                promoCode: promoCode,
                source: source,
                destination: destination
            }
        };
    } else {
        context.res = {
            status: 400, /* Defaults to 200 */
            body: {
                "error": "Promo Code is Invalid"
            }
        };
    }




}
// Here we are using haversine formula, better approach would be to use Wolphram Alpha but for simplicity used this.

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c; // Distance in km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}