"use client";
import { useState } from "react";
import Link from "next/link";
import { MoodCheckIn } from "./mood-check-in";
import { CompanionPicker } from "./companion-picker";
import { moodRepository } from "@/lib/repositories";
import type { CompanionId } from "@/features/companions/catalog";

const places = [
  {
    id: "cottage",
    href: "/chat",
    title: "倾听小屋",
    detail: "与 AI 对话，倾听心声",
  },
  {
    id: "stream",
    href: "/games/stream",
    title: "心绪溪流",
    detail: "释放情绪，放松心绪",
  },
  {
    id: "greenhouse",
    href: "/games",
    title: "静心花房",
    detail: "呼吸练习与植物养成",
  },
] as const;

export function Courtyard() {
  const [companionId, setCompanionId] = useState<CompanionId | "custom">("fox");
  const [showCompanionPicker, setShowCompanionPicker] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="courtyard" aria-label="心屿庭院">
      <div className="courtyard-base" aria-hidden="true" />
      <div className="courtyard-mist" aria-hidden="true" />
      <div className="courtyard-atmosphere" aria-hidden="true" />

      <div className="courtyard-content">
        <header className="courtyard-heading">
          <p>循着晨光，慢慢靠近此刻的自己</p>
          <h1>今天，想去哪里走走？</h1>
        </header>

        <div className="courtyard-places">
          {places.map((place) => (
            <Link
              className={`place-hotspot place-hotspot--${place.id}`}
              href={place.href}
              key={place.id}
            >
              <strong>{place.title}</strong>
              <span>{place.detail}</span>
              <span className="place-hotspot__action" aria-hidden="true">
                走近看看 <span>→</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="courtyard-mood-section">
          <MoodCheckIn
            date={today}
            onSave={async (entry) => {
              await moodRepository.save(entry);
              setShowCompanionPicker(true);
            }}
          />
        </div>

        {showCompanionPicker && (
          <div className="courtyard-companion-section">
            <CompanionPicker
              value={companionId}
              onChange={(id) => {
                setCompanionId(id);
                localStorage.setItem("xinyu.companion", id);
              }}
            />
          </div>
        )}
      </div>

      <div className="courtyard-foreground" aria-hidden="true" />
    </section>
  );
}

