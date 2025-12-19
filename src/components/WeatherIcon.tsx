type WeatherIconProps = {
  name: string;
  size?: number;
  alt?: string;
};

export default function WeatherIcon({
  name,
  size = 80,
  alt = "weather icon",
}: WeatherIconProps) {
  return (
    <img
      src={`/icons/meteocons/${name}`}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
    />
  );
}