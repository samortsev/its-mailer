const cron = require('node-cron');
const nodemailer = require('nodemailer');
const timezone = 'Europe/Moscow';

const startSubject = 'Начало работы';
const startText = 'Начал работу в ';
const startHtml = 'Начал работу в ';

const endSubject = 'Завершение работы';
const endText = 'Работать закончил в ';
const endHtml = 'Работать закончил в ';

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
            pass: 'Ipad1976!!z',
        },
    });

    const mailOptions = {
        from: '"Дмитрий Саморцев" <samortsevdb@itsai.ru>',
        to,
        bcc: 'samortsev@gmail.com',
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
        const cd = new Date();
        const subject =
            startSubject +
            ` ${String(cd.getDate()).padStart(2, '0')}.${String(cd.getMonth() + 1).padStart(2, '0')}.${cd.getFullYear()}`;
        await sendMail(
            ['tkachenkoei@itsai.ru', 'kurochkinal@itsai.ru'],
            subject,
            startText +
                `${String(cd.getHours()).padStart(2, '0')}:${String(cd.getMinutes()).padStart(2, '0')}`,
            startHtml +
                `${String(cd.getHours()).padStart(2, '0')}:${String(cd.getMinutes()).padStart(2, '0')}`
        );
    },
    {
        timezone,
    }
);
cron.schedule(
    getCronExpression('18:00'),
    async () => {
        const cd = new Date();
        const subject =
            endSubject +
            ` ${String(cd.getDate()).padStart(2, '0')}.${String(cd.getMonth() + 1).padStart(2, '0')}.${cd.getFullYear()}`;
        await sendMail(
            ['tkachenkoei@itsai.ru', 'kurochkinal@itsai.ru'],
            subject,
            endText +
                `${String(cd.getHours()).padStart(2, '0')}:${String(cd.getMinutes()).padStart(2, '0')}`,
            endHtml +
                `${String(cd.getHours()).padStart(2, '0')}:${String(cd.getMinutes()).padStart(2, '0')}`
        );
    },
    {
        timezone,
    }
);

console.log('Задачи запланированы (Московское время)');
