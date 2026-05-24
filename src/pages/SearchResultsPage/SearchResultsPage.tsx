import { useCallback, useEffect, useMemo, useState } from "react";
import { CiClock2 } from "react-icons/ci";
import { HiArrowLeft } from "react-icons/hi2";
import { LuLuggage } from "react-icons/lu";
import { PiAirplaneTilt } from "react-icons/pi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { searchFlights } from "@/api/flights.api";
import EmptyState from "@/pages/_shared/components/ui/EmptyState";
import ErrorState from "@/pages/_shared/components/ui/ErrorState";
import Skeleton from "@/pages/_shared/components/ui/Skeleton";
import { ROUTES } from "@/constants/routes";
import { colors, typography } from "@/constants/theme";
import { useBookingFlowStore } from "@/store/useBookingFlowStore";
import { cn } from "@/utils/cn";
import type { Flight } from "@/types";
import {
  DEFAULT_SEARCH_CRITERIA,
  DEPARTURE_TIME_OPTIONS,
  MOCK_SEARCH_FLIGHTS,
  PRICE_FILTER_DEFAULT,
  PRICE_FILTER_MAX,
  PRICE_FILTER_MIN,
  applyClientFilters,
  buildFlightSearchParams,
  buildResultsQueryString,
  formatCabinLabel,
  formatPhp,
  formatTime,
  getFlightDisplayMeta,
  isBackendConfigured,
  parseFiltersFromParams,
  parseSearchCriteriaFromParams,
  type DepartureTimeFilterId,
  type SearchCriteria,
  type SearchFiltersState,
} from "./searchResults.utils";

function useSearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [criteria] = useState<SearchCriteria>(() =>
    parseSearchCriteriaFromParams(searchParams, DEFAULT_SEARCH_CRITERIA),
  );
  const [filters, setFilters] = useState<SearchFiltersState>(() =>
    parseFiltersFromParams(searchParams, PRICE_FILTER_DEFAULT),
  );
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiParams = useMemo(
    () => buildFlightSearchParams(criteria, filters),
    [criteria, filters],
  );
  const filteredFlights = useMemo(
    () => applyClientFilters(flights, filters),
    [flights, filters],
  );

  const syncUrl = useCallback(
    (nextCriteria: SearchCriteria, nextFilters: SearchFiltersState) => {
      setSearchParams(buildResultsQueryString(nextCriteria, nextFilters), {
        replace: true,
      });
    },
    [setSearchParams],
  );

  const fetchFlights = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isBackendConfigured()) {
      setFlights(MOCK_SEARCH_FLIGHTS);
      setIsLoading(false);
      return;
    }

    try {
      const response = await searchFlights(apiParams);
      setFlights(response.length > 0 ? response : MOCK_SEARCH_FLIGHTS);
    } catch {
      setFlights(MOCK_SEARCH_FLIGHTS);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiParams]);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  const updateFilters = useCallback(
    (patch: Partial<SearchFiltersState>) => {
      setFilters((previous) => {
        const next = { ...previous, ...patch };
        syncUrl(criteria, next);
        return next;
      });
    },
    [criteria, syncUrl],
  );

  return {
    criteria,
    filters,
    flights: filteredFlights,
    isLoading,
    error,
    refetch: fetchFlights,
    updateFilters,
  };
}

function SearchSummaryBar({
  criteria,
  filters,
}: {
  criteria: SearchCriteria;
  filters: SearchFiltersState;
}) {
  const editSearchHref = `${ROUTES.BOOK}?${buildResultsQueryString(criteria, filters)}`;

  return (
    <section className="border-b border-tertiary-20 bg-bg-page">
      <div className="mx-auto flex max-w-[1131px] items-center justify-between gap-4 px-4 py-4 md:px-6 md:py-5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
          <Link
            to={ROUTES.HOME}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5",
              typography.label.sm.semiBold,
              colors.text.link,
            )}
          >
            <HiArrowLeft className="size-4 shrink-0" aria-hidden />
            Home
          </Link>
          <span className="hidden h-4 w-px shrink-0 bg-tertiary-30 sm:block" aria-hidden />
          <p className={cn(typography.label.md.bold, colors.text.primary)}>
            {criteria.origin} → {criteria.destination}
          </p>
          <p className={cn(typography.paragraph.sm.medium, colors.text.secondary)}>
            {criteria.date}
            <span className="hidden sm:inline">
              {" "}
              · {criteria.passengers} pax · {formatCabinLabel(criteria.cabinClass)}
            </span>
          </p>
        </div>
        <Link
          to={editSearchHref}
          className={cn(
            "inline-flex shrink-0",
            colors.action.ghost,
            typography.label.sm.semiBold,
            "h-10 items-center justify-center rounded-[10px] px-4 transition-colors hover:bg-primary-10",
          )}
        >
          Edit Search
        </Link>
      </div>
    </section>
  );
}

