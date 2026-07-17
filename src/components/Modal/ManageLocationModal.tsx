import { useState } from "react";
import type { City } from "../../types/city";
import {
  Search,
  Star,
  Trash2,
  Plus,
  MapPin,
  LocateFixed,
  Loader2,
} from "lucide-react";

import Modal from "./Modal";
import Skeleton from "../Skeleton/Skeleton";
import { useLocationSearch } from "../../hooks/useLocationSearch";
import { useAutoDetectLocation } from "../../hooks/useAutoDetectLocation";
import { formatLocationName } from "../../utils/location";
import type { Location } from "../../types/location";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  bgGradient: { from: string; to: string };
  cities: City[];
  onCitiesUpdate: (cities: City[]) => void;
}

export default function ManageLocationModal({
  isOpen,
  onClose,
  bgGradient,
  cities,
  onCitiesUpdate,
}: ModalProps) {
  const [query, setQuery] = useState("");
  const { results, loading } = useLocationSearch(query);
  const { loading: gpsLoading, error: gpsError, detect } = useAutoDetectLocation();

  const addCity = (loc: Location) => {
    if (
      cities.some(
        (c) =>
          c.latitude === +loc.lat &&
          c.longitude === +loc.lon
      )
    )
      return;

    onCitiesUpdate([
      ...cities,
      {
        name: loc.display_name,
        country: "",
        latitude: +loc.lat,
        longitude: +loc.lon,
        is_favorite: cities.length === 0,
      },
    ]);
    setQuery("");
  };

  const removeCity = (lat: number, lon: number) => {
    let updated = cities.filter(
      (c) => c.latitude !== lat || c.longitude !== lon
    );

    if (!updated.some((c) => c.is_favorite) && updated.length > 0) {
      updated = updated.map((c, i) =>
        i === 0 ? { ...c, is_favorite: true } : c
      );
    }

    onCitiesUpdate(updated);
  };

  const setFavorite = (lat: number, lon: number) => {
    onCitiesUpdate(
      cities.map((c) => ({
        ...c,
        is_favorite:
          c.latitude === lat && c.longitude === lon,
      }))
    );
  };

  const handleDetectLocation = async () => {
    const loc = await detect();
    if (loc) addCity(loc);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} bgGradient={bgGradient} className="max-w-lg">
      <div className="p-4 sm:p-5">
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
          Manage Locations
        </h2>

        {/* SEARCH */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" strokeWidth={1.5} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 text-white text-sm border border-white/10 placeholder-white/40 focus:outline-none focus:border-white/25 transition"
          />
        </div>

        {/* AUTO DETECT */}
        <button
          onClick={handleDetectLocation}
          disabled={gpsLoading}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm font-medium transition mb-3 disabled:opacity-50"
        >
          {gpsLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
          ) : (
            <LocateFixed className="w-4 h-4" strokeWidth={1.5} />
          )}
          {gpsLoading ? "Detecting..." : "Use My Location"}
        </button>

        {gpsError && (
          <p className="text-red-400 text-xs mb-3">{gpsError}</p>
        )}

        {/* STATES */}
        {loading && (
          <div className="space-y-2 mb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-7 w-14 rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <p className="text-white/40 text-xs mb-4">No results found.</p>
        )}

        {/* SEARCH RESULTS */}
        {results.length > 0 && (
          <div className="mb-5 space-y-0.5">
            <div className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5">
              Results
            </div>
            {results.map((loc, i) => {
              const isSaved = cities.some(
                (c) => c.latitude === +loc.lat && c.longitude === +loc.lon
              );

              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    <MapPin className="w-3.5 h-3.5 text-white/30 shrink-0" strokeWidth={1.5} />
                    <span className="text-sm text-white/80 truncate" title={loc.display_name}>
                      {formatLocationName(loc.display_name)}
                    </span>
                  </div>

                  <button
                    onClick={() => !isSaved && addCity(loc)}
                    disabled={isSaved}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium shrink-0 transition
                      ${isSaved
                        ? "bg-white/10 text-white/40 cursor-not-allowed"
                        : "bg-white/15 text-white/80 hover:bg-white/25"
                      }
                    `}
                  >
                    {isSaved ? (
                      "Saved"
                    ) : (
                      <>
                        <Plus className="w-3 h-3" strokeWidth={2.5} />
                        Add
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* SAVED LOCATIONS */}
        <div className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1.5">
          Saved Locations
        </div>

        {cities.length === 0 ? (
          <p className="text-white/40 text-xs">No saved locations yet.</p>
        ) : (
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1 sidebar-scroll">
            {cities.map((city) => (
              <div
                key={`${city.latitude}-${city.longitude}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition"
              >
                <span
                  className="text-sm text-white/80 truncate flex-1 min-w-0 mr-2"
                  title={city.name}
                >
                  {formatLocationName(city.name)}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setFavorite(city.latitude, city.longitude)}
                    className="p-1.5 rounded-lg hover:bg-white/15 transition"
                    title="Set as favorite"
                  >
                    <Star
                      className={`w-4 h-4 transition ${
                        city.is_favorite
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white/30 hover:text-white/60"
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>

                  <button
                    onClick={() => removeCity(city.latitude, city.longitude)}
                    className="p-1.5 rounded-lg hover:bg-white/15 transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4 text-red-400/70 hover:text-red-400 transition" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
