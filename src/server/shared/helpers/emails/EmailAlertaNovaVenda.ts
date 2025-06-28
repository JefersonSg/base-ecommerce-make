import { Resend } from 'resend';
import { type AddressInterface } from '../Interfaces';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function EmailAlertaNovaVenda(order: {
  name: string;
  surname: string;
  email: string;
  paymentMethod: string;
  status: string;
  total: number;
  address: AddressInterface;
  orderId: string;
}) {
  const whatsappLink = `https://api.whatsapp.com/send?phone=55${order.address.telefone}`;

  try {
    const response = await resend.emails.send({
      from: 'Loja Bless <pedidos@vistabless.com>',
      to: ['lojablessmg@gmail.com'], // ou seu e-mail de gestão de pedidos
      subject: `🛍️ Nova venda realizada: ${order.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #333;">
          <h2 style="color: #d71920;">Nova venda confirmada!</h2>
          <p>Uma nova compra foi realizada no site <a href="https://vistabless.com" target="_blank">vistabless.com</a>.</p>
          <br />
          <table cellpadding="8" cellspacing="0" style="border: 1px solid #ccc; border-radius: 4px;">
            <tr>
              <td><strong>👤 Cliente</strong></td>
              <td>${order.name} ${order.surname.slice(0, 10)}</td>
            </tr>
            <tr>
              <td><strong>📧 E-mail</strong></td>
              <td>${order.email}</td>
            </tr>
            <tr>
              <td><strong>📱 Telefone</strong></td>
              <td>
                ${order.address.telefone}
                <br />
                <a href="${whatsappLink}" target="_blank" style="display:inline-block; margin-top:5px; padding:8px 12px; background:#25D366; color:#fff; text-decoration:none; border-radius:4px;">
                  Entrar em Contato
                </a>
              </td>
            </tr>
            <tr>
              <td><strong>💳 Forma de Pagamento</strong></td>
              <td>${order.paymentMethod}</td>
            </tr>
            <tr>
              <td><strong>📦 Status do Pedido</strong></td>
              <td><strong style="color: ${order.status === 'Pago' ? '#28a745' : '#d71920'}">${order.status}</strong></td>
            </tr>
            <tr>
              <td><strong>💰 Valor Total</strong></td>
              <td>R$ ${order.total.toFixed(2).replace('.', ',')}</td>
            </tr>
            <tr>
              <td><strong>📍 Endereço de Entrega</strong></td>
              <td>CEP: ${order.address.cep} - ${order.address.cidade} - ${order.address.uf}</td>
            </tr>
          </table>
          <br />
          <a href="www.vistabless.com/dashboard/pedidos/${order.orderId}" style="display:inline-block; padding:10px 20px; background:#d71920; color:#fff; border-radius:5px; text-decoration:none; font-weight:bold;">
          Ver o pedido na loja
          </a>
          <br />
          <p style="font-size: 14px; color: #777;">Este é um aviso automático da Loja Bless.</p>
        </div>
      `
    });

    console.log('E-mail de alerta de venda enviado com sucesso:', response);
    return response;
  } catch (error) {
    console.error('Erro ao enviar alerta de venda:', error);
    throw error;
  }
}
