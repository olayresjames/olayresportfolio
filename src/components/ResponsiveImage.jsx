export default function ResponsiveImage({ item, sizes = '(max-width: 768px) 92vw, 45vw', eager = false }) {
  return (
    <picture>
      {item.webp && <source srcSet={`${item.webpSmall ? `${item.webpSmall} 800w, ` : ''}${item.webp} ${item.imageWidth}w`} sizes={sizes} type="image/webp" />}
      <img
        src={item.image}
        alt={item.alt}
        width={item.imageWidth}
        height={item.imageHeight}
        loading={eager ? undefined : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : undefined}
      />
    </picture>
  );
}
