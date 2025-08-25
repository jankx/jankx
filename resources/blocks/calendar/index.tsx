import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl, SelectControl } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';

// FullCalendar imports (ensure deps in package.json):
// core + daygrid view as default; can be extended later
import { Calendar, type CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

interface EventInput {
    id?: string;
    title: string;
    start?: string | Date;
    end?: string | Date;
    allDay?: boolean;
}

type CalendarView = 'dayGridMonth' | 'dayGridWeek' | 'dayGridDay';

interface CalendarAttributes {
    initialView: CalendarView;
    editable: boolean;
    selectable: boolean;
    weekends: boolean;
    locale: string;
    events: EventInput[];
    className?: string;
}

interface CalendarEditProps {
    attributes: CalendarAttributes;
    setAttributes: (attributes: Partial<CalendarAttributes>) => void;
}

function CalendarPreview({ attributes }: { attributes: CalendarAttributes }): JSX.Element {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const calendarRef = useRef<Calendar | null>(null);

    useEffect(() => {
        const node = containerRef.current;
        if (!node || !(node instanceof HTMLElement)) return;

        if (calendarRef.current) {
            calendarRef.current.destroy();
            calendarRef.current = null;
        }

        // Clear any previous children to avoid DOM conflicts in block editor re-renders
        try { node.innerHTML = ''; } catch (e) { /* noop */ }

        const options: CalendarOptions = {
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: attributes.initialView || 'dayGridMonth',
            editable: !!attributes.editable,
            selectable: !!attributes.selectable,
            weekends: !!attributes.weekends,
            locale: attributes.locale || 'en',
            events: attributes.events || [],
            height: 'auto'
        };

        const cal = new Calendar(node, options);
        cal.render();
        calendarRef.current = cal;

        return () => {
            cal.destroy();
        };
    }, [attributes.initialView, attributes.editable, attributes.selectable, attributes.weekends, attributes.locale, attributes.events]);

    return <div className="jankx-calendar-wrap"><div ref={containerRef} /></div>;
}

function CalendarEdit({ attributes, setAttributes }: CalendarEditProps): JSX.Element {
    const { initialView, editable, selectable, weekends, locale, className } = attributes;

    const blockProps = useBlockProps({
        className: `jankx-calendar-block ${className || ''}`
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Calendar Settings', 'jankx')} initialOpen={true}>
                    <SelectControl
                        label={__('Initial View', 'jankx')}
                        value={initialView}
                        options={[
                            { label: 'Month (dayGridMonth)', value: 'dayGridMonth' },
                            { label: 'Week (dayGridWeek)', value: 'dayGridWeek' },
                            { label: 'Day (dayGridDay)', value: 'dayGridDay' }
                        ]}
                        onChange={(value: CalendarView) => setAttributes({ initialView: value })}
                    />
                    <ToggleControl
                        label={__('Editable', 'jankx')}
                        checked={editable}
                        onChange={(value: boolean) => setAttributes({ editable: value })}
                    />
                    <ToggleControl
                        label={__('Selectable', 'jankx')}
                        checked={selectable}
                        onChange={(value: boolean) => setAttributes({ selectable: value })}
                    />
                    <ToggleControl
                        label={__('Show Weekends', 'jankx')}
                        checked={weekends}
                        onChange={(value: boolean) => setAttributes({ weekends: value })}
                    />
                    <TextControl
                        label={__('Locale (e.g., en, vi)', 'jankx')}
                        value={locale}
                        onChange={(value: string) => setAttributes({ locale: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <CalendarPreview attributes={attributes} />
            </div>
        </>
    );
}

function CalendarSave(): null {
    return null;
}

registerBlockType('jankx/calendar', {
    title: 'Calendar',
    category: 'widgets',
    attributes: {
        initialView: { type: 'string', default: 'dayGridMonth' },
        editable: { type: 'boolean', default: false },
        selectable: { type: 'boolean', default: false },
        weekends: { type: 'boolean', default: true },
        locale: { type: 'string', default: 'en' },
        events: { type: 'array', default: [] },
        className: { type: 'string' }
    },
    edit: CalendarEdit,
    save: CalendarSave,
});


