import './image.style.scss'
import { FunctionComponent, StyleHTMLAttributes, useState } from 'react'

interface ISource {
  mediaWidth: string
  srcset: string
}

interface ImageProps {
  source?: ISource[]
  fallback: {
    src: string
    alt: string
    style?: StyleHTMLAttributes<HTMLImageElement>
  }
}

const Image: FunctionComponent<ImageProps> = ({ source, fallback }) => {
  return (
    <div className="wrapper-image">
      <picture>
        {source
          ? source.map((src) => (
              <source
                media={src.mediaWidth}
                srcSet={src.srcset}
                key={src.srcset}
              />
            ))
          : null}
        <img src={fallback.src} alt={fallback.alt} style={fallback.style} />
      </picture>
    </div>
  )
}

export default Image
