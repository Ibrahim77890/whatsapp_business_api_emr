import { withErrorHandler } from "@/app/middlewares/errorHandler";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const token = process.env.TOKEN!;
const myToken = process.env.MYTOKEN;

export const GET = withErrorHandler(async (req: NextRequest): Promise<NextResponse> => {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const challenge = parseInt(url.searchParams.get("hub.challenge") as string, 10)
    const verifyToken = url.searchParams.get("hub.verify_token");

    if (mode && verifyToken) {
        if (mode === "subscribe" && verifyToken === myToken) {
            return NextResponse.json(challenge);
        } else {
            return NextResponse.json({ status: 403 });
        }
    }

    return NextResponse.json({ status: 400, message: "Bad Request" });
});

export const POST = withErrorHandler(async (req: NextRequest): Promise<NextResponse> => {
    const body_params = await req.json();

    console.log(JSON.stringify(body_params, null, 2));

    if (body_params.object && body_params.entry && body_params.entry[0].changes[0].value.message && body_params.entry[0].changes[0].value.message[0]) {
        const phone_no_id = body_params.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body_params.entry[0].changes[0].value.messages[0].from;
        const msg_body = body_params.entry[0].changes[0].value.messages[0].text.body;

        // At this point we have to deal with the LLM based configuration logic
        // Either msg_body can simply be a simple prompt or either it can be paricular business template prompt

        //After processing in here, we have to send response message to the user
        const response = msg_body

        try {
            await axios({
                method: 'POST',
                url: `https://graph.facebook.com/v13.0/${phone_no_id}/message?access_token=${token}`,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: response
                    }
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return NextResponse.json({ status: 200 });
        } catch (error) {
            console.error('Error sending message:', error);
            return NextResponse.json({ status: 500, message: "Internal Server Error" });
        }
    } else {
        return NextResponse.json({ status: 404, message: "Not Found" });
    }
});
