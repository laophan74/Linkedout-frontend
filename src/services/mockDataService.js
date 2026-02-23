// Mock Data Service - Complete dummy data for frontend demo without backend
// Login: username: guest, password: guest

const MOCK_USERS = [
  {
    _id: '1',
    username: 'guest',
    email: 'guest@example.com',
    password: 'guest',
    fullname: 'Guest User',
    imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
    bio: 'Welcome to Linkedout! This is a demo account.',
    phone: '',
    address: 'Vietnam',
    website: '',
    joinedDate: new Date('2024-01-01'),
    connections: ['2', '3', '4', '5'],
  },
  {
    _id: '2',
    username: 'john_dev',
    email: 'john@example.com',
    fullname: 'John Developer',
    imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    bio: 'Full Stack Developer | React & Node.js',
    phone: '+84-123-456',
    address: 'Ho Chi Minh City',
    website: 'https://example.com',
    joinedDate: new Date('2023-06-15'),
    connections: ['1', '3', '4'],
  },
  {
    _id: '3',
    username: 'sarah_designer',
    email: 'sarah@example.com',
    fullname: 'Sarah Designer',
    imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio: 'UI/UX Designer | Creating beautiful experiences',
    phone: '+84-987-654',
    address: 'Da Nang',
    website: '',
    joinedDate: new Date('2023-08-20'),
    connections: ['1', '2', '5'],
  },
  {
    _id: '4',
    username: 'mike_manager',
    email: 'mike@example.com',
    fullname: 'Mike Manager',
    imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    bio: 'Product Manager | Building great products',
    phone: '+84-555-666',
    address: 'Hanoi',
    website: '',
    joinedDate: new Date('2023-11-01'),
    connections: ['1', '2', '3'],
  },
  {
    _id: '5',
    username: 'emma_marketing',
    email: 'emma@example.com',
    fullname: 'Emma Marketing',
    imgUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    bio: 'Marketing Specialist | Content & Growth',
    phone: '+84-111-222',
    address: 'Can Tho',
    website: '',
    joinedDate: new Date('2024-01-15'),
    connections: ['1', '3', '4'],
  },
]

const MOCK_POSTS = [
  {
    _id: '101',
    createdBy: '2',
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    txt: 'Just launched my new React project! Building amazing web applications with modern tech stack. Check out my portfolio! 🚀',
    imgUrl: 'https://images.unsplash.com/photo-1517694712202-14dd05513371?w=600',
    likes: ['1', '3', '4'],
    comments: ['c101', 'c102'],
    shares: 2,
    saved: false,
  },
  {
    _id: '102',
    createdBy: '3',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    txt: 'Design inspiration: Beautiful UI components for modern web applications. What do you think about this color palette?',
    imgUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
    likes: ['1', '2', '5'],
    comments: ['c103'],
    shares: 5,
    saved: true,
  },
  {
    _id: '103',
    createdBy: '4',
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    txt: 'The future of tech is here! AI and Machine Learning are transforming industries. Excited to see what comes next.',
    imgUrl: 'https://images.unsplash.com/photo-1677442d019cecf71a9ee186658bbb75?w=600',
    likes: ['1', '2', '3'],
    comments: [],
    shares: 10,
    saved: false,
  },
  {
    _id: '104',
    createdBy: '5',
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    txt: 'Content marketing tips that really work! 📝 Creating valuable content is the key to audience engagement. Share your best practices!',
    imgUrl: '',
    likes: ['1', '2'],
    comments: ['c104', 'c105'],
    shares: 3,
    saved: false,
  },
  {
    _id: '105',
    createdBy: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
    txt: 'Welcome to Linkedout! A modern professional network where connections matter. Let\'s build something great together! 💼',
    imgUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
    likes: ['2', '3', '4', '5'],
    comments: ['c106', 'c107'],
    shares: 15,
    saved: false,
  },
  {
    _id: '106',
    createdBy: '3',
    createdAt: new Date(Date.now() - 1000 * 60 * 150),
    txt: 'Sharing my latest design project - a complete redesign of a SaaS dashboard. Focus on user experience and accessibility.',
    imgUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
    likes: ['1', '2', '4'],
    comments: [],
    shares: 8,
    saved: true,
  },
]

