const nodemailer = require('nodemailer');

async function sendYandexMail() {
    const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
            user: 'samortsevdb@itsai.ru',
            pass: 'Ipad1234',
        },
    });

    const mailOptions = {
        from: '"Дмитрий Саморцев" <samortsevdb@itsai.ru>',
        to: 'samortsev@gmail.com',
        subject: 'Конец смены',
        text: `Работать закончил

--
С уважением, Дмитрий Саморцев`,
        html: `Работать закончил<br>
<br>
--<br>
С уважением, Дмитрий Саморцев`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Письмо отправлено: %s - %s', info.messageId, new Date().toISOString());
    } catch (error) {
        console.error('Ошибка при отправке письма:', error, new Date().toISOString());
    }
}

sendYandexMail().catch(console.error);
