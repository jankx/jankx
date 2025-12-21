type Config = {
  positionX: 'left' | 'right';
  positionY: 'bottom' | 'center';
  offsetBottom: number;
  expansionStyle: 'vertical' | 'horizontal' | 'fan' | 'split';
  idleAnimation: 'none' | 'pulse-ring' | 'wiggle' | 'float';
  spacing: number;
  messengers: { id: string; name: string; color: string; url: string }[];
};

function createMainButton(): HTMLElement {
  const btn = document.createElement('button');
  btn.className = 'jfm-main-btn';
  const icon = document.createElement('span');
  icon.className = 'jfm-main-icon';
  icon.textContent = '✉';
  btn.appendChild(icon);
  return btn;
}

function createMessengerItem(m: { id: string; name: string; color: string; url: string }, positionX: 'left' | 'right', idleAnimation: string): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'jfm-item-wrap';
  const link = document.createElement('a');
  link.className = 'jfm-item';
  link.href = m.url || '#';
  link.target = '_blank';
  link.rel = 'noopener';
  link.style.backgroundColor = m.color || '#4B5563';
  const label = document.createElement('span');
  label.className = 'jfm-item-icon';
  label.textContent = (m.name || '').charAt(0).toUpperCase();
  link.appendChild(label);
  const tip = document.createElement('div');
  tip.className = `jfm-tooltip ${positionX === 'right' ? 'jfm-tip-right' : 'jfm-tip-left'}`;
  tip.textContent = m.name || '';
  wrap.appendChild(link);
  wrap.appendChild(tip);
  if (idleAnimation === 'wiggle') wrap.classList.add('animate-wiggle');
  if (idleAnimation === 'float') wrap.classList.add('animate-float');
  if (idleAnimation === 'pulse-ring') {
    const ring = document.createElement('span');
    ring.className = 'jfm-pulse-ring animate-ping';
    ring.style.backgroundColor = m.color || '#4B5563';
    wrap.appendChild(ring);
  }
  return wrap;
}

function getItemTranslate(index: number, cfg: Config): { x: number; y: number } {
  const isRight = cfg.positionX === 'right';
  const isBottom = cfg.positionY === 'bottom';
  const dist = (index + 1) * cfg.spacing;
  let x = 0;
  let y = 0;
  switch (cfg.expansionStyle) {
    case 'vertical':
      y = -dist;
      if (!isBottom) y = -dist;
      break;
    case 'horizontal':
      x = isRight ? -dist : dist;
      break;
    case 'split':
      if (index % 2 === 0) {
        y = -((index / 2 + 1) * cfg.spacing);
      } else {
        x = isRight ? -(((index - 1) / 2 + 1) * cfg.spacing) : (((index - 1) / 2 + 1) * cfg.spacing);
      }
      break;
    case 'fan': {
      const count = cfg.messengers.length;
      if (cfg.positionY === 'center') {
        const range = 180;
        const startAngle = isRight ? 90 : -90;
        const step = range / (count + 1);
        const angleDeg = startAngle + step * (index + 1);
        const angleRad = (angleDeg * Math.PI) / 180;
        x = Math.cos(angleRad) * cfg.spacing * 1.5;
        y = -Math.sin(angleRad) * cfg.spacing * 1.5;
      } else {
        const range = 90;
        const step = range / (count - 1);
        const currentAngle = index * step;
        const rad = (currentAngle * Math.PI) / 180;
        const radius = cfg.spacing * (1 + index * 0.1);
        if (isRight) {
          x = -Math.sin(rad) * radius * 2;
          y = -Math.cos(rad) * radius * 2;
        } else {
          x = Math.sin(rad) * radius * 2;
          y = -Math.cos(rad) * radius * 2;
        }
      }
      break;
    }
  }
  return { x, y };
}

function mount(container: HTMLElement, cfg: Config) {
  const isOpen = { value: false };
  const root = document.createElement('div');
  root.className = 'jfm-root';
  const items = document.createElement('div');
  items.className = 'jfm-items';
  const btn = createMainButton();
  btn.addEventListener('click', () => {
    isOpen.value = !isOpen.value;
    btn.classList.toggle('is-open', isOpen.value);
    Array.from(items.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const t = getItemTranslate(i, cfg);
      el.style.transform = isOpen.value ? `translate(${t.x}px, ${t.y}px)` : 'translate(0, 0)';
      el.style.opacity = isOpen.value ? '1' : '0';
      el.style.pointerEvents = isOpen.value ? 'auto' : 'none';
      el.style.transitionDelay = `${i * 50}ms`;
    });
  });
  cfg.messengers.forEach((m, i) => {
    const el = createMessengerItem(m, cfg.positionX, cfg.idleAnimation);
    items.appendChild(el);
  });
  root.appendChild(items);
  root.appendChild(btn);
  const style: Partial<CSSStyleDeclaration> = {
    position: 'fixed',
    zIndex: '9999',
    left: cfg.positionX === 'left' ? '24px' : 'auto',
    right: cfg.positionX === 'right' ? '24px' : 'auto',
    bottom: cfg.positionY === 'bottom' ? `${cfg.offsetBottom}px` : 'auto',
    top: cfg.positionY === 'center' ? '50%' : 'auto',
    transform: cfg.positionY === 'center' ? 'translateY(-50%)' : 'none',
  };
  Object.assign(root.style, style);
  container.appendChild(root);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll<HTMLElement>('.jankx-floating-messengers').forEach(el => {
    try {
      const raw = el.getAttribute('data-config') || '{}';
      const cfg = JSON.parse(raw) as Config;
      mount(el, cfg);
    } catch (e) {}
  });
});
