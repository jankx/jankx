import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import './style.scss';

registerBlockType(metadata.name, {
  ...metadata,
  title: __('Carousel Card', 'jankx'),
  edit: Edit,
  save: Save,
  transforms: {
    to: [
      {
        type: 'block',
        blocks: ['jankx/embla-carousel-slide'],
        transform: (attributes: any) => {
          return {
            imageUrl: '',
            imageAlt: '',
            badge: attributes.badgeText || '',
            title: attributes.title || '',
            subtitle: attributes.description || '',
            ctaText: attributes.actionText || 'Chi tiết',
            ctaLink: '#',
            overlayOpacity: 50,
            textAlignment: 'left',
          };
        },
      },
      {
        type: 'block',
        blocks: ['jankx/embla-carousel-presentation-slide'],
        transform: (attributes: any) => {
          return {
            layout: 'title',
            title: attributes.title || '',
            subtitle: '',
            bodyText: attributes.description || '',
            bullets: [],
            statsNumber: attributes.metricValue || '',
            statsLabel: attributes.metricLabel || '',
            quoteText: '',
            quoteAuthor: '',
            quoteRole: '',
            theme: 'dark',
            presenterNotes: '',
          };
        },
      },
    ],
    from: [
      {
        type: 'block',
        blocks: ['jankx/embla-carousel-slide'],
        transform: (attributes: any) => {
          return {
            category: 'KHỐI',
            title: attributes.title || '',
            description: attributes.subtitle || '',
            badgeText: attributes.badge || '',
            metricValue: '',
            metricLabel: '',
            actionText: attributes.ctaText || 'Chi tiết',
            cardColor: 'slate',
          };
        },
      },
      {
        type: 'block',
        blocks: ['jankx/embla-carousel-presentation-slide'],
        transform: (attributes: any) => {
          return {
            category: 'KHỐI',
            title: attributes.title || '',
            description: attributes.bodyText || '',
            badgeText: '',
            metricValue: attributes.statsNumber || '',
            metricLabel: attributes.statsLabel || '',
            actionText: 'Chi tiết',
            cardColor: 'slate',
          };
        },
      },
    ],
  },
} as any);
