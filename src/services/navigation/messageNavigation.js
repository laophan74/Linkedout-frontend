export function getMessagePath(userId) {
  return userId ? `/main/message/${userId}` : '/main/message'
}

export function navigateToMessage(history, userId) {
  if (!history || !userId) return
  history.push(getMessagePath(userId))
}
