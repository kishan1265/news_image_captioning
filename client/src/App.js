import axios from "axios";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import Nav from "./components/navbar";
import Form from "./components/form";
import React from "react";
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Link,
  CircularProgress,
} from "@mui/material";

//import { makeStyles } from "@mui/material/styles";

const options = [
  { value: "POLITICS", label: "POLITICS" },
  { value: "WELLNESS", label: "WELLNESS" },
  { value: "ENTERTAINMENT", label: "ENTERTAINMENT" },
  { value: "TRAVEL", label: "TRAVEL" },
  { value: "STYLE & BEAUTY", label: "STYLE & BEAUTY" },
  { value: "PARENTING", label: "PARENTING" },
  { value: "HEALTHY LIVING", label: "HEALTHY LIVING" },
  { value: "QUEER VOICES", label: "QUEER VOICES" },
  { value: "FOOD & DRINK", label: "FOOD & DRINK" },
  { value: "BUSINESS", label: "BUSINESS" },
  { value: "COMEDY", label: "COMEDY" },
  { value: "SPORTS", label: "SPORTS" },
  { value: "BLACK VOICES", label: "BLACK VOICES" },
  { value: "HOME & LIVING", label: "HOME & LIVING" },
  { value: "PARENTS", label: "PARENTS" },
  { value: "THE WORLDPOST", label: "THE WORLDPOST" },
  { value: "WEDDINGS", label: "WEDDINGS" },
  { value: "WOMEN", label: "WOMEN" },
  { value: "CRIME", label: "CRIME" },
  { value: "IMPACT", label: "IMPACT" },
  { value: "DIVORCE", label: "DIVORCE" },
  { value: "WORLD NEWS", label: "WORLD NEWS" },
  { value: "MEDIA", label: "MEDIA" },
  { value: "WEIRD NEWS", label: "WEIRD NEWS" },
  { value: "GREEN", label: "GREEN" },
  { value: "WORLDPOST", label: "WORLDPOST" },
  { value: "RELIGION", label: "RELIGION" },
  { value: "STYLE", label: "STYLE" },
  { value: "SCIENCE", label: "SCIENCE" },
  { value: "TECH", label: "TECH" },
  { value: "TASTE", label: "TASTE" },
  { value: "MONEY", label: "MONEY" },
  { value: "ARTS", label: "ARTS" },
  { value: "ENVIRONMENT", label: "ENVIRONMENT" },
  { value: "FIFTY", label: "FIFTY" },
  { value: "GOOD NEWS", label: "GOOD NEWS" },
  { value: "U.S. NEWS", label: "U.S. NEWS" },
  { value: "ARTS & CULTURE", label: "ARTS & CULTURE" },
  { value: "COLLEGE", label: "COLLEGE" },
  { value: "LATINO VOICES", label: "LATINO VOICES" },
  { value: "CULTURE & ARTS", label: "CULTURE & ARTS" },
  { value: "EDUCATION", label: "EDUCATION" },
];

// const useStyles = makeStyles((theme) => ({
//   card: {
//     backgroundColor: "#2196F3", // Blue background color
//     color: "#fff", // White text color
//   },
// }));

const cardStyle = {
  backgroundColor: "#2196F3", // Blue background color
  color: "#fff", // White text color
  maxWidth: "md",
  marginTop: "50px",
};

