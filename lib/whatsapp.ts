export function sendToWhatsApp(message: string) {
  // Format the message for WhatsApp
  const encodedMessage = encodeURIComponent(message)

  // Updated WhatsApp number
  const phoneNumber = "94760484612" 
  // International format for UK number 07604848612

  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

  // Open WhatsApp in a new tab
  window.open(whatsappUrl, "_blank")
}
