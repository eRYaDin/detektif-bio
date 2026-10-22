/* Audio orisinal disintesis lokal. Tidak mengunduh musik atau rekaman pihak lain. */
window.AudioBio = (() => {
  let ctx, bus, enabled = false, timer, tick = 0;
  function tone(freq, duration = .12, type = 'sine', volume = .12, delay = 0) {
    if (!enabled || !ctx) return;
    const osc = ctx.createOscillator(), amp = ctx.createGain(), t = ctx.currentTime + delay;
    osc.type = type; osc.frequency.setValueAtTime(freq, t);
    amp.gain.setValueAtTime(0, t); amp.gain.linearRampToValueAtTime(volume, t + .015);
    amp.gain.exponentialRampToValueAtTime(.0001, t + duration);
    osc.connect(amp); amp.connect(bus); osc.start(t); osc.stop(t + duration + .02);
  }
  async function toggle(force) {
    enabled = typeof force === 'boolean' ? force : !enabled;
    if (enabled) {
      ctx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (!bus) { bus = ctx.createGain(); bus.gain.value = .28; bus.connect(ctx.destination); }
      await ctx.resume();
      if (!timer) timer = setInterval(() => {
        const melody = [392,0,493.88,587.33,0,493.88,440,0,329.63,0,392,493.88,440,0,392,0,349.23,0,440,523.25,0,440,392,0,293.66,0,349.23,440,392,0,329.63,0];
        const f = melody[tick % melody.length];
        if (f) tone(f, 1.1, 'sine', .075);
        if (tick % 8 === 0) tone([196,164.81,174.61,146.83][Math.floor(tick / 8) % 4], 3.2, 'triangle', .055);
        tick++;
      }, 340);
    } else { clearInterval(timer); timer = null; if (ctx) await ctx.suspend(); }
    return enabled;
  }
  return {toggle, get enabled() {return enabled;},
    click: () => tone(520,.08,'triangle',.09),
    step: () => tone(130 + Math.random()*25,.045,'triangle',.02),
    success: () => [523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,.5,'triangle',.17,i*.1)),
    think: () => {tone(349,.18,'sine',.1);tone(293,.3,'sine',.09,.14);},
    ping: (f=120) => {tone(f,.9,'sine',.2);tone(f*2,.65,'sine',.045,.1);}
  };
})();
