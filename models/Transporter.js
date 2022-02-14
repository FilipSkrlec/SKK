const db = require('../db')

module.exports = class Transporter {
    
    constructor(transporter_id, name) {
        this.transporter_id = transporter_id;
        this.name = name;
    }

    static async getById(id) {
        let results = await dbGetTransporterById(id)
        let newTransporter = new Transporter()

        if( results.length > 0 ) {
            newTransporter = new Transporter(results[0].transporter_id, results[0].name)
        }
        return newTransporter
    }

}

dbGetTransporterById = async (id) => {
    const sql = `SELECT transporter_id, name
    FROM transporters WHERE transporter_id = ` + id;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};