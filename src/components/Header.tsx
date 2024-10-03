import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";

export default function AppBarComponent() {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 1 }}
          href="/"
        >
          <Avatar alt="NPTEL" src="/nptel.jpg" />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NPTEL Courses
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
