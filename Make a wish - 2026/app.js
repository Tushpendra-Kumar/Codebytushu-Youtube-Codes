const CONFIG = {
  particleCount: 400000,
  perMouse: 300,
  color: [0.8, 0.65, 0.4],
  size: 2,
  minSize: 0.001,
  spread: 8,
  explosionForce: 10,
  movementSpread: 20,
  speed: 0.001,
  fadeSpeed: 0.06,
  far: 100,
  maxZ: 100,
  textString: "Make a wish",
  textDuration: 6000
};

// =========================================================
// SHADERS
// =========================================================

// PARTICLE SHADER (Unchanged from your perfect version)
const SHADER_PARTICLES = `
struct Uniforms {
    resolution: vec2<f32>,
    pixelRatio: f32,
    time: f32,
    speed: f32,
    size: f32,
    minSize: f32,
    spread: f32,
    movementSpread: f32,
    explosionForce: f32,
    far: f32,
    fadeSpeed: f32,
    maxZ: f32
};

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vProgress: f32,
    @location(1) vRandom: f32,
    @location(2) vDiff: f32,
    @location(3) vUv: vec2<f32>,
    @location(4) vDepth: f32
};

fn easeOutQuart(x: f32) -> f32 {
    return 1.0 - pow(1.0 - x, 4.0);
}

const PI = 3.1415926;

@vertex
fn vs_main(
    @builtin(vertex_index) v_index: u32,
    @location(0) pos: vec3<f32>,          
    @location(1) random: f32,             
    @location(2) mouse: vec4<f32>,        
    @location(3) aFront: vec2<f32>        
) -> VertexOutput {
    
    var out: VertexOutput;
    var progress = (u.time - mouse.z) * u.speed;
    progress = clamp(progress, 0.0, 1.0);
    
    if (mouse.x < -100.0) {
        out.position = vec4<f32>(0.0, 0.0, 0.0, 0.0);
        return out;
    }

    let startX = mouse.x - (u.resolution.x * 0.5);
    let startY = (u.resolution.y - mouse.y) - (u.resolution.y * 0.5);
    let startPosition = vec3<f32>(startX, startY, 0.0);

    var diff = clamp(mouse.w / 100.0, 0.0, 1.0);
    let cPosition = pos * 2.0 - 1.0; 
    let radian = cPosition.x * PI * 2.0 - PI;
    
    let baseWidth = u.spread;
    let moveWidth = u.movementSpread * diff;
    let ageWidth = u.explosionForce * pow(progress, 0.4);
    let totalSpread = baseWidth + moveWidth + ageWidth;

    let xySpread = vec2<f32>(cos(radian), sin(radian)) 
                 * totalSpread 
                 * cPosition.y; 

    var endPosition = startPosition;
    endPosition.x += xySpread.x;
    endPosition.y += xySpread.y;
    
    let dragFactor = mix(0.2, 1.0, diff); 
    endPosition.x -= aFront.x * u.far * random * dragFactor;
    endPosition.y += aFront.y * u.far * random * dragFactor; 

    endPosition.z += cPosition.z * u.maxZ;

    let animP = easeOutQuart(progress);
    let currentPosition = mix(startPosition, endPosition, animP);

    let camZ = 1200.0;
    let viewZ = camZ - currentPosition.z;
    let perspective = camZ / viewZ;

    let clipX = (currentPosition.x * perspective) / (u.resolution.x * 0.5);
    let clipY = (currentPosition.y * perspective) / (u.resolution.y * 0.5);

    var corners = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0), vec2<f32>( 1.0, -1.0), vec2<f32>(-1.0,  1.0),
        vec2<f32>(-1.0,  1.0), vec2<f32>( 1.0, -1.0), vec2<f32>( 1.0,  1.0)
    );
    let corner = corners[v_index];
    out.vUv = corner;

    let lifeCycle = sin(progress * 3.14); 
    let pxSize = u.size * lifeCycle * perspective * u.pixelRatio;
    let finalSize = max(pxSize, u.minSize);

    let w_clip = finalSize / u.resolution.x;
    let h_clip = finalSize / u.resolution.y;

    out.position = vec4<f32>(
        clipX + (corner.x * w_clip), 
        clipY + (corner.y * h_clip), 
        0.5, 
        1.0
    );

    out.vProgress = progress;
    out.vRandom = random;
    out.vDiff = diff;
    out.vDepth = cPosition.z;

    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let len = length(in.vUv);
    let shape = 1.0 - smoothstep(0.0, 1.0, len); 
    if (shape <= 0.0) { discard; }

    let seed = vec2<f32>(in.vProgress * mix(0.2, 1.0, in.vRandom));
    let dt = dot(seed, vec2<f32>(12.9898, 78.233));
    let sn = (dt % 3.14);
    var twinkle = fract(sin(sn) * 43758.5453);
    twinkle = mix(0.4, 1.0, twinkle); 

    var alpha = 1.0 - in.vProgress;
    alpha = pow(alpha, u.fadeSpeed);
    
    let finalAlpha = alpha * twinkle * shape * mix(0.5, 1.0, in.vDepth);
    let color = vec3<f32>(${CONFIG.color.join(",")});
    
    return vec4<f32>(color * twinkle, finalAlpha);
}
`;

