"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[224],{21046:(e,t,r)=>{r.d(t,{n:()=>n});var o=r(12115),a=r(52495),i=r(87548);let n=o.forwardRef(({children:e,enabled:t=!0,speed:r=1,rotationIntensity:n=1,floatIntensity:l=1,floatingRange:s=[-.1,.1],autoInvalidate:u=!1,...c},f)=>{let m=o.useRef(null);o.useImperativeHandle(f,()=>m.current,[]);let d=o.useRef(1e4*Math.random());return(0,a.F)(e=>{var o,a;if(!t||0===r)return;u&&e.invalidate();let c=d.current+e.clock.elapsedTime;m.current.rotation.x=Math.cos(c/4*r)/8*n,m.current.rotation.y=Math.sin(c/4*r)/8*n,m.current.rotation.z=Math.sin(c/4*r)/20*n;let f=Math.sin(c/4*r)/10;f=i.MathUtils.mapLinear(f,-.1,.1,null!=(o=null==s?void 0:s[0])?o:-.1,null!=(a=null==s?void 0:s[1])?a:.1),m.current.position.y=f*l,m.current.updateMatrix()}),o.createElement("group",c,o.createElement("group",{ref:m,matrixAutoUpdate:!1},e))})},39897:(e,t,r)=>{r.d(t,{b:()=>n});var o=r(88945),a=r(12115),i=r(87548);let n=a.forwardRef(function({args:[e=1,t=1,r=1]=[],radius:i=.05,steps:n=1,smoothness:s=4,bevelSegments:u=4,creaseAngle:c=.4,children:f,...m},d){return a.createElement("mesh",(0,o.A)({ref:d},m),a.createElement(l,{args:[e,t,r],radius:i,steps:n,smoothness:s,bevelSegments:u,creaseAngle:c}),f)}),l=a.forwardRef(function({args:[e=1,t=1,r=1]=[],radius:n=.05,steps:l=1,smoothness:s=4,bevelSegments:u=4,creaseAngle:c=.4,...f},m){let d=a.useMemo(()=>(function(e,t,r){let o=new i.Shape,a=r-1e-5;return o.absarc(1e-5,1e-5,1e-5,-Math.PI/2,-Math.PI,!0),o.absarc(1e-5,t-2*a,1e-5,Math.PI,Math.PI/2,!0),o.absarc(e-2*a,t-2*a,1e-5,Math.PI/2,0,!0),o.absarc(e-2*a,1e-5,1e-5,0,-Math.PI/2,!0),o})(e,t,n),[e,t,n]),p=a.useMemo(()=>({depth:r-2*n,bevelEnabled:!0,bevelSegments:2*u,steps:l,bevelSize:n-1e-5,bevelThickness:n,curveSegments:s}),[r,n,s,u,l]),v=a.useRef(null);return a.useLayoutEffect(()=>{v.current&&(v.current.center(),function(e,t=Math.PI/3){let r=Math.cos(t),o=(1+1e-10)*100,a=[new i.Vector3,new i.Vector3,new i.Vector3],n=new i.Vector3,l=new i.Vector3,s=new i.Vector3,u=new i.Vector3;function c(e){let t=~~(e.x*o),r=~~(e.y*o),a=~~(e.z*o);return`${t},${r},${a}`}let f=e.index?e.toNonIndexed():e,m=f.attributes.position,d={};for(let e=0,t=m.count/3;e<t;e++){let t=3*e,r=a[0].fromBufferAttribute(m,t+0),o=a[1].fromBufferAttribute(m,t+1),s=a[2].fromBufferAttribute(m,t+2);n.subVectors(s,o),l.subVectors(r,o);let u=new i.Vector3().crossVectors(n,l).normalize();for(let e=0;e<3;e++){let t=c(a[e]);t in d||(d[t]=[]),d[t].push(u)}}let p=new Float32Array(3*m.count),v=new i.BufferAttribute(p,3,!1);for(let e=0,t=m.count/3;e<t;e++){let t=3*e,o=a[0].fromBufferAttribute(m,t+0),i=a[1].fromBufferAttribute(m,t+1),f=a[2].fromBufferAttribute(m,t+2);n.subVectors(f,i),l.subVectors(o,i),s.crossVectors(n,l).normalize();for(let e=0;e<3;e++){let o=d[c(a[e])];u.set(0,0,0);for(let e=0,t=o.length;e<t;e++){let t=o[e];s.dot(t)>r&&u.add(t)}u.normalize(),v.setXYZ(t+e,u.x,u.y,u.z)}}f.setAttribute("normal",v)}(v.current,c))},[d,p,c]),a.useImperativeHandle(m,()=>v.current),a.createElement("extrudeGeometry",(0,o.A)({ref:v,args:[d,p]},f))})},97003:(e,t,r)=>{r.d(t,{s:()=>d});var o=r(88945),a=r(12115),i=r(87548),n=r(52495);let l=parseInt(i.REVISION.replace(/\D+/g,""));class s extends i.ShaderMaterial{constructor(){super({uniforms:{time:{value:0},pixelRatio:{value:1}},vertexShader:`
        uniform float pixelRatio;
        uniform float time;
        attribute float size;  
        attribute float speed;  
        attribute float opacity;
        attribute vec3 noise;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
          modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
          modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPostion = projectionMatrix * viewPosition;
          gl_Position = projectionPostion;
          gl_PointSize = size * 25. * pixelRatio;
          gl_PointSize *= (1.0 / - viewPosition.z);
          vColor = color;
          vOpacity = opacity;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1;
          gl_FragColor = vec4(vColor, strength * vOpacity);
          #include <tonemapping_fragment>
          #include <${l>=154?"colorspace_fragment":"encodings_fragment"}>
        }
      `})}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}get pixelRatio(){return this.uniforms.pixelRatio.value}set pixelRatio(e){this.uniforms.pixelRatio.value=e}}let u=e=>e&&e.constructor===Float32Array,c=e=>e instanceof i.Vector2||e instanceof i.Vector3||e instanceof i.Vector4,f=e=>Array.isArray(e)?e:c(e)?e.toArray():[e,e,e];function m(e,t,r){return a.useMemo(()=>{if(void 0!==t)if(u(t))return t;else{if(t instanceof i.Color){let r=Array.from({length:3*e},()=>[t.r,t.g,t.b]).flat();return Float32Array.from(r)}if(c(t)||Array.isArray(t)){let r=Array.from({length:3*e},()=>f(t)).flat();return Float32Array.from(r)}return Float32Array.from({length:e},()=>t)}return Float32Array.from({length:e},r)},[t])}let d=a.forwardRef(({noise:e=1,count:t=100,speed:r=1,opacity:l=1,scale:c=1,size:d,color:p,children:v,...b},h)=>{a.useMemo(()=>(0,n.e)({SparklesImplMaterial:s}),[]);let g=a.useRef(null),y=(0,n.D)(e=>e.viewport.dpr),A=f(c),M=a.useMemo(()=>Float32Array.from(Array.from({length:t},()=>A.map(i.MathUtils.randFloatSpread)).flat()),[t,...A]),x=m(t,d,Math.random),P=m(t,l),w=m(t,r),E=m(3*t,e),V=m(void 0===p?3*t:t,u(p)?p:new i.Color(p),()=>1);return(0,n.F)(e=>{g.current&&g.current.material&&(g.current.material.time=e.clock.elapsedTime)}),a.useImperativeHandle(h,()=>g.current,[]),a.createElement("points",(0,o.A)({key:`particle-${t}-${JSON.stringify(c)}`},b,{ref:g}),a.createElement("bufferGeometry",null,a.createElement("bufferAttribute",{attach:"attributes-position",args:[M,3]}),a.createElement("bufferAttribute",{attach:"attributes-size",args:[x,1]}),a.createElement("bufferAttribute",{attach:"attributes-opacity",args:[P,1]}),a.createElement("bufferAttribute",{attach:"attributes-speed",args:[w,1]}),a.createElement("bufferAttribute",{attach:"attributes-color",args:[V,3]}),a.createElement("bufferAttribute",{attach:"attributes-noise",args:[E,3]})),v||a.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:y,depthWrite:!1}))})}}]);