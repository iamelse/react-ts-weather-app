import { useState } from "react";
import type { City } from "../../types/city";
import {
  X,
  Search,
  Star,
  Trash2,
  Plus,
} from "lucide-react";

import { useLocationSearch } from "../../hooks/useLocationSearch";
import { formatLocationName } from "../../utils/location";

interface Location {
  display_name: string;
  lat: string;
  lon: string;
}

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

  /* ==========================
     ACTIONS
  ========================== */

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
      style={{
        background: `linear-gradient(to bottom, ${bgGradient.from}88, ${bgGradient.to}88)`,
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl p-6 bg-white/10 border border-white/30 backdrop-blur-sm shadow">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/20 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <h2 className="text-2xl font-semibold text-white mb-6">
          Manage Locations
        </h2>

        {/* SEARCH */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, region, or place..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/10 text-white border border-white/30 placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40"
          />
        </div>

        {/* STATES */}
        {loading && (
          <p className="text-white/70 text-sm mb-3">
            Searching locations…
          </p>
        )}

        {!loading && query && results.length === 0 && (
          <p className="text-white/50 text-sm mb-3">
            No results found.
          </p>
        )}

        {/* SEARCH RESULTS */}
        {results.length > 0 && (
          <ul className="space-y-1 mb-6">
            {results.map((loc, i) => (
              <li
                key={i}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/20 transition"
              >
                <span
                  className="text-white text-sm truncate flex-1 mr-3"
                  title={loc.display_name}
                >
                  {formatLocationName(loc.display_name)}
                </span>

                <button
                  onClick={() => addCity(loc)}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition"
                >
                  <Plus className="w-3 h-3" />
                  Save
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* SAVED LOCATIONS */}
        <h3 className="text-white/80 text-sm mb-2">
          Saved Locations
        </h3>

        {cities.length === 0 ? (
          <p className="text-white/50 text-sm">
            No saved locations yet.
          </p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-auto pr-1">
            {cities.map((city) => (
              <li
                key={`${city.latitude}-${city.longitude}`}
                className="flex items-center justify-between p-2 rounded-lg bg-white/10 hover:bg-white/15 transition"
              >
                <span
                  className="text-white text-sm truncate flex-1"
                  title={city.name}
                >
                  {formatLocationName(city.name)}
                </span>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() =>
                      setFavorite(
                        city.latitude,
                        city.longitude
                      )
                    }
                  >
                    <Star
                      className={`w-4 h-4 transition ${
                        city.is_favorite
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white/40 hover:text-white/70"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() =>
                      removeCity(
                        city.latitude,
                        city.longitude
                      )
                    }
                  >
                    <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300 transition" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}