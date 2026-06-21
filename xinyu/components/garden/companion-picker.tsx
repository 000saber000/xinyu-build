"use client";
import { useState } from "react";
import Image from "next/image";
import { companions, type CompanionId } from "@/features/companions/catalog";
import { saveCustomAvatar } from "@/lib/avatar-store";
import { COMPANION_SPRITE } from "@/lib/visual-assets";

export function CompanionPicker({
  value,
  onChange,
}: {
  value: CompanionId | "custom";
  onChange: (id: CompanionId | "custom") => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <fieldset className="companion-picker">
      <legend>我的陪伴者</legend>
      <div className="companion-picker__grid">
      {companions.map((companion) => (
        <label className="companion-option" key={companion.id}>
          <input
            type="radio"
            name="companion"
            value={companion.id}
            checked={value === companion.id}
            onChange={() => onChange(companion.id)}
          />
          <span
            aria-hidden="true"
            className="companion-option__art"
            data-testid="companion-art"
            style={{
              backgroundImage: `url("${COMPANION_SPRITE}")`,
              backgroundPosition: companion.spritePosition,
            }}
          />
          <strong>{companion.name}</strong>
          <small>{companion.kind}</small>
        </label>
      ))}
      </div>
      <label className="companion-upload">
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
        <span>＋ 自定义头像</span>
      </label>
      {preview && <Image src={preview} alt="自定义头像预览" width={96} height={96} unoptimized />}
    </fieldset>
  );
}
