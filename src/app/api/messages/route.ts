// src/pages/api/someApiRoute.ts
import { withErrorHandler } from '@/app/middlewares/errorHandler';
import { getTextMessageInput, sendMessage } from '@/app/utility/messages';
import { NextRequest, NextResponse } from 'next/server';

export const POST = withErrorHandler(async (req: NextRequest): Promise<NextResponse> => {
  const body = await req.json()
  console.log("Body received", body);
  if (!body)
    throw new Error("No data received")

  // Here we received the body.data which contains the message to be posted on sendMessage
  // This body.data should be passed to the chatbot and response is generated based upon user message provided


  //Now pass the data to sendMessage function
  const responseGen: string = body.data;
  const responseToSend = getTextMessageInput(process.env.RECIPIENT_WAID!, responseGen)
  sendMessage(responseToSend).catch(err => { throw new Error(`Error in sending Message: ${err}`) })

  return NextResponse.json({ message: 'Success' });
});

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    let resData = {
      status: false,
      message: ''
    }
    resData.status = true;
    resData.message = "This Api is working..."
    return Response.json({ status: 200, message: resData });
  } catch (error) {
    console.error(error)
    return Response.json({ status: 500, message: "Internal Server Error" });
  }
}



