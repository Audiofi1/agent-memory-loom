import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Theme } from "@/components/providers/ThemeProvider";

const vsSource = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

const fsSource = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform float iTheme;

  const float overallSpeed = 0.2;
  const float gridSmoothWidth = 0.015;
  const float scale = 5.0;
  const float minLineWidth = 0.01;
  const float maxLineWidth = 0.2;
  const float lineSpeed = 1.0 * overallSpeed;
  const float lineAmplitude = 1.0;
  const float lineFrequency = 0.2;
  const float warpSpeed = 0.2 * overallSpeed;
  const float warpFrequency = 0.5;
  const float warpAmplitude = 1.0;
  const float offsetFrequency = 0.5;
  const float offsetSpeed = 1.33 * overallSpeed;
  const float minOffsetSpread = 0.6;
  const float maxOffsetSpread = 2.0;
  const int linesPerGroup = 16;

  #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
  #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
  #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))

  float random(float t) {
    return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
  }

  float getPlasmaY(float x, float horizontalFade, float offset) {
    return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
  }

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

    float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
    float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

    space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
    space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

    vec4 lines = vec4(0.0);
    vec4 lineColor = mix(vec4(0.42, 0.28, 0.82, 1.0), vec4(0.4, 0.2, 0.8, 1.0), iTheme);
    float lineBoost = mix(1.2, 1.0, iTheme);

    // Light: sky-blue edges (top + bottom), bright center — no black vignette
    float edgeV = 1.0 - verticalFade;
    vec4 lightCenter = vec4(0.98, 0.995, 1.0, 1.0);
    vec4 lightEdge = vec4(0.58, 0.80, 0.97, 1.0);
    vec4 lightBg = mix(lightCenter, lightEdge, smoothstep(0.0, 0.95, edgeV));

    // Dark: original purple gradient + vertical fade
    vec4 darkBg = mix(vec4(0.1, 0.1, 0.3, 1.0), vec4(0.3, 0.1, 0.5, 1.0), uv.x);
    darkBg *= verticalFade;

    vec4 fragColor = mix(lightBg, darkBg, iTheme);

    for(int l = 0; l < linesPerGroup; l++) {
      float normalizedLineIndex = float(l) / float(linesPerGroup);
      float offsetTime = iTime * offsetSpeed;
      float offsetPosition = float(l) + space.x * offsetFrequency;
      float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
      float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
      float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
      float linePosition = getPlasmaY(space.x, horizontalFade, offset);
      float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

      float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
      vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
      float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

      line = line + circle;
      lines += line * lineColor * rand * lineBoost;
    }

    fragColor.a = 1.0;
    fragColor += lines;

    gl_FragColor = fragColor;
  }
`;

function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function initShaderProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string,
) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return null;

  const shaderProgram = gl.createProgram();
  if (!shaderProgram) return null;
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("Shader program link error:", gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

export type ShaderBackgroundProps = {
  className?: string;
  theme?: Theme;
};

const THEME_BLEND_SPEED = 0.07;

export function ShaderBackground({ className, theme = "dark" }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeTargetRef = useRef(theme === "dark" ? 1 : 0);
  const themeBlendRef = useRef(theme === "dark" ? 1 : 0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    themeTargetRef.current = theme === "dark" ? 1 : 0;
  }, [theme]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.warn("WebGL not supported.");
      return;
    }

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const vertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    const resolution = gl.getUniformLocation(shaderProgram, "iResolution");
    const time = gl.getUniformLocation(shaderProgram, "iTime");
    const themeUniform = gl.getUniformLocation(shaderProgram, "iTheme");

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const startTime = Date.now();
    let frameId = 0;

    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      const target = themeTargetRef.current;
      let blend = themeBlendRef.current;
      blend += (target - blend) * THEME_BLEND_SPEED;
      if (Math.abs(target - blend) < 0.002) blend = target;
      themeBlendRef.current = blend;

      const inv = 1 - blend;
      gl.clearColor(0.58 * inv, 0.8 * inv, 0.97 * inv, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(shaderProgram);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, currentTime);
      gl.uniform1f(themeUniform, blend);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexPosition);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "absolute inset-0 -z-10",
          theme === "dark" ? "bg-slate-950" : "bg-sky-100",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      data-no-theme-transition
      className={cn("absolute inset-0 h-full w-full -z-10", className)}
      aria-hidden
    />
  );
}

export default ShaderBackground;