const MOCK_COMMENTS = [
  {
    _id: 'c101',
    postId: '101',
    createdBy: '3',
    txt: 'Amazing work! Love the architecture of your React project.',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    replies: [],
    likes: ['1', '2'],
  },
  {
    _id: 'c102',
    postId: '101',
    createdBy: '4',
    txt: 'This looks really professional. Great job on the implementation!',
    createdAt: new Date(Date.now() - 1000 * 60 * 3),
    replies: [],
    likes: ['1'],
  },
  {
    _id: 'c103',
    postId: '102',
    createdBy: '2',
    txt: 'Love these colors! Perfect for modern applications. 🎨',
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
    replies: [],
    likes: ['1', '5'],
  },
  {
    _id: 'c104',
    postId: '104',
    createdBy: '2',
    txt: 'Very insightful! Content is definitely king in today\'s digital world.',
    createdAt: new Date(Date.now() - 1000 * 60 * 50),
    replies: [],
    likes: ['1'],
  },
  {
    _id: 'c105',
    postId: '104',
    createdBy: '3',
    txt: 'Would love to see a detailed guide on this topic!',
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    replies: [],
    likes: [],
  },
  {
    _id: 'c106',
    postId: '105',
    createdBy: '2',
    txt: 'Excited to be part of this network! Looking forward to connecting with amazing professionals.',
    createdAt: new Date(Date.now() - 1000 * 60 * 110),
    replies: [],
    likes: ['3', '4'],
  },
  {
    _id: 'c107',
    postId: '105',
    createdBy: '5',
    txt: 'Great initiative! This platform has huge potential.',
    createdAt: new Date(Date.now() - 1000 * 60 * 105),
    replies: [],
    likes: ['2'],
  },
]

const MOCK_CHATS = [
  {
    _id: 'chat1',
    users: ['1', '2'],
    lastMsg: 'Sounds good! Let\'s discuss the project detailsmore before starting.',
    lastMsgTime: new Date(Date.now() - 1000 * 60 * 5),
    lastMsgSender: '2',
  },
  {
    _id: 'chat2',
    users: ['1', '3'],
    lastMsg: 'The design looks fantastic! Can we schedule a call to discuss?',
    lastMsgTime: new Date(Date.now() - 1000 * 60 * 15),
    lastMsgSender: '3',
  },
  {
    _id: 'chat3',
    users: ['1', '4'],
    lastMsg: 'Meeting went great! Let\'s move forward with the plan.',
    lastMsgTime: new Date(Date.now() - 1000 * 60 * 45),
    lastMsgSender: '1',
  },
  {
    _id: 'chat4',
    users: ['1', '5'],
    lastMsg: 'Thanks for sharing the insights! Really helpful.',
    lastMsgTime: new Date(Date.now() - 1000 * 60 * 120),
    lastMsgSender: '5',
  },
]

const MOCK_MESSAGES = [
  // Chat 1 - with John
  {
    _id: 'msg1',
    chatId: 'chat1',
    from: '2',
    to: '1',
    txt: 'Hey! Did you see my last project?',
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    _id: 'msg2',
    chatId: 'chat1',
    from: '1',
    to: '2',
    txt: 'Yes! It looks amazing! Great work on the UI.',
    createdAt: new Date(Date.now() - 1000 * 60 * 18),
  },
  {
    _id: 'msg3',
    chatId: 'chat1',
    from: '2',
    to: '1',
    txt: 'Thanks! Want to collaborate on something?',
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    _id: 'msg4',
    chatId: 'chat1',
    from: '1',
    to: '2',
    txt: 'Definitely! I\'d love to work together.',
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    _id: 'msg5',
    chatId: 'chat1',
    from: '2',
    to: '1',
    txt: 'Sounds good! Let\'s discuss the project details more before starting.',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },

  // Chat 2 - with Sarah
  {
    _id: 'msg6',
    chatId: 'chat2',
    from: '3',
    to: '1',
    txt: 'Hi! I loved your recent post about the new features.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    _id: 'msg7',
    chatId: 'chat2',
    from: '1',
    to: '3',
    txt: 'Thank you! I\'m really excited about this update.',
    createdAt: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    _id: 'msg8',
    chatId: 'chat2',
    from: '3',
    to: '1',
    txt: 'The design looks fantastic! Can we schedule a call to discuss?',
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },

  // Chat 3 - with Mike
  {
    _id: 'msg9',
    chatId: 'chat3',
    from: '1',
    to: '4',
    txt: 'The meeting was productive. Got some great feedback.',
    createdAt: new Date(Date.now() - 1000 * 60 * 50),
  },
  {
    _id: 'msg10',
    chatId: 'chat3',
    from: '4',
    to: '1',
    txt: 'Totally agree! I think we\'re on the right track.',
    createdAt: new Date(Date.now() - 1000 * 60 * 48),
  },
  {
    _id: 'msg11',
    chatId: 'chat3',
    from: '1',
    to: '4',
    txt: 'Meeting went great! Let\'s move forward with the plan.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
  },
]

