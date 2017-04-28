import TelegramBot from 'node-telegram-bot-api'

const bot = new TelegramBot(process.env.MMCS_TELEGRAM_TOKEN, {polling: true})

bot.onText(/chat id/, msg => bot.sendMessage(msg.chat.id, msg.chat.id))

bot.onText(/status/, msg => bot.sendMessage(msg.chat.id, 'I\'m fine, thank you'))

export default bot
