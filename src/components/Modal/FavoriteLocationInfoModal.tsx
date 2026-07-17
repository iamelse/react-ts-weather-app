import Modal from "./Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bgGradient: { from: string; to: string };
}

export default function FavoriteLocationInfoModal({
  isOpen,
  onClose,
  bgGradient,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} bgGradient={bgGradient}>
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
          Favorite Location
        </h2>

        <p className="text-white/80 text-sm leading-relaxed">
          Your favorite location serves as the primary reference for providing default weather data throughout the app. Selecting a favorite ensures that the app will automatically display current weather conditions and forecasts for this location whenever you open the app, even before searching for other cities or locations.
        </p>
      </div>
    </Modal>
  );
}