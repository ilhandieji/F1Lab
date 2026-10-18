import type { DriverSeasonView, DriverTabId } from "@/lib/driver/types";
import { DriverRaceLog } from "./driver-race-log";
import { DriverSeasonPanel } from "./driver-season-panel";

type DriverSeasonContentProps = {
  view: DriverSeasonView;
  activeTab: DriverTabId;
};

export function DriverSeasonContent({ view, activeTab }: DriverSeasonContentProps) {
  if (activeTab === "races") {
    return <DriverRaceLog view={view} />;
  }
  return <DriverSeasonPanel view={view} />;
}
