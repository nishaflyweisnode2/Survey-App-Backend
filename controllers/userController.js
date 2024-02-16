const User = require('../models/userModel');
const authConfig = require("../configs/auth.config");
const jwt = require("jsonwebtoken");
const newOTP = require("otp-generators");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const Notification = require('../models/notificationModel');
const Form1 = require('../models/form1Model')
const Form2 = require('../models/form2Model');
const Form3 = require('../models/form3Model');
const Form4 = require('../models/form4Model');
const Form5 = require('../models/form5Model');
const Form6 = require('../models/form6Model');
const Form7 = require('../models/form7Model');
const Form8 = require('../models/form8Model');
const Banner = require('../models/bannerModel');







const reffralCode = async () => {
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let OTP = '';
    for (let i = 0; i < 9; i++) {
        OTP += digits[Math.floor(Math.random() * 36)];
    }
    return OTP;
}

exports.loginWithPhone = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        if (mobileNumber.replace(/\D/g, '').length !== 10) {
            return res.status(400).send({ status: 400, message: "Invalid mobileNumber number length" });
        }

        const user = await User.findOne({ mobileNumber: mobileNumber, userType: "USER" });
        if (!user) {
            let otp = newOTP.generate(6, { alphabets: false, upperCase: false, specialChar: false });
            let otpExpiration = new Date(Date.now() + 60 * 1000);
            let accountVerification = false;

            const newUser = await User.create({ mobileNumber: mobileNumber, otp, otpExpiration, accountVerification, userType: "USER" });
            let obj = { id: newUser._id, otp: newUser.otp, mobileNumber: newUser.mobileNumber }
            const welcomeMessage = `Welcome, ${newUser.mobileNumber}! Thank you for registering.`;
            const welcomeNotification = new Notification({
                recipient: newUser._id,
                content: welcomeMessage,
                type: 'welcome',
            });
            await welcomeNotification.save();

            return res.status(200).send({ status: 200, message: "logged in successfully", data: obj });
        } else {
            const userObj = {};
            userObj.otp = newOTP.generate(6, { alphabets: false, upperCase: false, specialChar: false });
            userObj.otpExpiration = new Date(Date.now() + 60 * 1000);
            userObj.accountVerification = false;
            const updated = await User.findOneAndUpdate({ mobileNumber: mobileNumber, userType: "USER" }, userObj, { new: true });
            let obj = { id: updated._id, otp: updated.otp, mobileNumber: updated.mobileNumber }
            return res.status(200).send({ status: 200, message: "logged in successfully", data: obj });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "user not found" });
        }
        console.log("Current Time:", new Date());
        console.log("OTP Expiration:", user.otpExpiration);

        if (user.otp !== otp || user.otpExpiration < Date.now()) {
            console.log("Invalid or expired OTP");
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const updated = await User.findByIdAndUpdate({ _id: user._id }, { $set: { accountVerification: true } }, { new: true });
        const accessToken = await jwt.sign({ id: user._id }, authConfig.secret, {
            expiresIn: authConfig.accessTokenTime,
        });
        let obj = {
            userId: updated._id,
            otp: updated.otp,
            mobileNumber: updated.mobileNumber,
            token: accessToken,
            completeProfile: updated.completeProfile
        }
        return res.status(200).send({ status: 200, message: "logged in successfully", data: obj });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ error: "internal server error" + err.message });
    }
};

exports.resendOTP = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id, userType: "USER" });
        if (!user) {
            return res.status(404).send({ status: 404, message: "User not found" });
        }
        const otp = newOTP.generate(6, { alphabets: false, upperCase: false, specialChar: false, });
        const otpExpiration = new Date(Date.now() + 60 * 1000);
        const accountVerification = false;
        const updated = await User.findOneAndUpdate({ _id: user._id }, { otp, otpExpiration, accountVerification }, { new: true });
        let obj = {
            id: updated._id,
            otp: updated.otp,
            mobileNumber: updated.mobileNumber
        }
        return res.status(200).send({ status: 200, message: "OTP resent", data: obj });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: 500, message: "Server error" + error.message });
    }
};

