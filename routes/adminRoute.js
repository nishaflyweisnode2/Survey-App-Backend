const auth = require("../controllers/adminController");
const express = require("express");
const router = express()


const authJwt = require("../middlewares/auth");

const { profileImage, form1Image, form2Image, form3Image, form4Image, bannerImage } = require('../middlewares/imageUpload');



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
    app.post('/api/v1/admin/form2', [authJwt.isAdmin], form2Image.single('image'), auth.createForm2);
    app.get('/api/v1/admin/form2', [authJwt.isAdmin], auth.getAllForm2);
    app.get('/api/v1/admin/form2/:form2Id', [authJwt.isAdmin], auth.getForm2ById);
    app.get('/api/v1/admin/form2/byForm1/:form1Id', [authJwt.isAdmin], auth.getForm2ByForm1);
    app.put('/api/v1/admin/form2/:form2Id', [authJwt.isAdmin], form2Image.single('image'), auth.updateForm2);
    app.delete('/api/v1/admin/form2/:form2Id', [authJwt.isAdmin], auth.deleteForm2);
    app.post('/api/v1/admin/form3', [authJwt.isAdmin], form3Image.single('image'), auth.createForm3);
    app.get('/api/v1/admin/form3', [authJwt.isAdmin], auth.getAllForm3);
    app.get('/api/v1/admin/form3/:form3Id', [authJwt.isAdmin], auth.getForm3ById);
    app.get('/api/v1/admin/form3/byForm1/:form1Id', [authJwt.isAdmin], auth.getForm3ByForm1);
    app.get('/api/v1/admin/form3/byForm2/:form2Id', [authJwt.isAdmin], auth.getForm3ByForm2);
    app.put('/api/v1/admin/form3/:form3Id', [authJwt.isAdmin], form3Image.single('image'), auth.updateForm3);
    app.delete('/api/v1/admin/form3/:form3Id', [authJwt.isAdmin], auth.deleteForm3);
    app.post('/api/v1/admin/form4', [authJwt.isAdmin], auth.createForm4);
    app.get('/api/v1/admin/form4', [authJwt.isAdmin], auth.getAllForm4);
    app.get('/api/v1/admin/form4/:form4Id', [authJwt.isAdmin], auth.getForm4ById);
    app.get('/api/v1/admin/form4/byForm1/:form1Id', [authJwt.isAdmin], auth.getForm4ByForm1);
    app.get('/api/v1/admin/form4/byForm2/:form2Id', [authJwt.isAdmin], auth.getForm4ByForm2);
    app.get('/api/v1/admin/form4/byForm3/:form3Id', [authJwt.isAdmin], auth.getForm4ByForm3);
    app.put('/api/v1/admin/form4/:form4Id', [authJwt.isAdmin], auth.updateForm4);
    app.delete('/api/v1/admin/form4/:form4Id', [authJwt.isAdmin], auth.deleteForm4);
    app.post('/api/v1/admin/form5', [authJwt.isAdmin], auth.createForm5);
    app.get('/api/v1/admin/form5', [authJwt.isAdmin], auth.getAllForm5);
    app.get('/api/v1/admin/form5/:form5Id', [authJwt.isAdmin], auth.getForm5ById);
    app.get('/api/v1/admin/form5/byForm1/:form1Id', [authJwt.isAdmin], auth.getForm5ByForm1);
    app.get('/api/v1/admin/form5/byForm2/:form2Id', [authJwt.isAdmin], auth.getForm5ByForm2);
    app.get('/api/v1/admin/form5/byForm3/:form3Id', [authJwt.isAdmin], auth.getForm5ByForm3);
    app.get('/api/v1/admin/form5/byForm4/:form4Id', [authJwt.isAdmin], auth.getForm5ByForm4);
    app.put('/api/v1/admin/form5/:form5Id', [authJwt.isAdmin], auth.updateForm5);
    app.delete('/api/v1/admin/form5/:form5Id', [authJwt.isAdmin], auth.deleteForm5);
    app.post('/api/v1/admin/form6', [authJwt.isAdmin], auth.createForm6);
    app.get('/api/v1/admin/form6', [authJwt.isAdmin], auth.getAllForm6);
    app.get('/api/v1/admin/form6/:form6Id', [authJwt.isAdmin], auth.getForm6ById);
    app.get('/api/v1/admin/form6/byForm1/:form1Id', [authJwt.isAdmin], auth.getForm6ByForm1);
    app.get('/api/v1/admin/form6/byForm2/:form2Id', [authJwt.isAdmin], auth.getForm6ByForm2);
    app.get('/api/v1/admin/form6/byForm3/:form3Id', [authJwt.isAdmin], auth.getForm6ByForm3);
    app.get('/api/v1/admin/form6/byForm4/:form4Id', [authJwt.isAdmin], auth.getForm6ByForm4);
    app.get('/api/v1/admin/form6/byForm5/:form5Id', [authJwt.isAdmin], auth.getForm6ByForm5);
    app.put('/api/v1/admin/form6/:form6Id', [authJwt.isAdmin], auth.updateForm6);
    app.delete('/api/v1/admin/form6/:form6Id', [authJwt.isAdmin], auth.deleteForm6);
    app.post('/api/v1/admin/form7', [authJwt.isAdmin], auth.createForm7);
    app.get('/api/v1/admin/form7', [authJwt.isAdmin], auth.getAllForm7);
    app.get('/api/v1/admin/form7/:form7Id', [authJwt.isAdmin], auth.getForm7ById);
    app.get('/api/v1/admin/form7/byForm1/:form1Id', [authJwt.isAdmin], auth.getForm7ByForm1);
    app.get('/api/v1/admin/form7/byForm2/:form2Id', [authJwt.isAdmin], auth.getForm7ByForm2);
    app.get('/api/v1/admin/form7/byForm3/:form3Id', [authJwt.isAdmin], auth.getForm7ByForm3);
    app.get('/api/v1/admin/form7/byForm4/:form4Id', [authJwt.isAdmin], auth.getForm7ByForm4);
    app.get('/api/v1/admin/form7/byForm5/:form5Id', [authJwt.isAdmin], auth.getForm7ByForm5);
    app.get('/api/v1/admin/form7/byForm6/:form6Id', [authJwt.isAdmin], auth.getForm7ByForm6);
    app.put('/api/v1/admin/form7/:form7Id', [authJwt.isAdmin], auth.updateForm7);
    app.delete('/api/v1/admin/form7/:form7Id', [authJwt.isAdmin], auth.deleteForm7);
    app.get('/api/v1/admin/form8', [authJwt.isAdmin], auth.getAllForm8);
    app.get('/api/v1/admin/form8/:form8Id', [authJwt.isAdmin], auth.getForm8ById);
    app.get('/api/v1/admin/form8/byForm1/:form1Id', [authJwt.isAdmin], auth.getForm8ByForm1);
    app.get('/api/v1/admin/form8/byForm2/:form2Id', [authJwt.isAdmin], auth.getForm8ByForm2);
    app.get('/api/v1/admin/form8/byForm3/:form3Id', [authJwt.isAdmin], auth.getForm8ByForm3);
    app.get('/api/v1/admin/form8/byForm4/:form4Id', [authJwt.isAdmin], auth.getForm8ByForm4);
    app.get('/api/v1/admin/form8/byForm5/:form5Id', [authJwt.isAdmin], auth.getForm8ByForm5);
    app.get('/api/v1/admin/form8/byForm6/:form6Id', [authJwt.isAdmin], auth.getForm8ByForm6);
    app.get('/api/v1/admin/form8/byForm7/:form7Id', [authJwt.isAdmin], auth.getForm8ByForm7);
    app.post('/api/v1/admin/banner', [authJwt.isAdmin], bannerImage.single('image'), auth.createBanner);
    app.get('/api/v1/admin/banner', [authJwt.isAdmin], auth.getAllBanners);
    app.get('/api/v1/admin/banner/:id', [authJwt.isAdmin], auth.getBannerById);
    app.put('/api/v1/admin/banner/:id', [authJwt.isAdmin], bannerImage.single('image'), auth.updateBanner);
    app.delete('/api/v1/admin/banner/:id', [authJwt.isAdmin], auth.deleteBanner);
    app.get('/api/v1/admin/banner/:id/change-requests', [authJwt.isAdmin], auth.getChangeRequests);
    app.put('/api/v1/admin/banner/:bannerId/change-requests/:requestId', [authJwt.isAdmin], auth.updateChangeRequestStatus);
    app.get('/api/v1/admin/template', [authJwt.isAdmin], auth.getAllTemplate);
    app.get('/api/v1/admin/template/:id', [authJwt.isAdmin], auth.getTemplateById);

}