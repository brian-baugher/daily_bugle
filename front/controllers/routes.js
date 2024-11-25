const prefix = 'http://localhost:3010/dailyBugle';

/**
 * @typedef {Object} routes
 * @property {string} newUser 
 * POST
 * - req body requires `{username, password}`
 * @property {string} login 
 * POST
 * - req body requires `{username, password}`
 * @property {string} articles
 * - GET
*       - optionally has query params `title` and `id` for search
*           - paginated by 10, query param `page` will get you different pages
 * - POST
 *      - req body requires `{title, teaser, body, categories}`
 * - PUT
 *      - requires `id` as query param for associated article
 * @property {string} comment
 * PUT
 * - require `id` as query param for article
 * - res body requires `{comment}`
 * @property {string} ads GET
 * @property {string} adImpression
 * PUT
 * - required query param of `id` for associated ad
 * - req body requires `{ip, userAgent, eventType, user, article}`
 */

/**
 * @type {routes}
 * Defines the available backend routes to hit via apache
 */
const routes = {
    newUser: prefix + '/auth1/new',
    login: prefix + '/auth1',
    articles: prefix + '/article',
    comment: prefix + '/article/comment',
    ads: prefix + '/ad',
    adImpression: prefix + '/ad/impression',
}

export default routes;