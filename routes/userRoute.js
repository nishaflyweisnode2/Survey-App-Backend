const auth = require("../controllers/userController");
const express = require("express");
const router = express()


const authJwt = require("../middlewares/auth");

const { profileImage, form4Image, form5Image, bannerImage, templateImage, memberImage } = require('../middlewares/imageUpload');



module.exports = (app) => {

    // api/v1/user/

    app.post("/api/v1/user/loginWithPhone", auth.loginWithPhone);
    app.post("/api/v1/user/:id", auth.verifyOtp);
    app.post("/api/v1/user/resendOtp/:id", auth.resendOTP);
    app.put("/api/v1/user/upload-profile-picture", /*[authJwt.verifyToken],*/ profileImage.single('image'), auth.uploadProfilePicture);
    app.put("/api/v1/user/edit-profile", /*[authJwt.verifyToken],*/ auth.editProfile);
    app.get("/api/v1/user/profile", /*[authJwt.verifyToken],*/ auth.getUserProfile);
    app.get("/api/v1/user/profile/:userId", /*[authJwt.verifyToken],*/ auth.getUserProfileById);
    app.get('/api/v1/user/form1', /*[authJwt.verifyToken],*/ auth.getAllForm1);
    app.get('/api/v1/user/form1/:form1Id', /*[authJwt.verifyToken],*/ auth.getForm1ById);
    app.get('/api/v1/user/form2', /*[authJwt.verifyToken],*/ auth.getAllForm2);
    app.get('/api/v1/user/form2/:form2Id', /*[authJwt.verifyToken],*/ auth.getForm2ById);
    app.get('/api/v1/user/form3', /*[authJwt.verifyToken],*/ auth.getAllForm3);
    app.get('/api/v1/user/form3/:form3Id', /*[authJwt.verifyToken],*/ auth.getForm3ById);
    app.get('/api/v1/user/form3/byForm1/:form1Id', /*[authJwt.verifyToken],*/ auth.getForm3ByForm1);
    app.get('/api/v1/user/form3/byForm2/:form2Id', /*[authJwt.verifyToken],*/ auth.getForm3ByForm2);
    app.get('/api/v1/user/form4', /*[authJwt.verifyToken],*/ auth.getAllForm4);
    app.get('/api/v1/user/form4/:form4Id', /*[authJwt.verifyToken],*/ auth.getForm4ById);
    app.get('/api/v1/user/form4/byForm1/:form1Id', /*[authJwt.verifyToken],*/ auth.getForm4ByForm1);
    app.get('/api/v1/user/form4/byForm2/:form2Id', /*[authJwt.verifyToken],*/ auth.getForm4ByForm2);
    app.get('/api/v1/user/form4/byForm3/:form3Id', /*[authJwt.verifyToken],*/ auth.getForm4ByForm3);
    app.get('/api/v1/user/form5', /*[authJwt.verifyToken],*/ auth.getAllForm5);
    app.get('/api/v1/user/form5/:form5Id', /*[authJwt.verifyToken],*/ auth.getForm5ById);
    app.get('/api/v1/user/form5/byForm1/:form1Id', /*[authJwt.verifyToken],*/ auth.getForm5ByForm1);
    app.get('/api/v1/user/form5/byForm2/:form2Id', /*[authJwt.verifyToken],*/ auth.getForm5ByForm2);
    app.get('/api/v1/user/form5/byForm3/:form3Id', /*[authJwt.verifyToken],*/ auth.getForm5ByForm3);
    app.get('/api/v1/user/form5/byForm4/:form4Id', /*[authJwt.verifyToken],*/ auth.getForm5ByForm4);
    app.get('/api/v1/user/form6', /*[authJwt.verifyToken],*/ auth.getAllForm6);
    app.get('/api/v1/user/form6/:form6Id', /*[authJwt.verifyToken],*/ auth.getForm6ById);
    app.get('/api/v1/user/form6/byForm1/:form1Id', /*[authJwt.verifyToken],*/ auth.getForm6ByForm1);
    app.get('/api/v1/user/form6/byForm2/:form2Id', /*[authJwt.verifyToken],*/ auth.getForm6ByForm2);
    app.get('/api/v1/user/form6/byForm3/:form3Id', /*[authJwt.verifyToken],*/ auth.getForm6ByForm3);
    app.get('/api/v1/user/form6/byForm4/:form4Id', /*[authJwt.verifyToken],*/ auth.getForm6ByForm4);
    app.get('/api/v1/user/form6/byForm5/:form5Id', /*[authJwt.verifyToken],*/ auth.getForm6ByForm5);
    app.get('/api/v1/user/form7', /*[authJwt.verifyToken],*/ auth.getAllForm7);
    app.get('/api/v1/user/form7/:form7Id', /*[authJwt.verifyToken],*/ auth.getForm7ById);
    app.get('/api/v1/user/form7/byForm1/:form1Id', /*[authJwt.verifyToken],*/ auth.getForm7ByForm1);
    app.get('/api/v1/user/form7/byForm2/:form2Id', /*[authJwt.verifyToken],*/ auth.getForm7ByForm2);
    app.get('/api/v1/user/form7/byForm3/:form3Id', /*[authJwt.verifyToken],*/ auth.getForm7ByForm3);
    app.get('/api/v1/user/form7/byForm4/:form4Id', /*[authJwt.verifyToken],*/ auth.getForm7ByForm4);
    app.get('/api/v1/user/form7/byForm5/:form5Id', /*[authJwt.verifyToken],*/ auth.getForm7ByForm5);
    app.get('/api/v1/user/form7/byForm6/:form6Id', /*[authJwt.verifyToken],*/ auth.getForm7ByForm6);
    app.post('/api/v1/user/form8/create', /*[authJwt.verifyToken],*/ form4Image.single('image'), auth.createForm8);
    app.get('/api/v1/user/form8', /*[authJwt.verifyToken],*/ auth.getAllForm8);
    app.get('/api/v1/user/form8/:form8Id', /*[authJwt.verifyToken],*/ auth.getForm8ById);
    app.get('/api/v1/user/form8/byForm1/:form1Id', /*[authJwt.verifyToken],*/ auth.getForm8ByForm1);
    app.get('/api/v1/user/form8/byForm2/:form2Id', /*[authJwt.verifyToken],*/ auth.getForm8ByForm2);
    app.get('/api/v1/user/form8/byForm3/:form3Id', /*[authJwt.verifyToken],*/ auth.getForm8ByForm3);
    app.get('/api/v1/user/form8/byForm4/:form4Id', /*[authJwt.verifyToken],*/ auth.getForm8ByForm4);
    app.get('/api/v1/user/form8/byForm5/:form5Id', /*[authJwt.verifyToken],*/ auth.getForm8ByForm5);
    app.get('/api/v1/user/form8/byForm6/:form6Id', /*[authJwt.verifyToken],*/ auth.getForm8ByForm6);
    app.get('/api/v1/user/form8/byForm7/:form7Id', /*[authJwt.verifyToken],*/ auth.getForm8ByForm7);
    app.put('/api/v1/user/form8/:form8Id', /*[authJwt.verifyToken],*/ form4Image.single('image'), auth.updateForm8);
    app.delete('/api/v1/user/form8/:form8Id', /*[authJwt.verifyToken],*/ auth.deleteForm8);
    app.get('/api/v1/user/banner', /*[authJwt.verifyToken],*/ auth.getAllBanners);
    app.get('/api/v1/user/banner/:id', /*[authJwt.verifyToken],*/ auth.getBannerById);
    app.post('/api/v1/user/banner/:id/change-request', /*[authJwt.verifyToken],*/ auth.createChangeRequest);
    app.post('/api/v1/user/template/create', /*[authJwt.verifyToken],*/ templateImage.single('image'), auth.createTemplate);
    app.get('/api/v1/user/template', /*[authJwt.verifyToken],*/ auth.getAllTemplate);
    app.get('/api/v1/user/template/:id', /*[authJwt.verifyToken],*/ auth.getTemplateById);
    app.put('/api/v1/user/template/:id', /*[authJwt.verifyToken],*/ templateImage.single('image'), auth.updateTemplate);
    app.delete('/api/v1/user/template/:id', /*[authJwt.verifyToken],*/ auth.deleteTemplate);
    app.post('/api/v1/user/sureveyforms/create', /*[authJwt.verifyToken],*/ auth.createSurveyForms);
    app.get('/api/v1/user/sureveyforms', /*[authJwt.verifyToken],*/ auth.getAllSurveyForms);
    app.get('/api/v1/user/sureveyforms/:id', /*[authJwt.verifyToken],*/ auth.getSurveyFormsById);
    app.put('/api/v1/user/sureveyforms/:id', /*[authJwt.verifyToken],*/ auth.updateSurveyForms);
    app.delete('/api/v1/user/sureveyforms/:id', /*[authJwt.verifyToken],*/ auth.deleteSurveyForms);
    app.post('/api/v1/user/member/create', /*[authJwt.verifyToken],*/ memberImage.single('image'), auth.createMember);
    app.get('/api/v1/user/member', /*[authJwt.verifyToken],*/ auth.getAllMembers);
    app.get('/api/v1/user/member/:id', /*[authJwt.verifyToken],*/ auth.getMemberById);
    app.put('/api/v1/user/member/:id', /*[authJwt.verifyToken],*/ memberImage.single('image'), auth.updateMember);
    app.delete('/api/v1/user/member/:id', /*[authJwt.verifyToken],*/ auth.deleteMember);

}