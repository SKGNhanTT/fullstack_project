require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // async..await is not allowed in global scope, must use a wrapper

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: 'Thông tin đặt lịch khám bệnh', // Subject line
        html: getBodyHTMLEmail(dataSend),
    });
};

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Cảm ơn bạn đã đặt lịch khám bệnh online</p>
        <p>Thông tin đặt lịch khám bệnh</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Please click this link to accept booking. <a href=${dataSend.redirectLink}>Click here</a></p>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
        `;
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>Thank you for booking your medical examination appointment online</p>
        <p>Information on scheduling medical examinations</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <p>Please click this link to accept booking. <a href=${dataSend.redirectLink}>Click here</a></p>
        <p>Thank you for using our service</p>
        `;
    }
    return result;
};

let sendAttachments = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // async..await is not allowed in global scope, must use a wrapper

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: 'Kết quả đặt lịch khám bệnh', // Subject line
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: {
            filename: `remedy-${
                dataSend.patientId
            }-${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split('base64')[1],
            encoding: 'base64',
        },
    });
};

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Cảm ơn bạn đã tham gia khám bệnh online</p>
        <p>Thông tin đơn thuốc được gửi trong đính kèm</p>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</p>
        `;
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>Thank you for booking your medical examination appointment online</p>
        <p>Information on scheduling medical examinations</p>
        
        <p>Thank you for using our service</p>
        `;
    }
    return result;
};

module.exports = {
    sendSimpleEmail,
    sendAttachments,
};
