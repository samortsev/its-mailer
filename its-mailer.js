const cron = require('node-cron');
const nodemailer = require('nodemailer');
const timezone = 'Europe/Moscow';
const startSubject = 'Начало смены';
const startText = `К работе приступил

--
С уважением, Дмитрий Саморцев`;
const startHtml = `К работе приступил<br>
<br>
--<br>
С уважением, Дмитрий Саморцев`;
const endSubject = 'Конец смены';
const endText = `Работать закончил

--
С уважением, Дмитрий Саморцев`;
const endHtml = `Работать закончил<br>
<br>
--<br>
С уважением, Дмитрий Саморцев`;

function getCronExpression(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return `${minutes} ${hours} * * 2-5`;
}

function randomDelay() {
    return new Promise(resolve => {
        const delay = Math.floor(Math.random() * 3 * 60 * 1000);
        setTimeout(resolve, delay);
    });
}

async function sendMail(to, subject, text, html) {
    await randomDelay();

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
        to,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Письмо отправлено: %s - %s', info.messageId, new Date().toISOString());
    } catch (error) {
        console.error('Ошибка при отправке письма:', error, new Date().toISOString());
    }
}

cron.schedule(
    getCronExpression('09:00'),
    async () => {
        await sendMail('samortsev@gmail.com', startSubject, startText, startHtml);
    },
    {
        timezone,
    }
);
cron.schedule(
    getCronExpression('18:00'),
    async () => {
        await sendMail('samortsev@gmail.com', endSubject, endText, endHtml);
    },
    {
        timezone,
    }
);

console.log('Задачи запланированы (Московское время)');
