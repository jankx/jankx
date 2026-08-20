import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import './style.scss';

registerBlockType(metadata.name, {
  ...metadata,
  title: __('Presentation Slide', 'jankx'),
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
            badge: '',
            title: attributes.title || '',
            subtitle: attributes.subtitle || '',
            ctaText: '',
            ctaLink: '#',
            overlayOpacity: 50,
            textAlignment: 'left',
          };
        },
      },
      {
        type: 'block',
        blocks: ['jankx/embla-carousel-card'],
        transform: (attributes: any) => {
          return {
            category: 'KHỐI',
            title: attributes.title || '',
            description: attributes.bodyText || attributes.subtitle || '',
            badgeText: '',
            metricValue: attributes.statsNumber || '',
            metricLabel: attributes.statsLabel || '',
            actionText: 'Chi tiết',
            cardColor: 'slate',
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
            layout: 'title',
            title: attributes.title || '',
            subtitle: attributes.subtitle || '',
            bodyText: '',
            bullets: [],
            statsNumber: '',
            statsLabel: '',
            quoteText: '',
            quoteAuthor: '',
            quoteRole: '',
            theme: 'dark',
            presenterNotes: '',
          };
        },
      },
      {
        type: 'block',
        blocks: ['jankx/embla-carousel-card'],
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
  },
} as any);
