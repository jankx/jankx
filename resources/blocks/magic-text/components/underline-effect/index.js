import "./style.scss";
import { __ } from "@wordpress/i18n";
import { useState, useCallback } from "@wordpress/element";
import { registerFormatType, toggleFormat } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import { Popover, Button, ColorPicker } from "@wordpress/components";
import IconUnderlineCurve from "./icon-underline-curve";

const UnderlineEffectUI = ({
  onClose,
  onChange,
  popoverAnchor,
  borderColor,
  setBorderColor,
  LABEL_APPLY_UNDERLINE,
  LABEL_POPOVER_TITLE,
}) => {
  return (
    <Popover className='jankx-popover' anchor={popoverAnchor}>
      <h4>{LABEL_POPOVER_TITLE}</h4>
      <ColorPicker
        color={borderColor}
        onChange={(color) => setBorderColor(color)}
      />
      <Button
        variant="primary"
        onClick={() => {
          onChange();
          onClose();
        }}
      >
        {LABEL_APPLY_UNDERLINE}
      </Button>
    </Popover>
  );
};

const UnderlineEffect = ({
  isActive,
  onChange,
  value,
  textDomain = "jankx",
}) => {
  const [isAddingUnderline, setIsAddingUnderline] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState();
  const [borderColor, setBorderColor] = useState("hsl(130 80% 50%)");

  const LABEL_APPLY_UNDERLINE = __("Apply", textDomain) || "Apply";
  const LABEL_POPOVER_TITLE =
    __("Customize Underline", textDomain) || "Customize Underline";

  const applyUnderlineEffect = useCallback(() => {
    onChange(
      toggleFormat(value, {
        type: "jankx/underline-effect",
        attributes: {
          style: `--underline-border-color: ${borderColor};`,
          class: "jankx-underline-clip-effect",
        },
      })
    );
  }, [borderColor, onChange, value]);

  const handleToolbarClick = useCallback(() => {
    if (isActive) {
      onChange(toggleFormat(value, { type: "jankx/underline-effect" }));
    } else {
      setIsAddingUnderline(true);
    }
  }, [isActive, onChange, value]);

  return (
    <>
      <div ref={setPopoverAnchor}>
        <RichTextToolbarButton
          icon={IconUnderlineCurve}
          title={__("Underline Effect", "jankx")}
          onClick={handleToolbarClick}
          isActive={isActive}
        />
      </div>
      {!isActive && isAddingUnderline && (
        <UnderlineEffectUI
          onClose={() => setIsAddingUnderline(false)}
          onChange={applyUnderlineEffect}
          popoverAnchor={popoverAnchor}
          borderColor={borderColor}
          setBorderColor={setBorderColor}
          LABEL_APPLY_UNDERLINE={LABEL_APPLY_UNDERLINE}
          LABEL_POPOVER_TITLE={LABEL_POPOVER_TITLE}
        />
      )}
    </>
  );
};

registerFormatType("jankx/underline-effect", {
  title: __("Underline Curve", "jankx"),
  tagName: "span",
  className: "jankx-underline-clip-effect",
  attributes: {
    style: "style",
    class: "class",
  },
  edit: UnderlineEffect,
});
