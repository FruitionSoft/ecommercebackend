const admin = require('./firebase-config')


const sendNotification=(req,res)=>{
    const registrationToken = "del0VRqIRc-Qiiq66NuQnT:APA91bFMZBFlmnO4njOC11RrHDQE62Nmay1f13zZD05mEA81hICo083dmObkgJJlOwCWfajiEL5khRbPlKGqwWP5WL0ib0Frx5Q4NrEJv1_KVU9ke4Twsqk0ChBDhNaaUB0W74WJuNYk"
    const notification = {
      title: "Hello world",
      body: "message message",
      image:
        "https://images.odishatv.in/uploadimage/library/16_9/16_9_5/recent_photo_1685865610.webp",
    };

   
    let message = {
      data: { data: "hello" },
      token: registrationToken,
      notification,
    };
     admin
       .messaging()
       .send(message)
       .then((response) => {
          console.log(response)
       })
       .catch((error) => {
         console.log(error);
       });
}

module.exports = sendNotification;