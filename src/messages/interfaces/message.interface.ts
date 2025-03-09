export interface Message {
  id: string
  conversationId: string
  senderId: string
  content?: string
  imageUrl?: string | null
  createdAt: string
}

