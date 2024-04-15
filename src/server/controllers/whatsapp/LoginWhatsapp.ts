import { Request, Response } from 'express';
import qrcode from 'qrcode-terminal';

import { Client, LocalAuth, NoAuth, Message }   from 'whatsapp-web.js';

export const LoginWhatsApp = async (req : Request, res: Response)=>{

try {
    const client = await new Client({
        authStrategy: new NoAuth()
    });
    
        await client.on('qr', (qr: any) => {
            qrcode.generate(qr, {small: true});
        });
        
    await client.once('ready', () => {
            console.log('Client is ready!');
        });
    
    await client.on('message_create', async (message: Message) => {
            console.log(message.body)
        });
        
    
     await client.initialize();

     return res.status(200).json({
        message: 'tudo certo nengue'
     })
} catch (error) {
    console.log(error)
}
}