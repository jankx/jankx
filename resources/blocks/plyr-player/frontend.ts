import Plyr from 'plyr/dist/plyr';

type PlyrBlockConfig = {
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
};

function safeParseJson(value: string | null): any {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
}

function initPlyrPlayers(): void {
  const wrappers = document.querySelectorAll<HTMLElement>('.plyr-player-block[data-plyr-block="1"]');

  wrappers.forEach((wrapper) => {
    const media = wrapper.querySelector<HTMLMediaElement>('video.plyr-player__media, audio.plyr-player__media');
    if (!media) return;

    if ((media as any).__plyrInstance) return;

    const config = safeParseJson(wrapper.getAttribute('data-plyr-config')) as PlyrBlockConfig | null;

    const player = new Plyr(media, {
      autoplay: !!config?.autoplay,
      muted: !!config?.muted,
      loop: { active: !!config?.loop }
    });

    (media as any).__plyrInstance = player;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initPlyrPlayers());
} else {
  initPlyrPlayers();
}

document.addEventListener('content-loaded', () => initPlyrPlayers());

if (typeof (window as any).wp !== 'undefined' && (window as any).wp.domReady) {
  (window as any).wp.domReady(() => initPlyrPlayers());
}
