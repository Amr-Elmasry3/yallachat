// [1] => Api Routes Types

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  field?: string;
}
export type VerifyToken = { decoded: unknown; token: string | undefined };

// [2] => Shared Primitive Types
export type UrlFile = string;
export type MessageType = "text" | "image" | "audio" | "video" | "file";
export type MessageStatus = "sent" | "delivered" | "seen";
export type UserStatus = "offline" | "online";
export type CallStatus =
  | "pending"
  | "active"
  | "rejected"
  | "canceled"
  | "missed"
  | "ended";
export type ConversationType = "direct" | "group";

// [3] => Alert Dialog Types
export type DialogConfig = {
  title: string;
  description: string;
  cancelBtn: string;
  okBtn: string;
  onCancel: () => void;
  onOk: () => void;
};
export type DialogInfo = {
  title: string;
  description: string;
  cancelBtn: string;
  okBtn: string;
};
export type SectionConfig = {
  name: string;
  funcName: string;
};

// [4] => Upload Files Types
export type FileData = {
  fileType: string;
  fileSize: number;
  fileName: string;
  isVoice?: boolean;
  duration: number | undefined;
};
export type FileValues = FileData & {
  urlFile: UrlFile;
};

// [5] => User Types
export type UserInfo = {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  profile_image: string | null;
  status: UserStatus;
  last_seen: string;
  bio: string | null;
  full_name?: string | null;
  created_at?: string;
  updated_at?: string;
};
export type User = UserInfo & {
  created_at: string;
  updated_at: string;
};
export type UserProfile = UserInfo & {
  created_at: string;
};
export type SessionUser = UserInfo & {
  full_name: string | null;
};

// [6] => Conversation Types
export type Conversation = {
  id: number;
  type: ConversationType;
  name: string | null;
  created_at: string;
  last_message_at: string;
  created_by?: string;
};
export type ConversationGroupInfo = {
  name: string | null;
  created_by: string;
  participants_count: number;
};
export type Participant = {
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
  last_read_at: string | null;
  user: UserInfo;
};
export type ConversationDetails = {
  conversation: Conversation;
  friend: UserInfo | null;
  group: ConversationGroupInfo | null;
  user: UserInfo;
  participants: Participant[];
  messages: Message[];
  messagesCount: number;
  hasMore: boolean;
};

// [7] => Message Types
export type Message = {
  id: number;
  conversation_id: number;
  sender_id: string;
  content: string | null;
  type: MessageType;
  media_urls: UrlFile[] | null;
  status: MessageStatus;
  reply_to_id: number | null;
  is_deleted: boolean;
  metadata: FileData[] | null;
  created_at: string;
  updated_at: string;
  sender: {
    id: string;
    username: string;
    email: string;
    phone_number: string;
    profile_image: string | null;
    status: UserStatus;
  };
};
export type LastMessage = {
  id: number;
  conversation_id: number;
  content: string | null;
  type: MessageType;
  media_urls: UrlFile[] | null;
  metadata: FileData[] | null;
  created_at: string;
  sender_id: string;
  status: MessageStatus;
  is_deleted: boolean;
  isFromMe: boolean;
};

// [8] => Friend Types
export type Friend = UserInfo & {
  friendshipId: number;
  friendSince: string;
  conversationId: number | null;
  lastMessage: LastMessage | null;
  unreadCount: number;
};
export type FriendsApiData = {
  count: number;
  friends: Friend[];
};
export type FriendsData = {
  count: number;
  friendsList: Friend[];
};

// [9] => Call Types
export type InsertCall = {
  caller_id: string;
  receiver_id: string;
  conversation_id: number;
  status: CallStatus;
  started_at: string | null;
  answered_at: string | null;
  ended_at: string | null;
  duration: number | null;
};
export type Call = InsertCall & {
  id: number;
  created_at: string;
  updated_at: string;
  caller?: UserInfo;
  receiver?: UserInfo;
};
export type CallsData = {
  calls: Call[];
  count: number;
  userId: string;
};

// [10] => FCM Types
export type FcmTokenRow = {
  id: number;
  user_id: string;
  fcm_token: string;
  last_used_at: string;
  updated_at: string;
  created_at?: string;
};
export type FcmTokensData = {
  friendId: string;
  tokens: string[];
  count: number;
};

export type LoginResponse = {
  token: string;
  expiresDays: number;
  user: SessionUser;
};
export type RegisterResponse = {
  user: UserInfo;
};
export type UserUpdateResponse = {
  user: {
    id: string;
    username: string;
    email: string;
    phone_number: string;
    bio: string | null;
    updated_at: string;
  };
  updated_fields: string[];
  timestamp: string;
};
export type MessageStatusUpdateResponse = {
  count: number;
  messages: Message[];
  status: MessageStatus;
};
export type MessagesPageData = {
  messages: Message[];
  hasMore: boolean;
  count: number;
};
export type UserIdData = {
  id: string;
};

export interface PostgresChangePayload {
  new: Record<string, unknown>;
  old: Record<string, unknown>;
  errors: null;
  eventType?: "INSERT" | "UPDATE" | "DELETE" | "*";
}

export type LoadingErorrReturn = {
  isLoading: boolean;
  isError: boolean;
  statusNum: number;
};

// [11] => Get Data Fetch Types
export type ConversationId = string | string[];
type Params = {
  conversationId?: ConversationId;
};
export interface GetDataFetchFunc<T = Params> {
  url: string;
  params?: T;
}
export interface GetDataResponse<T> extends LoadingErorrReturn {
  data: T;
  getDataFetchFunc: (config: GetDataFetchFunc) => void;
}
