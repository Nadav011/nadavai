// faq.js (S11): questions answered like a chat. Without JS every question and answer is listed.
// With JS the first exchange is shown, the rest become reply chips; a chip "asks" its question, a typing
// bubble appears, then the answer. Answers stay in the log (aria-live).

export function initFaq({ gsap, reduce }) {
  const chat = document.getElementById('chat');
  const log = document.getElementById('chatLog');
  const ask = document.getElementById('chatAsk');
  const qas = [...log.querySelectorAll('.qa')];
  chat.classList.add('is-live');
  qas[0].classList.add('is-asked');

  qas.slice(1).forEach((qa) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = qa.querySelector('.msg--q').textContent;
    b.addEventListener('click', () => go(qa, b));
    ask.appendChild(b);
  });

  let busy = false;
  function go(qa, chip) {
    if (busy) return;
    busy = true;
    chip.remove();
    log.appendChild(qa);
    const q = qa.querySelector('.msg--q'), a = qa.querySelector('.msg--a');
    qa.classList.add('is-asked');
    if (reduce || !gsap) { busy = false; done(); return; }
    a.hidden = true;
    const typing = document.createElement('p');
    typing.className = 'msg msg--a msg--typing'; typing.setAttribute('aria-hidden', 'true');
    const live = document.getElementById('chatTyping'); if (live) live.textContent = __t('home.faq.typing');
    typing.innerHTML = '<i></i><i></i><i></i>';
    gsap.fromTo(q, { autoAlpha: 0, y: 10, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'expo.out', transformOrigin: '0% 100%' });
    setTimeout(() => {
      qa.appendChild(typing);
      gsap.fromTo(typing, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'expo.out' });
    }, 260);
    setTimeout(() => {
      typing.remove(); a.hidden = false; if (live) live.textContent = '';
      gsap.fromTo(a, { autoAlpha: 0, y: 10, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'expo.out', transformOrigin: '100% 100%' });
      busy = false; done();
    }, 860);
  }
  function done() {
    if (ask.querySelector('button')) { ask.querySelector('button').focus({ preventScroll: true }); return; }
    const wa = document.createElement('a');
    wa.className = 'btn btn--sm'; wa.href = document.querySelector('.faq__wa').href; wa.target = '_blank'; wa.rel = 'noopener';
    wa.textContent = __t('error.cta.whatsapp');
    ask.appendChild(wa);
  }
}
