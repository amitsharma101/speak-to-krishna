(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();function k(){return k=Object.assign?Object.assign.bind():function(i){for(var e=1;e<arguments.length;e++){var s=arguments[e];for(var t in s)({}).hasOwnProperty.call(s,t)&&(i[t]=s[t])}return i},k.apply(null,arguments)}const B=new Uint8Array(0);class _{static getFullOptions(e){return k({clientTools:{},onConnect:()=>{},onDebug:()=>{},onDisconnect:()=>{},onError:()=>{},onMessage:()=>{},onAudio:()=>{},onModeChange:()=>{},onStatusChange:()=>{},onCanSendFeedbackChange:()=>{}},e)}constructor(e,s){var t=this;this.options=void 0,this.connection=void 0,this.lastInterruptTimestamp=0,this.mode="listening",this.status="connecting",this.volume=1,this.currentEventId=1,this.lastFeedbackEventId=1,this.canSendFeedback=!1,this.endSessionWithDetails=async function(n){t.status!=="connected"&&t.status!=="connecting"||(t.updateStatus("disconnecting"),await t.handleEndSession(),t.updateStatus("disconnected"),t.options.onDisconnect(n))},this.onMessage=async function(n){switch(n.type){case"interruption":return void t.handleInterruption(n);case"agent_response":return void t.handleAgentResponse(n);case"user_transcript":return void t.handleUserTranscript(n);case"internal_tentative_agent_response":return void t.handleTentativeAgentResponse(n);case"client_tool_call":return void await t.handleClientToolCall(n);case"audio":return void t.handleAudio(n);case"ping":return void t.connection.sendMessage({type:"pong",event_id:n.ping_event.event_id});default:return void t.options.onDebug(n)}},this.setVolume=({volume:n})=>{this.volume=n},this.options=e,this.connection=s,this.options.onConnect({conversationId:s.conversationId}),this.connection.onMessage(this.onMessage),this.connection.onDisconnect(this.endSessionWithDetails),this.updateStatus("connected")}endSession(){return this.endSessionWithDetails({reason:"user"})}async handleEndSession(){this.connection.close()}updateMode(e){e!==this.mode&&(this.mode=e,this.options.onModeChange({mode:e}))}updateStatus(e){e!==this.status&&(this.status=e,this.options.onStatusChange({status:e}))}updateCanSendFeedback(){const e=this.currentEventId!==this.lastFeedbackEventId;this.canSendFeedback!==e&&(this.canSendFeedback=e,this.options.onCanSendFeedbackChange({canSendFeedback:e}))}handleInterruption(e){e.interruption_event&&(this.lastInterruptTimestamp=e.interruption_event.event_id)}handleAgentResponse(e){this.options.onMessage({source:"ai",message:e.agent_response_event.agent_response})}handleUserTranscript(e){this.options.onMessage({source:"user",message:e.user_transcription_event.user_transcript})}handleTentativeAgentResponse(e){this.options.onDebug({type:"tentative_agent_response",response:e.tentative_agent_response_internal_event.tentative_agent_response})}async handleClientToolCall(e){if(this.options.clientTools.hasOwnProperty(e.client_tool_call.tool_name))try{var s;const t=(s=await this.options.clientTools[e.client_tool_call.tool_name](e.client_tool_call.parameters))!=null?s:"Client tool execution successful.",n=typeof t=="object"?JSON.stringify(t):String(t);this.connection.sendMessage({type:"client_tool_result",tool_call_id:e.client_tool_call.tool_call_id,result:n,is_error:!1})}catch(t){this.onError("Client tool execution failed with following error: "+(t==null?void 0:t.message),{clientToolName:e.client_tool_call.tool_name}),this.connection.sendMessage({type:"client_tool_result",tool_call_id:e.client_tool_call.tool_call_id,result:"Client tool execution failed: "+(t==null?void 0:t.message),is_error:!0})}else{if(this.options.onUnhandledClientToolCall)return void this.options.onUnhandledClientToolCall(e.client_tool_call);this.onError(`Client tool with name ${e.client_tool_call.tool_name} is not defined on client`,{clientToolName:e.client_tool_call.tool_name}),this.connection.sendMessage({type:"client_tool_result",tool_call_id:e.client_tool_call.tool_call_id,result:`Client tool with name ${e.client_tool_call.tool_name} is not defined on client`,is_error:!0})}}handleAudio(e){}onError(e,s){console.error(e,s),this.options.onError(e,s)}getId(){return this.connection.conversationId}isOpen(){return this.status==="connected"}setMicMuted(e){}getInputByteFrequencyData(){return B}getOutputByteFrequencyData(){return B}getInputVolume(){return 0}getOutputVolume(){return 0}sendFeedback(e){this.canSendFeedback?(this.connection.sendMessage({type:"feedback",score:e?"like":"dislike",event_id:this.currentEventId}),this.lastFeedbackEventId=this.currentEventId,this.updateCanSendFeedback()):console.warn(this.lastFeedbackEventId===0?"Cannot send feedback: the conversation has not started yet.":"Cannot send feedback: feedback has already been sent for the current response.")}sendContextualUpdate(e){this.connection.sendMessage({type:"contextual_update",text:e})}sendUserMessage(e){this.connection.sendMessage({type:"user_message",text:e})}sendUserActivity(){this.connection.sendMessage({type:"user_activity"})}sendMCPToolApprovalResult(e,s){this.connection.sendMessage({type:"mcp_tool_approval_result",tool_call_id:e,is_approved:s})}}function P(i){return!!i.type}class C{static async create(e){let s=null;try{var t;const a=(t=e.origin)!=null?t:"wss://api.elevenlabs.io",o=e.signedUrl?e.signedUrl:a+"/v1/convai/conversation?agent_id="+e.agentId,r=["convai"];e.authorization&&r.push(`bearer.${e.authorization}`),s=new WebSocket(o,r);const l=await new Promise((v,u)=>{s.addEventListener("open",()=>{var d;const m={type:"conversation_initiation_client_data"};var L,E,T,O,q;e.overrides&&(m.conversation_config_override={agent:{prompt:(L=e.overrides.agent)==null?void 0:L.prompt,first_message:(E=e.overrides.agent)==null?void 0:E.firstMessage,language:(T=e.overrides.agent)==null?void 0:T.language},tts:{voice_id:(O=e.overrides.tts)==null?void 0:O.voiceId},conversation:{text_only:(q=e.overrides.conversation)==null?void 0:q.textOnly}}),e.customLlmExtraBody&&(m.custom_llm_extra_body=e.customLlmExtraBody),e.dynamicVariables&&(m.dynamic_variables=e.dynamicVariables),(d=s)==null||d.send(JSON.stringify(m))},{once:!0}),s.addEventListener("error",d=>{setTimeout(()=>u(d),0)}),s.addEventListener("close",u),s.addEventListener("message",d=>{const m=JSON.parse(d.data);P(m)&&(m.type==="conversation_initiation_metadata"?v(m.conversation_initiation_metadata_event):console.warn("First received message is not conversation metadata."))},{once:!0})}),{conversation_id:c,agent_output_audio_format:h,user_input_audio_format:f}=l,p=R(f??"pcm_16000"),g=R(h);return new C(s,c,p,g)}catch(a){var n;throw(n=s)==null||n.close(),a}}constructor(e,s,t,n){this.socket=void 0,this.conversationId=void 0,this.inputFormat=void 0,this.outputFormat=void 0,this.queue=[],this.disconnectionDetails=null,this.onDisconnectCallback=null,this.onMessageCallback=null,this.socket=e,this.conversationId=s,this.inputFormat=t,this.outputFormat=n,this.socket.addEventListener("error",a=>{setTimeout(()=>this.disconnect({reason:"error",message:"The connection was closed due to a socket error.",context:a}),0)}),this.socket.addEventListener("close",a=>{this.disconnect(a.code===1e3?{reason:"agent",context:a}:{reason:"error",message:a.reason||"The connection was closed by the server.",context:a})}),this.socket.addEventListener("message",a=>{try{const o=JSON.parse(a.data);if(!P(o))return;this.onMessageCallback?this.onMessageCallback(o):this.queue.push(o)}catch{}})}close(){this.socket.close()}sendMessage(e){this.socket.send(JSON.stringify(e))}onMessage(e){this.onMessageCallback=e;const s=this.queue;this.queue=[],s.length>0&&queueMicrotask(()=>{s.forEach(e)})}onDisconnect(e){this.onDisconnectCallback=e;const s=this.disconnectionDetails;s&&queueMicrotask(()=>{e(s)})}disconnect(e){var s;this.disconnectionDetails||(this.disconnectionDetails=e,(s=this.onDisconnectCallback)==null||s.call(this,e))}}function R(i){const[e,s]=i.split("_");if(!["pcm","ulaw"].includes(e))throw new Error(`Invalid format: ${i}`);const t=parseInt(s);if(isNaN(t))throw new Error(`Invalid sample rate: ${s}`);return{format:e,sampleRate:t}}function U(){return["iPad Simulator","iPhone Simulator","iPod Simulator","iPad","iPhone","iPod"].includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"ontouchend"in document}async function W(i={default:0,android:3e3}){let e=i.default;var s;if(/android/i.test(navigator.userAgent))e=(s=i.android)!=null?s:e;else if(U()){var t;e=(t=i.ios)!=null?t:e}e>0&&await new Promise(n=>setTimeout(n,e))}class I extends _{static async startSession(e){const s=_.getFullOptions(e);s.onStatusChange({status:"connecting"}),s.onCanSendFeedbackChange({canSendFeedback:!1});let t=null;try{return await W(s.connectionDelay),t=await C.create(e),new I(s,t)}catch(a){var n;throw s.onStatusChange({status:"disconnected"}),(n=t)==null||n.close(),a}}}function V(i){const e=new Uint8Array(i);return window.btoa(String.fromCharCode(...e))}function j(i){const e=window.atob(i),s=e.length,t=new Uint8Array(s);for(let n=0;n<s;n++)t[n]=e.charCodeAt(n);return t.buffer}const F=new Map;function N(i,e){return async s=>{const t=F.get(i);if(t)return s.addModule(t);const n=new Blob([e],{type:"application/javascript"}),a=URL.createObjectURL(n);try{return await s.addModule(a),void F.set(i,a)}catch{URL.revokeObjectURL(a)}try{const o=`data:application/javascript;base64,${btoa(e)}`;await s.addModule(o),F.set(i,o)}catch{throw new Error(`Failed to load the ${i} worklet module. Make sure the browser supports AudioWorklets.`)}}}const z=N("raw-audio-processor",`
const BIAS = 0x84;
const CLIP = 32635;
const encodeTable = [
  0,0,1,1,2,2,2,2,3,3,3,3,3,3,3,3,
  4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
  5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
  5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
  6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
  6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
  6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
  6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7
];

function encodeSample(sample) {
  let sign;
  let exponent;
  let mantissa;
  let muLawSample;
  sign = (sample >> 8) & 0x80;
  if (sign !== 0) sample = -sample;
  sample = sample + BIAS;
  if (sample > CLIP) sample = CLIP;
  exponent = encodeTable[(sample>>7) & 0xFF];
  mantissa = (sample >> (exponent+3)) & 0x0F;
  muLawSample = ~(sign | (exponent << 4) | mantissa);
  
  return muLawSample;
}

class RawAudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
              
    this.port.onmessage = ({ data }) => {
      switch (data.type) {
        case "setFormat":
          this.isMuted = false;
          this.buffer = []; // Initialize an empty buffer
          this.bufferSize = data.sampleRate / 4;
          this.format = data.format;

          if (globalThis.LibSampleRate && sampleRate !== data.sampleRate) {
            globalThis.LibSampleRate.create(1, sampleRate, data.sampleRate).then(resampler => {
              this.resampler = resampler;
            });
          }
          break;
        case "setMuted":
          this.isMuted = data.isMuted;
          break;
      }
    };
  }
  process(inputs) {
    if (!this.buffer) {
      return true;
    }
    
    const input = inputs[0]; // Get the first input node
    if (input.length > 0) {
      let channelData = input[0]; // Get the first channel's data

      // Resample the audio if necessary
      if (this.resampler) {
        channelData = this.resampler.full(channelData);
      }

      // Add channel data to the buffer
      this.buffer.push(...channelData);
      // Get max volume 
      let sum = 0.0;
      for (let i = 0; i < channelData.length; i++) {
        sum += channelData[i] * channelData[i];
      }
      const maxVolume = Math.sqrt(sum / channelData.length);
      // Check if buffer size has reached or exceeded the threshold
      if (this.buffer.length >= this.bufferSize) {
        const float32Array = this.isMuted 
          ? new Float32Array(this.buffer.length)
          : new Float32Array(this.buffer);

        let encodedArray = this.format === "ulaw"
          ? new Uint8Array(float32Array.length)
          : new Int16Array(float32Array.length);

        // Iterate through the Float32Array and convert each sample to PCM16
        for (let i = 0; i < float32Array.length; i++) {
          // Clamp the value to the range [-1, 1]
          let sample = Math.max(-1, Math.min(1, float32Array[i]));

          // Scale the sample to the range [-32768, 32767]
          let value = sample < 0 ? sample * 32768 : sample * 32767;
          if (this.format === "ulaw") {
            value = encodeSample(Math.round(value));
          }

          encodedArray[i] = value;
        }

        // Send the buffered data to the main script
        this.port.postMessage([encodedArray, maxVolume]);

        // Clear the buffer after sending
        this.buffer = [];
      }
    }
    return true; // Continue processing
  }
}
registerProcessor("raw-audio-processor", RawAudioProcessor);
`);class A{static async create({sampleRate:e,format:s,preferHeadphonesForIosDevices:t}){let n=null,a=null;try{const l={sampleRate:{ideal:e},echoCancellation:{ideal:!0},noiseSuppression:{ideal:!0}};if(U()&&t){const g=(await window.navigator.mediaDevices.enumerateDevices()).find(v=>v.kind==="audioinput"&&["airpod","headphone","earphone"].find(u=>v.label.toLowerCase().includes(u)));g&&(l.deviceId={ideal:g.deviceId})}const c=navigator.mediaDevices.getSupportedConstraints().sampleRate;n=new window.AudioContext(c?{sampleRate:e}:{});const h=n.createAnalyser();c||await n.audioWorklet.addModule("https://cdn.jsdelivr.net/npm/@alexanderolsen/libsamplerate-js@2.1.2/dist/libsamplerate.worklet.js"),await z(n.audioWorklet),a=await navigator.mediaDevices.getUserMedia({audio:l});const f=n.createMediaStreamSource(a),p=new AudioWorkletNode(n,"raw-audio-processor");return p.port.postMessage({type:"setFormat",format:s,sampleRate:e}),f.connect(h),h.connect(p),await n.resume(),new A(n,h,p,a)}catch(l){var o,r;throw(o=a)==null||o.getTracks().forEach(c=>c.stop()),(r=n)==null||r.close(),l}}constructor(e,s,t,n){this.context=void 0,this.analyser=void 0,this.worklet=void 0,this.inputStream=void 0,this.context=e,this.analyser=s,this.worklet=t,this.inputStream=n}async close(){this.inputStream.getTracks().forEach(e=>e.stop()),await this.context.close()}setMuted(e){this.worklet.port.postMessage({type:"setMuted",isMuted:e})}}const $=N("audio-concat-processor",`
const decodeTable = [0,132,396,924,1980,4092,8316,16764];

export function decodeSample(muLawSample) {
  let sign;
  let exponent;
  let mantissa;
  let sample;
  muLawSample = ~muLawSample;
  sign = (muLawSample & 0x80);
  exponent = (muLawSample >> 4) & 0x07;
  mantissa = muLawSample & 0x0F;
  sample = decodeTable[exponent] + (mantissa << (exponent+3));
  if (sign !== 0) sample = -sample;

  return sample;
}

class AudioConcatProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffers = []; // Initialize an empty buffer
    this.cursor = 0;
    this.currentBuffer = null;
    this.wasInterrupted = false;
    this.finished = false;
    
    this.port.onmessage = ({ data }) => {
      switch (data.type) {
        case "setFormat":
          this.format = data.format;
          break;
        case "buffer":
          this.wasInterrupted = false;
          this.buffers.push(
            this.format === "ulaw"
              ? new Uint8Array(data.buffer)
              : new Int16Array(data.buffer)
          );
          break;
        case "interrupt":
          this.wasInterrupted = true;
          break;
        case "clearInterrupted":
          if (this.wasInterrupted) {
            this.wasInterrupted = false;
            this.buffers = [];
            this.currentBuffer = null;
          }
      }
    };
  }
  process(_, outputs) {
    let finished = false;
    const output = outputs[0][0];
    for (let i = 0; i < output.length; i++) {
      if (!this.currentBuffer) {
        if (this.buffers.length === 0) {
          finished = true;
          break;
        }
        this.currentBuffer = this.buffers.shift();
        this.cursor = 0;
      }

      let value = this.currentBuffer[this.cursor];
      if (this.format === "ulaw") {
        value = decodeSample(value);
      }
      output[i] = value / 32768;
      this.cursor++;

      if (this.cursor >= this.currentBuffer.length) {
        this.currentBuffer = null;
      }
    }

    if (this.finished !== finished) {
      this.finished = finished;
      this.port.postMessage({ type: "process", finished });
    }

    return true; // Continue processing
  }
}

registerProcessor("audio-concat-processor", AudioConcatProcessor);
`);class x{static async create({sampleRate:e,format:s}){let t=null;try{t=new AudioContext({sampleRate:e});const a=t.createAnalyser(),o=t.createGain();o.connect(a),a.connect(t.destination),await $(t.audioWorklet);const r=new AudioWorkletNode(t,"audio-concat-processor");return r.port.postMessage({type:"setFormat",format:s}),r.connect(o),await t.resume(),new x(t,a,o,r)}catch(a){var n;throw(n=t)==null||n.close(),a}}constructor(e,s,t,n){this.context=void 0,this.analyser=void 0,this.gain=void 0,this.worklet=void 0,this.context=e,this.analyser=s,this.gain=t,this.worklet=n}async close(){await this.context.close()}}class D extends _{static async startSession(e){var s;const t=_.getFullOptions(e);t.onStatusChange({status:"connecting"}),t.onCanSendFeedbackChange({canSendFeedback:!1});let n=null,a=null,o=null,r=null,l=null;if((s=e.useWakeLock)==null||s)try{l=await navigator.wakeLock.request("screen")}catch{}try{var c;return r=await navigator.mediaDevices.getUserMedia({audio:!0}),await W(t.connectionDelay),a=await C.create(e),[n,o]=await Promise.all([A.create(k({},a.inputFormat,{preferHeadphonesForIosDevices:e.preferHeadphonesForIosDevices})),x.create(a.outputFormat)]),(c=r)==null||c.getTracks().forEach(u=>u.stop()),r=null,new D(t,a,n,o,l)}catch(u){var h,f,p,g;t.onStatusChange({status:"disconnected"}),(h=r)==null||h.getTracks().forEach(d=>d.stop()),(f=a)==null||f.close(),await((p=n)==null?void 0:p.close()),await((g=o)==null?void 0:g.close());try{var v;await((v=l)==null?void 0:v.release()),l=null}catch{}throw u}}constructor(e,s,t,n,a){super(e,s),this.input=void 0,this.output=void 0,this.wakeLock=void 0,this.inputFrequencyData=void 0,this.outputFrequencyData=void 0,this.onInputWorkletMessage=o=>{this.status==="connected"&&this.connection.sendMessage({user_audio_chunk:V(o.data[0].buffer)})},this.onOutputWorkletMessage=({data:o})=>{o.type==="process"&&this.updateMode(o.finished?"listening":"speaking")},this.addAudioBase64Chunk=o=>{this.output.gain.gain.value=this.volume,this.output.worklet.port.postMessage({type:"clearInterrupted"}),this.output.worklet.port.postMessage({type:"buffer",buffer:j(o)})},this.fadeOutAudio=()=>{this.updateMode("listening"),this.output.worklet.port.postMessage({type:"interrupt"}),this.output.gain.gain.exponentialRampToValueAtTime(1e-4,this.output.context.currentTime+2),setTimeout(()=>{this.output.gain.gain.value=this.volume,this.output.worklet.port.postMessage({type:"clearInterrupted"})},2e3)},this.calculateVolume=o=>{if(o.length===0)return 0;let r=0;for(let l=0;l<o.length;l++)r+=o[l]/255;return r/=o.length,r<0?0:r>1?1:r},this.input=t,this.output=n,this.wakeLock=a,this.input.worklet.port.onmessage=this.onInputWorkletMessage,this.output.worklet.port.onmessage=this.onOutputWorkletMessage}async handleEndSession(){await super.handleEndSession();try{var e;await((e=this.wakeLock)==null?void 0:e.release()),this.wakeLock=null}catch{}await this.input.close(),await this.output.close()}handleInterruption(e){super.handleInterruption(e),this.fadeOutAudio()}handleAudio(e){this.lastInterruptTimestamp<=e.audio_event.event_id&&(this.options.onAudio(e.audio_event.audio_base_64),this.addAudioBase64Chunk(e.audio_event.audio_base_64),this.currentEventId=e.audio_event.event_id,this.updateCanSendFeedback(),this.updateMode("speaking"))}setMicMuted(e){this.input.setMuted(e)}getInputByteFrequencyData(){return this.inputFrequencyData!=null||(this.inputFrequencyData=new Uint8Array(this.input.analyser.frequencyBinCount)),this.input.analyser.getByteFrequencyData(this.inputFrequencyData),this.inputFrequencyData}getOutputByteFrequencyData(){return this.outputFrequencyData!=null||(this.outputFrequencyData=new Uint8Array(this.output.analyser.frequencyBinCount)),this.output.analyser.getByteFrequencyData(this.outputFrequencyData),this.outputFrequencyData}getInputVolume(){return this.calculateVolume(this.getInputByteFrequencyData())}getOutputVolume(){return this.calculateVolume(this.getOutputByteFrequencyData())}}class J extends _{static startSession(e){return e.textOnly?I.startSession(e):D.startSession(e)}}const S=document.getElementById("startButton"),M=document.getElementById("stopButton"),y=document.getElementById("waveContainer");let b;function w(i){if(!i){y.style.display="none",y.classList.remove("listening","speaking");return}y.style.display="flex",y.classList.remove("listening","speaking"),y.classList.add(i)}async function G(){try{await navigator.mediaDevices.getUserMedia({audio:!0}),b=await J.startSession({agentId:"agent_01jxs6hq1sfgqsr9z9vh44ze8p",onConnect:()=>{S.style.display="none",M.style.display="inline-block",w("listening")},onDisconnect:()=>{M.style.display="none",S.style.display="inline-block",w(null)},onError:i=>{console.error("Error:",i),w(null)},onModeChange:i=>{w(i.mode)}})}catch(i){console.error("Failed to start conversation:",i)}}async function H(){b&&(await b.endSession(),b=null,M.style.display="none",S.style.display="inline-block",w(null))}S.addEventListener("click",G);M.addEventListener("click",H);
