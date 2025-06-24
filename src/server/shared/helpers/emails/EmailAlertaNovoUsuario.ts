// sendNewUserAlertEmail.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function EmailAlertaNovoUsuario({
  userName,
  userEmail
}: {
  userName: string;
  userEmail: string;
}) {
  try {
    const response = await resend.emails.send({
      from: 'Loja Bless <notificacoes@vistabless.com>',
      to: ['lojablessmg@gmail.com'], // E-mail do dono/responsável pelo site
      subject: `🚨 Novo usuário cadastrado: ${userName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #333;">
          <h2 style="color: #d71920;">Novo cadastro no site!</h2>
          <p>Uma nova pessoa se registrou em <a href="https://vistabless.com" target="_blank">vistabless.com</a>.</p>
          <br />
          <table cellpadding="8" cellspacing="0" style="border: 1px solid #ccc; border-radius: 4px;">
            <tr>
              <td><strong>👤 Nome</strong></td>
              <td>${userName}</td>
            </tr>
            <tr>
              <td><strong>📧 E-mail</strong></td>
              <td>${userEmail}</td>
            </tr>
          </table>
          <br />
          <p style="font-size: 14px; color: #777;">Este e-mail é gerado automaticamente pela plataforma da Loja Bless.</p>
        </div>
      `
    });

    console.log('Alerta de novo usuário enviado com sucesso:', response);
    return response;
  } catch (error) {
    console.error('Erro ao enviar alerta de novo usuário:', error);
    throw error;
  }
}
