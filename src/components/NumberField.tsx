import { useEffect, useRef, useState } from "react";

interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max?: number;
  onCommit: (value: number) => void;
}

/**
 * Numeric input that tolerates a transiently empty/partial value while typing.
 * Live numeric edits propagate immediately; clamping is reflected on blur so the
 * field can be cleared and retyped without snapping back to the minimum.
 */
export function NumberField({ label, value, min, max, onCommit }: NumberFieldProps) {
  const [draft, setDraft] = useState(() => String(value));
  const isFocused = useRef(false);

  // Sync external (e.g. clamped) values in, but never fight the user mid-edit.
  useEffect(() => {
    if (!isFocused.current) setDraft(String(value));
  }, [value]);

  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={draft}
        onFocus={() => {
          isFocused.current = true;
        }}
        onChange={(e) => {
          const raw = e.target.value;
          setDraft(raw);
          if (raw !== "") {
            const parsed = Number(raw);
            if (!Number.isNaN(parsed)) onCommit(parsed);
          }
        }}
        onBlur={() => {
          isFocused.current = false;
          setDraft(String(value));
        }}
      />
    </label>
  );
}
