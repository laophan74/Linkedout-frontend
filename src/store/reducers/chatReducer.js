const INITIAL_STATE = {
  chats: [],
}

function getParticipantIds(chat) {
  return [chat?.userId, chat?.userId2].filter(Boolean).sort()
}

function isSameChat(chatA, chatB) {
  if (!chatA || !chatB) return false
  if (chatA._id && chatB._id && chatA._id === chatB._id) return true

  const participantsA = getParticipantIds(chatA)
  const participantsB = getParticipantIds(chatB)

  return (
    participantsA.length === 2 &&
    participantsB.length === 2 &&
    participantsA[0] === participantsB[0] &&
    participantsA[1] === participantsB[1]
  )
}

function upsertChat(chats, chatToSave) {
  const existingIdx = chats.findIndex((chat) => isSameChat(chat, chatToSave))
  if (existingIdx === -1) return [chatToSave, ...chats]

  return chats.map((chat, idx) => (idx === existingIdx ? chatToSave : chat))
}

function dedupeChats(chats) {
  return chats.reduce((acc, chat) => upsertChat(acc, chat), [])
}

export function chatReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_CHATS':
      return {
        ...state,
        chats: dedupeChats(action.chats),
      }
    case 'ADD_CHAT':
      return {
        ...state,
        chats: upsertChat(state.chats, action.chat),
      }

    case 'UPDATE_CHAT':
      return {
        ...state,
        chats: upsertChat(state.chats, action.chat),
      }

    case 'REMOVE_CHAT':
      return {
        ...state,
        chats: state.chats.filter((chat) => chat._id !== action.chatId),
      }

    default:
      return state
  }
}
