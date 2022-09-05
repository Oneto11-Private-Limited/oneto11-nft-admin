const userModel = require('../../models/userModel');
const userSchema = require('../../models/userSchema');


module.exports = class userController {
    constructor() {
        this.userModel = new userModel();
    }

    updateUser = (req, res) => {
        const data = {
            gender: 0
        }
        if (req.body.gender == 'male') {
            data.gender = 1;
        }
        userSchema.findByIdAndUpdate(req.body.user_id, { $set: data }).then(result => {
            res.json({
                status: true,
                message: 'User updated successfully',
                response: result
            })
        }).catch(err => {
            res.status(500).json({
                status: false,
                message: err.message
            })
        })
    }


}