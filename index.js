const https = require("https");
const querystring = require("querystring");

const Mod = require("./objects/Mod");
const ModFile = require("./objects/Files");

const base_url = "https://ddph1n5l22.execute-api.eu-central-1.amazonaws.com/dev/";


/**
 * @description Generic Convertion Function
 * @private
 * @param {Object} object - The object
 * @returns {Object} Returns the object
 */
function basic_convertion_function(object){
    return object;
}

/**
 * @description Helper function to get content
 * @private
 * @param {string} url - Url to get
 * @param {Object} options - Object to stringify to url options
 */
function innerGet(url, options = {}, convertionFunction = basic_convertion_function){
    return new Promise((resolve, reject) => {
        url += "?" + querystring.stringify(options);
        https.get(url, function(response){
            if (response && response.statusCode === 200) {
                let data = "";
                response.on("data", (chunk) => {
                    data += chunk;
                });

                response.on("end", () => {
                    resolve(convertionFunction(JSON.parse(data)));
                });
            } else {
                reject(response.statusCode);
            }
        });
    });
}

/**
 * @description the purpose of this package is to interact with the Curseforge API with simple functions instead of having to write all the requests yourself.
 * @module CurseForgeAPI
 * @see getMods
 */


/**
* @function getMods
* 
* @description Get an overview of all possible mods.
* @param {Object} options - A Object containing optional parameters.
* @param {string} options.mc_version - The Minecraft version string to use. ("1.12.2", "1.13")
* @param {string} options.mod_name - The mod name to search for. ("immersive", "botania")
* @param {string} options.owner - The creators name to search for. ("Vazkii", "Mondanzo")
* @param {number} options.page_num - The page to use. (in combination with options.page_size)
* @param {number} options.page_size - The amount of items to show per page. (in combination with options.page_num)
* @param {function} callback - Optional callback to use instead of Promise.
* @returns {Promise.<Mod[], Error>} A promise containing the json object returned by the Curse API on successful 200 response.
*/
module.exports.getMods = function (options = {}, callback) {
    if (options && typeof options === 'function') {
        callback = options;
        options = {};
    }
    let promise = innerGet(base_url + "mods", options, function(obj){
        let mods = [];
        for(let m of obj.result){
            mods.push(new Mod(m));
        }
        return mods;
    });
    if (callback && typeof callback === 'function')
        promise.then(callback.bind(null, null), callback);
    return promise;
};

/**
 * @function getMod
 * 
 * @description Get information about a specific mod using the identifier.
 * @param {string|number} identifier - The mods slug or curse id to find the mod with.
 * @param {function} callback - Optional callback to use instead of Promise.
 * @returns {Promise.<Mod, Error>} A promise containing the json object returned by the Curse API on successful 200 response.
 */
module.exports.getMod = function (identifier, callback) {
    let promise = innerGet(base_url + "mod/" + identifier, {}, function(obj){
        return new Mod(obj.result);
    });
    if (callback && typeof callback === 'function')
        promise.then(callback.bind(null, null), callback);
    return promise;
};

/**
 * @function getModFiles
 *
 * @description Get information about the releases of a specific mod.
 * @param {string|number} identifier - The mods slug or curse id to find the mod with.
 * @param {Object} options - Optional Options object to use for filtering.
 * @param {string} options.mc_version - The Minecraft version string to use. ("1.12.2", "1.13")
 * @param {string} options.channel - The channel to use. ("Beta", "Release")
 * @param {boolean} options.newest_only - only get the newest one.
 * @param {function} callback - Optional callback to use instead of Promise.
 * @returns {Promise.<ModFile[], Error>} A promise containing the json object returned by the Curse API on successful 200 response.
 */
module.exports.getModFiles = function(identifier, options = {}, callback){
    if (options && typeof options === 'function') {
        callback = options; 
        options = {};
    }

    if(options.hasOwnProperty("newest_only"))
        options.newest_only = options.newest_only ? 1 : 0;
    let promise = innerGet(base_url + "mod/" + identifier + "/files", options, function(obj){
        let files = [];
        for (let f of obj.result) {
            files.push(new ModFile(f));
        }
        return files;
    });
    if (callback && typeof callback === 'function')
        promise.then(callback.bind(null, null), callback);
    return promise;
};