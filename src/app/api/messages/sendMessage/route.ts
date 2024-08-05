import { NextRequest, NextResponse } from "next/server";
import { request } from "node:https";

export const GET = async (req: Request, res: Response) => {
    try {
        let resData = {
            status: false,
            message: ''
        }
        try {
            const url = 'https://graph.facebook.com/v20.0/355196641019338/messages';
            const headers = {
                'Authorization': process.env.SECRET_KEY!,
                'Content-Type': 'application/json'
            };

            const dynamicContent = "Hey buddy, Sup!...";

            const body = JSON.stringify({
                messaging_product: 'whatsapp',
                to: process.env.TO!,
                type: 'template',
                template: {
                    name: 'emr',
                    language: {
                        code: 'en'
                    },
                    components: [
                        {
                            type: 'body',
                            parameters: [
                                {
                                    type: 'text',
                                    text: dynamicContent
                                }
                            ]
                        },
                    ]
                }
            });

            console.log(body);
            

            const response = await fetch(url, {
                method: 'POST',
                headers: headers as HeadersInit,
                body: body
            });

            const responseBody = await response.json();
            resData.status = true;
            resData.message = responseBody;
            return Response.json(resData);

        } catch (e) {
            resData.status = false;
            resData.message = "e";
            return Response.json(resData);
        }
    } catch (error) {

    }
}