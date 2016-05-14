'use strict'

class Format {

    /**
     *
     * format user data
     * @param data {object}
     * @returns {object}
     */
    static user(data) {
        let model = {
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            skype: data.skype,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            email: data.email
        };

        return model;
    }
}

module.exports = Format;