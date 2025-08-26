import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
  PanelBody,
  SelectControl,
  TextControl,
  CheckboxControl,
  ColorPicker,
  Button,
  Notice
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import metadata from './block.json';

interface MediaFile {
  id: number;
  url: string;
  alt?: string;
}

interface Attributes {
  mediaType: 'video' | 'audio' | 'youtube' | 'vimeo';
  mediaUrl: string;
  mediaOptions: string[];
  videoPoster: MediaFile | null;
  videoCaptions: MediaFile[];
  audioPoster: MediaFile | null;
  youtubeUrl: string;
  vimeoUrl: string;
  playerColor: string;
  controls: string[];
  settings: string[];
  seekTime: number;
}

const Edit = ({ attributes, setAttributes }: { attributes: Attributes; setAttributes: (a: Partial<Attributes>) => void; }) => {
  const {
    mediaType = 'video',
    mediaUrl = '',
    mediaOptions = [],
    videoPoster = null,
    videoCaptions = [],
    audioPoster = null,
    youtubeUrl = '',
    vimeoUrl = '',
    playerColor = '#fca311',
    controls = ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
    settings = ['captions', 'quality', 'speed'],
    seekTime = 10
  } = attributes;

  const blockProps = useBlockProps({
    className: 'jankx-wplyr-player',
    style: { '--plyr-color': playerColor }
  });

  const mediaTypeOptions = [
    { label: __('Video', 'jankx'), value: 'video' },
    { label: __('Audio', 'jankx'), value: 'audio' },
    { label: __('YouTube', 'jankx'), value: 'youtube' },
    { label: __('Vimeo', 'jankx'), value: 'vimeo' },
  ];

  const mediaOptionsChoices = [
    { label: __('Muted', 'jankx'), value: 'muted' },
    { label: __('Loop', 'jankx'), value: 'loop' },
    { label: __('Autoplay', 'jankx'), value: 'autoplay' },
  ];

  const controlOptions = [
    { label: __('Play Large', 'jankx'), value: 'play-large' },
    { label: __('Restart', 'jankx'), value: 'restart' },
    { label: __('Rewind', 'jankx'), value: 'rewind' },
    { label: __('Play', 'jankx'), value: 'play' },
    { label: __('Fast Forward', 'jankx'), value: 'fast-forward' },
    { label: __('Progress', 'jankx'), value: 'progress' },
    { label: __('Current Time', 'jankx'), value: 'current-time' },
    { label: __('Duration', 'jankx'), value: 'duration' },
    { label: __('Mute', 'jankx'), value: 'mute' },
    { label: __('Volume', 'jankx'), value: 'volume' },
    { label: __('Captions', 'jankx'), value: 'captions' },
    { label: __('Settings', 'jankx'), value: 'settings' },
    { label: __('Picture-in-Picture', 'jankx'), value: 'pip' },
    { label: __('Airplay', 'jankx'), value: 'airplay' },
    { label: __('Download', 'jankx'), value: 'download' },
    { label: __('Fullscreen', 'jankx'), value: 'fullscreen' },
  ];

  const settingsOptions = [
    { label: __('Speed', 'jankx'), value: 'speed' },
    { label: __('Quality', 'jankx'), value: 'quality' },
    { label: __('Captions', 'jankx'), value: 'captions' },
  ];

  const handleMediaOptionChange = (option: string, checked: boolean) => {
    const newOptions = checked
      ? [...mediaOptions, option]
      : mediaOptions.filter(opt => opt !== option);
    setAttributes({ mediaOptions: newOptions });
  };

  const handleControlChange = (selectedControls: string[]) => {
    setAttributes({ controls: selectedControls });
  };

  const handleSettingsChange = (selectedSettings: string[]) => {
    setAttributes({ settings: selectedSettings });
  };

  const renderMediaPlayer = () => {
    const hasMedia = (mediaType === 'video' || mediaType === 'audio') && mediaUrl;
    const hasYouTube = mediaType === 'youtube' && youtubeUrl;
    const hasVimeo = mediaType === 'vimeo' && vimeoUrl;

    if (!hasMedia && !hasYouTube && !hasVimeo) {
      return (
        <div className="jankx-wplyr-placeholder">
          <p>{__('Please configure media settings in the sidebar.', 'jankx')}</p>
        </div>
      );
    }

    if (mediaType === 'video') {
      return (
        <video
          controls
          poster={videoPoster?.url}
          {...(mediaOptions.includes('muted') && { muted: true })}
          {...(mediaOptions.includes('loop') && { loop: true })}
          {...(mediaOptions.includes('autoplay') && { autoPlay: true })}
        >
          <source src={mediaUrl} type="video/mp4" />
          {videoCaptions.map((caption, index) => (
            <track
              key={index}
              kind="captions"
              src={caption.url}
              srcLang="en"
              label="English"
            />
          ))}
          {__('Your browser does not support the video tag.', 'jankx')}
        </video>
      );
    }

    if (mediaType === 'audio') {
      return (
        <audio
          controls
          poster={audioPoster?.url}
          {...(mediaOptions.includes('muted') && { muted: true })}
          {...(mediaOptions.includes('loop') && { loop: true })}
          {...(mediaOptions.includes('autoplay') && { autoPlay: true })}
        >
          <source src={mediaUrl} type="audio/mpeg" />
          {__('Your browser does not support the audio tag.', 'jankx')}
        </audio>
      );
    }

    if (mediaType === 'youtube') {
      return (
        <div className="jankx-youtube-placeholder">
          <p>{__('YouTube video will be loaded on the frontend.', 'jankx')}</p>
          <p><strong>URL:</strong> {youtubeUrl}</p>
        </div>
      );
    }

    if (mediaType === 'vimeo') {
      return (
        <div className="jankx-vimeo-placeholder">
          <p>{__('Vimeo video will be loaded on the frontend.', 'jankx')}</p>
          <p><strong>URL:</strong> {vimeoUrl}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__('Media Settings', 'jankx')} initialOpen={true}>
          <SelectControl
            label={__('Media Type', 'jankx')}
            value={mediaType}
            options={mediaTypeOptions}
            onChange={(value) => setAttributes({ mediaType: value as Attributes['mediaType'] })}
          />

          {(mediaType === 'video' || mediaType === 'audio') && (
            <TextControl
              label={__('Media URL', 'jankx')}
              value={mediaUrl}
              onChange={(value) => setAttributes({ mediaUrl: value })}
              help={__('Enter the URL of your media file', 'jankx')}
            />
          )}

          {mediaType === 'youtube' && (
            <TextControl
              label={__('YouTube URL', 'jankx')}
              value={youtubeUrl}
              onChange={(value) => setAttributes({ youtubeUrl: value })}
              help={__('Enter the YouTube video URL', 'jankx')}
            />
          )}

          {mediaType === 'vimeo' && (
            <TextControl
              label={__('Vimeo URL', 'jankx')}
              value={vimeoUrl}
              onChange={(value) => setAttributes({ vimeoUrl: value })}
              help={__('Enter the Vimeo video URL', 'jankx')}
            />
          )}

          {(mediaType === 'video' || mediaType === 'audio') && (
            <div>
              <p><strong>{__('Media Options', 'jankx')}</strong></p>
              {mediaOptionsChoices.map(option => (
                <CheckboxControl
                  key={option.value}
                  label={option.label}
                  checked={mediaOptions.includes(option.value)}
                  onChange={(checked) => handleMediaOptionChange(option.value, checked)}
                />
              ))}
            </div>
          )}
        </PanelBody>

        <PanelBody title={__('Player Settings', 'jankx')} initialOpen={false}>
          <div>
            <p><strong>{__('Player Color', 'jankx')}</strong></p>
            <ColorPicker
              color={playerColor}
              onChange={(color) => setAttributes({ playerColor: color })}
            />
          </div>

          <SelectControl
            label={__('Controls', 'jankx')}
            value={controls}
            options={controlOptions}
            multiple
            onChange={handleControlChange}
          />

          <SelectControl
            label={__('Settings', 'jankx')}
            value={settings}
            options={settingsOptions}
            multiple
            onChange={handleSettingsChange}
          />

          {(controls.includes('rewind') || controls.includes('fast-forward')) && (
            <TextControl
              label={__('Seek Time (seconds)', 'jankx')}
              type="number"
              min={5}
              max={60}
              value={seekTime}
              onChange={(value) => setAttributes({ seekTime: parseInt(value) || 10 })}
            />
          )}
        </PanelBody>

        {(mediaType === 'video' || mediaType === 'audio') && (
          <PanelBody title={__('Media Files', 'jankx')} initialOpen={false}>
            {mediaType === 'video' && (
              <div>
                <p><strong>{__('Video Poster', 'jankx')}</strong></p>
                <MediaUploadCheck>
                  <MediaUpload
                    onSelect={(media) => setAttributes({ videoPoster: media })}
                    allowedTypes={['image']}
                    value={videoPoster?.id}
                    render={({ open }) => (
                      <div>
                        {videoPoster ? (
                          <div>
                            <img src={videoPoster.url} alt={videoPoster.alt} style={{ maxWidth: '100px' }} />
                            <Button onClick={() => setAttributes({ videoPoster: null })} variant="secondary" isSmall>
                              {__('Remove', 'jankx')}
                            </Button>
                          </div>
                        ) : (
                          <Button onClick={open} variant="secondary">
                            {__('Choose Poster Image', 'jankx')}
                          </Button>
                        )}
                      </div>
                    )}
                  />
                </MediaUploadCheck>
              </div>
            )}

            {mediaType === 'audio' && (
              <div>
                <p><strong>{__('Audio Poster', 'jankx')}</strong></p>
                <MediaUploadCheck>
                  <MediaUpload
                    onSelect={(media) => setAttributes({ audioPoster: media })}
                    allowedTypes={['image']}
                    value={audioPoster?.id}
                    render={({ open }) => (
                      <div>
                        {audioPoster ? (
                          <div>
                            <img src={audioPoster.url} alt={audioPoster.alt} style={{ maxWidth: '100px' }} />
                            <Button onClick={() => setAttributes({ audioPoster: null })} variant="secondary" isSmall>
                              {__('Remove', 'jankx')}
                            </Button>
                          </div>
                        ) : (
                          <Button onClick={open} variant="secondary">
                            {__('Choose Poster Image', 'jankx')}
                          </Button>
                        )}
                      </div>
                    )}
                  />
                </MediaUploadCheck>
              </div>
            )}
          </PanelBody>
        )}
      </InspectorControls>

      <div className="jankx-wplyr-container">
        {renderMediaPlayer()}
      </div>
    </div>
  );
};

const Save = () => null;

registerBlockType(metadata as any, {
  edit: Edit as any,
  save: Save as any,
});
