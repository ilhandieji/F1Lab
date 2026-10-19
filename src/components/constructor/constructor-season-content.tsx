import type { ConstructorSeasonView, ConstructorTabId } from "@/lib/constructor/types";
import { ConstructorRaceLog } from "./constructor-race-log";
import { ConstructorSeasonPanel } from "./constructor-season-panel";

type ConstructorSeasonContentProps = {
  view: ConstructorSeasonView;
  activeTab: ConstructorTabId;
};

export function ConstructorSeasonContent({ view, activeTab }: ConstructorSeasonContentProps) {
  if (activeTab === "races") {
    return <ConstructorRaceLog view={view} />;
  }
  return <ConstructorSeasonPanel view={view} />;
}
