interface WhatsAppMediaMessage {
  type: "image";
  image: {
    link: string;
    caption?: string;
  };
}

interface WhatsAppTextMessage {
  type: "text";
  text: {
    body: string;
  };
}

type WhatsAppMessage = WhatsAppMediaMessage | WhatsAppTextMessage;

export async function sendToWhatsAppWithMedia(
  textMessage: string,
  imageUrls: string[] = [],
  recipientPhone: string = process.env.WHATSAPP_RECIPIENT_PHONE || ""
) {
  // If no WhatsApp Business API token, fall back to regular WhatsApp
  if (!process.env.WHATSAPP_BUSINESS_TOKEN) {
    return sendToWhatsAppWeb(textMessage, imageUrls);
  }

  try {
    const messages: WhatsAppMessage[] = [];

    // Add text message
    messages.push({
      type: "text",
      text: {
        body: textMessage,
      },
    });

    // Add image messages
    imageUrls.forEach((imageUrl, index) => {
      messages.push({
        type: "image",
        image: {
          link: imageUrl,
          caption: `Design File ${index + 1}`,
        },
      });
    });

    // Send messages via WhatsApp Business API
    for (const message of messages) {
      await fetch(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_BUSINESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: recipientPhone,
            ...message,
          }),
        }
      );
    }

    return { success: true, method: "business_api" };
  } catch (error) {
    console.error("WhatsApp Business API failed, falling back to web:", error);
    return sendToWhatsAppWeb(textMessage, imageUrls);
  }
}

// Fallback to regular WhatsApp Web with clickable links
export function sendToWhatsAppWeb(message: string, imageUrls: string[] = []) {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  let enhancedMessage = message;

  if (imageUrls.length > 0) {
    enhancedMessage += "\n\n📸 Design Files (click to view):\n";
    imageUrls.forEach((url, index) => {
      enhancedMessage += `${index + 1}. ${baseUrl}${url}\n`;
    });
  }

  const encodedMessage = encodeURIComponent(enhancedMessage);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

  if (typeof window !== "undefined") {
    window.open(whatsappUrl, "_blank");
  }

  return { success: true, method: "web", url: whatsappUrl };
}

// Enhanced function that tries Business API first, then falls back to web
export async function sendToWhatsApp(
  message: string,
  imageUrls: string[] = []
) {
  return sendToWhatsAppWithMedia(message, imageUrls);
}
