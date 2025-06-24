import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function EmailBoasVindas({
  to,
  name
}: {
  to: string;
  name: string;
}) {
  try {
    const response = await resend.emails.send({
      from: 'Loja Bless <contato@vistabless.com>',
      to: [to],
      subject: 'Seja bem-vinda à Loja Bless!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #d71920;">Olá, ${name}!</h2>
          <p>Estamos muito felizes em ter você com a gente 💖</p>
          <p>A <strong>Loja Bless</strong> é o seu novo destino de estilo, bom gosto e elegância. A partir de agora, você receberá em primeira mão nossas novidades, promoções e tendências.</p>
          <p>Explore agora mesmo nossos lançamentos e se apaixone!</p>
          <a href="https://vistabless.com" style="display:inline-block; padding:10px 20px; background:#d71920; color:#fff; border-radius:5px; text-decoration:none; font-weight:bold;">
            Ir para a Loja
          </a>
          <p style="margin-top: 20px;">Com carinho,<br>A equipe Bless 💫</p>
        </div>
      `
    });

    console.log('E-mail enviado com sucesso:', response);
    return response;
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
    throw error;
  }
}
