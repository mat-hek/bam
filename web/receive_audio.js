{
const player = document.getElementById("player");
const pcConfig = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' },] };
const proto = window.location.protocol === "https:" ? "wss:" : "ws:"
const urlParams = new URLSearchParams(window.location.search);
const port = urlParams.get("in_port") || window.location.port
const port_str = port ? `:${port}` : ""
const path = urlParams.get("in_path") || ""

const setup_ws = () => {
  try {
    url = `${proto}//${window.location.hostname || "localhost"}${port_str}/${path}`;
    console.log(`Opening receive websocket at ${url}`)
    const ws = new WebSocket(url);
    ws.onopen = () => start_connection(ws);
    ws.onclose = event => {
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
  player.srcObject = new MediaStream();

  const pc = new RTCPeerConnection(pcConfig);
  pc.ontrack = event => player.srcObject.addTrack(event.track);
  pc.onicecandidate = event => {
    if (event.candidate === null) return;

    console.log("Sent ICE candidate:", event.candidate);
    ws.send(JSON.stringify({ type: "ice_candidate", data: event.candidate }));
  };

  ws.onmessage = async event => {
    const { type, data } = JSON.parse(event.data);

    switch (type) {
      case "sdp_offer":
        console.log("Received SDP offer:", data);
        await pc.setRemoteDescription(data);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.send(JSON.stringify({ type: "sdp_answer", data: answer }));
        console.log("Sent SDP answer:", answer)
        break;
      case "ice_candidate":
        console.log("Recieved ICE candidate:", data);
        await pc.addIceCandidate(data);
    }
  };
};
}