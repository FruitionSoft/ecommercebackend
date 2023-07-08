const User = require('./model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const { sendSMS } = require("../services/sms");

const getUserList = async (req, res) => {
    try {
        const userList = await User.find().select('-passwordHash');
        if (!userList) {
            res.status(500).send({ success: false })
        } else {
            res.status(201).send({ success: true, message: '', data: userList });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: 'Bad request' })
    }
}

const getAdminTokens = async (req, res) => {
    try {
        const userList = await User.find({ isAdmin: true }).select('token');
        if (!userList) {
            res.status(500).send({ success: false })
        } else {
            res.status(201).send({ success: true, message: '', data: userList });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: 'Bad request' })
    }
}

const getSellerToken = async (req, res) => {
    try {
        await User.find({ _id: req.params.id }).select('token')
            .then(response => {
                res.status(201).send({ success: true, message: '', data: response });
            }).catch(error => {
                res.status(500).send({ success: false, message: error.message });
            })
    } catch (error) {
        res.status(500).send({ success: false, message: 'Bad request' })
    }
}

const editUser = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(500).send({ error: 'Invalid user id', success: false })
        }
        await User.findByIdAndUpdate(req.params.id, req.body).then(response => {
            return res.status(201).send({ success: true, message: 'Data updated.' });
        }).catch(err => {
            return res.status(500).send({ error: err, success: false })
        })
    } catch (error) {
        res.status(500).send({ success: false, message: 'Bad request' })
    }
}

const forgotPassword = async (req, res) => {
    console.log("inside: ")
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(500).send({ error: 'Invalid user id', success: false })
        }
        req.body.passwordHash = await bcrypt.hashSync(req.body.passwordHash, 10);
        console.log(req.body)
        await User.findOneAndUpdate({ _id: req.params.id }, req.body).then(response => {
            return res.status(201).send({ success: true, message: 'Data updated.' });
        }).catch(err => {
            console.log(err)
            return res.status(500).send({ error: err, success: false })
        })
    } catch (error) {
        console.log("error: ", error)
        res.status(500).send({ success: false, message: 'Bad request' })
    }
}

const newUser = async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findOne({ phone: req.body.phone });
        if (!user) {
            let otpnumber = Math.random() * (9999 - 1000) + 1000
            req.body.passwordHash = bcrypt.hashSync(req.body.passwordHash, 10)
            req.body.otp = Math.round(otpnumber);
            const UserData = new User(req.body);
            UserData.save().then(data => {
                if (!req.body.isAdmin) {
    
                    sendSMS(Math.round(otpnumber), `${req.body.country_code}${data.phone}`)
                }
                return res.status(201).send({ success: true, message: 'Data saved.', data: data });
            }).catch(err => {
                console.log(err)
                return res.status(500).send({ error: err, success: false })
            })
        } else {
            return res.status(500).send({ success: false, message: 'User already exist.' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: 'Bad request' })
    }
}

const   otpValidator = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, otp: req.body.otp });
        if (user) {
            if (req.body) {
                let body = { status: req.body.status }
                await User.findByIdAndUpdate(req.params.id, body).then(response => {
                    return res.status(201).send({ success: true, message: 'Data found.' });
                }).catch(err => {
                    return res.status(500).send({ error: err, success: false })
                })
            } else {
                return res.status(201).send({ success: true, message: 'Data found.' });
            }
        } else {
            res.status(500).send({ success: false, message: 'Wrong OTP' })
        }
    } catch (error) {
        res.status(500).send({ success: false, message: 'Bad request' })
    }
}

const login = async (req, res) => {
    console.log(req.body)
    try {
        const user = await User.findOne({ phone: req.body.phone, status: "ACTIVE", isAdmin: false });
        console.log(user)
        if (!user) {
            return res.status(500).send({ success: false, message: 'User not found.' });
        } else if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            let userToken = jwt.sign(
                {
                    userId: user._id,
                    isAdmin: true
                },
                process.env.SECRET,
            )
            // {expiresIn: '1d'} //1d = one day, 1w = one week, 1m = one month
            return res.status(201).send({ success: true, message: 'Login success', userId: user._id, token: userToken });
        } else {
            return res.status(500).send({ success: false, message: 'Wrong password.' });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: 'Bad request' })
    }
}

const loginAdmin = async (req, res) => {
    try {
        const user = await User.findOne({ phone: req.body.phone, isAdmin: true });
        let bcrpt = bcrypt.decodeBase64(user.passwordHash);
        if (!user) {
            return res.status(500).send({ success: false, message: 'User not found.' });
        } else if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            let userToken = jwt.sign(
                {
                    userId: user._id,
                    isAdmin: user.isAdmin
                },
                process.env.SECRET,
            )
            // {expiresIn: '1d'} //1d = one day, 1w = one week, 1m = one month
            return res.status(201).send({ success: true, message: 'Login success', userId: user._id, token: userToken });
        } else {
            return res.status(500).send({ success: false, message: 'Wrong password.', data: bcrpt });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: 'Bad request' })
    }
}

const getUserById = async (req, res) => {
    try {
        const userData = await User.findById(req.params.id);
        if (!userData) {
            res.status(400).send({ success: false, message: "User not found" })
        } else {
            res.status(201).send({ success: true, message: '', data: userData });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: 'Bad request' })
    }
}

const generateOTP = async (req, res) => {
    try {
        const userData = await User.findOne({ phone: req.params.id }).select('_id country_code');
        if (!userData) {
            res.status(500).send({ success: false, message: "User not found" })
        } else {
            let otpnumber = Math.random() * (9999 - 1000) + 1000;
            console.log(userData)
            await User.findByIdAndUpdate(userData._id, { otp: Math.round(otpnumber) }).then(response => {
                sendSMS(Math.round(otpnumber), `${userData.country_code}${req.params.id}`)
                return res.status(201).send({ success: true, message: userData });
            }).catch(err => {
                return res.status(500).send({ error: err, success: false })
            })
        }
    } catch (error) {
        res.status(500).send({ success: false, message: 'Bad request' })
    }
}

const getUserAnalytics = async (req, res) => {
    console.log('hi')
    await User.find().then(UserCount => {
        res.status(201).send({success: true, message: '', total_users: UserCount.length});
    }).catch(err => {
        res.status(500).send({success: false, error: err})
    })
}

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id).then(response => {
            if (response) {
                return res.status(201).send({ success: true, message: 'Data deleted.' });
            } else {
                return res.status(404).send({ success: false, message: 'User not found' });
            }
        }).catch(err => {
            return res.status(500).send({ error: err, success: false })
        })
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Bad request' })
    }
}

module.exports = {
    getUserList,
    newUser,
    getUserById,
    login,
    getUserAnalytics,
    deleteUser,
    editUser,
    otpValidator,
    forgotPassword,
    generateOTP,
    loginAdmin,
    getAdminTokens,
    getSellerToken
};