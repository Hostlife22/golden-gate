export const surfaceDeclarations = /* glsl */ `
  varying vec3 vSurfacePosition;
  uniform sampler2D uAlbedo, uSurfaceNormal, uSurfaceRough;
  uniform sampler2D uRockAlbedo, uRockNormal, uRockRough;
  uniform float uSurfaceScale, uTriplanarQuality;
  float surfaceHash(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
  float surfaceNoise(vec3 p) {
    vec3 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(mix(surfaceHash(i),surfaceHash(i+vec3(1,0,0)),f.x),mix(surfaceHash(i+vec3(0,1,0)),surfaceHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(surfaceHash(i+vec3(0,0,1)),surfaceHash(i+vec3(1,0,1)),f.x),mix(surfaceHash(i+vec3(0,1,1)),surfaceHash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }
  vec3 projectionWeights(vec3 n) { vec3 w=pow(abs(n),vec3(4.0));return w/max(dot(w,vec3(1.0)),0.001); }
  vec3 surfaceSample(sampler2D tex,vec3 p,vec3 w) {
    if(uTriplanarQuality<0.5) return texture2D(tex,w.y>=max(w.x,w.z)?p.xz:w.x>w.z?p.zy:p.xy).rgb;
    return texture2D(tex,p.zy).rgb*w.x+texture2D(tex,p.xz).rgb*w.y+texture2D(tex,p.xy).rgb*w.z;
  }
  vec3 surfaceNormal(sampler2D tex,vec3 p,vec3 n,vec3 w) {
    if(uTriplanarQuality<0.5) {
      if(w.y>=max(w.x,w.z)){vec3 t=texture2D(tex,p.xz).xyz*2.0-1.0;return normalize(vec3(t.x,t.z*sign(n.y),t.y));}
      if(w.x>w.z){vec3 t=texture2D(tex,p.zy).xyz*2.0-1.0;return normalize(vec3(t.z*sign(n.x),t.y,t.x));}
      vec3 t=texture2D(tex,p.xy).xyz*2.0-1.0;return normalize(vec3(t.x,t.y,t.z*sign(n.z)));
    }
    vec3 x=texture2D(tex,p.zy).xyz*2.0-1.0;
    vec3 y=texture2D(tex,p.xz).xyz*2.0-1.0;
    vec3 z=texture2D(tex,p.xy).xyz*2.0-1.0;
    return normalize(vec3(x.z*sign(n.x),x.y,x.x)*w.x+vec3(y.x,y.z*sign(n.y),y.y)*w.y+vec3(z.x,z.y,z.z*sign(n.z))*w.z);
  }
`;
