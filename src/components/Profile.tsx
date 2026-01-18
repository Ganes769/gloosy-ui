import { use } from "react";
import { getCurrentUser } from "../services/api";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Paper,
  Chip,
  Card,
  CardMedia,
  TextField,
  InputAdornment,
  Link,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
} from "@mui/material";
import {
  CameraAlt,
  Star,
  Facebook,
  LinkedIn,
  Twitter,
  Instagram,
  YouTube,
  ArrowForward,
} from "@mui/icons-material";
import ResponsiveAppBar from "./AppNavbar";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
// Placeholder user data structure
const placeholderUser = {
  _id: "696ca1f885e56ed656eabc50",
  role: "creator",
  email: "ganeshsnawali@gmail.com",
  firstName: "Ganesh",
  lastName: "Gnawali",
  createdAt: "2026-01-18T09:03:52.005Z",
  dateOfBirth: "1990-01-01T00:00:00.000Z",
  description: "Software Developer",
  experience: 2,
  id: "6966b59325b667953a494c2c",
  primarySkill: "Video creation",
  profilePicture:
    "https://res.cloudinary.com/df9sy6tw7/image/upload/v1768514044/profile-pictures/user_6966b59325b667953a494c2c.jpg",
  updatedAt: "2026-01-18T09:03:52.005Z",
  user: "6966b59325b667953a494c2c",
  userName: "Ganesh Gnawali",
  __v: 0,
};

type Order = {
  id: number | string;
  buyer: { name: string; avatar: string };
  service: string;
  amount: string;
  dueDate: string;
  status: string;
  statusColor: "warning" | "success" | "error";
};

// Placeholder orders data
const placeholderOrders: Order[] = [
  {
    id: 1,
    buyer: { name: "Abhi Bagchi", avatar: "" },
    service:
      "I will User-Generated Content Management: Organize and Optimize Your UGC",
    amount: "$ 300",
    dueDate: "2 days",
    statusColor: "warning",
    status: "In work",
  },
  {
    id: 2,
    buyer: { name: "jaoc kjib", avatar: "" },
    service: "UGC: Organize and Optimize You",
    amount: "$ 300",
    dueDate: "2 days",
    status: "Delivered",
    statusColor: "success",
  },
  {
    id: 3,
    buyer: { name: "c ybg njhu", avatar: "" },
    service: "Optimize Your UGC",
    amount: "$ 300",
    dueDate: "2 days",
    status: "In Dispute",
    statusColor: "error",
  },
];

// Placeholder categories
const placeholderCategories = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: "Lorem ipsum",
  image: "",
}));

