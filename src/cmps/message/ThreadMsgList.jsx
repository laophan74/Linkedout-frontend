import { ThreadMsgPreview } from './ThreadMsgPreview'

export function ThreadMsgList({ messagesToShow }) {
  if (!messagesToShow?.length) {
    return (
      <div className="empty-thread">
        <h3>No messages yet</h3>
        <p>Send the first message to start the conversation.</p>
      </div>
    )
  }

  return (
    <section className="thread-msg-list">
      <div className="list">
        {messagesToShow.map((msg) => (
          <ThreadMsgPreview key={msg._id} msg={msg} />
        ))}
      </div>
    </section>
  )
}
