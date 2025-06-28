// sendOrderConfirmationToClient.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface Product {
  name: string;
  size: string;
  color: string;
  imageUrl: string;
}

export async function confirmarCompraCliente(order: {
  clientName: string;
  clientEmail: string;
  paymentStatus: 'Pago' | 'Pendente';
  total: number;
  paymentLink?: string;
  products: Product[];
}) {
  const whatsappLink = `https://wa.me/5532984920918?text=Olá, realizei uma compra agora, mas preciso de suporte.`;

  const productListHtml = order.products
    .map(
      (product) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px;">
            <img src="${product.imageUrl}" alt="${product.name}" width="80" style="border-radius: 8px;" />
          </td>
          <td style="padding: 10px;">
            <strong>${product.name}</strong><br/>
            Tamanho: ${product.size}<br/>
            Cor: ${product.color}
          </td>
        </tr>
      `
    )
    .join('');

  const paymentSection =
    order.paymentStatus === 'Pago'
      ? `<p style="color: #28a745;"><strong>Pagamento confirmado!</strong> Seu pedido está sendo preparado com muito carinho 💝</p>`
      : `
        <p style="color: #d71920;"><strong>O pagamento ainda não foi confirmado.</strong></p>
        <a href="${order.paymentLink}" target="_blank" style="display:inline-block; margin-top:10px; padding:10px 16px; background:#d71920; color:#fff; text-decoration:none; border-radius:6px;">
          🔗 Clique aqui para pagar agora
        </a>
      `;

  try {
    const response = await resend.emails.send({
      from: 'Loja Bless <pedidos@vistabless.com>',
      to: [order.clientEmail],
      subject: `🛍️ Pedido confirmado na Loja Bless!`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <div style="background-color: #d71920; padding: 20px; color: white; text-align: center;">
              <h1 style="margin: 0;">Loja Bless</h1>
              <p style="margin: 0;">Moda Feminina com Estilo</p>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #333;">Olá, ${order.clientName}!</h2>
              <p>Seu pedido foi realizado com sucesso 🎉</p>
              <p>Nossa equipe já está separando os produtos com muito cuidado para você!</p>

              <h3 style="margin-top: 30px; color: #d71920;">🧾 Detalhes do Pedido</h3>
              <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 10px;">
                ${productListHtml}
              </table>

              <p style="margin-top: 20px;"><strong>Valor Total:</strong> R$ ${order.total.toFixed(2).replace('.', ',')}</p>

              ${paymentSection}

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;"/>

              <p style="text-align: center; margin-top: 20px;">📞 Precisa de ajuda?</p>
              <a href="${whatsappLink}" target="_blank" style="display: inline-block; background-color: #25D366; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Falar com o Suporte via WhatsApp
              </a>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
              © ${new Date().getFullYear()} Loja Bless — Todos os direitos reservados.<br/>
              Site oficial: <a href="https://vistabless.com" style="color: #d71920; text-decoration: none;">vistabless.com</a>
            </div>
          </div>
        </div>
      `
    });

    console.log('E-mail de confirmação enviado com sucesso:', response);
    return response;
  } catch (error) {
    console.error('Erro ao enviar e-mail de confirmação:', error);
    throw error;
  }
}