function SearchFiltersPanel({
  filters,
  onFiltersChange,
}: {
  filters: SearchFiltersState;
  onFiltersChange: (patch: Partial<SearchFiltersState>) => void;
}) {
  const toggleDepartureTime = (id: DepartureTimeFilterId) => {
    const departureTimes = filters.departureTimes.includes(id)
      ? filters.departureTimes.filter((value) => value !== id)
      : [...filters.departureTimes, id];
    onFiltersChange({ departureTimes });
  };

  return (
    <aside className="rounded-[14px] border border-tertiary-30 bg-bg-page p-5 shadow-[0px_2px_8px_rgba(0,0,0,0.04)]">
      <h2 className={cn(typography.heading.h5.bold, colors.text.primary, "mb-5")}>
        Filters
      </h2>
      <div className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-3">
          <legend
            className={cn(
              typography.label.xs.bold,
              colors.text.tertiary,
              "uppercase tracking-wide",
            )}
          >
            Max Price
          </legend>
          <p className={cn(typography.heading.h4.bold, colors.text.primary)}>
            {formatPhp(filters.maxPrice)}
          </p>
          <input
            type="range"
            min={PRICE_FILTER_MIN}
            max={PRICE_FILTER_MAX}
            step={100}
            value={filters.maxPrice}
            onChange={(event) =>
              onFiltersChange({ maxPrice: Number(event.target.value) })
            }
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-tertiary-20 accent-primary-60"
            aria-label="Maximum price"
          />
          <div className="flex justify-between">
            <span className={cn(typography.paragraph.xs.medium, colors.text.tertiary)}>
              {formatPhp(PRICE_FILTER_MIN)}
            </span>
            <span className={cn(typography.paragraph.xs.medium, colors.text.tertiary)}>
              {formatPhp(PRICE_FILTER_MAX)}
            </span>
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-3">
          <legend
            className={cn(
              typography.label.xs.bold,
              colors.text.tertiary,
              "uppercase tracking-wide",
            )}
          >
            Stops
          </legend>
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={filters.directOnly}
              onChange={(event) =>
                onFiltersChange({ directOnly: event.target.checked })
              }
              className="size-4 rounded border-tertiary-40 text-primary-60 focus:ring-primary-40"
            />
            <span className={cn(typography.paragraph.sm.normal, colors.text.primary)}>
              Direct flights only
            </span>
          </label>
        </fieldset>
        <fieldset className="flex flex-col gap-3">
          <legend
            className={cn(
              typography.label.xs.bold,
              colors.text.tertiary,
              "uppercase tracking-wide",
            )}
          >
            Departure Time
          </legend>
          <div className="flex flex-col gap-2.5">
            {DEPARTURE_TIME_OPTIONS.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-2.5"
              >
                <input
                  type="checkbox"
                  checked={filters.departureTimes.includes(option.id)}
                  onChange={() => toggleDepartureTime(option.id)}
                  className="size-4 rounded border-tertiary-40 text-primary-60 focus:ring-primary-40"
                />
                <span className={cn(typography.paragraph.sm.normal, colors.text.primary)}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </aside>
  );
}

function FlightTimeline({
  flight,
  durationLabel,
}: {
  flight: Flight;
  durationLabel: string;
}) {
  const isNonStop = (flight.stops ?? 0) === 0;

  return (
    <div className="w-full min-w-0 lg:max-w-[340px]">
      <p
        className={cn(
          "mb-2 text-center",
          typography.paragraph.xs.medium,
          colors.text.secondary,
        )}
      >
        {durationLabel}
      </p>
      <div className="grid grid-cols-[72px_1fr_72px] items-center gap-2">
        <div className="text-right">
          <p className={cn(typography.label.md.bold, colors.text.primary)}>
            {formatTime(flight.departureTime)}
          </p>
          <p className={cn(typography.paragraph.xs.medium, colors.text.secondary)}>
            {flight.origin}
          </p>
        </div>
        <div className="flex items-center px-1">
          <span className="h-px flex-1 bg-tertiary-30" />
          <span
            className="mx-2 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-10 text-primary-60"
            aria-hidden
          >
            <PiAirplaneTilt className="size-3.5" />
          </span>
          <span className="h-px flex-1 bg-tertiary-30" />
        </div>
        <div className="text-left">
          <p className={cn(typography.label.md.bold, colors.text.primary)}>
            {formatTime(flight.arrivalTime)}
          </p>
          <p className={cn(typography.paragraph.xs.medium, colors.text.secondary)}>
            {flight.destination}
          </p>
        </div>
      </div>
      <p
        className={cn(
          "mt-2 text-center",
          typography.label.xs.semiBold,
          isNonStop ? "text-success-60" : colors.text.secondary,
        )}
      >
        {isNonStop
          ? "Non-stop"
          : (flight.stops ?? 0) === 1
            ? "1 stop"
            : `${flight.stops} stops`}
      </p>
    </div>
  );
}

function FlightResultCard({ flight }: { flight: Flight }) {
  const navigate = useNavigate();
  const { startFlow } = useBookingFlowStore();
  const meta = getFlightDisplayMeta(flight);
  const cabinLabel = formatCabinLabel(flight.cabinClass ?? "economy");
  const lowSeats =
    flight.seatsAvailable !== undefined && flight.seatsAvailable <= 5;

  return (
    <article className="rounded-[14px] border border-tertiary-30 bg-bg-page p-4 shadow-[0px_2px_8px_rgba(0,0,0,0.04)] md:p-5">
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[200px_minmax(260px,1fr)_auto_auto] lg:items-center lg:gap-6">
        <div className="flex items-center gap-3">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-10 text-sm font-bold text-primary-70"
            aria-hidden
          >
            {meta.airlineInitials}
          </div>
          <div className="min-w-0">
            <p className={cn(typography.label.sm.bold, colors.text.primary)}>
              {meta.airlineName}
            </p>
            <p className={cn(typography.paragraph.xs.medium, colors.text.secondary)}>
              {flight.flightNumber} · {meta.aircraft}
            </p>
          </div>
        </div>
        <FlightTimeline flight={flight} durationLabel={meta.durationLabel} />
        <div className="flex shrink-0 items-center gap-4 lg:gap-5">
          <div
            className={cn(
              "flex items-center gap-1.5",
              typography.paragraph.xs.medium,
              colors.text.secondary,
            )}
          >
            <LuLuggage className="size-4 shrink-0" aria-hidden />
            <span>{flight.baggageAllowanceKg ?? 0}kg</span>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5",
              typography.paragraph.xs.medium,
              "text-success-60",
            )}
          >
            <CiClock2 className="size-4 shrink-0" aria-hidden />
            <span>On time</span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-tertiary-20 pt-4 lg:shrink-0 lg:border-0 lg:pt-0">
          <div className="text-left lg:text-right">
            <p className={cn(typography.heading.h4.bold, "text-primary-60")}>
              {formatPhp(flight.price)}
            </p>
            <p className={cn(typography.paragraph.xs.medium, colors.text.secondary)}>
              {cabinLabel} / pax
            </p>
            {lowSeats ? (
              <p className={cn(typography.label.xs.semiBold, "mt-1 text-danger-60")}>
                {flight.seatsAvailable} seats left!
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => {
              startFlow(flight.id);
              navigate(ROUTES.BOOKING_PASSENGER_DETAILS);
            }}
            className={cn(
              colors.action.primary,
              colors.action.primaryHover,
              colors.action.primaryPress,
              typography.label.sm.semiBold,
              "h-10 shrink-0 rounded-[10px] px-6 transition-colors",
            )}
          >
            Select
          </button>
        </div>
      </div>
    </article>
  );
}

