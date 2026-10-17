import type { GridTabId, SeasonGrid } from "@/lib/grid/types";
import { GridViews } from "./grid-views";

export function GridExplorer({
  data,
  activeTab,
}: {
  data: SeasonGrid;
  activeTab: GridTabId;
}) {
  return <GridViews data={data} activeTab={activeTab} />;
}
