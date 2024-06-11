const models = require('../model/models.js');

async function userRoleCheck (user, req) {
    await models.users.findOne({_id: user.id})
    .then((user) => {
        if (!user) {
            console.log("No user found!")
        } else {
            if (user.role != "sysAdmin" && req.path === ("/users" || "/movies")) {
                console.log("User shouldnt have access to this")
            }
        }
    })

}

module.exports = {
    userRoleCheck
}