"use client";
import { useState } from "react";
import { companions, type CompanionId } from "@/features/companions/catalog";
import { saveCustomAvatar } from "@/lib/avatar-store";

export function CompanionPicker({
  value,
  onChange,
}: {
  value: CompanionId | "custom";
  onChange: (id: CompanionId | "custom") => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <fieldset>
      <legend>选择你的陪伴者</legend>
      {companions.map((companion) => (
        <label key={companion.id}>
          <input
            type="radio"
            name="companion"
            value={companion.id}
            checked={value === companion.id}
            onChange={() => onChange(companion.id)}
          />
          {companion.name}（{companion.kind}）— {companion.tone}
        </label>
      ))}
      <label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              await saveCustomAvatar(file);
              setPreview(URL.createObjectURL(file));
              onChange("custom");
            } catch {
              // invalid file — silently ignore
            }
          }}
        />
        自定义头像
      </label>
      {preview && <img src={preview} alt="自定义头像预览" />}
    </fieldset>
  );
}
