export function Icon({
  name,
  className = "size-4",
}: {
  name: string;
  className?: string;
}) {
  return <img src={`/icons/${name}.svg`} alt="" className={`${className} max-w-none shrink-0`} />;
}
