---
marp: true
theme: default
style: |
  @font-face {
      font-family: Roboto;
      src: url(Roboto/Roboto-Regular.ttf);
  }
  @font-face {
    font-family: "Roboto";
    src: url("Roboto/Roboto-bold.ttf");
    font-weight: bold;
  }
  section {
    background-color: #101010;
    padding-top:150px;
    vertical-align: top;
  }
  p, ul {
    min-height: 300px;
  }
  p, li, :is(h1, h2, h3, h4, h5, h6) {
    color: white;
    font-family: Roboto;
  }
  h1 {
    font-size: 60px;
  }
  h2 {
    position: absolute;
    padding-right: 100px;
    top: 100px;
    font-size: 50px;
  }
  marp-pre {
    background: #ebebe9;
    line-height: 40px;
  }
  .kroki-image-container {
    width:100%;
    text-align:center;
  }
  .kroki-image-container img {
    min-width:600px;
  }

---

# Media streaming in the functional world



<h6 style="position:absolute;bottom:100px;">Mateusz Front</h6>


<img src="images/logos.png" style="position:absolute;right:100px;bottom:100px;width:300px" />

---

# How do you stream media in Elixir?

### 

---

# How do you stream media in Elixir?

### Let's solve a real-life problem! Or kind of...

---

## Drum

![bg h:400](images/drum.png)

---

## Drum

![bg right h:400](images/drum.png)

<span style="color:lightgreen">+ It does bam bam</span>


---

## Drum

![bg right h:400](images/drum.png)

<span style="color:lightgreen">+ It does bam bam</span>
<span style="color:red">- It takes a lot of space</span>

---

## Small drum == not cool

![bg h:300](images/small_drum.png)


---

## Digital drum == too expensive

![bg h:300](images/digital_drum.png)

---

# Let's make a virtual drum!

---

![bg  h:80%](images/bambam.excalidraw.png)

---

![bg right:60% h:80%](images/bambam.excalidraw.png)

- Record hand movements with camera

---

![bg right:60% h:80%](images/bambam.excalidraw.png)

- Record hand movements with camera
- Stream it over WebRTC

---

![bg right:60% h:80%](images/bambam.excalidraw.png)

- Record hand movements with camera
- Stream it over WebRTC
- Detect hand position with AI

---

![bg right:60% h:80%](images/bambam.excalidraw.png)

- Record hand movements with camera
- Stream it over WebRTC
- Detect hand position with AI
- Emit _bam_ whenever hand moves down

---

![bg right:60% h:80%](images/bambam.excalidraw.png)

- Record hand movements with camera
- Stream it over WebRTC
- Detect hand position with AI
- Emit _bam_ whenever hand moves down
- Stream the sound back

---

## Project Bam Bam - client

- Use `getUserMedia` to get the video from the browser

---

## Project Bam Bam - client

- Use `getUserMedia` to get the video from the browser
- Use JS WebRTC API to send it to the server

---

## Project Bam Bam - client

- Use `getUserMedia` to get the video from the browser
- Use JS WebRTC API to send it to the server
- Use JS WebRTC API to receive audio from the server

---

## Project Bam Bam - client

- Use `getUserMedia` to get the video from the browser
- Use JS WebRTC API to send it to the server
- Use JS WebRTC API to receive audio from the server
- Put it into the HTML `<audio/>` element

---

## Project Bam Bam - server ingress

- Receive video over WebRTC

---

## Project Bam Bam - server ingress

- Receive video over WebRTC
- Parse the video

---

## Project Bam Bam - server ingress

![bg right 100%](images/parsing.excalidraw.png)

- Receive video over WebRTC
- Parse the video

---

## Project Bam Bam - server ingress

- Receive video over WebRTC
- Parse the video
- Decode the video

---

## Project Bam Bam - server ingress

- Receive video over WebRTC
- Parse the video
- Decode the video
- Convert the video from YUV to RGB

---

## Project Bam Bam - server ingress

![bg right 100%](images/rgb.jpeg)

- Receive video over WebRTC
- Parse the video
- Decode the video
- Convert the video from YUV to RGB

<footer>Image source: https://deeprender.ai/blog/yuv-colour-and-compression</footer>

---

## Project Bam Bam - server ingress

![bg right 100%](images/yuv.jpeg)

- Receive video over WebRTC
- Parse the video
- Decode the video
- Convert the video from YUV to RGB

<footer>Image source: https://deeprender.ai/blog/yuv-colour-and-compression</footer>

---

## Project Bam Bam - server ingress

- Receive video over WebRTC
- Parse the video
- Decode the video
- Convert the video from YUV to RGB
- Detect hand movement

---

## Project Bam Bam - server egress

- Generate BAM sounds

---

## Project Bam Bam - server egress

- Generate BAM sounds
- Fill gaps with silence

---

## Project Bam Bam - server egress

- Generate BAM sounds
- Fill gaps with silence
- Encode the audio

---

## Project Bam Bam - server egress

- Generate BAM sounds
- Fill gaps with silence
- Encode the audio
- Send the audio via WebRTC

---

# Let's get to it!

---

## Project Bam Bam - outcomes

- With WebRTC we can stream media at very low latency
- Membrane helps accessing and manipulating media in a functional way
- Elixir makes parallelism manageable
- Bridging media streaming with AI opens up a ton of possibilities

---

## WebRTC & low latency

&nbsp; | Sending a file | Low-latency media streaming
-- | -- | --
Packet loss | Always retransmit | Maybe drop it, FEC
Congestion decection | On packet loss | Constant monitoring 
Recovering from congestion | Slow down | Reduce quality
Transport protocol | TCP | Custom stack on top of UDP

---

![bg 100%](images/rtcon.jpeg)