exports.uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!req.file) {
            return res.status(400).json({ status: 400, error: "Image file is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { image: req.file.path, }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        return res.status(200).json({ status: 200, message: 'Profile Picture Uploaded successfully', data: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to upload profile picture', error: error.message });
    }
};

exports.editProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const { firstName, lastName, email, mobileNumber } = req.body;

        const updateObject = {};
        if (firstName) updateObject.firstName = firstName;
        if (lastName) updateObject.lastName = lastName;
        if (email) updateObject.email = email;
        if (mobileNumber) updateObject.mobileNumber = mobileNumber;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateObject, completeProfile: true },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        return res.status(200).json({ status: 200, message: 'Edit Profile updated successfully', data: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate('city');
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const memberSince = user.createdAt.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        });

        return res.status(200).json({
            status: 200,
            data: {
                user,
                memberSince,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

exports.getUserProfileById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const memberSince = user.createdAt.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        });

        return res.status(200).json({
            status: 200, data: {
                user,
                memberSince,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

exports.getAllForm1 = async (req, res) => {
    try {
        const categories = await Form1.find();

        return res.status(200).json({
            status: 200,
            message: 'Form1 categories retrieved successfully',
            data: categories,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm1ById = async (req, res) => {
    try {
        const form1Id = req.params.form1Id;
        const category = await Form1.findById(form1Id);

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form1 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getAllForm2 = async (req, res) => {
    try {
        const categories = await Form2.find();

        return res.status(200).json({
            status: 200,
            message: 'Form2 categories retrieved successfully',
            data: categories,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm2ById = async (req, res) => {
    try {
        const form2Id = req.params.form2Id;
        const category = await Form2.findById(form2Id);

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form2 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form2 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm2ByForm1 = async (req, res) => {
    try {
        const form1Id = req.params.form1Id;
        const category = await Form2.find({ form1: form1Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form2 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getAllForm3 = async (req, res) => {
    try {
        const categories = await Form3.find();

        return res.status(200).json({
            status: 200,
            message: 'Form3 categories retrieved successfully',
            data: categories,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm3ById = async (req, res) => {
    try {
        const form3Id = req.params.form3Id;
        const category = await Form3.findById(form3Id);

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form3 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form3 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm3ByForm1 = async (req, res) => {
    try {
        const form1Id = req.params.form1Id;
        const category = await Form3.find({ form1: form1Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form2 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm3ByForm2 = async (req, res) => {
    try {
        const form2Id = req.params.form2Id;
        const category = await Form3.find({ form2: form2Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form2 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form2 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getAllForm4 = async (req, res) => {
    try {
        const categories = await Form4.find();

        return res.status(200).json({
            status: 200,
            message: 'Form4 categories retrieved successfully',
            data: categories,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm4ById = async (req, res) => {
    try {
        const form4Id = req.params.form4Id;
        const category = await Form4.findById(form4Id);

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form4 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form4 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm4ByForm1 = async (req, res) => {
    try {
        const form1Id = req.params.form1Id;
        const category = await Form4.find({ form1: form1Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form4 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm4ByForm2 = async (req, res) => {
    try {
        const form2Id = req.params.form2Id;
        const category = await Form4.find({ form2: form2Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form2 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form4 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm4ByForm3 = async (req, res) => {
    try {
        const form3Id = req.params.form3Id;
        const category = await Form4.find({ form3: form3Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form3 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form4 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getAllForm5 = async (req, res) => {
    try {
        const categories = await Form5.find();

        return res.status(200).json({
            status: 200,
            message: 'Form5 categories retrieved successfully',
            data: categories,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm5ById = async (req, res) => {
    try {
        const form5Id = req.params.form5Id;
        const category = await Form5.findById(form5Id);

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form5 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form5 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm5ByForm1 = async (req, res) => {
    try {
        const form1Id = req.params.form1Id;
        const category = await Form5.find({ form1: form1Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form5 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm5ByForm2 = async (req, res) => {
    try {
        const form2Id = req.params.form2Id;
        const category = await Form5.find({ form2: form2Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form2 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form5 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm5ByForm3 = async (req, res) => {
    try {
        const form3Id = req.params.form3Id;
        const category = await Form5.find({ form3: form3Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form3 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form5 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm5ByForm4 = async (req, res) => {
    try {
        const form4Id = req.params.form4Id;
        const category = await Form5.find({ form4: form4Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form4 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form5 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getAllForm6 = async (req, res) => {
    try {
        const categories = await Form6.find();

        return res.status(200).json({
            status: 200,
            message: 'Form6 categories retrieved successfully',
            data: categories,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm6ById = async (req, res) => {
    try {
        const form6Id = req.params.form6Id;
        const category = await Form6.findById(form6Id);

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form6 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form6 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm6ByForm1 = async (req, res) => {
    try {
        const form1Id = req.params.form1Id;
        const category = await Form6.find({ form1: form1Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form6 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm6ByForm2 = async (req, res) => {
    try {
        const form2Id = req.params.form2Id;
        const category = await Form6.find({ form2: form2Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form2 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form6 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm6ByForm3 = async (req, res) => {
    try {
        const form3Id = req.params.form3Id;
        const category = await Form6.find({ form3: form3Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form3 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form6 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm6ByForm4 = async (req, res) => {
    try {
        const form4Id = req.params.form4Id;
        const category = await Form6.find({ form4: form4Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form4 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form6 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm6ByForm5 = async (req, res) => {
    try {
        const form5Id = req.params.form5Id;
        const category = await Form6.find({ form5: form5Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form5 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form6 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getAllForm7 = async (req, res) => {
    try {
        const categories = await Form7.find();

        return res.status(200).json({
            status: 200,
            message: 'Form7 categories retrieved successfully',
            data: categories,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm7ById = async (req, res) => {
    try {
        const form7Id = req.params.form7Id;
        const category = await Form7.findById(form7Id);

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form7 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form7 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm7ByForm1 = async (req, res) => {
    try {
        const form1Id = req.params.form1Id;
        const category = await Form7.find({ form1: form1Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form7 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm7ByForm2 = async (req, res) => {
    try {
        const form2Id = req.params.form2Id;
        const category = await Form7.find({ form2: form2Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form2 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form7 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm7ByForm3 = async (req, res) => {
    try {
        const form3Id = req.params.form3Id;
        const category = await Form7.find({ form3: form3Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form3 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form7 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm7ByForm4 = async (req, res) => {
    try {
        const form4Id = req.params.form4Id;
        const category = await Form7.find({ form4: form4Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form4 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form7 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm7ByForm5 = async (req, res) => {
    try {
        const form5Id = req.params.form5Id;
        const category = await Form7.find({ form5: form5Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form5 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form7 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm7ByForm6 = async (req, res) => {
    try {
        const form6Id = req.params.form6Id;
        const category = await Form7.find({ form5: form6Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form6 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form7 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.createForm8 = async (req, res) => {
    try {
        const { form1, form2, form3, form4, form5, form6, form7, facebookLink, twiterLink, instagramLink, status } = req.body;

        let imagePath = null;
        if (req.file) {
            imagePath = req.file.path;
        }

        // const existingCategory = await Form7.findOne({ name });
        // if (existingCategory) {
        //     return res.status(400).json({ status: 400, message: 'Form7 category with this name already exists', data: null });
        // }

        const form1Category = await Form1.findById(form1);
        if (!form1Category) {
            return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
        }

        const form2Category = await Form2.findById(form2);
        if (!form2Category) {
            return res.status(404).json({ status: 404, message: 'form2 category not found', data: null });
        }

        const form3Category = await Form3.findById(form3);
        if (!form3Category) {
            return res.status(404).json({ status: 404, message: 'form3 category not found', data: null });
        }

        const form4Category = await Form4.findById(form4);
        if (!form4Category) {
            return res.status(404).json({ status: 404, message: 'form4 category not found', data: null });
        }

        const form5Category = await Form5.findById(form5);
        if (!form5Category) {
            return res.status(404).json({ status: 404, message: 'form5 category not found', data: null });
        }

        const form6Category = await Form6.findById(form6);
        if (!form6Category) {
            return res.status(404).json({ status: 404, message: 'form6 category not found', data: null });
        }

        const form7Category = await Form7.findById(form7);
        if (!form7Category) {
            return res.status(404).json({ status: 404, message: 'form7 category not found', data: null });
        }

        const newCategory = await Form8.create({ form1, form2, form3, form4, form5, form6, form7, facebookLink, twiterLink, instagramLink, status, image: imagePath, });

        return res.status(201).json({ status: 201, message: 'Form7 category created successfully', data: newCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getAllForm8 = async (req, res) => {
    try {
        const categories = await Form8.find();

        return res.status(200).json({
            status: 200,
            message: 'Form8 categories retrieved successfully',
            data: categories,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm8ById = async (req, res) => {
    try {
        const form8Id = req.params.form8Id;
        const category = await Form8.findById(form8Id);

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form8 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form8 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm8ByForm1 = async (req, res) => {
    try {
        const form1Id = req.params.form1Id;
        const category = await Form8.find({ form1: form1Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form8 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm8ByForm2 = async (req, res) => {
    try {
        const form2Id = req.params.form2Id;
        const category = await Form8.find({ form2: form2Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form2 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form8 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm8ByForm3 = async (req, res) => {
    try {
        const form3Id = req.params.form3Id;
        const category = await Form8.find({ form3: form3Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form3 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form8 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm8ByForm4 = async (req, res) => {
    try {
        const form4Id = req.params.form4Id;
        const category = await Form8.find({ form4: form4Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form4 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form8 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm8ByForm5 = async (req, res) => {
    try {
        const form5Id = req.params.form5Id;
        const category = await Form8.find({ form5: form5Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form5 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form8 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm8ByForm6 = async (req, res) => {
    try {
        const form6Id = req.params.form6Id;
        const category = await Form8.find({ form6: form6Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form6 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form8 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getForm8ByForm7 = async (req, res) => {
    try {
        const form7Id = req.params.form7Id;
        const category = await Form8.find({ form7: form7Id });

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form7 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form8 category retrieved successfully', data: category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.updateForm8 = async (req, res) => {
    try {
        const form8Id = req.params.form8Id;
        const { form1, form2, form3, form4, form5, form6, form7, facebookLink, twiterLink, instagramLink, status } = req.body;

        let imagePath;
        if (req.file) {
            imagePath = req.file.path;
        }

        if (form1) {
            const form1Category = await Form1.findById(form1);
            if (!form1Category) {
                return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
            }
        }

        if (form2) {
            const form2Category = await Form2.findById(form2);
            if (!form2Category) {
                return res.status(404).json({ status: 404, message: 'form2 category not found', data: null });
            }
        }

        if (form3) {
            const form3Category = await Form3.findById(form3);
            if (!form3Category) {
                return res.status(404).json({ status: 404, message: 'form3 category not found', data: null });
            }
        }

        if (form4) {
            const form4Category = await Form4.findById(form4);
            if (!form4Category) {
                return res.status(404).json({ status: 404, message: 'form4 category not found', data: null });
            }
        }

        if (form5) {
            const form4Category = await Form5.findById(form5);
            if (!form4Category) {
                return res.status(404).json({ status: 404, message: 'form5 category not found', data: null });
            }
        }

        if (form6) {
            const form4Category = await Form6.findById(form6);
            if (!form4Category) {
                return res.status(404).json({ status: 404, message: 'form6 category not found', data: null });
            }
        }

        if (form7) {
            const form4Category = await Form7.findById(form7);
            if (!form4Category) {
                return res.status(404).json({ status: 404, message: 'form7 category not found', data: null });
            }
        }

        const updatedCategory = await Form8.findByIdAndUpdate(
            form8Id,
            { form1, form2, form3, form4, form5, form6, form7, facebookLink, twiterLink, instagramLink, status, image: imagePath },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ status: 404, message: 'Form8 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form8 category updated successfully', data: updatedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.deleteForm8 = async (req, res) => {
    try {
        const form8Id = req.params.form8Id;

        const deletedCategory = await Form8.findByIdAndDelete(form8Id);

        if (!deletedCategory) {
            return res.status(404).json({ status: 404, message: 'Form8 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form8 category deleted successfully', data: deletedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        return res.status(200).json({ status: 200, data: banners });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Server Error' });
    }
};

exports.getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ success: false, error: 'Banner not found' });
        }
        return res.status(200).json({ status: 200, data: banner });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Server Error' });
    }
};

exports.createChangeRequest = async (req, res) => {
    try {
        const { comment } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ success: false, error: 'Banner not found' });
        }

        banner.changeRequests.push({
            user: userId,
            comment: comment,
            status: 'Pending'
        });

        await banner.save();

        return res.status(201).json({ success: true, message: 'Change request created successfully', data: banner });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};
