const newsItems = [
  {
    title: 'NDIS to be cut by $15b',
    meta: '15h ago - 2,704 readers',
  },
  {
    title: '200m litres of diesel secured',
    meta: '18h ago - 1,332 readers',
  },
  {
    title: 'AI skills are driving sustainability',
    meta: '23h ago - 278 readers',
  },
  {
    title: "What's next for Apple?",
    meta: '23h ago - 7,734 readers',
  },
  {
    title: 'Property agents leading AI use',
    meta: '23h ago - 813 readers',
  },
]

const promotedItems = [
  {
    logo: 'C',
    logoClassName: 'blue',
    title: 'Your AI-powered workspace',
    description:
      'Teams ditch their old docs and collaborate effortlessly with Confluence.',
  },
  {
    logo: 'AIB',
    logoClassName: 'orange',
    title: 'Get Your MBA from AIB',
    description:
      'Rated a Tier 1 MBA by CEO Magazine and 4.5 stars on Google. Learn more!',
  },
  {
    logo: 'G',
    logoClassName: 'green',
    title: 'Upgrade Your Resume',
    description:
      "Make every word count with Grammarly's AI writing help.",
  },
]

export const RightSideBar = () => {
  return (
    <aside className="right-side-bar">
      <section className="linkedin-sidebar-card linkedin-news-card">
        <div className="news-header">
          <div>
            <h2>Linkedout News</h2>
            <p>Top stories</p>
          </div>

          <button type="button" className="info-btn" aria-label="News info">
            i
          </button>
        </div>

        <div className="news-list">
          {newsItems.map((item) => (
            <article className="news-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.meta}</p>
            </article>
          ))}
        </div>

        <button type="button" className="show-more-btn">
          Show more news
          <span className="chevron" aria-hidden="true">
            v
          </span>
        </button>
      </section>

      <section className="linkedin-sidebar-card promoted-card">
        <div className="promoted-header">
          <p>Promoted</p>
          <button type="button" aria-label="More promoted options">
            ...
          </button>
        </div>

        <div className="promoted-list">
          {promotedItems.map((item) => (
            <article className="promoted-item" key={item.title}>
              <div className={`promoted-logo ${item.logoClassName}`}>{item.logo}</div>

              <div className="promoted-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </aside>
  )
}
