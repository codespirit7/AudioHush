# AudioHush - A noise Reduction Web App

This web application allows users to reduce background noise from videos by leveraging the power of `ffmpeg`. Simply provide a direct link to the video, and our server will process it asynchronously using `ffmpeg` to deliver a noise-free version.

## Usage

1. Clone the repository:

2. Install dependencies:

3. Start the server:

4. Access the web application in your browser at `http://localhost:3000`.

##User Interface 

![Screenshot from 2023-05-29 16-19-17-1](https://github.com/codespirit7/AudioHush/assets/88592710/415d934a-0708-4dd2-b32a-3648b4d59f32)
![Screenshot from 2023-05-29 16-19-17](https://github.com/codespirit7/AudioHush/assets/88592710/882b8e6c-8bb1-4904-943d-4e14395378ef)


## How it Works

1. **Upload a Video**: Users should provide a direct link to the video file. Links from services like Google Drive or Dropbox.

2. **Processing Queue**: Once the user submits a video link, it is added to a processing queue. Due to the potentially time-consuming nature of `ffmpeg` processing, it is handled asynchronously in a background worker.

3. **Task ID**: After submitting the video, the user is provided with a unique task ID. They are instructed to check back after a few minutes.

4. **Check Progress**: Users can return to the web app later and enter their task ID to check the processing status.

 - If the video is processed, a download link will be provided, allowing the user to retrieve the noise-reduced video.
 - If the video is still in the queue, the user will be informed that it is "in-progress" and should check back later.
 - If the processing fails, "failed" error message will be displayed.

## Tech Stack

The project is built using the following technologies and tools:

- **Node/Express**: The web application user interface is developed using Node.js and Express framework.

- **Background Job Processor**: To handle asynchronous processing, we utilize a background job processor such as [Bull](https://github.com/OptimalBits/bull). You can choose the one that suits your requirements.

- **Redis**: Redis is integrated to support the background job processing and task management.
- 
- **ffmpeg**: The `ffmpeg` command line tool is employed to remove noise from the videos.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as per the license terms.

## Acknowledgements

I would like to express our gratitude to the developers of `ffmpeg` and the background job processors mentioned above. Their invaluable tools and contributions make this project possible.

