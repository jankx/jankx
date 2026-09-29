import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

type Variation = {
    name: string;
    title: string;
    description: string;
};

export const SHAPES: Variation[] = [
    {
        name: 'plain',
        title: 'Plain',
        description: 'Chỉ hiển thị số thứ tự, không nền không viền.',
    },
    {
        name: 'circle',
        title: 'Circle',
        description: 'Hình tròn, nền nhạt theo màu chữ.',
    },
    {
        name: 'rounded',
        title: 'Rounded',
        description: 'Hình chữ nhật bo góc vừa phải.',
    },
    {
        name: 'pill',
        title: 'Pill',
        description: 'Capsule bo tròn hai đầu.',
    },
    {
        name: 'outline',
        title: 'Outline Circle',
        description: 'Hình tròn rỗng, chỉ có viền.',
    },
    {
        name: 'ribbon',
        title: 'Ribbon',
        description: 'Nhãn bo tròn một bên kiểu ribbon.',
    },
];

registerBlockType(metadata.name, {
    ...(metadata as any),
    edit: Edit,
    save: Save,
    variations: SHAPES.map((shape) => ({
        name: shape.name,
        title: shape.title,
        description: shape.description,
        scope: ['inserter', 'block'],
        attributes: {
            className: `is-style-${shape.name}`,
        },
        isActive: (attributes: { className?: string }) =>
            (attributes?.className || '').split(/\s+/).includes(`is-style-${shape.name}`),
    })),
} as any);
