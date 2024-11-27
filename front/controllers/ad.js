import routes from './routes.js'

/**
 * @module ad
 */
/**
 * @typedef {Object} ad
 * @property {string} advertisement
 * @property {string} _id
 */

/**
 * Randomly selects one ad to display
 * @returns {ad}
 */
const getAdToDisplay = async () => {
    const ads = await fetch(routes.ads);
    /**@type {Array<ad>} */
    const adsArray = await ads.json();
    const rand = Math.floor(Math.random() * (adsArray.length - 1));
    return adsArray[rand];
}

/**
 * @typedef {Object} adImpression
 * @property {string} adId 
 * @property {string} userId 
 * @property {string} articeId 
 * @property {string} eventType 
 */

/**
 * 
 * @param {adImpression} impression 
 */
const recordAdImpression = async ({
    adId,
    userId,
    articeId,
    eventType
}) => {
    console.log(adId)
    await fetch(routes.adImpression + `?ad=${adId}`, {
        body: JSON.stringify({
            user: userId,
            artice: articeId,
            eventType: eventType,
        }),
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
}

export {getAdToDisplay, recordAdImpression};