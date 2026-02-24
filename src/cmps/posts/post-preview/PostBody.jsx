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
      <div className="title">
        <h1>{title}</h1>
      </div>
      <div className="post-text">
        <p>{body}</p>
      </div>
      {link && (
        <div className="link">
          <a href={link} target="_blank" rel="noreferrer">
            <span className="the-link">{link}</span>
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
