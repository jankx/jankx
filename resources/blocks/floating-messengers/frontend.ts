function initFloatingMessengers(container: HTMLElement) {
  const positionX = container.getAttribute('data-position-x') as 'left' | 'right';
  const positionY = container.getAttribute('data-position-y') as 'bottom' | 'center';
  const expansionStyle = container.getAttribute('data-expansion-style') as 'vertical' | 'horizontal' | 'fan' | 'split';
  const idleAnimation = container.getAttribute('data-idle-animation') as 'none' | 'pulse-ring' | 'wiggle' | 'float';
  const offsetBottom = parseInt(container.getAttribute('data-offset-bottom') || '24', 10);
  const spacing = parseInt(container.getAttribute('data-spacing') || '60', 10);

  const itemsWrapper = container.querySelector('.fm-items') as HTMLElement | null;
  const itemEls = Array.from(container.querySelectorAll('.fm-item')) as HTMLElement[];
  const mainBtn = container.querySelector('.fm-main-button') as HTMLButtonElement | null;
  if (!itemsWrapper || !mainBtn) return;

  // Position container fixed
  container.style.position = 'fixed';
  container.style.zIndex = '9999';
  container.style.left = positionX === 'left' ? '24px' : 'auto';
  container.style.right = positionX === 'right' ? '24px' : 'auto';
  container.style.bottom = positionY === 'bottom' ? `${offsetBottom}px` : 'auto';
  if (positionY === 'center') {
    container.style.top = '50%';
    container.style.transform = 'translateY(-50%)';
  }

  let isOpen = false;

  function getItemTransform(index: number, count: number) {
    const isRight = positionX === 'right';
    const isBottom = positionY === 'bottom';
    const dist = (index + 1) * spacing;
    let x = 0;
    let y = 0;

    switch (expansionStyle) {
      case 'vertical':
        y = -dist;
        if (!isBottom) {
          y = -dist;
        }
        break;
      case 'horizontal':
        x = isRight ? -dist : dist;
        break;
      case 'split':
        if (index % 2 === 0) {
          y = -((index / 2 + 1) * spacing);
        } else {
          x = isRight ? -(((index - 1) / 2 + 1) * spacing) : (((index - 1) / 2 + 1) * spacing);
        }
        break;
      case 'fan': {
        if (positionY === 'center') {
          const range = 180;
          const startAngle = isRight ? 90 : -90;
          const step = range / (count + 1);
          const angleDeg = startAngle + step * (index + 1);
          const angleRad = (angleDeg * Math.PI) / 180;
          x = Math.cos(angleRad) * spacing * 1.5;
          y = -Math.sin(angleRad) * spacing * 1.5;
        } else {
          const range = 90;
          const step = range / Math.max(1, count - 1);
          const currentAngle = index * step;
          const rad = (currentAngle * Math.PI) / 180;
          const radius = spacing * (1 + index * 0.1);
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
    return `translate(${x}px, ${y}px)`;
  }

  function applyIdleAnimation(el: HTMLElement) {
    el.classList.remove('fm-anim-wiggle', 'fm-anim-float', 'fm-anim-pulse-ring');
    switch (idleAnimation) {
      case 'wiggle':
        el.classList.add('fm-anim-wiggle');
        break;
      case 'float':
        el.classList.add('fm-anim-float');
        break;
      case 'pulse-ring':
        el.classList.add('fm-anim-pulse-ring');
        break;
    }
  }

  itemEls.forEach((el, idx) => {
    el.style.transition = 'transform 0.5s ease-out, opacity 0.3s ease-out';
    el.style.transform = 'translate(0, 0)';
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    applyIdleAnimation(el);
    (el.style as any).transitionDelay = `${idx * 50}ms`;
  });

  function open() {
    const count = itemEls.length;
    itemEls.forEach((el, idx) => {
      el.style.transform = getItemTransform(idx, count);
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
    });
    isOpen = true;
    mainBtn.classList.add('fm-open');
  }
  function close() {
    itemEls.forEach((el) => {
      el.style.transform = 'translate(0, 0)';
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
    });
    isOpen = false;
    mainBtn.classList.remove('fm-open');
  }

  mainBtn.addEventListener('click', () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  });
}

function boot() {
  const containers = Array.from(document.querySelectorAll('.jankx-floating-messengers')) as HTMLElement[];
  containers.forEach((c) => initFloatingMessengers(c));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

