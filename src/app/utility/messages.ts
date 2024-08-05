import axios, { AxiosRequestConfig } from 'axios';

// Define the structure of the message data
interface MessageData {
  messaging_product: string;
  preview_url: boolean;
  recipient_type: string;
  to: string;
  type: string;
  text: {
    body: string;
  };
}

// Define the function for sending a message
export async function sendMessage(data: MessageData): Promise<any> {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    headers: {
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };

  try {
    return await axios(config);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Define the function for getting text message input
export function getTextMessageInput(recipient: string, text: string): MessageData {
  return {
    messaging_product: "whatsapp",
    preview_url: false,
    recipient_type: "individual",
    to: recipient,
    type: "text",
    text: {
      body: text,
    },
  };
}