// FIXED TEXT SHADER (Uses Normalized 0-1 Progress)
const SHADER_TEXT = `
struct Uniforms {
    resolution: vec2<f32>,
    progress: f32, // Normalized 0.0 to 1.0
    pad1: f32,
    pad2: f32,
    alpha: f32
};
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var mySampler: sampler;
@group(0) @binding(2) var myTexture: texture_2d<f32>;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>
};

@vertex
fn vs_main(@location(0) pos: vec2<f32>, @location(1) uv: vec2<f32>) -> VertexOutput {
    var out: VertexOutput;
    // Map pixels to clip space
    let clipX = (pos.x / (u.resolution.x * 0.5));
    let clipY = (pos.y / (u.resolution.y * 0.5)); 
    out.position = vec4<f32>(clipX, clipY, 0.0, 1.0);
    out.uv = uv;
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let color = textureSample(myTexture, mySampler, in.uv);
    
    // "V" Shape wipe logic
    // u.progress is 0.0 to 1.0 relative to text width
    
    // Add V-offset based on Y. Center (0.5) is ahead, edges are behind.
    // abs(in.uv.y - 0.5) ranges from 0.0 to 0.5
    let vShape = abs(in.uv.y - 0.5) * 0.3; // 0.3 controls angle sharpness
    
    // Scale progress slightly > 1.0 to ensure full clear with the V-shape offset
    let p = u.progress * 1.3 - 0.15;
    
    // Visible if UV.x is less than the threshold
    let limit = p - vShape;
    let isShow = step(in.uv.x, limit);
    
    if (color.a < 0.1 || isShow < 0.5) { discard; }
    return vec4<f32>(color.rgb, color.a * u.alpha);
}
`;

// =========================================================
// APP LOGIC
// =========================================================

class WebGPUApp {
  constructor(canvas) {
    this.canvas = canvas;
    this.dpr = Math.min(window.devicePixelRatio, 2) || 1;
    this.mouseIndex = 0;
    this.oldPos = null;
    this.lastFx = 0;
    this.lastFy = 0;
    this.animState = "spiral";
    this.animStartTime = 0;
    this.textProgressNormalized = 0;
    this.resize();
  }

  async init() {
    if (!navigator.gpu) throw new Error("WebGPU not supported");

    this.adapter = await navigator.gpu.requestAdapter();
    this.device = await this.adapter.requestDevice();
    this.context = this.canvas.getContext("webgpu");
    this.format = navigator.gpu.getPreferredCanvasFormat();

    this.context.configure({
      device: this.device,
      format: this.format,
      alphaMode: "premultiplied"
    });

    await this.setupParticles();
    await this.setupText();
    this.setupInputs();

    window.addEventListener("resize", () => this.resize());

    this.animStartTime = performance.now();
    requestAnimationFrame((t) => this.render(t));
    document.getElementById("loader").style.display = "none";
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio, 2) || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.halfW = this.width / 2;
    this.halfH = this.height / 2;

