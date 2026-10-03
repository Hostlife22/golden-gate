export function hasWebGL() {
  if (new URLSearchParams(location.search).has('forceFallback')) return false;
  try {
    const canvas = document.createElement('canvas'),
      ctx = canvas.getContext('webgl2');
    if (!ctx) return false;
    ctx.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}
