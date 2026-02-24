export function PostBody({
  body,
  imgUrl,
  videoUrl,
  toggleShowImgPreview,
  link,
  title,
}) {
  return (
    <section className="post-body">
      {title && (
        <div className="title">
          <h1 className="text-gray-900 dark:text-white">{title}</h1>
        </div>
      )}
      {body && (
        <div className="post-text">
          <p className="text-gray-500 dark:text-gray-400">{body}</p>
        </div>
      )}
      {link && (
        <div className="link">
          <a href={link} target="_blank" rel="noreferrer">
            <span className="the-link text-blue-600 dark:text-blue-400">{link}</span>
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
