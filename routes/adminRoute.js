const auth = require("../controllers/adminController");
const express = require("express");
const router = express()


const authJwt = require("../middlewares/auth");

const { profileImage, form1Image } = require('../middlewares/imageUpload');



module.exports = (app) => {

    // api/v1/admin/

    app.post("/api/v1/admin/registration", auth.registration);
    app.post("/api/v1/admin/login", auth.signin);
    app.put("/api/v1/admin/update", [authJwt.isAdmin], auth.update);
    app.get("/api/v1/admin/profile", [authJwt.isAdmin], auth.getAllUser);
    app.get("/api/v1/admin/profile/:userId", [authJwt.isAdmin], auth.getUserById);
    app.delete('/api/v1/admin/users/profile/delete/:id', [authJwt.isAdmin], auth.deleteUser);
    app.post('/api/v1/admin/form1', [authJwt.isAdmin], form1Image.single('image'), auth.createForm1);
    app.get('/api/v1/admin/form1', [authJwt.isAdmin], auth.getAllForm1);
    app.get('/api/v1/admin/form1/:form1Id', [authJwt.isAdmin], auth.getForm1ById);
    app.put('/api/v1/admin/form1/:form1Id', [authJwt.isAdmin], form1Image.single('image'), auth.updateForm1);
    app.delete('/api/v1/admin/form1/:form1Id', [authJwt.isAdmin], auth.deleteForm1);


}