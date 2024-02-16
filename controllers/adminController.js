const User = require('../models/userModel');
const authConfig = require("../configs/auth.config");
const jwt = require("jsonwebtoken");
const newOTP = require("otp-generators");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const Notification = require('../models/notificationModel');
const Form1 = require('../models/form1Model');
const Form2 = require('../models/form2Model');
const Form3 = require('../models/form3Model');
const Form4 = require('../models/form4Model');
const Form5 = require('../models/form5Model');
const Form6 = require('../models/form6Model');
const Form7 = require('../models/form7Model');
const Form8 = require('../models/form8Model');
const Banner = require('../models/bannerModel');







exports.registration = async (req, res) => {
    const { phone, email, fullName } = req.body;
    try {
        req.body.email = email.split(" ").join("").toLowerCase();
        let user = await User.findOne({ $and: [{ $or: [{ email: req.body.email }, { phone: phone }] }], userType: "ADMIN" });
        if (!user) {
            req.body.password = bcrypt.hashSync(req.body.password, 8);
            req.body.userType = "ADMIN";
            req.body.accountVerification = true;
            const userCreate = await User.create(req.body);
            return res.status(200).send({ message: "registered successfully ", data: userCreate, });
        } else {
            return res.status(409).send({ message: "Already Exist", data: [] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email, userType: "ADMIN" });
        if (!user) {
            return res
                .status(404)
                .send({ message: "user not found ! not registered" });
        }
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(401).send({ message: "Wrong password" });
        }
        const accessToken = jwt.sign({ id: user._id }, authConfig.secret, {
            expiresIn: authConfig.accessTokenTime,
        });
        let obj = {
            fullName: user.fullName,
            mobileNumber: user.mobileNumber,
            email: user.email,
            userType: user.userType,
        }
        return res.status(201).send({ data: obj, accessToken: accessToken });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server error" + error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { fullName, lastName, email, mobileNumber, password } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ message: "not found" });
        }
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.mobileNumber = mobileNumber || user.mobileNumber;
        if (req.body.password) {
            user.password = bcrypt.hashSync(password, 8) || user.password;
        }
        const updated = await user.save();
        return res.status(200).send({ message: "updated", data: updated });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: "internal server error " + err.message,
        });
    }
};

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find().populate('city');
        if (!users || users.length === 0) {
            return res.status(404).json({ status: 404, message: 'Users not found' });
        }

        const formattedUsers = users.map(user => ({
            _id: user._id,
            user: user,
            memberSince: user.createdAt.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
            }),
        }));

        return res.status(200).json({
            status: 200,
            data: formattedUsers,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

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

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({ status: 200, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

exports.createForm1 = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        if (!req.file) {
            return res.status(400).json({ status: 400, error: "Image file is required" });
        }

        const existingCategory = await Form1.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ status: 400, message: 'Form1 category with this name already exists', data: null });
        }

        const newCategory = await Form1.create({ name, description, status, image: req.file.path, });

        return res.status(201).json({ status: 201, message: 'Form1 category created successfully', data: newCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
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

exports.updateForm1 = async (req, res) => {
    try {
        const form1Id = req.params.form1Id;
        const { name, description, status } = req.body;

        let imagePath;

        if (req.file) {
            imagePath = req.file.path;
        }

        const updatedCategory = await Form1.findByIdAndUpdate(
            form1Id,
            { name, description, status, image: imagePath },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form1 category updated successfully', data: updatedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.deleteForm1 = async (req, res) => {
    try {
        const form1Id = req.params.form1Id;

        const deletedCategory = await Form1.findByIdAndDelete(form1Id);

        if (!deletedCategory) {
            return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form1 category deleted successfully', data: deletedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.createForm2 = async (req, res) => {
    try {
        const { form1, name, description, status } = req.body;

        if (!req.file) {
            return res.status(400).json({ status: 400, error: "Image file is required" });
        }

        const category = await Form1.findById(form1);

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
        }

        const existingCategory = await Form2.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ status: 400, message: 'Form2 category with this name already exists', data: null });
        }

        const newCategory = await Form2.create({ form1, name, description, status, image: req.file.path, });

        return res.status(201).json({ status: 201, message: 'Form2 category created successfully', data: newCategory });
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

exports.updateForm2 = async (req, res) => {
    try {
        const form2Id = req.params.form2Id;
        const { form1, name, description, status } = req.body;

        let imagePath;

        if (req.file) {
            imagePath = req.file.path;
        }

        if (form1) {
            const category = await Form1.findById(form1);
            if (!category) {
                return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
            }
        }

        const updatedCategory = await Form2.findByIdAndUpdate(
            form2Id,
            { form1, name, description, status, image: imagePath },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ status: 404, message: 'Form2 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form2 category updated successfully', data: updatedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.deleteForm2 = async (req, res) => {
    try {
        const form2Id = req.params.form2Id;

        const deletedCategory = await Form2.findByIdAndDelete(form2Id);

        if (!deletedCategory) {
            return res.status(404).json({ status: 404, message: 'Form2 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form2 category deleted successfully', data: deletedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.createForm3 = async (req, res) => {
    try {
        const { form1, form2, name, description, status } = req.body;

        if (!req.file) {
            return res.status(400).json({ status: 400, error: "Image file is required" });
        }

        const existingCategory = await Form3.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ status: 400, message: 'Form3 category with this name already exists', data: null });
        }

        const form1Category = await Form1.findById(form1);
        if (!form1Category) {
            return res.status(404).json({ status: 404, message: 'Form1 category not found', data: null });
        }

        const form2Category = await Form2.findById(form2);
        if (!form2Category) {
            return res.status(404).json({ status: 404, message: 'form2 category not found', data: null });
        }

        const newCategory = await Form3.create({ form1, form2, name, description, status, image: req.file.path, });

        return res.status(201).json({ status: 201, message: 'Form3 category created successfully', data: newCategory });
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

exports.updateForm3 = async (req, res) => {
    try {
        const form3Id = req.params.form3Id;
        const { form1, form2, name, description, status } = req.body;

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

        const updatedCategory = await Form3.findByIdAndUpdate(
            form3Id,
            { form1, form2, name, description, status, image: imagePath },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ status: 404, message: 'Form3 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form3 category updated successfully', data: updatedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.deleteForm3 = async (req, res) => {
    try {
        const form3Id = req.params.form3Id;

        const deletedCategory = await Form3.findByIdAndDelete(form3Id);

        if (!deletedCategory) {
            return res.status(404).json({ status: 404, message: 'Form3 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form3 category deleted successfully', data: deletedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.createForm4 = async (req, res) => {
    try {
        const { form1, form2, form3, name, description, status } = req.body;

        const existingCategory = await Form4.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ status: 400, message: 'Form4 category with this name already exists', data: null });
        }

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

        const newCategory = await Form4.create({ form1, form2, form3, name, description, status, });

        return res.status(201).json({ status: 201, message: 'Form4 category created successfully', data: newCategory });
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

exports.updateForm4 = async (req, res) => {
    try {
        const form4Id = req.params.form4Id;
        const { form1, form2, form3, name, description, status } = req.body;

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

        const updatedCategory = await Form4.findByIdAndUpdate(
            form4Id,
            { form1, form2, form3, name, description, status },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ status: 404, message: 'Form4 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form4 category updated successfully', data: updatedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.deleteForm4 = async (req, res) => {
    try {
        const form4Id = req.params.form4Id;

        const deletedCategory = await Form4.findByIdAndDelete(form4Id);

        if (!deletedCategory) {
            return res.status(404).json({ status: 404, message: 'Form4 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form4 category deleted successfully', data: deletedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.createForm5 = async (req, res) => {
    try {
        const { form1, form2, form3, form4, name, description, status } = req.body;

        const existingCategory = await Form5.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ status: 400, message: 'Form5 category with this name already exists', data: null });
        }

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

        const newCategory = await Form5.create({ form1, form2, form3, form4, name, description, status });

        return res.status(201).json({ status: 201, message: 'Form5 category created successfully', data: newCategory });
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

exports.updateForm5 = async (req, res) => {
    try {
        const form5Id = req.params.form5Id;
        const { form1, form2, form3, form4, name, description, status } = req.body;

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

        const updatedCategory = await Form5.findByIdAndUpdate(
            form5Id,
            { form1, form2, form3, form4, name, description, status },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ status: 404, message: 'Form5 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form5 category updated successfully', data: updatedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.deleteForm5 = async (req, res) => {
    try {
        const form5Id = req.params.form5Id;

        const deletedCategory = await Form5.findByIdAndDelete(form5Id);

        if (!deletedCategory) {
            return res.status(404).json({ status: 404, message: 'Form5 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form5 category deleted successfully', data: deletedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.createForm6 = async (req, res) => {
    try {
        const { form1, form2, form3, form4, form5, name, description, status } = req.body;

        const existingCategory = await Form6.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ status: 400, message: 'Form6 category with this name already exists', data: null });
        }

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

        const newCategory = await Form6.create({ form1, form2, form3, form4, form5, name, description, status });

        return res.status(201).json({ status: 201, message: 'Form6 category created successfully', data: newCategory });
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

exports.updateForm6 = async (req, res) => {
    try {
        const form6Id = req.params.form6Id;
        const { form1, form2, form3, form4, form5, name, description, status } = req.body;

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

        const updatedCategory = await Form6.findByIdAndUpdate(
            form6Id,
            { form1, form2, form3, form4, form5, name, description, status },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ status: 404, message: 'Form6 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form6 category updated successfully', data: updatedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.deleteForm6 = async (req, res) => {
    try {
        const form6Id = req.params.form6Id;

        const deletedCategory = await Form6.findByIdAndDelete(form6Id);

        if (!deletedCategory) {
            return res.status(404).json({ status: 404, message: 'Form6 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form6 category deleted successfully', data: deletedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.createForm7 = async (req, res) => {
    try {
        const { form1, form2, form3, form4, form5, form6, name, description, status } = req.body;

        const existingCategory = await Form7.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ status: 400, message: 'Form7 category with this name already exists', data: null });
        }

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

        const newCategory = await Form7.create({ form1, form2, form3, form4, form5, form6, name, description, status });

        return res.status(201).json({ status: 201, message: 'Form7 category created successfully', data: newCategory });
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

exports.updateForm7 = async (req, res) => {
    try {
        const form7Id = req.params.form7Id;
        const { form1, form2, form3, form4, form5, form6, name, description, status } = req.body;

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

        const updatedCategory = await Form7.findByIdAndUpdate(
            form7Id,
            { form1, form2, form3, form4, form5, form6, name, description, status },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ status: 404, message: 'Form7 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form7 category updated successfully', data: updatedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: null });
    }
};

exports.deleteForm7 = async (req, res) => {
    try {
        const form7Id = req.params.form7Id;

        const deletedCategory = await Form7.findByIdAndDelete(form7Id);

        if (!deletedCategory) {
            return res.status(404).json({ status: 404, message: 'Form7 category not found', data: null });
        }

        return res.status(200).json({ status: 200, message: 'Form7 category deleted successfully', data: deletedCategory });
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

exports.createBanner = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        let imagePath = null;
        if (req.file) {
            imagePath = req.file.path;
        }

        const banner = await Banner.create({ title, image: imagePath, description, createdBy: user._id });
        return res.status(201).json({ status: 201, data: banner });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Server Error' });
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

exports.updateBanner = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        let imagePath;
        if (req.file) {
            imagePath = req.file.path;
        }

        const banner = await Banner.findByIdAndUpdate(req.params.id, { 
            ...req.body,
            image: imagePath 
        }, { 
            new: true,
            runValidators: true
        });

        if (!banner) {
            return res.status(404).json({ success: false, error: 'Banner not found' });
        }

        return res.status(200).json({ status: 200, data: banner });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Server Error' });
    }
};

exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({ success: false, error: 'Banner not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Server Error' });
    }
};
