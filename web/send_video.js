{
const pcConfig = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' },] };
const mediaConstraints = { video: {width: 416, height: 416}, audio: false }
const connStatus = document.getElementById("status");
const proto = window.location.protocol === "https:" ? "wss:" : "ws:"
const urlParams = new URLSearchParams(window.location.search);
const port = urlParams.get("out_port") || window.location.port
const port_str = port ? `:${port}` : ""
const path = urlParams.get("out_path") || ""

const setup_ws = () => {
  try {
    const url = `${proto}//${window.location.hostname || "localhost"}${port_str}/${path}`
    console.log(`Opening send websocket at ${url}`)
    const ws = new WebSocket(url);
    ws.onopen = _ => start_connection(ws);
    ws.onclose = event => {
      connStatus.innerHTML = "Connecting..."
      console.log("WebSocket connection was terminated:", event);
      setTimeout(setup_ws, 500);
    }
  } catch {
    e =>
      console.error(e);
      setTimeout(setup_ws, 500);
  }
}

setup_ws();

const start_connection = async (ws) => {
  const localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
  const pc = new RTCPeerConnection(pcConfig);

  pc.onicecandidate = event => {
    if (event.candidate === null) return;
    console.log("Sent ICE candidate:", event.candidate);
    ws.send(JSON.stringify({ type: "ice_candidate", data: event.candidate }));
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState == "connected") {
      const button = document.createElement('button');
      button.innerHTML = "Disconnect";
      button.onclick = () => {
        ws.close();
        localStream.getTracks().forEach(track => track.stop())
      }
      connStatus.innerHTML = "Connected ";
      connStatus.appendChild(button);
    }
  }

  for (const track of localStream.getTracks()) {
    pc.addTrack(track, localStream);
  }

  ws.onmessage = async event => {
    const { type, data } = JSON.parse(event.data);

    switch (type) {
      case "sdp_answer":
        console.log("Received SDP answer:", data);
        await pc.setRemoteDescription(data);
        break;
      case "ice_candidate":
        console.log("Recieved ICE candidate:", data);
        await pc.addIceCandidate(data);
        break;
    }
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  console.log("Sent SDP offer:", offer)
  ws.send(JSON.stringify({ type: "sdp_offer", data: offer }));
};
}