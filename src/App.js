import './App.css';
import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};
export default App;