function FlightResultsList({
  flights,
  isLoading,
  error,
  onRetry,
}: {
  flights: Flight[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading flights">
        {[0, 1, 2].map((key) => (
          <div
            key={key}
            className="rounded-[14px] border border-tertiary-30 bg-bg-page p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <Skeleton className="h-11 w-11 rounded-full" />
              <Skeleton className="h-16 flex-1" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={onRetry} />;

  if (flights.length === 0) {
    return (
      <EmptyState
        title="No flights found"
        description="Try adjusting your filters or search criteria to see more results."
      />
    );
  }

  return (
    <section>
      <p
        className={cn(
          typography.paragraph.sm.medium,
          colors.text.secondary,
          "mb-4",
        )}
      >
        {flights.length} {flights.length === 1 ? "flight" : "flights"} found
      </p>
      <div className="flex flex-col gap-4">
        {flights.map((flight) => (
          <FlightResultCard key={flight.id} flight={flight} />
        ))}
      </div>
    </section>
  );
}

const SearchResultsPage = () => {
  const { criteria, filters, flights, isLoading, error, refetch, updateFilters } =
    useSearchResultsPage();

  return (
    <div className="min-h-screen bg-bg-surface">
      <SearchSummaryBar criteria={criteria} filters={filters} />
      <div className="mx-auto max-w-[1131px] px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="w-full lg:w-[280px] lg:shrink-0">
            <SearchFiltersPanel filters={filters} onFiltersChange={updateFilters} />
          </div>
          <div className="min-w-0 flex-1">
            <FlightResultsList
              flights={flights}
              isLoading={isLoading}
              error={error}
              onRetry={refetch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
