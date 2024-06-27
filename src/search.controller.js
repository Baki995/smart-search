const { extractEntities } = require("./search.service")

exports.search = async (req, res) => {
    if (!req.query?.s) {
        return res.send([]);
    }

    return res.send(await extractEntities(req.query.s));
}