import { __ } from "@wordpress/i18n";
import { useState, useCallback, useMemo } from "@wordpress/element";
import { registerFormatType, toggleFormat } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import {
  Popover,
  ColorPicker,
  TextControl,
  Button,
} from "@wordpress/components";
import IconGradient from "./icon-gradient";

const GradientColorUI = ({
  onClose,
  onChange,
  gradientDeg,
  setGradientDeg,
  gradientStartColor,
  setGradientStartColor,
  gradientEndColor,
  setGradientEndColor,
  popoverAnchor,
  LABEL_GRADIENT_DEG,
  LABEL_APPLY_BUTTON,
  LABEL_POPOVER_TITLE,
}) => {
  return (
    <Popover
      className="jankx-popover"
      animate={true}
      position="bottom right"
      offset={{ x: 10, y: 10 }}
      onClose={onClose}
      anchor={popoverAnchor}
    >
      <h4>{LABEL_POPOVER_TITLE}</h4>
      <div style={{ marginBottom: "10px" }}>
        <strong>{__('Start Color', 'jankx')}</strong>
        <ColorPicker
          color={gradientStartColor}
          onChange={(startColor) => setGradientStartColor(startColor)}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>{__('End Color', 'jankx')}</strong>
        <ColorPicker
          color={gradientEndColor}
          onChange={(endColor) => setGradientEndColor(endColor)}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <TextControl
          label={LABEL_GRADIENT_DEG}
          value={gradientDeg}
          onChange={(value) => setGradientDeg(value)}
        />
      </div>

      <Button
        variant="primary"
        onClick={() => {
          onChange();
          onClose();
        }}
      >
        {LABEL_APPLY_BUTTON}
      </Button>
    </Popover>
  );
};

const GradientTextColor = ({
  isActive,
  onChange,
  value,
  textDomain = "jankx",
}) => {
  const [isAddingGradient, setIsAddingGradient] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [gradientStartColor, setGradientStartColor] = useState("#fff");
  const [gradientEndColor, setGradientEndColor] = useState("#000");
  const [gradientDeg, setGradientDeg] = useState("90deg");

  const LABEL_GRADIENT_DEG =
    __("Gradient direction", "jankx") || "Gradient direction";
  const LABEL_APPLY_BUTTON = __("Apply", "jankx") || "Apply";
  const LABEL_POPOVER_TITLE =
    __("Select Gradient colors and deg", "jankx") ||
    "Select Gradient colors and deg";

  const gradientCSS = useMemo(
    () =>
      `linear-gradient(${gradientDeg}, ${gradientStartColor}, ${gradientEndColor})`,
    [gradientDeg, gradientStartColor, gradientEndColor]
  );

  const applyGradient = useCallback(() => {
    onChange(
      toggleFormat(value, {
        type: "jankx/gradient",
        attributes: {
          style: `background: ${gradientCSS}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`,
          class: "magic-text-gradient",
        },
      })
    );
  }, [gradientCSS, onChange, value]);

  const handleToolbarClick = useCallback(() => {
    if (isActive) {
      onChange(toggleFormat(value, { type: "jankx/gradient" }));
    } else {
      setIsAddingGradient(true);
    }
  }, [isActive, onChange, value]);

  return (
    <>
      <div ref={setPopoverAnchor}>
        <RichTextToolbarButton
          icon={IconGradient}
          title="Gradient Text Color"
          onClick={handleToolbarClick}
          isActive={isActive}
        />
      </div>
      {!isActive && isAddingGradient && (
        <GradientColorUI
          onClose={() => setIsAddingGradient(false)}
          onChange={applyGradient}
          gradientDeg={gradientDeg}
          setGradientDeg={setGradientDeg}
          gradientStartColor={gradientStartColor}
          setGradientStartColor={setGradientStartColor}
          gradientEndColor={gradientEndColor}
          setGradientEndColor={setGradientEndColor}
          popoverAnchor={popoverAnchor}
          LABEL_GRADIENT_DEG={LABEL_GRADIENT_DEG}
          LABEL_APPLY_BUTTON={LABEL_APPLY_BUTTON}
          LABEL_POPOVER_TITLE={LABEL_POPOVER_TITLE}
        />
      )}
    </>
  );
};

registerFormatType("jankx/gradient", {
  title: "Gradient",
  tagName: "span",
  className: 'jankx-gradient',
  attributes: {
    style: "style",
  },
  edit: GradientTextColor,
});
