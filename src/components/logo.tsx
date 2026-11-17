import Image from "next/image";

type LogoProps = {
  tone?: "forest" | "white";
  className?: string;
  priority?: boolean;
};

const assets = {
  forest: { src: "/brand/wordmark.svg", width: 274, height: 89 },
  white: { src: "/brand/wordmark-on-forest.svg", width: 710, height: 230 },
} as const;

export function Logo({ tone = "forest", className = "h-8 w-auto", priority = false }: LogoProps) {
  const asset = assets[tone];

  return (
    <Image
      src={asset.src}
      alt="Wageet"
      width={asset.width}
      height={asset.height}
      className={`${className} max-w-none shrink-0`}
      style={{ width: "auto" }}
      unoptimized
      priority={priority}
    />
  );
}
