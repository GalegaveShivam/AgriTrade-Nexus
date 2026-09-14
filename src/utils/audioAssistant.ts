// Audio assistance utility for playing speech and audio feedback chimes
// Uses Web Speech API with fallback tone generator via Web Audio API

class AudioAssistant {
  private isSpeaking = false;

  public playChime(type: 'success' | 'click' | 'alert' = 'click') {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.28);
      } else {
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  public speak(text: string, lang: string = 'hi-IN', onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this environment.');
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      this.playChime('click');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      // Try to find an appropriate Indian regional voice if available
      const voices = window.speechSynthesis.getVoices();
      const langPrefix = lang.split('-')[0].toLowerCase();
      const preferredVoice = voices.find(v => {
        const vLang = v.lang.toLowerCase();
        if (langPrefix === 'hi') return vLang.includes('hi') || (vLang.includes('in') && v.name.toLowerCase().includes('hindi'));
        if (langPrefix === 'mr') return vLang.includes('mr') || v.name.toLowerCase().includes('marathi');
        if (langPrefix === 'pa') return vLang.includes('pa') || v.name.toLowerCase().includes('punjabi');
        return vLang.includes('en-in') || v.name.toLowerCase().includes('india');
      }) || voices.find(v => v.lang.toLowerCase().includes(langPrefix));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      this.isSpeaking = true;

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  public stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }

  public getSpeakingState() {
    return this.isSpeaking || ('speechSynthesis' in window && window.speechSynthesis.speaking);
  }
}

export const audioAssistant = new AudioAssistant();
