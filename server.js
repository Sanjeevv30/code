const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const fs = require('fs');
mongoose.set('strictQuery', false);
const uri = "mongodb+srv://mysecondproject:mysecondproject@mysecondproject.6irgxzg.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

connection.on('error', (err) => {
  console.error("MongoDB connection error: ", err);
});


const app = express();
const upload = multer({ dest: 'uploads/' });


const csvDataSchema = new mongoose.Schema({
  field1: String,
  field2: String,
});

const CsvData = mongoose.model('CsvData', csvDataSchema);

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
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