    if (this.context && this.device) {
      this.context.configure({
        device: this.device,
        format: this.format,
        alphaMode: "premultiplied"
      });
    }
  }

  async setupParticles() {
    const count = CONFIG.particleCount;

    const staticData = new Float32Array(count * 4);
    for (let i = 0; i < count * 4; i++) staticData[i] = Math.random();
    this.bufStatic = this.createBuffer(staticData, GPUBufferUsage.VERTEX);

    const dynamicData = new Float32Array(count * 6);
    for (let i = 0; i < count * 6; i += 6) {
      dynamicData[i] = -9999;
      dynamicData[i + 2] = -9999;
    }
    this.bufDynamic = this.createBuffer(
      dynamicData,
      GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    );

    this.bufUniforms = this.device.createBuffer({
      size: 128,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const module = this.device.createShaderModule({ code: SHADER_PARTICLES });
    this.pipelineParticles = this.device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module,
        entryPoint: "vs_main",
        buffers: [
          {
            arrayStride: 16,
            stepMode: "instance",
            attributes: [
              { format: "float32x3", offset: 0, shaderLocation: 0 },
              { format: "float32", offset: 12, shaderLocation: 1 }
            ]
          },
          {
            arrayStride: 24,
            stepMode: "instance",
            attributes: [
              { format: "float32x4", offset: 0, shaderLocation: 2 },
              { format: "float32x2", offset: 16, shaderLocation: 3 }
            ]
          }
        ]
      },
      fragment: {
        module,
        entryPoint: "fs_main",
        targets: [
          {
            format: this.format,
            blend: {
              color: {
                srcFactor: "src-alpha",
                dstFactor: "one",
                operation: "add"
              },
              alpha: { srcFactor: "zero", dstFactor: "one", operation: "add" }
            }
          }
        ]
      },
      primitive: { topology: "triangle-list" }
    });

    this.bindGroupParticles = this.device.createBindGroup({
      layout: this.pipelineParticles.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: this.bufUniforms } }]
    });
  }

  async setupText() {
    const txtCanvas = document.createElement("canvas");
    // Mobile Fix: Ensure font size scales, but doesn't get ludicrously huge
    const fontSize = 40 * this.dpr;
    const ctx = txtCanvas.getContext("2d");
    ctx.font = `bold ${fontSize}px Georgia, serif`;
    const metrics = ctx.measureText(CONFIG.textString);
    const w = Math.ceil(metrics.width * 1.5);
    const h = Math.ceil(fontSize * 2.0);
    txtCanvas.width = w;
    txtCanvas.height = h;
    this.textWidth = w;

    ctx.font = `bold ${fontSize}px Georgia, serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(CONFIG.textString, w / 2, h / 2);

    const texture = this.device.createTexture({
      size: [w, h],
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT
    });
    this.device.queue.copyExternalImageToTexture(
      { source: txtCanvas },
      { texture },
      [w, h]
    );

    // Fix UV mapping (Y-Flip)
    const hw = w / 2;
    const hh = h / 2;
    const vertexData = new Float32Array([
      -hw,
      hh,
      0,
      0,
      hw,
      hh,
      1,
      0,
      -hw,
      -hh,
      0,
      1,
      hw,
      -hh,
      1,
      1
    ]);
    this.bufTextGeom = this.createBuffer(vertexData, GPUBufferUsage.VERTEX);

    this.bufTextUniforms = this.device.createBuffer({
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const module = this.device.createShaderModule({ code: SHADER_TEXT });
    this.pipelineText = this.device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module,
        entryPoint: "vs_main",
        buffers: [
          {
            arrayStride: 16,
            stepMode: "vertex",
            attributes: [
              { format: "float32x2", offset: 0, shaderLocation: 0 },
              { format: "float32x2", offset: 8, shaderLocation: 1 }
            ]
          }
        ]
      },
      fragment: {
        module,
        entryPoint: "fs_main",
        targets: [
          {
            format: this.format,
            blend: {
              color: {
                srcFactor: "src-alpha",
                dstFactor: "one-minus-src-alpha",
                operation: "add"
              },
              alpha: {
                srcFactor: "one",
                dstFactor: "one-minus-src-alpha",
                operation: "add"
              }
            }
          }
        ]
      },
      primitive: { topology: "triangle-strip" }
    });

    const sampler = this.device.createSampler({
      minFilter: "linear",
      magFilter: "linear"
    });
    this.bindGroupText = this.device.createBindGroup({
      layout: this.pipelineText.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.bufTextUniforms } },
        { binding: 1, resource: sampler },
        { binding: 2, resource: texture.createView() }
      ]
    });
  }

  createBuffer(data, usage) {
    const buffer = this.device.createBuffer({
      size: data.byteLength,
      usage: usage,
      mappedAtCreation: true
    });
    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return buffer;
  }

  setupInputs() {
    const handler = (cx, cy) => {
      if (this.animState === "interactive") {
        this.updateTrail(cx * this.dpr, cy * this.dpr);
      }
    };
    window.addEventListener("pointermove", (e) =>
      handler(e.clientX, e.clientY)
    );
    window.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        handler(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: false }
    );
  }

  updateTrail(x, y) {
    const now = performance.now();
    let dist = 0;
    let targetFx = 0,
      targetFy = 0;

    if (this.oldPos) {
      const dx = x - this.oldPos.x;
      const dy = y - this.oldPos.y;
      dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        targetFx = dx / dist;
        targetFy = dy / dist;
      }
    } else {
      targetFx = this.lastFx;
      targetFy = this.lastFy;
    }

    const count = CONFIG.perMouse;
    const data = new Float32Array(count * 6);
    const jitterAmount = dist < 1.0 ? 2.0 : 0.0;

    for (let i = 0; i < count; i++) {
      const ratio = i / count;
      let cx = this.oldPos ? this.oldPos.x + (x - this.oldPos.x) * ratio : x;
      let cy = this.oldPos ? this.oldPos.y + (y - this.oldPos.y) * ratio : y;

      if (jitterAmount > 0) {
        cx += (Math.random() - 0.5) * jitterAmount;
        cy += (Math.random() - 0.5) * jitterAmount;
      }

      const iFx = this.lastFx + (targetFx - this.lastFx) * ratio;
      const iFy = this.lastFy + (targetFy - this.lastFy) * ratio;

      const idx = i * 6;
      data[idx] = cx;
      data[idx + 1] = cy;
      data[idx + 2] = now;
      data[idx + 3] = dist;
      data[idx + 4] = iFx;
      data[idx + 5] = iFy;
    }

    this.lastFx = targetFx;
    this.lastFy = targetFy;

    const startIdx = this.mouseIndex % CONFIG.particleCount;
    const byteOffset = startIdx * 6 * 4;
    this.device.queue.writeBuffer(this.bufDynamic, byteOffset, data);

    this.mouseIndex = (this.mouseIndex + count) % CONFIG.particleCount;
    this.oldPos = { x, y };
  }

  render(time) {
    const elapsed = time - this.animStartTime;

    if (this.animState === "spiral") {
      const dur = 1080;
      if (elapsed > dur) {
        this.animState = "wipe";
        this.animStartTime = time;
        this.oldPos = null;
        this.updateTrail(-1000, 0);
      } else {
        const p = Math.pow(elapsed / dur - 1, 3) + 1;
        const period = Math.PI * 3;
        const amp = Math.min(this.width * 0.1, 200 * this.dpr);
        const cx = Math.cos(p * period) * amp + this.halfW;
        const cy =
          Math.sin(p * period) * amp * 0.5 +
          this.height * 0.5 -
          p * 200 * this.dpr;
        this.updateTrail(cx, cy);
      }
    } else if (this.animState === "wipe") {
      const dur = CONFIG.textDuration;
      const p = Math.min((time - this.animStartTime) / dur, 1.0);
      const val = 1 - Math.pow(1 - p, 5);

      const startX = -this.width * 0.1;
      const endX = this.width + 200;
      const curX = startX + (endX - startX) * val;

      this.updateTrail(curX, this.halfH);

      // --- FIX FOR MOBILE TEXT ---
      // Calculate progress relative to text width (0 to 1) instead of pixel coordinates
      const textStart = this.halfW - this.textWidth / 2;
      const leadOffset = 0.08 * this.width;
      const wiperPos = curX - leadOffset;

      // Normalize: 0.0 = Start of text, 1.0 = End of text
      this.textProgressNormalized = (wiperPos - textStart) / this.textWidth;

      if (p >= 1.0) {
        this.animState = "interactive";
        this.oldPos = null;
      }
    }

    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    });

    const pUni = new Float32Array([
      this.width,
      this.height,
      this.dpr,
      time,
      CONFIG.speed,
      CONFIG.size,
      CONFIG.minSize,
      CONFIG.spread,
      CONFIG.movementSpread,
      CONFIG.explosionForce,
      CONFIG.far,
      CONFIG.fadeSpeed,
      CONFIG.maxZ
    ]);
    this.device.queue.writeBuffer(this.bufUniforms, 0, pUni);

    pass.setPipeline(this.pipelineParticles);
    pass.setBindGroup(0, this.bindGroupParticles);
    pass.setVertexBuffer(0, this.bufStatic);
    pass.setVertexBuffer(1, this.bufDynamic);
    pass.draw(6, CONFIG.particleCount, 0, 0);

    if (this.animState !== "spiral") {
      const tUni = new Float32Array([
        this.width,
        this.height,
        this.textProgressNormalized, // Passing normalized 0..1 value
        0,
        0, // Padding
        0.8
      ]);
      this.device.queue.writeBuffer(this.bufTextUniforms, 0, tUni);

      pass.setPipeline(this.pipelineText);
      pass.setBindGroup(0, this.bindGroupText);
      pass.setVertexBuffer(0, this.bufTextGeom);
      pass.draw(4);
    }

    pass.end();
    this.device.queue.submit([encoder.finish()]);

    requestAnimationFrame((t) => this.render(t));
  }
}

try {
  const app = new WebGPUApp(document.getElementById("canvas"));
  app.init().catch((e) => {
    console.error(e);
    document.getElementById("loader").innerText = "Failed: " + e.message;
  });
} catch (err) {
  document.getElementById("loader").innerText = "Error: " + err.message;
}
