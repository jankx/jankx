import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
import { forwardRef } from 'react';
import './style.scss';
const isAnchor = (props) => !!props.href;
const cleanAnchorProps = ({ type, borderless, busy, className, compact, primary, scary, plain, transparent, ...anchorProps }) => anchorProps;
const cleanButtonProps = ({ type = 'button', borderless, busy, className, compact, primary, scary, plain, 
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Clean incorrect usage of the component
rel, 
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Clean incorrect usage of the component
href, 
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Clean incorrect usage of the component
target, transparent, ...buttonProps }) => ({ ...buttonProps, type });
const UnforwardedButton = (props, ref) => {
    const classes = props.plain
        ? clsx('button-plain', props.className)
        : clsx('button', props.className, {
            'is-compact': props.compact,
            'is-primary': props.primary,
            'is-scary': props.scary,
            'is-busy': props.busy,
            'is-borderless': props.borderless,
            'is-transparent': props.transparent,
        });
    if (isAnchor(props)) {
        const anchorProps = cleanAnchorProps(props);
        // block referrers when external link
        const rel = anchorProps.target
            ? (anchorProps.rel || '').replace(/noopener|noreferrer/g, '') + ' noopener noreferrer'
            : anchorProps.rel;
        return (_jsx("a", { ...anchorProps, rel: rel, className: classes, ref: ref }));
    }
    const buttonProps = cleanButtonProps(props);
    return (_jsx("button", { ...buttonProps, className: classes, ref: ref }));
};
/**
 * @deprecated This button has been deprecated in favor of the `Button` component from `@wordpress/components`.
 * Please use the `Button` component from `@wordpress/components` instead. This button has aggressive and generic CSS that breaks many other buttons when imported.
 */
export const Button = forwardRef(UnforwardedButton);
//# sourceMappingURL=index.js.map