const MOCK_ACTIVITIES = [
  {
    _id: 'activity1',
    type: 'like',
    actor: '2',
    targetUser: '1',
    targetId: '101',
    targetType: 'post',
    createdAt: new Date(Date.now() - 1000 * 60 * 8),
    isRead: false,
  },
  {
    _id: 'activity2',
    type: 'comment',
    actor: '3',
    targetUser: '1',
    targetId: '101',
    targetType: 'post',
    createdAt: new Date(Date.now() - 1000 * 60 * 6),
    isRead: false,
  },
  {
    _id: 'activity3',
    type: 'like',
    actor: '4',
    targetUser: '1',
    targetId: '105',
    targetType: 'post',
    createdAt: new Date(Date.now() - 1000 * 60 * 110),
    isRead: true,
  },
  {
    _id: 'activity4',
    type: 'connection-request',
    actor: '5',
    targetUser: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 200),
    isRead: true,
  },
  {
    _id: 'activity5',
    type: 'message',
    actor: '2',
    targetUser: '1',
    targetId: 'chat1',
    targetType: 'chat',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    isRead: false,
  },
]

export const mockDataService = {
  // Users
  async getUsers() {
    return [...MOCK_USERS]
  },
  async getUserById(userId) {
    const user = MOCK_USERS.find((u) => u._id === userId)
    return user ? { ...user } : null
  },
  async login(creds) {
    if (creds.username === 'guest' && creds.password === 'guest') {
      const user = MOCK_USERS[0]
      return { ...user }
    }
    throw new Error('Invalid credentials')
  },
  async logout() {
    return true
  },
  async updateUser(user) {
    const idx = MOCK_USERS.findIndex((u) => u._id === user._id)
    if (idx >= 0) {
      MOCK_USERS[idx] = { ...user }
    }
    return { ...user }
  },

  // Posts
  async getPosts() {
    return [...MOCK_POSTS]
  },
  async getPostById(postId) {
    return MOCK_POSTS.find((p) => p._id === postId)
  },
  async savePost(post) {
    if (post._id) {
      const idx = MOCK_POSTS.findIndex((p) => p._id === post._id)
      if (idx >= 0) MOCK_POSTS[idx] = post
    } else {
      post._id = 'post_' + Date.now()
      post.createdAt = new Date()
      post.likes = []
      post.comments = []
      MOCK_POSTS.unshift(post)
    }
    return post
  },
  async deletePost(postId) {
    const idx = MOCK_POSTS.findIndex((p) => p._id === postId)
    if (idx >= 0) MOCK_POSTS.splice(idx, 1)
    return true
  },

  // Comments
  async getComments() {
    return [...MOCK_COMMENTS]
  },
  async saveComment(comment) {
    if (comment._id) {
      const idx = MOCK_COMMENTS.findIndex((c) => c._id === comment._id)
      if (idx >= 0) MOCK_COMMENTS[idx] = comment
    } else {
      comment._id = 'comment_' + Date.now()
      comment.createdAt = new Date()
      MOCK_COMMENTS.push(comment)
    }
    return comment
  },

  // Chats
  async getChats() {
    return [...MOCK_CHATS]
  },
  async getChatMessages(chatId) {
    return MOCK_MESSAGES.filter((m) => m.chatId === chatId)
  },
  async saveMessage(message) {
    message._id = 'msg_' + Date.now()
    message.createdAt = new Date()
    MOCK_MESSAGES.push(message)
    // Update chat's last message
    const chat = MOCK_CHATS.find((c) => c._id === message.chatId)
    if (chat) {
      chat.lastMsg = message.txt
      chat.lastMsgTime = message.createdAt
      chat.lastMsgSender = message.from
    }
    return message
  },

  // Activities
  async getActivities() {
    return [...MOCK_ACTIVITIES]
  },
  async updateLastSeen() {
    return true
  },
}
