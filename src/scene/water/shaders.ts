export const waterVertex = /* glsl */ `
  uniform float uTime;
  uniform mat4 uReflectionMatrix;
  varying vec3 vWorld;
  varying vec4 vReflection;
  #include <fog_pars_vertex>
  void main() {
    vec3 p=position;
    p.z += 0.025*sin(p.x*0.19+p.y*0.11+uTime*0.7)+0.018*sin(p.y*0.24-p.x*0.08-uTime*0.5);
    vec4 world=modelMatrix*vec4(p,1.0);
    vWorld=world.xyz;
    vReflection=uReflectionMatrix*world;
    vec4 mvPosition=modelViewMatrix*vec4(p,1.0);
    gl_Position=projectionMatrix*mvPosition;
    #include <fog_vertex>
  }
`;
export const waterFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uWater, uSky, uSun, uSunDirection;
  uniform float uHalfSpan;
  uniform sampler2D uReflection, uCoast;
  uniform vec4 uCoastBounds;
  uniform float uBridgeAngle;
  varying vec3 vWorld;
  varying vec4 vReflection;
  #include <common>
  #include <fog_pars_fragment>
  float wave(vec2 p) {
    return sin(p.x*1.45+p.y*0.81+uTime*1.4)*0.45+sin(p.x*3.5-p.y*2.6-uTime*1.6)*0.22+sin(p.x*8.1+p.y*5.6+uTime*2.2)*0.085;
  }
  void main() {
    vec2 p=vWorld.xz;
    float dx=(wave(p+vec2(0.045,0.0))-wave(p-vec2(0.045,0.0)))*0.11;
    float dz=(wave(p+vec2(0.0,0.045))-wave(p-vec2(0.0,0.045)))*0.11;
    vec3 n=normalize(vec3(-dx,1.0,-dz));
    vec3 view=normalize(cameraPosition-vWorld);
    float fresnel=0.035+0.24*pow(1.0-max(dot(n,view),0.0),4.0);
    vec2 uv=vReflection.xy/vReflection.w;
    uv+=n.xz*0.075/(1.0+length(cameraPosition-vWorld)*0.009);
    vec3 reflected=texture2D(uReflection,uv).rgb*0.4;
    reflected+=(texture2D(uReflection,uv+vec2(0.003,0.0)).rgb+texture2D(uReflection,uv-vec2(0.003,0.0)).rgb+texture2D(uReflection,uv+vec2(0.0,0.003)).rgb+texture2D(uReflection,uv-vec2(0.0,0.003)).rgb)*0.15;
    float patches=0.5+0.5*sin(p.x*0.02+p.y*0.027);
    vec3 base=mix(uWater*0.78,uWater*1.15,patches*0.45);
    vec2 coastUv=(p-uCoastBounds.xy)/uCoastBounds.zw;
    float depth=1.0;
    if(coastUv.x>=0.0&&coastUv.x<=1.0&&coastUv.y>=0.0&&coastUv.y<=1.0)depth=texture2D(uCoast,coastUv).r;
    float coastal=1.0-smoothstep(0.0,0.8,depth);
    base=mix(base,uWater*1.18+vec3(0.01,0.025,0.0),coastal*0.5);
    base=mix(base,uSky*0.72,0.14);
    vec3 col=mix(base,reflected,fresnel);
    vec3 halfDir=normalize(uSunDirection+view);
    float glint=pow(max(dot(n,halfDir),0.0),240.0);
    col+=uSun*glint*0.7;
    col+=uSky*pow(max(0.0,0.5+wave(p)*0.52),7.0)*0.026;
    float c=cos(uBridgeAngle),s=sin(uBridgeAngle);
    vec2 bridge=vec2(p.x*c+p.y*s,-p.x*s+p.y*c);
    float deckShadow=(1.0-smoothstep(1.0,2.7,abs(bridge.x-2.1)))*(1.0-smoothstep(96.0,101.0,abs(bridge.y)));
    col*=1.0-0.16*deckShadow;
    float pier=min(length(bridge-vec2(0.0,uHalfSpan)),length(bridge-vec2(0.0,-uHalfSpan)));
    float foam=(1.0-smoothstep(2.4,3.3,pier))*smoothstep(2.2,2.5,pier)*(0.4+wave(p)*0.3);
    col=mix(col,uSky,foam*0.35);
    float shoreFoam=(1.0-smoothstep(0.02,0.08,depth))*pow(max(0.0,0.5+wave(p)*0.5),4.0);
    col=mix(col,uSky,shoreFoam*0.2);
    gl_FragColor=vec4(col,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;
