import { useState } from 'react'

const BODY_PREVIEW_LENGTH = 220

export function PostBody({
  body,
  imgUrl,
  videoUrl,
  toggleShowImgPreview,
  link,
  title,
  enableBodyTruncate = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const shouldTruncate =
    enableBodyTruncate && body && body.length > BODY_PREVIEW_LENGTH
  const displayedBody =
    shouldTruncate && !isExpanded
      ? body.slice(0, BODY_PREVIEW_LENGTH).trimEnd()
      : body

  return (
    <section className="post-body">
      {title && (
        <div className="title">
          <h1 className="text-gray-900">{title}</h1>
        </div>
      )}
      {body && (
        <div className="post-text">
          <p className="text-gray-500">
            {displayedBody}
            {shouldTruncate && !isExpanded && (
              <button
                type="button"
                className="read-more-btn"
                onClick={() => setIsExpanded(true)}
              >
                ...read more
              </button>
            )}
          </p>
        </div>
      )}
      {link && (
        <div className="link">
          <a href={link} target="_blank" rel="noreferrer">
            <span className="the-link text-blue-600">{link}</span>
          </a>
        </div>
      )}
      {imgUrl && (
        <div className="img-container" onClick={toggleShowImgPreview}>
          <img src={imgUrl} alt="" />
        </div>
      )}
      {videoUrl && (
        <div className="video-container">
          <video width="100%" height="300" controls>
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
    </section>
  )
}
