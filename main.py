import os
import django
from aiogram import Bot, Dispatcher, types
from aiogram.types import ParseMode
from aiogram.utils import executor
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext

from states import ContactForm

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from main.models import Message

bot = Bot(token="7568681687:AAGC5n3li7vEoHPt5QWv9fowWvn5U7MIkuE")
dp = Dispatcher(bot, storage=MemoryStorage())

@dp.message_handler(commands=['start'])
async def start_command(message: types.Message):
    await message.reply(
        "👋 Salom! Bu bot orqali biz bilan bog‘lanishingiz mumkin.\n\n"
        "➡️ Aloqa uchun /contact buyrug‘idan foydalaning.\n"
        "ℹ️ Yordam uchun /help buyrug‘ini bosing."
    )

@dp.message_handler(commands=['help'])
async def help_command(message: types.Message):
    await message.reply(
        "📌 Botdan foydalanish bo‘yicha ko‘rsatmalar:\n\n"
        "/start - Botni boshlash\n"
        "/contact - Biz bilan bog‘lanish uchun forma\n"
        "/help - Yordam"
    )

@dp.message_handler(commands=['contact'])
async def contact_start(message: types.Message):
    await message.reply("Ismingizni yozing:")
    await ContactForm.name.set()

@dp.message_handler(state=ContactForm.name)
async def get_name(message: types.Message, state: FSMContext):
    await state.update_data(name=message.text)
    await message.reply("Emailingizni yozing:")
    await ContactForm.email.set()

@dp.message_handler(state=ContactForm.email)
async def get_email(message: types.Message, state: FSMContext):
    await state.update_data(email=message.text)
    await message.reply("Xabar mavzusini yozing:")
    await ContactForm.subject.set()

@dp.message_handler(state=ContactForm.subject)
async def get_subject(message: types.Message, state: FSMContext):
    await state.update_data(subject=message.text)
    await message.reply("Xabaringizni yozing:")
    await ContactForm.message.set()

@dp.message_handler(state=ContactForm.message)
async def get_message(message: types.Message, state: FSMContext):
    await state.update_data(message_text=message.text)
    data = await state.get_data()

    from asgiref.sync import sync_to_async
    await sync_to_async(Message.objects.create)(
        name=data['name'],
        email=data['email'],
        subject=data['subject'],
        message=data['message_text']
    )

    ADMIN_CHAT_ID = 7353213881
    await bot.send_message(
        ADMIN_CHAT_ID,
        f"📥 <b>Yangi xabar:</b>\n"
        f"👤 {data['name']} ({data['email']})\n"
        f"📌 {data['subject']}\n"
        f"💬 {data['message_text']}",
        parse_mode=ParseMode.HTML
    )

    await message.reply("✅ Xabaringiz qabul qilindi! Tez orada siz bilan bog‘lanamiz.")
    await state.finish()


if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
