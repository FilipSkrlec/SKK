const res = require('express/lib/response');
const db = require('../db')

module.exports = class Ticket {

    constructor(ticket_id, ride_id, user_email) {
        this.ticket_id = ticket_id;
        this.ride_id = ride_id;
        this.user_email = user_email;
    }

    static async getById(id) {
        let results = await dbGetTicketById(id)
        let newTicket = new Ticket()

        if (results.length > 0) {
            newTicket = new Ticket(results[0].ticket_id, results[0].ride_id, results[0].user_email)
        }
        return newTicket
    }

    static async buyTicket(user_email, ticket_id) {
        let result = await dbBuyTicket(user_email, ticket_id)
        if (result !== undefined) {
            return true;
        }
    }

    static async cancelTicket(ticket_id) {
        let result = await dbCancelTicket(ticket_id)
        if (result === true) {
            return true;
        }
    }

    static async getAvailableTickets(id) {
        let results = await dbGetAvailableTickets(id)
        return results
    }

    static async getUserTickets(email) {
        let results = await dbGetUserTickets(email)
        return results
    }

}

dbGetTicketById = async (id) => {
    const sql = `SELECT ticket_id, ride_id, user_email
    FROM tickets WHERE ticket_id = ` + id;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbBuyTicket = async (user_email, ticket_id) => {
    const sql = `UPDATE tickets 
    SET user_email = '` + user_email + `'
    WHERE ticket_id = ` + ticket_id + `RETURNING ticket_id`;
    try {
        const result = await db.query(sql, []);
        if(result.rows != undefined) {
            return true
        } else {
            return false
        }
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbCancelTicket = async (ticket_id) => {
    const sql = `UPDATE tickets 
    SET user_email = null
    WHERE ticket_id = ` + ticket_id + `RETURNING ticket_id`;
    try {
        const result = await db.query(sql, []);
        if(result.rows != undefined) {
            return true
        } else {
            return false
        }
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetAvailableTickets = async (id) => {
    const sql = `SELECT ticket_id, ride_id
    FROM tickets WHERE user_email IS NULL AND ride_id = ` + id;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetUserTickets = async (email) => {
    const sql = `SELECT ticket_id, ride_id
    FROM tickets WHERE user_email = '` + email + `'`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}