import { create } from 'zustand';

interface VoiceState {
  isSpeaking: boolean;
  isListening: boolean;
  speak: (text: string, voiceType?: string, onEndCallback?: () => void) => void;
  setListening: (listening: boolean) => void;
  stopSpeaking: () => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isSpeaking: false,
  isListening: false,

  setListening: (listening) => set({ isListening: listening }),

  stopSpeaking: () => {
    window.speechSynthesis.cancel();
    set({ isSpeaking: false });
  },

  speak: (text, voiceType = 'marcus', onEndCallback) => {
    // 1. Cancelar cualquier audio anterior
    window.speechSynthesis.cancel();
    set({ isSpeaking: true });

    // 2. Crear la locución
    const utterance = new SpeechSynthesisUtterance(text);

    // 3. FORZAR MODO "MARCUS" PARA TODOS LOS AGENTES (Por ahora)
    // Tono más grave (0.8) y un poco más pausado (0.95)
    utterance.pitch = 0.8;
    utterance.rate = 0.95;

    // 4. Asegurar que hable en Español
    const voices = window.speechSynthesis.getVoices();
    // Busca la primera voz en español disponible en tu sistema operativo
    const spanishVoice = voices.find(v => v.lang.includes('es-ES') || v.lang.includes('es-MX') || v.lang.includes('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    // 5. EVENTOS CRÍTICOS (Aquí es donde se dispara el micrófono después de hablar)
    utterance.onend = () => {
      set({ isSpeaking: false });
      if (onEndCallback) onEndCallback(); // Llama a la siguiente acción (ej: encender micro)
    };

    utterance.onerror = (event) => {
      // Ignorar errores de interrupción esperados durante re-renders o saltos de página
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error("Error en Web Speech API:", event);
      }
      set({ isSpeaking: false });
      // Si por alguna razón falla, no bloqueamos la app, igual ejecutamos el callback
      if (onEndCallback) onEndCallback();
    };

    // 6. ¡Hablar!
    window.speechSynthesis.speak(utterance);
  }
}));
