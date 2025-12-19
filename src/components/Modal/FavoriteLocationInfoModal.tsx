import type { City } from "../../types/city";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  favoriteCity: City;
  bgGradient: { from: string; to: string };
}

export default function FavoriteLocationInfoModal({
  isOpen,
  onClose,
  // favoriteCity,
  bgGradient,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
      style={{
        background: `linear-gradient(to bottom, ${bgGradient.from}DD, ${bgGradient.to}DD)`,
      }}
    >
      <div className="relative w-full max-w-md p-6 bg-white/10 rounded-2xl border border-white/30 shadow-lg">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/20 transition"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-white mb-4">
          Favorite Location
        </h2>

        <p className="text-white/80 text-sm leading-relaxed">
          Your favorite location serves as the primary reference for providing default weather data throughout the app. Selecting a favorite ensures that the app will automatically display current weather conditions and forecasts for this location whenever you open the app, even before searching for other cities or locations.
        </p>
      </div>
    </div>
  );
}