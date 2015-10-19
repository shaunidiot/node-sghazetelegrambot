var config = {};

config.telegramToken = process.env.TELEGRAM_TOKEN;

config.activePlugins = ["haze", "ping", "areas", "help", "subscribe", "unsubscribe"];

module.exports = config;