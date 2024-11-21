import routes from "./routes.js"

/**
 * @typedef {Object} comment
 * @property {string} comment
 * @property {Date} dateCreated
 * @property {string} contributor
 */

/**
 * @typedef {Object} article
 * @property {string} title
 * @property {string} teaser
 * @property {string} body
 * @property {Date} dateCreated
 * @property {Date} dateLastEdited
 * @property {Array<string>} categories
 * @property {Array<comment>} comments
 */

/**
 * @param {number} [page=0] defaults to 0
 * @returns {Array<article>} returns list of articles for given page
 */
const getArticles = async (page) => {
    const articles = await fetch(routes.articles + `?page=${page}`);
    const articlesArray = await articles.json();
    return articlesArray;
}

export {getArticles};