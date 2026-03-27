import { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  Delete,
  MoreVert,
  Person,
  Image,
  AttachFile,
  InsertEmoticon,
  Send,
} from "@mui/icons-material";
import { useSearch } from "@tanstack/react-router";
import type { User } from "../components/Creator";
import { getAllCreators, sendDM } from "../services/api";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline?: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isIncoming: boolean;
  avatar: string;
}

const messages: Message[] = [
  {
    id: "1",
    text: "sieuhiushu s heucnse seo e",
    timestamp: "10:36 PM",
    isIncoming: true,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    text: "Hey cssc ssdsd dc",
    timestamp: "10:35 PM",
    isIncoming: false,
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "3",
    text: "Hey cdc",
    timestamp: "10:41 PM",
    isIncoming: false,
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: "4",
    text: "Tomorrow definitely ssncsncks sncksncksnck sjcksjcksjck",
    timestamp: "10:36 PM",
    isIncoming: true,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "5",
    text: "Okay i will reach",
    timestamp: "10:41 PM",
    isIncoming: false,
    avatar: "https://i.pravatar.cc/150?img=4",
  },
];
type SendDMPayload = {
  receiverId: string; // the user you’re chatting with
  text: string;
  type?: "text";
  clientMessageId?: string; // optional for optimistic UI
};
export default function Messages() {
  const search = useSearch({ from: "/messages" });
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [messageText, setMessageText] = useState("");
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchUserAndCreateConversation = async () => {
      if (search.userId) {
        try {
          // Fetch all creators to find the user
          const response = await getAllCreators(1000);
          const users = response.data || response || [];
          const user = users.find((u: User) => u._id === search.userId);
          console.log("user", user);
          if (user) {
            // Check if conversation already exists using functional update
            setAllConversations((prev) => {
              const existingConv = prev.find((c) => c.id === user._id);
              if (!existingConv) {
                // Create new conversation for this user
                const newConversation: Conversation = {
                  id: user._id,
                  name: `${user.firstName} ${user.lastName}`,
                  avatar: user.profilePicture,
                  lastMessage: "Start a conversation...",
                  timestamp: new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  isOnline: false,
                };
                return [newConversation, ...prev];
              }
              return prev;
            });
            // Auto-select this conversation
            setSelectedConversation(user._id);
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      }
    };

    fetchUserAndCreateConversation();
  }, [search.userId]);

  const selectedConv = allConversations.find(
    (c) => c.id === selectedConversation,
  );

  const handleSendMessage = async () => {
    const text = messageText.trim();
    if (!text || !selectedConversation) return;
    const payload: SendDMPayload = {
      receiverId: selectedConversation,
      text,
      type: "text",
    };
    console.log("payload", payload);
    try {
      await sendDM(payload);
      setMessageText("");
      // TODO: add the new message to the messages list or refetch conversation
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "1200px",
          height: "85vh",
          display: "flex",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        {/* Left Sidebar - Conversations List */}
        <Box
          sx={{
            width: "300px",
            borderRight: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
          }}
        >
          {/* Logo Icon */}
          <Box
            sx={{
              position: "relative",
              mb: 2,
            }}
          ></Box>

          {/* Header */}
          <Box sx={{ px: 3, pt: 4, pb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1a1a1a",
                fontSize: "1.25rem",
              }}
            >
              All Conversations
            </Typography>
          </Box>

          {/* Conversations List */}
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {allConversations.map((conversation) => (
              <Box
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 3,
                  py: 2,
                  cursor: "pointer",
                  backgroundColor:
                    selectedConversation === conversation.id
                      ? "#2F80ED"
                      : "transparent",
                  "&:hover": {
                    backgroundColor:
                      selectedConversation === conversation.id
                        ? "#2F80ED"
                        : "#f5f5f5",
                  },
                }}
              >
                <Avatar
                  src={conversation.avatar}
                  alt={conversation.name}
                  sx={{ width: 48, height: 48 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color:
                        selectedConversation === conversation.id
                          ? "white"
                          : "#1a1a1a",
                      fontSize: "0.95rem",
                      mb: 0.5,
                    }}
                  >
                    {conversation.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color:
                        selectedConversation === conversation.id
                          ? "rgba(255,255,255,0.9)"
                          : "#999",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {conversation.timestamp}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Panel - Chat Interface */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 2,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton size="small">
                <ArrowBack sx={{ color: "#666" }} />
              </IconButton>
              <Avatar
                src={selectedConv?.avatar}
                alt={selectedConv?.name}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#1a1a1a",
                      fontSize: "1rem",
                    }}
                  >
                    {selectedConv?.name}
                  </Typography>
                  {selectedConv?.isOnline && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#4CAF50",
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton size="small">
                <Delete sx={{ color: "#666", fontSize: 20 }} />
              </IconButton>
              <IconButton size="small">
                <MoreVert sx={{ color: "#666", fontSize: 20 }} />
              </IconButton>
              <IconButton size="small">
                <Person sx={{ color: "#666", fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 3,
              py: 2,
              backgroundColor: "white",
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  mb: 2,
                  flexDirection: message.isIncoming ? "row" : "row-reverse",
                }}
              >
                {message.isIncoming && (
                  <Avatar src={message.avatar} sx={{ width: 32, height: 32 }} />
                )}
                <Box
                  sx={{
                    maxWidth: "60%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: message.isIncoming ? "flex-start" : "flex-end",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: message.isIncoming
                        ? "#E5E5E5"
                        : "#2F80ED",
                      color: message.isIncoming ? "#1a1a1a" : "white",
                      px: 2,
                      py: 1,
                      borderRadius: "12px",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        width: 0,
                        height: 0,
                        ...(message.isIncoming
                          ? {
                              left: -8,
                              top: 12,
                              borderTop: "8px solid transparent",
                              borderBottom: "8px solid transparent",
                              borderRight: "8px solid #E5E5E5",
                            }
                          : {
                              right: -8,
                              top: 12,
                              borderTop: "8px solid transparent",
                              borderBottom: "8px solid transparent",
                              borderLeft: "8px solid #2F80ED",
                            }),
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        lineHeight: 1.4,
                        wordBreak: "break-word",
                      }}
                    >
                      {message.text}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "#999",
                      mt: 0.5,
                      px: 1,
                    }}
                  >
                    {message.timestamp}
                  </Typography>
                </Box>
                {!message.isIncoming && (
                  <Avatar src={message.avatar} sx={{ width: 32, height: 32 }} />
                )}
              </Box>
            ))}
          </Box>

          {/* Message Input Area */}
          <Box
            sx={{
              px: 3,
              py: 2,
              backgroundColor: "#f5f5f5",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <IconButton size="small">
                <Image sx={{ color: "#666", fontSize: 22 }} />
              </IconButton>
              <IconButton size="small">
                <AttachFile sx={{ color: "#666", fontSize: 22 }} />
              </IconButton>
              <IconButton size="small">
                <InsertEmoticon sx={{ color: "#666", fontSize: 22 }} />
              </IconButton>
              <TextField
                fullWidth
                placeholder="Type your Message"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: "white",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!messageText.trim() || !selectedConversation}
                sx={{
                  backgroundColor: "#2F80ED",
                  color: "white",
                  borderRadius: "8px",
                  px: 2,
                  "&:hover": {
                    backgroundColor: "#2563EB",
                  },
                }}
              >
                <Send sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