const linkStyle = {
  color: "#9500ae", // White text color for the link
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // const [dateRange, setDateRange] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchLimit, setSearchLimit] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState(null);
  const [keywords, setKeywords] = useState(null);
  const [LoadingData, setLoadingData] = useState(false);

  const handleImageChange = async (e) => {
    const image = e.target.files[0];
    setSelectedImage(image);
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCategories([...categories, value]);
    } else {
      setCategories(categories.filter((category) => category !== value));
    }
  };

  const sendSearchRequest = () => {
    console.log("i am in sendSearchRequest");
    if (fromDate && toDate && fromDate > toDate) {
      alert("From date must be less than or equal to To date");
      return;
    }
    const results = {
      method: "GET",
      url: "http://localhost:3001/results",
      params: {
        q: keywords,
        fromDate: fromDate instanceof Date ? fromDate.toISOString() : null,
        toDate: toDate instanceof Date ? toDate.toISOString() : null,
        category: categories,
        limit: searchLimit,
      },
    };
    axios
      .request(results)
      .then((response) => {
        console.log(response.data);
        setDocuments(response.data);
        setLoadingData(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const sendCaptionrequest = async () => {
    setLoadingData(true);
    console.log(typeof selectedImage);
    if (selectedImage) {
      const formData = new FormData();
      formData.append("file", selectedImage);
      // console.log(formData);
      // const data = new URLSearchParams(formData);

      try {
        const instance = axios.create({
          // .. where we make our configurations
          baseURL: "",
        });
        const response = await fetch("http://127.0.0.1:8000/predict", {
          headers: {
            // "Content-Type": "multipart/form-data",
            Accept: "application/json",
            "Sec-Fetch-Mode": "no-cors",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Sec-Fetch-Site": "cross-site",
          },
          body: formData,
          method: "POST",
          // mode: "no-cors",
        });

        //console.log(response);
        //console.log("type : " + typeof response);
        const data = await response.json();

        //console.log(data);
        console.log(data.caption[0]);
        console.log(keywords);
        const allKeywords = keywords + " " + data.caption[0];
        setSearchQuery(allKeywords);
      } catch (error) {
        console.error("Error generating caption:", error);
      }
    }

    sendSearchRequest();
  };

  //const classes = useStyles();

  return (
    <div className="app">
      <Nav />
      {/* <Typography variant="h3" component="h3">
        Search for news articles using the following criteria
      </Typography> */}
      {/* <Form /> */}
      {!LoadingData && documents == null && (
        <Container
          maxWidth="sm"
          style={{
            justifyItems: "center",
            marginTop: "100px",
          }}
        >
          <Paper
            elevation={3}
            style={{ padding: "20px", backgroundColor: "#2196F3" }}
          >
            <Typography variant="h5" style={{ color: "#fff" }}>
              Search Form
            </Typography>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendSearchRequest();
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="contained"
                      component="span"
                      color="secondary"
                    >
                      Upload Image
                    </Button>
                  </label>
                  <>
                    {selectedImage && (
                      <Typography variant="body1" color="#ffffff">
                        {selectedImage.name}
                      </Typography>
                    )}
                  </>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Number"
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    onChange={(e) => setSearchLimit(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Select Option"
                    fullWidth
                    variant="outlined"
                    color="secondary"
                  >
                    {options.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        checked={
                          categories.includes(option.value) ? true : false
                        }
                        onChange={handleCategoryChange}
                      >
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
                    helperText="From Date"
                    variant="outlined"
                    color="secondary"
                    onChange={(date) => setFromDate(date)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="date2"
                    type="date"
                    helperText="To Date"
                    variant="outlined"
                    color="secondary"
                    onChange={(date) => setToDate(date)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={sendCaptionrequest}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      )}
      {documents === null && LoadingData == true && (
        <CircularProgress style={{ marginTop: "20%", marginLeft: "48%" }} />
      )}
      {documents && (
        <div className="main">
          <Typography variant="h4" component="h4">
            {documents.length > 0 ? (
              <p style={{ alignContent: "center" }}>
                {" "}
                Results: {documents.length}
              </p>
            ) : (
              <p> No results found. Try broadening your search criteria.</p>
            )}
          </Typography>
          <Container
            maxWidth="sm"
            style={{ justifyItems: "center", marginTop: "20px" }}
          >
            {documents.map((document) => (
              <Card style={cardStyle}>
                <CardContent>
                  <Typography variant="h6">
                    <Link
                      href={document._source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={linkStyle}
                    >
                      {document._source.headline}
                    </Link>
                  </Typography>
                  <Typography variant="subtitle1">
                    Category: {document._source.category}
                  </Typography>
                  <Typography variant="body1">
                    Description : {document._source.short_description}
                  </Typography>
                  <Typography variant="subtitle2">
                    Author: {document._source.authors}
                  </Typography>
                  <Typography variant="subtitle2">
                    Date: {document._source["@timestamp"]}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Container>
        </div>
      )}
    </div>
  );
};

export default App;
