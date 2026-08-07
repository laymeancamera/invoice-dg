import { Invoice, StudioProfile } from '../types';

export function formatTelegramInvoiceMessage(invoice: Invoice, studio: StudioProfile): string {
  const khrTotal = (invoice.total * studio.exchangeRateKHR).toLocaleString('km-KH');
  const khrPaid = (invoice.paidAmount * studio.exchangeRateKHR).toLocaleString('km-KH');
  const khrBalance = (invoice.balanceDue * studio.exchangeRateKHR).toLocaleString('km-KH');

  const statusEmoji =
    invoice.status === 'paid'
      ? '✅ [បានទូទាត់រួច ១០០%]'
      : invoice.status === 'deposit'
      ? '🟡 [បានកក់ប្រាក់រួច]'
      : '🔴 [មិនទាន់ទូទាត់]';

  let msg = `📸 *${studio.khmerName.toUpperCase()} - វិក្កយបត្រ* 📸\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🧾 *លេខវិក្កយបត្រ:* \`${invoice.invoiceNumber}\`\n`;
  msg += `👤 *ឈ្មោះអតិថិជន:* ${invoice.customerName}\n`;
  msg += `📞 *លេខទូរស័ព្ទ:* ${invoice.customerPhone}\n`;
  if (invoice.weddingDate) {
    msg += `💒 *ថ្ងៃរៀបមង្គលការ/កម្មវិធី:* ${invoice.weddingDate}\n`;
  }
  if (invoice.eventLocation) {
    msg += `📍 *ទីតាំង:* ${invoice.eventLocation}\n`;
  }
  msg += `📦 *កញ្ចប់ថត:* ${invoice.packageName}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *តម្លៃសរុប (Total):* $${invoice.total.toLocaleString()} (${khrTotal} ៛)\n`;
  msg += `💵 *បានកក់ (Deposit):* $${invoice.paidAmount.toLocaleString()} (${khrPaid} ៛)\n`;
  msg += `🔴 *នៅខ្វះ (Balance Due):* $${invoice.balanceDue.toLocaleString()} (${khrBalance} ៛)\n`;
  msg += `📌 *ស្ថានភាព:* ${statusEmoji}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  if (studio.bankName && studio.bankAccountNumber) {
    msg += `💳 *គណនីទូទាត់ (KHQR/Bank):*\n`;
    msg += `• ${studio.bankName}: \`${studio.bankAccountNumber}\` (${studio.bankAccountName})\n`;
  }
  msg += `📞 *ទំនាក់ទំនង Studio:* ${studio.phone} | Telegram: @${studio.telegramUsername || ''}\n`;
  msg += `🙏 *សូមអរគុណយ៉ាងជ្រាលជ្រៅសម្រាប់ការទុកចិត្ត!*`;

  return msg;
}

export function openTelegramShare(invoice: Invoice, studio: StudioProfile): void {
  const text = formatTelegramInvoiceMessage(invoice, studio);
  const encodedText = encodeURIComponent(text);
  const telegramUrl = `https://t.me/share/url?url=&text=${encodedText}`;
  window.open(telegramUrl, '_blank');
}

export async function copyTelegramMessage(invoice: Invoice, studio: StudioProfile): Promise<boolean> {
  const text = formatTelegramInvoiceMessage(invoice, studio);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy message', err);
    return false;
  }
}
