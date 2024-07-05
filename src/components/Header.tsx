import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import Menu from "@mui/icons-material/Menu";

export default function AppBarComponent() {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          href="/"
        >
          <Menu />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NPTEL View
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
