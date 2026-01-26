import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Pagination,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Star, VerifiedUser, Search, Message } from "@mui/icons-material";
import { useNavigate } from "@tanstack/react-router";
import { getAllCreator, getAllCreators } from "../services/api";

export interface User {
  _id: string;
  dateOfBirth: string;
  description: string;
  email: string;
  experience: number;
  firstName: string;
  lastName: string;
  primarySkill: string;
  profilePicture: string;
  role: string;
  userName: string;
  password?: string;
}

interface CreatorProps {
  users?: User[];
}

export default function Creator({ users: usersProp }: CreatorProps = {}) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(usersProp || []);
  const [allUsers, setAllUsers] = useState<User[]>([]); // Store all users for search
  const [loading, setLoading] = useState(!usersProp);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [apiTotalPages, setApiTotalPages] = useState(1); // Total pages from API when not searching

  // Initialize with usersProp if provided
  useEffect(() => {
    if (usersProp) {
      setUsers(usersProp);
      setAllUsers(usersProp);
      setLoading(false);
    }
  }, [usersProp]);

  // Fetch all users when search is first activated
  useEffect(() => {
    if (usersProp || !isSearchMode || allUsers.length > 0) {
      return; // Skip if usersProp provided, not in search mode, or already have all users
    }

    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllCreators(1000);
        const fetchedUsers = response.data || response || [];
        setAllUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch all creators", error);
        setAllUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [isSearchMode, usersProp, allUsers.length]);

  // Fetch paginated users when not searching
  useEffect(() => {
    if (usersProp || isSearchMode || searchQuery.trim()) {
      return; // Skip if usersProp provided or in search mode
    }

    const fetchPaginatedUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllCreator(page, pageSize);
        const fetchedUsers = response.data || response || [];
        setUsers(fetchedUsers);

        // Store total pages from API response
        if (response.totalPages) {
          setApiTotalPages(response.totalPages);
        } else if (response.total) {
          setApiTotalPages(Math.ceil(response.total / pageSize));
        } else {
          setApiTotalPages(1);
        }
      } catch (error) {
        console.error("Failed to fetch creators", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaginatedUsers();
  }, [page, pageSize, usersProp, isSearchMode, searchQuery]);

  // Filter users based on search query
  // When searching, use allUsers; otherwise use the current page users
  const filteredUsers = useMemo(() => {
    const usersToFilter = isSearchMode || searchQuery.trim() ? allUsers : users;

    if (!searchQuery.trim()) {
      return usersToFilter;
    }

    const query = searchQuery.toLowerCase().trim();
    return usersToFilter.filter((user) => {
      const searchableText = [
        user.firstName,
        user.lastName,
        user.userName,
        user.primarySkill,
        user.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [users, allUsers, searchQuery, isSearchMode]);

  // Calculate pagination for filtered users (when searching) or use API pagination (when not searching)
  const totalPages =
    isSearchMode || searchQuery.trim()
      ? Math.ceil(filteredUsers.length / pageSize)
      : apiTotalPages;

  const paginatedUsers = useMemo(() => {
    if (isSearchMode || searchQuery.trim()) {
      // Client-side pagination for search results
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return filteredUsers.slice(startIndex, endIndex);
    } else {
      // When not searching, users are already paginated from API
      return users;
    }
  }, [filteredUsers, users, page, pageSize, isSearchMode, searchQuery]);

  // Handle search mode and reset pagination
  useEffect(() => {
    const hasSearchQuery = searchQuery.trim().length > 0;
    setIsSearchMode(hasSearchQuery);
    setPage(1);
  }, [searchQuery]);

  const renderUserCard = (user: User) => {
    // Calculate rating (using experience as base, capped at 5)
    const rating = Math.min(4.5, 3 + user.experience * 0.3);
    const reviewCount = Math.floor(user.experience * 50 + 100);

    // Calculate price based on experience
    const price = user.experience * 1000;

    return (
      <Card
        key={user._id}
        onClick={() => {
          navigate({
            to: "/messages",
            search: { userId: user._id },
          });
        }}
        sx={{
          width: "312px",
          height: "340px",
          borderRadius: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* Profile Image Section */}
        <Box
          sx={{
            width: "100%",
            height: "185px",
            position: "relative",
            overflow: "hidden",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <Box
            component="img"
            src={user.profilePicture || "/placeholder.png"}
            alt={user.userName}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Message Icon Button */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              navigate({
                to: "/messages",
                search: { userId: user._id },
              });
            }}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "#1976d2",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            size="small"
          >
            <Message fontSize="small" />
          </IconButton>
        </Box>

        {/* Content Section */}
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: 2.5,
            gap: 1.5,
          }}
        >
          {/* Title/Description */}
          <Typography
            variant="h6"
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
              lineHeight: 1.5,
              color: "#1a1a1a",
              mb: 0.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {user.description ||
              `${user.firstName} ${user.lastName} - ${user.primarySkill}`}
          </Typography>

          {/* Username with Verified Badge */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.875rem",
                color: "#1a1a1a",
                fontWeight: 400,
              }}
            >
              @{user.userName}
            </Typography>
            <VerifiedUser
              sx={{
                fontSize: "1rem",
                color: "#1976d2",
              }}
            />
          </Box>

          {/* Rating and Price Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: "auto",
            }}
          >
            {/* Rating */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Star
                sx={{
                  fontSize: "1.125rem",
                  color: "#ffc107",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.875rem",
                  color: "#1a1a1a",
                  fontWeight: 400,
                }}
              >
                {rating.toFixed(1)}({reviewCount})
              </Typography>
            </Box>

            {/* Price */}
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "#1a1a1a",
              }}
            >
              $ {price.toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box p={3}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Creators
      </Typography>

      {/* Search Bar */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          mb: 4,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search creators by name, username, skill, or description..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          variant="outlined"
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "white",
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#346DFF",
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#346DFF",
                },
              },
            },
          }}
        />
      </Box>

      {/* Results count */}
      {searchQuery && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            alignSelf: "flex-start",
            maxWidth: "1400px",
            width: "50%",
          }}
        >
          {filteredUsers.length} creator{filteredUsers.length !== 1 ? "s" : ""}{" "}
          found
          {searchQuery && ` for "${searchQuery}"`}
        </Typography>
      )}

      <Box
        sx={{
          width: "50%",
          maxWidth: "1400px",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          justifyContent: "center",
        }}
      >
        {paginatedUsers.map((user) => (
          <Box
            key={user._id}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {renderUserCard(user)}
          </Box>
        ))}
      </Box>
      {paginatedUsers.length === 0 && searchQuery && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No creators found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search query
          </Typography>
        </Box>
      )}

      {paginatedUsers.length > 0 && totalPages > 0 && (
        <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
          <Typography variant="body2" color="text.secondary">
            {isSearchMode || searchQuery.trim() ? (
              <>
                Page {page} of {totalPages} ({filteredUsers.length} creator
                {filteredUsers.length !== 1 ? "s" : ""} matching "{searchQuery}
                ")
              </>
            ) : (
              <>
                Page {page} of {totalPages}
              </>
            )}
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
