const cron = require('node-cron');
const moment = require('moment-timezone');
const itsStart = require('./its-start');
const itsEnd = require('./its-end');

// Функция для генерации случайного отклонения в минутах (от -2 до +2 минут)
function getRandomOffset() {
    return Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
}

// Функция для запуска задачи с учетом случайного отклонения
function scheduleWithRandomOffset(cronTime, task) {
    const offset = getRandomOffset();
    const scheduledTime = moment().tz('Europe/Moscow').startOf('day').add(cronTime);
    scheduledTime.add(offset, 'minutes');

    // Если время уже прошло сегодня, планируем на следующий день
    if (scheduledTime.isBefore(moment().tz('Europe/Moscow'))) {
        scheduledTime.add(1, 'day');
    }

    const timeout = scheduledTime.diff(moment().tz('Europe/Moscow'));
    setTimeout(() => {
        task();
        // Планируем регулярное выполнение после первого запуска
        cron.schedule(getCronExpression(cronTime), task);
    }, timeout);
}

// Преобразование времени в cron-выражение (только рабочие дни)
function getCronExpression(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return `${minutes} ${hours} * * 1-5`; // Пн-Пт
}

// Планирование itsStart на 9:00 с отклонением
scheduleWithRandomOffset('09:00', itsStart);

// Планирование itsEnd на 18:00 с отклонением
scheduleWithRandomOffset('18:00', itsEnd);

console.log('Задачи запланированы (Московское время)');
