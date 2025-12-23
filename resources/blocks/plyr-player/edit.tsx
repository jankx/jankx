import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  SelectControl,
  TextControl,
  ToggleControl
} from '@wordpress/components';
import { Plyr } from 'plyr-react';
import type { PlyrProps } from 'plyr-react';
import 'plyr-react/plyr.css';

interface PlyrPlayerAttributes {
  mediaType: 'video' | 'audio';
  mediaUrl: string;
  posterUrl: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  preload: 'none' | 'metadata' | 'auto';
  className?: string;
}

interface EditProps {
  attributes: PlyrPlayerAttributes;
  setAttributes: (attributes: Partial<PlyrPlayerAttributes>) => void;
}

export default function Edit({ attributes, setAttributes }: EditProps): JSX.Element {
  const {
    mediaType,
    mediaUrl,
    posterUrl,
    autoplay,
    loop,
    muted,
    preload,
    className
  } = attributes;

  const blockProps = useBlockProps({
    className: `plyr-player-block ${className || ''}`
  });

  const renderPreview = (): JSX.Element => {
    if (!mediaUrl || mediaUrl.trim() === '') {
      return (
        <div className="plyr-player__placeholder">
          <p>{__('Paste a media URL to preview the player.', 'jankx')}</p>
        </div>
      );
    }

    const plyrProps: PlyrProps = {
      source: {
        type: mediaType,
        sources: [
          {
            src: mediaUrl,
            type: mediaType === 'audio' ? 'audio/mp3' : 'video/mp4'
          }
        ],
        ...(mediaType === 'video' && posterUrl ? { poster: posterUrl } : {})
      },
      options: {
        autoplay,
        muted,
        loop: { active: loop }
      }
    };

    return <Plyr {...plyrProps} />;
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Plyr Player Settings', 'jankx')} initialOpen={true}>
          <SelectControl
            label={__('Media type', 'jankx')}
            value={mediaType}
            options={[
              { label: __('Video', 'jankx'), value: 'video' },
              { label: __('Audio', 'jankx'), value: 'audio' }
            ]}
            onChange={(value: string) => setAttributes({ mediaType: value as 'video' | 'audio' })}
          />

          <TextControl
            label={__('Media URL', 'jankx')}
            value={mediaUrl}
            onChange={(value: string) => setAttributes({ mediaUrl: value })}
          />

          {mediaType === 'video' && (
            <TextControl
              label={__('Poster URL', 'jankx')}
              value={posterUrl}
              onChange={(value: string) => setAttributes({ posterUrl: value })}
            />
          )}

          <SelectControl
            label={__('Preload', 'jankx')}
            value={preload}
            options={[
              { label: 'none', value: 'none' },
              { label: 'metadata', value: 'metadata' },
              { label: 'auto', value: 'auto' }
            ]}
            onChange={(value: string) => setAttributes({ preload: value as 'none' | 'metadata' | 'auto' })}
          />

          <ToggleControl
            label={__('Autoplay', 'jankx')}
            checked={autoplay}
            onChange={(value: boolean) => setAttributes({ autoplay: value })}
          />

          <ToggleControl
            label={__('Loop', 'jankx')}
            checked={loop}
            onChange={(value: boolean) => setAttributes({ loop: value })}
          />

          <ToggleControl
            label={__('Muted', 'jankx')}
            checked={muted}
            onChange={(value: boolean) => setAttributes({ muted: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>{renderPreview()}</div>
    </>
  );
}
