// Sons do sistema
const NOTIFICATION_SOUND = new Audio('/sounds/notification.mp3');
const MESSAGE_RECEIVED_SOUND = new Audio('/sounds/message-received.mp3');
const MESSAGE_SENT_SOUND = new Audio('/sounds/message-sent.mp3');

// Configuração inicial dos sons
[NOTIFICATION_SOUND, MESSAGE_RECEIVED_SOUND, MESSAGE_SENT_SOUND].forEach(sound => {
  sound.preload = 'auto';
  sound.volume = 0.5;
});

export const playNotificationSound = () => {
  NOTIFICATION_SOUND.play().catch(() => {
    // Ignora erros de reprodução (comum quando o usuário ainda não interagiu com a página)
  });
};

export const playMessageReceivedSound = () => {
  MESSAGE_RECEIVED_SOUND.play().catch(() => {
    // Ignora erros de reprodução
  });
};

export const playMessageSentSound = () => {
  MESSAGE_SENT_SOUND.play().catch(() => {
    // Ignora erros de reprodução
  });
}; 