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
 * @typedef {Object} articlesResult
 * @property {Array<article>} result array of articles
 * @property {Number} total number of total articles (for page calculation)
 */

/**
 * @param {Object=} args optional filters, only use oneof title OR id
 * @param {number=} args.page defaults to first page
 * @param {string=} args.title optional title to search by
 * @param {string=} args.id optional specific id to fetch, page ignored
 * @returns {articlesResult} 
 * @
 */
const getArticles = async ({page, title, id}={}) => {
    let articles;
    if(id){
        articles = await fetch(routes.articles + `?id=${id}`);
    }else if(title){
        articles = await fetch(routes.articles + `?page=${page}&title=${title}`);
    }else{
        articles = await fetch(routes.articles + `?page=${page}`);
    }
    if(articles.ok){
        const articlesJson = await articles.json();
        const result = articlesJson.total > 0 ? articlesJson.result : []
        return {result: result, total: articlesJson.total};
    }
    console.log('Error fetching articles: ' + articles.statusText)
    return {result: [], total: 0}; 
}

export {getArticles};