//importing required modules
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const shortId = require("shortid");
const Queue = require("bull");
const { exec } = require("child_process");
const { promisify } = require("util");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

//setting up bull with redis server and creating a new Queue
const videoQueue = new Queue("VideoQueue", {
  redis: {
    port: "6379",
    host: "127.0.0.1",
  },
});

app.post("/videoUrl/", async (req, res) => {
  const videoUrl = req.body;
  console.log(videoUrl.url);
  const jobId = shortId.generate();

  await videoQueue.add(videoUrl, {
    jobId: jobId,
  });

  return res.json({ jobId });
});

app.get("/job/:jobId", async (req, res) => {
  const { jobId } = req.params;
  const job = await videoQueue.getJob(jobId);

  if (!job) {
    return res.status(404).json({ message: "Job not Found" });
  }

  const jobStatus = await job.getState();

  if (jobStatus === "completed") {
    return res.json({ status: "completed" });
  } else if (jobStatus === "failed") {
    return res.json({ status: "failed" });
  } else {
    return res.json({ status: "in-progress" });
  }
});

app.get("/download/:downloadId", (req, res) => {
  const downloadId = req.params.downloadId;
  console.log(downloadId);
  const videoFilePath = `./${downloadId}.mp4`;

  const file = path.basename(videoFilePath);
  const filePath = path.resolve(videoFilePath);

  res.setHeader("Content-Disposition", `attachment; filename=${file}`);
  res.setHeader("Content-Type", "video/mp4");

  res.sendFile(filePath);
});

const execAsync = promisify(exec);

videoQueue.process(async (job) => {
  console.log(job.data.url, job.opts.jobId);
  const command = `ffmpeg -i "${job.data.url}" ${job.opts.jobId}.mp4`;

  try {
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`FFmpeg stderr: ${stderr}`);
    }

    console.log("FFmpeg command executed successfully");
    console.log(stdout);

    return job.moveToCompleted();
  } catch (error) {
    job.moveToFailed(new Error("Job failed"));
    console.error(`An error occurred: ${error.message}`);
  }
});
