import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#424242",
    },
  },
  typography: {
    fontFamily: [
      '"Noto Sans JP"',
      "Inter",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(", "),
  },
});
