import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, ButtonGroup, Button } from '@wordpress/components';
import { grid, list, masonry, carousel, timeline } from '@wordpress/icons';

export default function TemplateSelector({ template, onUpdate }) {
    const templateOptions = [
        {
            value: 'grid',
            label: __('Grid', 'jankx'),
            icon: grid,
            description: __('Standard grid layout with equal columns', 'jankx')
        },
        {
            value: 'list',
            label: __('List', 'jankx'),
            icon: list,
            description: __('Vertical list layout', 'jankx')
        },
        {
            value: 'masonry',
            label: __('Masonry', 'jankx'),
            icon: masonry,
            description: __('Pinterest-style masonry layout', 'jankx')
        },
        {
            value: 'carousel',
            label: __('Carousel', 'jankx'),
            icon: carousel,
            description: __('Horizontal scrolling carousel', 'jankx')
        },
        {
            value: 'timeline',
            label: __('Timeline', 'jankx'),
            icon: timeline,
            description: __('Chronological timeline layout', 'jankx')
        }
    ];

    const selectedTemplate = templateOptions.find(t => t.value === template);

    return (
        <PanelBody title={__('Template Settings', 'jankx')} initialOpen={true}>
            <div className="jankx-template-selector">
                <div className="jankx-template-options">
                    <ButtonGroup className="jankx-template-buttons">
                        {templateOptions.map(({ value, label, icon: Icon }) => (
                            <Button
                                key={value}
                                isPrimary={template === value}
                                onClick={() => onUpdate('template', value)}
                                icon={Icon}
                                label={label}
                                className="jankx-template-button"
                            >
                                {label}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>

                {selectedTemplate && (
                    <div className="jankx-template-info">
                        <h4>{selectedTemplate.label}</h4>
                        <p>{selectedTemplate.description}</p>

                        {template === 'grid' && (
                            <div className="jankx-template-specific">
                                <p><strong>{__('Best for:', 'jankx')}</strong> {__('Blog posts, portfolios, product catalogs', 'jankx')}</p>
                                <p><strong>{__('Features:', 'jankx')}</strong> {__('Responsive columns, equal heights, clean alignment', 'jankx')}</p>
                            </div>
                        )}

                        {template === 'list' && (
                            <div className="jankx-template-specific">
                                <p><strong>{__('Best for:', 'jankx')}</strong> {__('News articles, blog posts, search results', 'jankx')}</p>
                                <p><strong>{__('Features:', 'jankx')}</strong> {__('Full-width content, easy reading, SEO friendly', 'jankx')}</p>
                            </div>
                        )}

                        {template === 'masonry' && (
                            <div className="jankx-template-specific">
                                <p><strong>{__('Best for:', 'jankx')}</strong> {__('Portfolios, galleries, image collections', 'jankx')}</p>
                                <p><strong>{__('Features:', 'jankx')}</strong> {__('Variable heights, dynamic layout, visual appeal', 'jankx')}</p>
                            </div>
                        )}

                        {template === 'carousel' && (
                            <div className="jankx-template-specific">
                                <p><strong>{__('Best for:', 'jankx')}</strong> {__('Featured content, testimonials, product showcases', 'jankx')}</p>
                                <p><strong>{__('Features:', 'jankx')}</strong> {__('Horizontal scrolling, navigation controls, autoplay', 'jankx')}</p>
                            </div>
                        )}

                        {template === 'timeline' && (
                            <div className="jankx-template-specific">
                                <p><strong>{__('Best for:', 'jankx')}</strong> {__('Company history, project milestones, event schedules', 'jankx')}</p>
                                <p><strong>{__('Features:', 'jankx')}</strong> {__('Chronological order, visual timeline, story progression', 'jankx')}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="jankx-template-customization">
                    <h4>{__('Template Customization', 'jankx')}</h4>
                    <p>
                        {__('Use the Layout, Display, and Styling tabs to customize how your selected template appears.', 'jankx')}
                    </p>

                    <div className="jankx-template-tips">
                        <h5>{__('Pro Tips:', 'jankx')}</h5>
                        <ul>
                            <li>{__('Grid works best with 2-4 columns for most content types', 'jankx')}</li>
                            <li>{__('List layout is ideal for text-heavy content', 'jankx')}</li>
                            <li>{__('Masonry requires consistent image sizes for best results', 'jankx')}</li>
                            <li>{__('Carousel is perfect for highlighting featured content', 'jankx')}</li>
                            <li>{__('Timeline works best with chronological content', 'jankx')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PanelBody>
    );
}