const userPromise = getCurrentUser();
const columnHelper = createColumnHelper<Order>();
const columns = [
  columnHelper.accessor("buyer", {
    header: "Buyer",
    cell: ({ row }) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Avatar
          src={row.original.buyer.avatar}
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#346DFF",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          {row.original.buyer.name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: "text.primary" }}
        >
          {row.original.buyer.name}
        </Typography>
      </Box>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("service", {
    header: "Service",
    cell: ({ row }) => (
      <Typography
        variant="body2"
        sx={{
          maxWidth: 300,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={row.original.service}
      >
        {row.original.service}
      </Typography>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: ({ row }) => (
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: "text.primary" }}
      >
        {row.original.amount}
      </Typography>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("dueDate", {
    header: "Due Date",
    cell: ({ row }) => (
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {row.original.dueDate}
      </Typography>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => (
      <Chip
        label={row.original.status}
        color={row.original.statusColor}
        size="small"
        sx={{
          fontWeight: 500,
          textTransform: "capitalize",
        }}
      />
    ),
    enableSorting: true,
  }),
];
export default function UserProfile() {
  const userData = use(userPromise);
  const user = userData || placeholderUser;
  const table = useReactTable({
    data: placeholderOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  // Calculate display name
  const displayName = user.firstName + " " + user.lastName;
  const roleDisplay =
    user.role === "creator" ? "UGC Creator" : "Customer/Entrepreneur";

  return (
    <Box sx={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <ResponsiveAppBar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Left Sidebar - User Profile Card */}
          <Box sx={{ width: { xs: "100%", md: "25%" } }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "white",
                textAlign: "center",
              }}
            >
              {/* Profile Picture */}
              <Box
                sx={{ position: "relative", display: "inline-block", mb: 2 }}
              >
                <Avatar
                  src={user.profilePicture}
                  alt={displayName}
                  sx={{ width: 120, height: 120 }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#346DFF",
                    color: "white",
                    width: 36,
                    height: 36,
                    "&:hover": { backgroundColor: "#2800C6" },
                  }}
                >
                  <CameraAlt fontSize="small" />
                </IconButton>
              </Box>

              {/* Name with Online Status */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {displayName}
                </Typography>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#4CAF50",
                  }}
                />
              </Box>

              {/* Role */}
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                {roleDisplay}
              </Typography>

              {/* Rating */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  mb: 3,
                }}
              >
                <Star sx={{ color: "#FFC107", fontSize: 20 }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  4.5(200)
                </Typography>
              </Box>

              {/* Metrics */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Response Time
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    1 hrs
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Active Orders
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {placeholderOrders.length}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Earnings from January
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#346DFF" }}
                  >
                    500 $
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ flex: 1 }}>
            {/* Welcome Banner */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 3,
                borderRadius: 2,
                background: "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
                color: "white",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Welcome, we're so excited to have you here
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                As a member, you'll have access to exclusive content, perks, and
                features. Explore UGC Hub's comprehensive suite of services
                designed to help content creators thrive and succeed.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: "#0030AB",
                  fontWeight: 400,
                  borderRadius: "30px",
                  textTransform: "capitalize",
                  width: "200px",
                }}
              >
                Start Now
              </Button>
            </Paper>
            {/* Orders Table Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                backgroundColor: "white",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Orders
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {placeholderOrders.length} active orders
                </Typography>
              </Box>
              <TableContainer
                sx={{
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        sx={{
                          backgroundColor: alpha("#346DFF", 0.05),
                          "& th": {
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: "text.primary",
                            borderBottom: "2px solid",
                            borderColor: "divider",
                            py: 2,
                          },
                        }}
                      >
                        {headerGroup.headers.map((header) => (
                          <TableCell
                            key={header.id}
                            sx={{
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              fontSize: "0.75rem",
                            }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha("#346DFF", 0.02),
                          },
                          "&:last-child td": {
                            borderBottom: 0,
                          },
                          transition: "background-color 0.2s ease",
                          cursor: "pointer",
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            sx={{
                              py: 2.5,
                              borderBottom: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Categories Section */}
            <Paper
              elevation={0}
              sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: "white" }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Our Categories
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 3 }}
              >
                Choose a category according to your contents.
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {placeholderCategories.map((category) => (
                  <Box key={category.id}>
                    <Card
                      sx={{
                        position: "relative",
                        height: 150,
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "scale(1.02)",
                          transition: "transform 0.2s",
                        },
                      }}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          height: "100%",
                          backgroundColor: "#E0E0E0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          filter: "blur(4px)",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "text.primary" }}
                        >
                          {category.name}
                        </Typography>
                      </Box>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          background: "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
          color: "white",
          mt: 6,
          py: 6,
        }}
      >
        <Container maxWidth="xl">
          {/* Newsletter Subscription */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              mb: 5,
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Subscribe to UGChub
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Get the newsletters and guides directly on your email from us.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                width: { xs: "100%", md: "auto" },
              }}
            >
              <TextField
                placeholder="Your email address"
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  width: { xs: "100%", md: 300 },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        sx={{
                          background:
                            "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
                          color: "white",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #2800C6 0%, #346DFF 100%)",
                          },
                        }}
                      >
                        <ArrowForward />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Footer Content */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(5, 1fr)",
              },
              gap: 4,
              mb: 4,
            }}
          >
            {/* Brand */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                UGChub
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Your One-Stop UGC Hub!
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                {[Facebook, LinkedIn, Twitter, Instagram, YouTube].map(
                  (Icon, index) => (
                    <IconButton
                      key={index}
                      size="small"
                      sx={{
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      <Icon fontSize="small" />
                    </IconButton>
                  )
                )}
              </Box>
            </Box>

            {/* Insights */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Insights
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {["For Creators", "For Companies", "FAQs", "Blogs"].map(
                  (item) => (
                    <Link
                      key={item}
                      href="#"
                      sx={{
                        color: "white",
                        textDecoration: "none",
                        opacity: 0.9,
                        fontSize: "0.875rem",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      {item}
                    </Link>
                  )
                )}
              </Box>
            </Box>

            {/* Legals */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Legals
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {["Impressum", "Terms & Conditions", "Help & Supports"].map(
                  (item) => (
                    <Link
                      key={item}
                      href="#"
                      sx={{
                        color: "white",
                        textDecoration: "none",
                        opacity: 0.9,
                        fontSize: "0.875rem",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      {item}
                    </Link>
                  )
                )}
              </Box>
            </Box>

            {/* Company */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Company
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {["About Us", "Careers", "Social Responsibilities"].map(
                  (item) => (
                    <Link
                      key={item}
                      href="#"
                      sx={{
                        color: "white",
                        textDecoration: "none",
                        opacity: 0.9,
                        fontSize: "0.875rem",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      {item}
                    </Link>
                  )
                )}
              </Box>
            </Box>

            {/* Contact */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Berlin, Germany
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +1 98000 0000 0000
                </Typography>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    fontWeight: 500,
                    "&:hover": { opacity: 1, textDecoration: "underline" },
                  }}
                >
                  Reach Out to Us
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Copyright */}
          <Box
            sx={{
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              pt: 3,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              © 2023 UGC®. All Rights Reserved
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Link
                href="#"
                sx={{
                  color: "white",
                  textDecoration: "none",
                  opacity: 0.9,
                  "&:hover": { opacity: 1, textDecoration: "underline" },
                }}
              >
                Google Play
              </Link>
              <Link
                href="#"
                sx={{
                  color: "white",
                  textDecoration: "none",
                  opacity: 0.9,
                  "&:hover": { opacity: 1, textDecoration: "underline" },
                }}
              >
                App Store
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
