import { prisma } from "@/lib/prisma";

export type CircuitCountry = {
  countryAlpha2: string | null;
  countryName: string | null;
};

const emptyCountry: CircuitCountry = {
  countryAlpha2: null,
  countryName: null,
};

/** Circuit host country for each circuit id. Avoids selecting `country`, whose Prisma type clashes on `constructor`. */
export async function loadCircuitCountries(circuitIds: readonly string[]): Promise<Map<string, CircuitCountry>> {
  const ids = [...new Set(circuitIds)];
  if (ids.length === 0) return new Map();

  const circuits = await prisma.circuit.findMany({
    where: { id: { in: ids } },
    select: { id: true, country_id: true },
  });
  const countryIds = [...new Set(circuits.map((circuit) => circuit.country_id))];
  const countries = countryIds.length
    ? await prisma.country.findMany({
        where: { id: { in: countryIds } },
      })
    : [];
  const countryById = new Map(countries.map((country) => [country.id, country]));

  return new Map(
    circuits.map((circuit) => {
      const country = countryById.get(circuit.country_id);
      return [
        circuit.id,
        country
          ? { countryAlpha2: country.alpha2_code, countryName: country.name }
          : emptyCountry,
      ];
    }),
  );
}

export function circuitCountryFor(
  countries: Map<string, CircuitCountry>,
  circuitId: string,
): CircuitCountry {
  return countries.get(circuitId) ?? emptyCountry;
}
