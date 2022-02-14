const db = require('../db')

module.exports = class Ride {
    
    constructor(id, transporter_id, departure_time, arrival_time, ride_name) {
        this.id = id;
        this.transporter_id = transporter_id;
        this.departure_time = departure_time;
        this.arrival_time = arrival_time;
        this.ride_name = ride_name;
    }

    static async getById(id) {
        let results = await dbGetRideById(id)
        let newRide = new Ride()

        if( results.length > 0 ) {
            newRide = new Ride(results[0].ride_id, results[0].transporter_id, results[0].departure_time, results[0].arrival_time, results[0].ride_name)
        }
        return newRide
    }

    static async getAllRides() {
        let results = await dbGetAllRides()

        if( results.length > 0 ) {
            return results
        }
    }

}

dbGetRideById = async (id) => {
    const sql = `SELECT ride_id, transporter_id, departure_time, arrival_time, ride_name
    FROM rides WHERE ride_id = ` + id;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbGetAllRides = async () => {
    const sql = `SELECT ride_id, transporter_id, departure_time, arrival_time, ride_name
    FROM rides ORDER BY departure_time ASC`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};