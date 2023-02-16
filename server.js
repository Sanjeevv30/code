const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
mongoose.set('strictQuery', false);
const uri = "mongodb+srv://mysecondproject:mysecondproject@mysecondproject.6irgxzg.mongodb.net/Udmey?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

connection.on('error', (err) => {
  console.error("MongoDB connection error: ", err);
});
const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
const upload = multer({ dest: 'uploads/' });


const csvDataSchema = new mongoose.Schema({
  //_id:mongoose.Schema.Types.ObjectId(),
  name: String,
  company: String,
  email: String,
  
});

const CsvData = mongoose.model('CsvData', csvDataSchema);

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Create 
app.post('/csvData', (req, res) => {
  const csvData = new CsvData(req.body);
  csvData.save((err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

// Read 
app.get('/csvData', (req, res) => {
  CsvData.find((err, csvData) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(csvData);
    }
  });
});

// Update 
app.put('/csvData/:Id', (req, res) => {
  CsvData.findByIdAndUpdate(req.params.sagar, req.body, { new: true }, (err, csvData) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(csvData);
    }
  });
});

//Delete 
app.delete('/csvData/:Id', (req, res) => {
  CsvData.findByIdAndRemove(req.params.sagar, (err, csvData) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(csvData);
    }
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      const csvData = new CsvData(row);
      csvData.save();
    })
    .on('end', () => {
      res.send('File uploaded and data saved to the database');
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
