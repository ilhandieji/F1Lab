import type { TeamInfo } from "@/lib/grid/types";

export type ConstructorChronologyLink = {
  otherConstructorId: string;
  otherConstructorName: string;
  otherConstructorCountryAlpha2: string | null;
  otherConstructorCountryName: string | null;
  yearFrom: number;
  yearTo: number | null;
};

export type ConstructorCareerTotals = {
  championshipWins: number;
  raceWins: number;
  oneTwoFinishes: number;
  podiums: number;
  podiumRaces: number;
  polePositions: number;
  fastestLaps: number;
  careerPoints: number;
  championshipPoints: number;
  raceEntries: number;
  raceStarts: number;
  raceLaps: number;
  bestChampionshipPosition: number | null;
  bestRaceResult: number | null;
  sprintRaceWins: number;
};

export type ConstructorProfile = {
  id: string;
  name: string;
  fullName: string;
  country: string;
  countryAlpha2: string | null;
  careerTotals: ConstructorCareerTotals;
  careerYears: number[];
  debutYear: number;
  defaultSeason: number;
  chronology: ConstructorChronologyLink[];
};

export type ConstructorSeasonStanding = {
  position: string;
  positionNumber: number | null;
  points: number;
  championshipWon: boolean;
  engineManufacturerName: string;
};

export type ConstructorSeasonTotals = {
  raceEntries: number;
  raceStarts: number;
  wins: number;
  oneTwoFinishes: number;
  podiums: number;
  podiumRaces: number;
  polePositions: number;
  fastestLaps: number;
  points: number;
  sprintRaceStarts: number;
  sprintRaceWins: number;
  bestStartingGridPosition: number | null;
  bestRaceResult: number | null;
};

export type ConstructorEntrantRegistration = {
  entrantId: string;
  entrantName: string;
  entrantCountry: string;
  engineManufacturerId: string;
  engineManufacturerName: string;
};

export type ConstructorLineupDriver = {
  driverId: string;
  driverName: string;
  nationalityAlpha2: string | null;
  nationalityName: string | null;
  portraitUrl: string | null;
  entrantName: string;
  engineManufacturerName: string;
  rounds: string | null;
  roundsText: string | null;
  testDriver: boolean;
};

export type ConstructorChassisEntry = {
  entrantName: string;
  chassisName: string;
  chassisFullName: string;
  engineManufacturerName: string;
};

export type ConstructorEngineEntry = {
  entrantName: string;
  engineName: string;
  engineFullName: string;
  engineManufacturerName: string;
  capacity: number | null;
  configuration: string | null;
  aspiration: string | null;
};

export type ConstructorTyreEntry = {
  entrantName: string;
  tyreManufacturerName: string;
  engineManufacturerName: string;
};

export type ConstructorChampionshipSnapshot = {
  round: number;
  grandPrixName: string;
  countryAlpha2: string | null;
  countryName: string | null;
  position: string;
  positionNumber: number | null;
  points: number;
  championshipWon: boolean;
  engineManufacturerName: string;
};

export type ConstructorRaceResult = {
  round: number;
  grandPrixName: string;
  countryAlpha2: string | null;
  countryName: string | null;
  driverId: string;
  driverName: string;
  nationalityAlpha2: string | null;
  nationalityName: string | null;
  portraitUrl: string | null;
  gridPosition: string | null;
  finishPosition: string;
  finishNumber: number | null;
  points: number;
  pole: boolean;
  fastestLap: boolean;
  retired: boolean;
  retirementReason: string | null;
  tyreManufacturerName: string;
  engineManufacturerName: string;
};

export type ConstructorSeasonView = {
  year: number;
  team: TeamInfo;
  standing: ConstructorSeasonStanding | null;
  totals: ConstructorSeasonTotals | null;
  entrantRegistrations: ConstructorEntrantRegistration[];
  lineup: ConstructorLineupDriver[];
  chassis: ConstructorChassisEntry[];
  engines: ConstructorEngineEntry[];
  tyres: ConstructorTyreEntry[];
  championshipProgression: ConstructorChampionshipSnapshot[];
  races: ConstructorRaceResult[];
};

export const CONSTRUCTOR_TABS = [
  { id: "season" },
  { id: "races" },
] as const;

export type ConstructorTabId = (typeof CONSTRUCTOR_TABS)[number]["id"];

export function isConstructorTabId(value: string | null | undefined): value is ConstructorTabId {
  return CONSTRUCTOR_TABS.some((tab) => tab.id === value);
}

export type ConstructorSearchHit = {
  id: string;
  name: string;
  fullName: string;
  country: string;
  countryAlpha2: string | null;
  championshipWins: number;
};
