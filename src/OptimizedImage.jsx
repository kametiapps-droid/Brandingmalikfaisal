import { useState, useRef, useEffect, memo } from 'react'

const OptimizedImage = memo(function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  priority = false 
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef(null)

  const getWebPSrc = (originalSrc) => {
    if (!originalSrc) return null
    if (originalSrc.endsWith('.webp')) return originalSrc
    const baseName = originalSrc.replace(/\.(png|jpg|jpeg)$/i, '')
    return `${baseName}.webp`
  }

  const webpSrc = getWebPSrc(src)
  const fallbackSrc = src

  useEffect(() => {
    if (priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '300px',
        threshold: 0
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isInView])

  const handleError = () => {
    setHasError(true)
  }

  return (
    <div 
      ref={imgRef}
      className={`opt-img-wrap ${className}`}
    >
      {isInView && (
        <picture>
          {webpSrc && !hasError && (
            <source srcSet={webpSrc} type="image/webp" />
          )}
          <img
            src={fallbackSrc}
            alt={alt}
            className={`opt-img ${isLoaded ? 'loaded' : ''}`}
            onLoad={() => setIsLoaded(true)}
            onError={handleError}
            decoding="async"
            fetchpriority={priority ? 'high' : 'low'}
          />
        </picture>
      )}
      {!isLoaded && <div className="opt-img-placeholder" />}
    </div>
  )
})

export default OptimizedImage
