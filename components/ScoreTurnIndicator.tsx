// components/ScoreTurnIndicator.tsx
import React from "react";
import { PartyTeam } from "../lib/types";
import clsx from "clsx";

interface Props {
  teams: PartyTeam[];
  currentTurn: number;
  winCount: number;
}

export const ScoreTurnIndicator: React.FC<Props> = ({ teams, currentTurn, winCount }) => {
  return (
    <div className="mb-[min(3vw,1.5rem)]">
      {teams.map((team, index) => {
        const isActive = index === currentTurn;

        return (
          <div
            key={team.name}
            className={clsx(
              "mb-[min(1vw,0.5rem)] transition-all duration-300",
              isActive ? "text-white font-bold text-[clamp(1.2rem,4vw,4.5rem)] animate-bounce" : "text-gray-400 text-[clamp(1rem,3vw,3rem)]"
            )}
          >
            <div>{team.name}</div>
            <div className="flex gap-[min(0.5vw,4px)] mt-[min(0.5vw,4px)]">
              {Array.from({ length: winCount }).map((_, i) => (
                <div
                  key={i}
                  className={clsx(
                    "w-[min(1.5vw,36px)] h-[min(1.5vw,36px)] min-w-[12px] min-h-[12px] rounded-full transition-all duration-200",
                    i < team.score
                      ? "bg-green-500"
                      : isActive
                      ? "bg-gray-300"
                      : "bg-gray-200 opacity-50"
                  )}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
