import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, SelectControl, ToggleControl, ButtonGroup, Button } from '@wordpress/components';
import { desktop, tablet, mobile } from '@wordpress/icons';

export default function LayoutControls({ layout, pagination, onUpdate }) {
    const updateLayout = (updates) => {
        onUpdate('layout', { ...layout, ...updates });
    };

    const updatePagination = (updates) => {
        onUpdate('pagination', { ...pagination, ...updates });
    };

    const paginationTypes = [
        { label: __('Numbers', 'jankx'), value: 'numbers' },
        { label: __('Previous/Next', 'jankx'), value: 'prev_next' },
        { label: __('Load More', 'jankx'), value: 'load_more' },
        { label: __('Infinite Scroll', 'jankx'), value: 'infinite' }
    ];

    return (
        <div className="jankx-layout-controls">
            <PanelBody title={__('Layout Settings', 'jankx')} initialOpen={true}>
                <div className="jankx-layout-section">
                    <h4>{__('Grid Columns', 'jankx')}</h4>

                    <div className="jankx-responsive-controls">
                        <div className="jankx-responsive-control">
                            <div className="jankx-responsive-label">
                                <desktop.icon />
                                <span>{__('Desktop', 'jankx')}</span>
                            </div>
                            <RangeControl
                                value={layout.columns}
                                onChange={(value) => updateLayout({ columns: value })}
                                min={1}
                                max={6}
                                step={1}
                            />
                        </div>

                        <div className="jankx-responsive-control">
                            <div className="jankx-responsive-label">
                                <tablet.icon />
                                <span>{__('Tablet', 'jankx')}</span>
                            </div>
                            <RangeControl
                                value={layout.columnsTablet}
                                onChange={(value) => updateLayout({ columnsTablet: value })}
                                min={1}
                                max={4}
                                step={1}
                            />
                        </div>

                        <div className="jankx-responsive-control">
                            <div className="jankx-responsive-label">
                                <mobile.icon />
                                <span>{__('Mobile', 'jankx')}</span>
                            </div>
                            <RangeControl
                                value={layout.columnsMobile}
                                onChange={(value) => updateLayout({ columnsMobile: value })}
                                min={1}
                                max={2}
                                step={1}
                            />
                        </div>
                    </div>
                </div>

                <div className="jankx-layout-section">
                    <h4>{__('Spacing', 'jankx')}</h4>

                    <div className="jankx-responsive-controls">
                        <div className="jankx-responsive-control">
                            <div className="jankx-responsive-label">
                                <desktop.icon />
                                <span>{__('Gap (px)', 'jankx')}</span>
                            </div>
                            <RangeControl
                                value={layout.gap}
                                onChange={(value) => updateLayout({ gap: value })}
                                min={0}
                                max={100}
                                step={5}
                            />
                        </div>

                        <div className="jankx-responsive-control">
                            <div className="jankx-responsive-label">
                                <tablet.icon />
                                <span>{__('Gap (px)', 'jankx')}</span>
                            </div>
                            <RangeControl
                                value={layout.gapTablet}
                                onChange={(value) => updateLayout({ gapTablet: value })}
                                min={0}
                                max={80}
                                step={5}
                            />
                        </div>

                        <div className="jankx-responsive-control">
                            <div className="jankx-responsive-label">
                                <mobile.icon />
                                <span>{__('Gap (px)', 'jankx')}</span>
                            </div>
                            <RangeControl
                                value={layout.gapMobile}
                                onChange={(value) => updateLayout({ gapMobile: value })}
                                min={0}
                                max={60}
                                step={5}
                            />
                        </div>
                    </div>
                </div>
            </PanelBody>

            <PanelBody title={__('Pagination Settings', 'jankx')} initialOpen={false}>
                <ToggleControl
                    label={__('Enable Pagination', 'jankx')}
                    checked={pagination.enabled}
                    onChange={(value) => updatePagination({ enabled: value })}
                    help={__('Show pagination controls for multiple pages', 'jankx')}
                />

                {pagination.enabled && (
                    <>
                        <SelectControl
                            label={__('Pagination Type', 'jankx')}
                            value={pagination.type}
                            options={paginationTypes}
                            onChange={(value) => updatePagination({ type: value })}
                            help={__('Choose how pagination is displayed', 'jankx')}
                        />

                        {pagination.type === 'load_more' && (
                            <ToggleControl
                                label={__('Load More Button', 'jankx')}
                                checked={pagination.loadMore}
                                onChange={(value) => updatePagination({ loadMore: value })}
                                help={__('Show a "Load More" button instead of pagination', 'jankx')}
                            />
                        )}

                        {pagination.type === 'infinite' && (
                            <ToggleControl
                                label={__('Infinite Scroll', 'jankx')}
                                checked={pagination.infiniteScroll}
                                onChange={(value) => updatePagination({ infiniteScroll: value })}
                                help={__('Automatically load more content when scrolling', 'jankx')}
                            />
                        )}

                        <div className="jankx-pagination-options">
                            <h5>{__('Pagination Options', 'jankx')}</h5>

                            {pagination.type === 'numbers' && (
                                <div className="jankx-pagination-numbers">
                                    <p>{__('Numbers pagination shows page numbers for easy navigation.', 'jankx')}</p>
                                    <ul>
                                        <li>{__('Best for: Blogs, portfolios, product catalogs', 'jankx')}</li>
                                        <li>{__('Users can jump to any page directly', 'jankx')}</li>
                                        <li>{__('Shows current page and total pages', 'jankx')}</li>
                                    </ul>
                                </div>
                            )}

                            {pagination.type === 'prev_next' && (
                                <div className="jankx-pagination-prev-next">
                                    <p>{__('Previous/Next pagination shows navigation arrows.', 'jankx')}</p>
                                    <ul>
                                        <li>{__('Best for: Simple content, minimal interfaces', 'jankx')}</li>
                                        <li>{__('Clean and simple navigation', 'jankx')}</li>
                                        <li>{__('Good for mobile devices', 'jankx')}</li>
                                    </ul>
                                </div>
                            )}

                            {pagination.type === 'load_more' && (
                                <div className="jankx-pagination-load-more">
                                    <p>{__('Load More button loads additional content without page refresh.', 'jankx')}</p>
                                    <ul>
                                        <li>{__('Best for: Social feeds, galleries, news sites', 'jankx')}</li>
                                        <li>{__('Maintains current page state', 'jankx')}</li>
                                        <li>{__('Good for user engagement', 'jankx')}</li>
                                    </ul>
                                </div>
                            )}

                            {pagination.type === 'infinite' && (
                                <div className="jankx-pagination-infinite">
                                    <p>{__('Infinite scroll automatically loads content as user scrolls.', 'jankx')}</p>
                                    <ul>
                                        <li>{__('Best for: Social media, content discovery', 'jankx')}</li>
                                        <li>{__('Seamless user experience', 'jankx')}</li>
                                        <li>{__('May impact performance with large datasets', 'jankx')}</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </PanelBody>
        </div>
    );
}
