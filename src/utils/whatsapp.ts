/**
 * Sanitizes phone numbers and generates direct WhatsApp API links.
 */
export function getWhatsAppApiUrl(
  phone: string,
  message: string = 'Olá! Estou entrando em contato através do Qindica.'
): string {
  if (!phone) return '';
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '');
  if (!digits) return '';

  // If number has 10 or 11 digits (Brazilian DDD + number), prepend country code 55
  if (digits.length === 10 || digits.length === 11) {
    digits = `55${digits}`;
  }

  const encodedMsg = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodedMsg}`;
}
