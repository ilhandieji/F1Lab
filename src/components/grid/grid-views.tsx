import type { GridTabId, SeasonGrid } from "@/lib/grid/types";
import { ActivityView } from "./activity-view";
import { ConstructorStandings } from "./constructor-standings";
import { DriverGrid } from "./driver-grid";

export function GridViews({ data, activeTab }: { data: SeasonGrid; activeTab: GridTabId }) {
  return (
    <div className="animate-in fade-in duration-300 motion-reduce:animate-none">
      <div hidden={activeTab !== "drivers"}>
        <DriverGrid
          year={data.year}
          drivers={data.startingDrivers}
          highestPoints={data.highestPoints}
        />
      </div>
      <div hidden={activeTab !== "activity"}>
        <ActivityView activity={data.activity} />
      </div>
      <div hidden={activeTab !== "constructors"}>
        <ConstructorStandings
          year={data.year}
          standings={data.constructorStandings}
          note={data.constructorStandingsNote}
          emptyMessage={data.constructorStandingsEmptyMessage}
        />
      </div>
    </div>
  );
}
