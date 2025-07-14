// =================================================================
// 🧪 JEST 환경 설정을 위한 최종 Polyfill 및 Mock 코드 (Ver. Final-Final)
// =================================================================

// 1. fetch, Request, Response, Headers 등 웹 API Polyfill
import "whatwg-fetch";

// 2. TextEncoder, TextDecoder Polyfill
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// 3. Web Streams API Polyfill
if (typeof global.TransformStream === "undefined") {
  const { ReadableStream, TransformStream } = require("node:stream/web");
  global.ReadableStream = ReadableStream;
  global.TransformStream = TransformStream;
}

// 4. BroadcastChannel Mock
if (typeof global.BroadcastChannel === "undefined") {
  global.BroadcastChannel = class {
    constructor(name) {}
    postMessage(message) {}
    close() {}
  };
}

// ✅ 5. Image 객체 Mock (더 안정적인 방식으로 수정)
// JSDOM 환경에는 Image 객체가 없으므로, 로딩이 즉시 성공한 것처럼 흉내 냅니다.
Object.defineProperty(global.Image.prototype, "src", {
  set() {
    // src 속성이 설정되면, 바로 onload를 호출합니다.
    if (this.onload) {
      this.onload();
    }
  },
});

// 6. React Testing Library를 위한 jest-dom 확장
import "@testing-library/jest-dom";
