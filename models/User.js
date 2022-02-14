const db = require('../db')

module.exports = class User {
    
    constructor(email, firstname, lastname, password) {
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password
    }

    static async getByEmail(email) {
        let results = await dbGetUserByEmail(email)
        let newUser = new User()

        if( results.length > 0 ) {
            newUser = new User(results[0].email, results[0].firstname, results[0].lastname, results[0].password)
        }
        return newUser
    }

    static async enterNewUser(user) {
        let result = await dbNewUser(user)
        if(result !== undefined) {
            return true;
        }
    }

    static async deleteUser(email) {
        let result = await dbDeleteUser(email)
        if(result === true) {
            return true;
        }
    }

}

dbGetUserByEmail = async (email) => {
    const sql = `SELECT email, firstname, lastname, password
    FROM users WHERE email = '` + email + `'`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbNewUser = async (user) => {
    const sql = "INSERT INTO users (email, firstname, lastname, password) VALUES ('" + user.email + "', '" + user.firstname + "', '" + user.lastname + "', '" + user.password + "') RETURNING email";
    try {
        const result = await db.query(sql, []);
        return result.rows[0].email;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbDeleteUser = async (email) => {
    const sql = "DELETE FROM users WHERE email = '" + email + "'";
    try {
        const result = await db.query(sql, []);
        return true;
    } catch (err) {
        console.log(err);
        throw err
    }
}