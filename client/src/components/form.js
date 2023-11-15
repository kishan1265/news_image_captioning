import React from "react";
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

function BlueThemedForm() {
  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        style={{ padding: "20px", backgroundColor: "#2196F3" }}
      >
        <Typography variant="h5" style={{ color: "#fff" }}>
          Search Form
        </Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                type="file"
              />
              <label htmlFor="image-upload">
                <Button variant="contained" component="span" color="secondary">
                  Upload Image
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Number" fullWidth variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Select Option"
                fullWidth
                variant="outlined"
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="date1"
                type="date"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="date2"
                type="date"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth>
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default BlueThemedForm;
