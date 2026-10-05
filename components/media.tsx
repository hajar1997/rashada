import Image from "next/image";
import type { ImageAsset } from "@/lib/content";

type MediaProps = {
  image?: ImageAsset;
  sizes: string;
  className?: string;
  imageClassName?: string;
  preload?: boolean;
};

/** Image frame that falls back to the Figma placeholder surface when no asset is set. */
export function Media({ image, sizes, className = "", imageClassName = "", preload }: MediaProps) {
  return (
    <div className={`relative overflow-hidden bg-placeholder ${className}`}>
      {image && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          preload={preload}
          draggable={false}
          className={`object-cover ${imageClassName}`}
        />
      )}
    </div>
  );
}
