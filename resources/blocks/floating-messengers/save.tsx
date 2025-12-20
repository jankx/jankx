import { useBlockProps } from '@wordpress/block-editor';

type MessengerItem = {
  id: string;
  name: string;
  enabled: boolean;
  color: string;
  url: string;
  iconLabel?: string;
};

interface SaveProps {
  attributes: {
    positionX: 'left' | 'right';
    positionY: 'bottom' | 'center';
    offsetBottom: number;
    expansionStyle: 'vertical' | 'horizontal' | 'fan' | 'split';
    idleAnimation: 'none' | 'pulse-ring' | 'wiggle' | 'float';
    spacing: number;
    messengers: MessengerItem[];
  };
}

export default function Save(props: SaveProps) {
  const { attributes } = props;
  const {
    positionX = 'right',
    positionY = 'bottom',
    offsetBottom = 24,
    expansionStyle = 'vertical',
    idleAnimation = 'none',
    spacing = 60,
    messengers = [],
  } = attributes;

  const blockProps = useBlockProps.save({
    className: 'jankx-floating-messengers',
  });

  const enabledMessengers = Array.isArray(messengers) ? messengers.filter((m) => m.enabled) : [];

  return (
    <div
      {...blockProps}
      data-position-x={positionX}
      data-position-y={positionY}
      data-expansion-style={expansionStyle}
      data-idle-animation={idleAnimation}
      data-offset-bottom={offsetBottom}
      data-spacing={spacing}
    >
      <div className="fm-items">
        {enabledMessengers.map((m) => (
          <a
            key={m.id}
            className="fm-item"
            href={m.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            data-id={m.id}
            data-name={m.name}
            style={{ backgroundColor: m.color }}
          >
            <span className="fm-item-icon">{m.iconLabel || m.name.charAt(0)}</span>
          </a>
        ))}
      </div>
      <button type="button" className="fm-main-button" aria-label="Toggle Messengers">
        <span className="fm-main-label">Chat</span>
      </button>
    </div>
  );
}

