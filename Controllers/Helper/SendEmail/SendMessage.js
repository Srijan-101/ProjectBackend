const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRIDAPI);

function Verification(email, token) {
    const Message = {
        to: email,
        from: "srijan.181743@ncit.edu.np",
        subject: "Account activation link",
        html: `<h2>please use this link to activate your account</h2>
             <h4>${process.env.CLIENT_URL}auth/verify/${token}</h4>
             <hr/>
             <p>please donot share this link to anyone</p>
            <p>${process.env.CLIENT_URL}auth/verify/${token}</p>`
    }
    return sgMail.send(Message);
}


function passwordReset(email,token) {
    const Message = {
        to: email,
        from: "srijan.181743@ncit.edu.np",
        subject: "Password activation link",
        html: `<h2>please use this link to reset your password</h2>
             <h4>${process.env.CLIENT_URL}/ResetPassword/${token}</h4>
             <hr/>
             <p>please donot share this link to anyone</p>
             <p>${process.env.CLIENT_URL}/ResetPassword/${token}</p>`
    }
    return sgMail.send(Message);
}
module.exports = { Verification , passwordReset};