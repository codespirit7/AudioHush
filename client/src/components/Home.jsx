import React, { useState, useEffect } from "react";
import "./home.css";

function Home() {
  const [url, setUrl] = useState("");
  const [taskId, setTaskId] = useState("");
  const [status, setStatus] = useState("");
  const [sentTaskId, setSentTaskId] = useState("");
  const [videoSource, setVideoSource] = useState("");

  const handleSubmitTaskId = async () => {
    console.log(sentTaskId);
    try {
      const response = await fetch(`http://localhost:5000/job/${sentTaskId}`, {
        method: "GET",
      });
      const res = await response.json();
      console.log(res.status);
      setStatus(res.status);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDownload = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/download/${sentTaskId}`,
        {
          method: "GET",
        }
      );
      const blob = await response.blob();
      const videoURL = URL.createObjectURL(blob);
      setVideoSource(videoURL);
      console.log(videoURL);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async () => {
    if (url.length === 0) {
      alert("Enter url");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/videoUrl", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
        }),
      });

      const data = await response.json();
      setTaskId(data.jobId);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="heading">
        <h2>Background Noise Reducer</h2>
      </div>

      <div className="container">
        <h2 style={{ color: "green" }}>Enter Video Url: </h2>
        <input
          type="text"
          className="input-field"
          id="myInput"
          placeholder="Enter video url..."
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      <div className="container2">
        {taskId.length > 0 ? (
          <>
            <p>
              Copy the task Id from below and check the progress of your video .
            </p>
            <h3 id="headH3">{taskId}</h3>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="containerJobId">
        <h2 style={{ color: "green" }}>Enter Task ID: </h2>
        <input
          type="text"
          className="input-field"
          id="myInput"
          placeholder="Enter video Task ID"
          onChange={(e) => setSentTaskId(e.target.value)}
        />
        <button className="submit-btn" onClick={handleSubmitTaskId}>
          Submit
        </button>
      </div>
      <div className="containerStatus">
        {status.length > 0 ? (
          <>
            {status === "completed" ? (
              <div>
                {" "}
                <h3 class="status success">{status}</h3>
                <button className="download-btn" onClick={handleDownload}>
                  Download Video
                </button>{" "}
              </div>
            ) : status === "in-progress" ? (
              <h3 class="status progress">{status}</h3>
            ) : (
              <h3 class="status error">{status}</h3>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      <div>
        {videoSource ? (
          <video className= "video"controls>
            <source src={videoSource} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Home;
