// lib/polyfill-dommatrix.js
//
// Runs on ANY server context that imports it. Must be imported BEFORE
// pdf-parse / pdfjs-dist anywhere in the dependency chain — ESM evaluates
// imported modules in source order, so this side-effect import comes first.
//
// Why: pdfjs-dist v4 legacy build has `const SCALE_MATRIX = new DOMMatrix()`
// at module top-level. It tries to polyfill DOMMatrix via the OPTIONAL
// `@napi-rs/canvas` package — works locally where npm installs optional deps,
// but Vercel's serverless bundler skips them, so production after() jobs
// crashed at module load with "DOMMatrix is not defined" (caught by the
// safety-net error reporter on row 39a91b5a, May 15 2026).
//
// We never RENDER PDFs — only extract text via getText()/getInfo() — so
// a no-op stub is enough to let the module load. The SCALE_MATRIX instance
// just sits there unused.

if (typeof globalThis.DOMMatrix === 'undefined') {
  class DOMMatrixStub {
    constructor() {}
    translate() { return this; }
    scale() { return this; }
    rotate() { return this; }
    invertSelf() { return this; }
    multiplySelf() { return this; }
    preMultiplySelf() { return this; }
    transformPoint() { return { x: 0, y: 0, z: 0, w: 1 }; }
  }
  globalThis.DOMMatrix = DOMMatrixStub;
}

// Path2D and ImageData are also referenced by pdfjs-dist's canvas code
// path. They're only used INSIDE render functions (which we never call)
// not at module top-level, so this is defence-in-depth.
if (typeof globalThis.Path2D === 'undefined') {
  class Path2DStub {
    addPath() {}
  }
  globalThis.Path2D = Path2DStub;
}
if (typeof globalThis.ImageData === 'undefined') {
  class ImageDataStub {
    constructor(w, h) {
      this.width = w || 0;
      this.height = h || 0;
      this.data = new Uint8ClampedArray(0);
    }
  }
  globalThis.ImageData = ImageDataStub;
}
