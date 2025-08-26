document.addEventListener('DOMContentLoaded', function() {
  // Initialize Plyr players
  function initWPlyr() {
    const players = document.querySelectorAll('.jankx-wplyr-player > *:not(.plyr)');

    players.forEach(player => {
      // Check if player already initialized
      if (!player.classList.contains('plyr')) {
        // Get player configuration from data attributes
        const playerConfig = {
          storage: {
            enabled: false
          },
          volume: 0.7,
          captions: {
            active: true,
          },
          tooltips: {
            controls: true,
            seek: true,
          },
          controls: getControlsFromData(player),
          settings: getSettingsFromData(player),
          seekTime: getSeekTimeFromData(player)
        };

        // Initialize Plyr
        if (typeof Plyr !== 'undefined') {
          new Plyr(player, playerConfig);
        }
      }
    });
  }

  // Helper function to get controls from data attributes
  function getControlsFromData(player) {
    const controlsData = player.closest('.jankx-wplyr-player').dataset.controls;
    if (controlsData) {
      try {
        return JSON.parse(controlsData);
      } catch (e) {
        console.warn('Invalid controls data:', controlsData);
      }
    }
    return ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'];
  }

  // Helper function to get settings from data attributes
  function getSettingsFromData(player) {
    const settingsData = player.closest('.jankx-wplyr-player').dataset.settings;
    if (settingsData) {
      try {
        return JSON.parse(settingsData);
      } catch (e) {
        console.warn('Invalid settings data:', settingsData);
      }
    }
    return ['captions', 'quality', 'speed'];
  }

  // Helper function to get seek time from data attributes
  function getSeekTimeFromData(player) {
    const seekTimeData = player.closest('.jankx-wplyr-player').dataset.seekTime;
    if (seekTimeData) {
      const seekTime = parseInt(seekTimeData);
      return isNaN(seekTime) ? 10 : seekTime;
    }
    return 10;
  }

  // Initialize players on page load
  initWPlyr();

  // Re-initialize players when content changes (for dynamic content)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if new players were added
        const hasNewPlayers = Array.from(mutation.addedNodes).some(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            return node.querySelector('.jankx-wplyr-player') || node.classList.contains('jankx-wplyr-player');
          }
          return false;
        });

        if (hasNewPlayers) {
          // Small delay to ensure DOM is ready
          setTimeout(initWPlyr, 100);
        }
      }
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Handle YouTube and Vimeo embeds
  function initExternalPlayers() {
    const youtubePlayers = document.querySelectorAll('.jankx-wplyr-player[data-media-type="youtube"]');
    const vimeoPlayers = document.querySelectorAll('.jankx-wplyr-player[data-media-type="vimeo"]');

    // Initialize YouTube players
    youtubePlayers.forEach(player => {
      const url = player.dataset.youtubeUrl;
      if (url && !player.querySelector('iframe')) {
        const videoId = extractYouTubeId(url);
        if (videoId) {
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
          iframe.width = '100%';
          iframe.height = '100%';
          iframe.frameBorder = '0';
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;

          player.appendChild(iframe);
        }
      }
    });

    // Initialize Vimeo players
    vimeoPlayers.forEach(player => {
      const url = player.dataset.vimeoUrl;
      if (url && !player.querySelector('iframe')) {
        const videoId = extractVimeoId(url);
        if (videoId) {
          const iframe = document.createElement('iframe');
          iframe.src = `https://player.vimeo.com/video/${videoId}`;
          iframe.width = '100%';
          iframe.height = '100%';
          iframe.frameBorder = '0';
          iframe.allow = 'autoplay; fullscreen; picture-in-picture';
          iframe.allowFullscreen = true;

          player.appendChild(iframe);
        }
      }
    });
  }

  // Extract YouTube video ID from URL
  function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // Extract Vimeo video ID from URL
  function extractVimeoId(url) {
    const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  // Initialize external players
  initExternalPlayers();

  // Re-initialize external players when content changes
  const externalObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        const hasNewExternalPlayers = Array.from(mutation.addedNodes).some(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            return node.querySelector('.jankx-wplyr-player[data-media-type="youtube"], .jankx-wplyr-player[data-media-type="vimeo"]') ||
                   (node.classList.contains('jankx-wplyr-player') && (node.dataset.mediaType === 'youtube' || node.dataset.mediaType === 'vimeo'));
          }
          return false;
        });

        if (hasNewExternalPlayers) {
          setTimeout(initExternalPlayers, 100);
        }
      }
    });
  });

  // Start observing for external players
  externalObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
});
