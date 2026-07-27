"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[847],{1538:function(e,t,r){r.d(t,{b:function(){return n}});var o=r(2265),i=r(9285),a=r(1448);let n=o.forwardRef(({children:e,enabled:t=!0,speed:r=1,rotationIntensity:n=1,floatIntensity:l=1,floatingRange:u=[-.1,.1],autoInvalidate:s=!1,...c},f)=>{let m=o.useRef(null);o.useImperativeHandle(f,()=>m.current,[]);let d=o.useRef(1e4*Math.random());return(0,i.F)(e=>{var o,i;if(!t||0===r)return;s&&e.invalidate();let c=d.current+e.clock.elapsedTime;m.current.rotation.x=Math.cos(c/4*r)/8*n,m.current.rotation.y=Math.sin(c/4*r)/8*n,m.current.rotation.z=Math.sin(c/4*r)/20*n;let f=Math.sin(c/4*r)/10;f=a.MathUtils.mapLinear(f,-.1,.1,null!==(o=null==u?void 0:u[0])&&void 0!==o?o:-.1,null!==(i=null==u?void 0:u[1])&&void 0!==i?i:.1),m.current.position.y=f*l,m.current.updateMatrix()}),o.createElement("group",c,o.createElement("group",{ref:m,matrixAutoUpdate:!1},e))})},8146:function(e,t,r){r.d(t,{Z:function(){return n}});var o=r(1119),i=r(2265),a=r(1448);let n=i.forwardRef(function({args:[e=1,t=1,r=1]=[],radius:n=.05,steps:l=1,smoothness:u=4,bevelSegments:s=4,creaseAngle:c=.4,children:f,...m},d){let p=i.useMemo(()=>(function(e,t,r){let o=new a.Shape,i=r-1e-5;return o.absarc(1e-5,1e-5,1e-5,-Math.PI/2,-Math.PI,!0),o.absarc(1e-5,t-2*i,1e-5,Math.PI,Math.PI/2,!0),o.absarc(e-2*i,t-2*i,1e-5,Math.PI/2,0,!0),o.absarc(e-2*i,1e-5,1e-5,0,-Math.PI/2,!0),o})(e,t,n),[e,t,n]),v=i.useMemo(()=>({depth:r-2*n,bevelEnabled:!0,bevelSegments:2*s,steps:l,bevelSize:n-1e-5,bevelThickness:n,curveSegments:u}),[r,n,u]),b=i.useRef(null);return i.useLayoutEffect(()=>{b.current&&(b.current.center(),function(e,t=Math.PI/3){let r=Math.cos(t),o=(1+1e-10)*100,i=[new a.Vector3,new a.Vector3,new a.Vector3],n=new a.Vector3,l=new a.Vector3,u=new a.Vector3,s=new a.Vector3;function c(e){let t=~~(e.x*o),r=~~(e.y*o),i=~~(e.z*o);return`${t},${r},${i}`}let f=e.index?e.toNonIndexed():e,m=f.attributes.position,d={};for(let e=0,t=m.count/3;e<t;e++){let t=3*e,r=i[0].fromBufferAttribute(m,t+0),o=i[1].fromBufferAttribute(m,t+1),u=i[2].fromBufferAttribute(m,t+2);n.subVectors(u,o),l.subVectors(r,o);let s=new a.Vector3().crossVectors(n,l).normalize();for(let e=0;e<3;e++){let t=c(i[e]);t in d||(d[t]=[]),d[t].push(s)}}let p=new Float32Array(3*m.count),v=new a.BufferAttribute(p,3,!1);for(let e=0,t=m.count/3;e<t;e++){let t=3*e,o=i[0].fromBufferAttribute(m,t+0),a=i[1].fromBufferAttribute(m,t+1),f=i[2].fromBufferAttribute(m,t+2);n.subVectors(f,a),l.subVectors(o,a),u.crossVectors(n,l).normalize();for(let e=0;e<3;e++){let o=d[c(i[e])];s.set(0,0,0);for(let e=0,t=o.length;e<t;e++){let t=o[e];u.dot(t)>r&&s.add(t)}s.normalize(),v.setXYZ(t+e,s.x,s.y,s.z)}}f.setAttribute("normal",v)}(b.current,c))},[p,v]),i.createElement("mesh",(0,o.Z)({ref:d},m),i.createElement("extrudeGeometry",{ref:b,args:[p,v]}),f)})},1973:function(e,t,r){r.d(t,{P:function(){return p}});var o=r(1119),i=r(2265),a=r(1448),n=r(9285);let l=parseInt(a.REVISION.replace(/\D+/g,""));class u extends a.ShaderMaterial{constructor(){super({uniforms:{time:{value:0},pixelRatio:{value:1}},vertexShader:`
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
      `})}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}get pixelRatio(){return this.uniforms.pixelRatio.value}set pixelRatio(e){this.uniforms.pixelRatio.value=e}}let s=e=>e&&e.constructor===Float32Array,c=e=>[e.r,e.g,e.b],f=e=>e instanceof a.Vector2||e instanceof a.Vector3||e instanceof a.Vector4,m=e=>Array.isArray(e)?e:f(e)?e.toArray():[e,e,e];function d(e,t,r){return i.useMemo(()=>{if(void 0!==t){if(s(t))return t;if(t instanceof a.Color){let r=Array.from({length:3*e},()=>c(t)).flat();return Float32Array.from(r)}if(f(t)||Array.isArray(t)){let r=Array.from({length:3*e},()=>m(t)).flat();return Float32Array.from(r)}return Float32Array.from({length:e},()=>t)}return Float32Array.from({length:e},r)},[t])}let p=i.forwardRef(({noise:e=1,count:t=100,speed:r=1,opacity:l=1,scale:c=1,size:f,color:p,children:v,...b},h)=>{i.useMemo(()=>(0,n.e)({SparklesImplMaterial:u}),[]);let g=i.useRef(null),y=(0,n.D)(e=>e.viewport.dpr),A=m(c),M=i.useMemo(()=>Float32Array.from(Array.from({length:t},()=>A.map(a.MathUtils.randFloatSpread)).flat()),[t,...A]),x=d(t,f,Math.random),P=d(t,l),w=d(t,r),E=d(3*t,e),V=d(void 0===p?3*t:t,s(p)?p:new a.Color(p),()=>1);return(0,n.F)(e=>{g.current&&g.current.material&&(g.current.material.time=e.clock.elapsedTime)}),i.useImperativeHandle(h,()=>g.current,[]),i.createElement("points",(0,o.Z)({key:`particle-${t}-${JSON.stringify(c)}`},b,{ref:g}),i.createElement("bufferGeometry",null,i.createElement("bufferAttribute",{attach:"attributes-position",args:[M,3]}),i.createElement("bufferAttribute",{attach:"attributes-size",args:[x,1]}),i.createElement("bufferAttribute",{attach:"attributes-opacity",args:[P,1]}),i.createElement("bufferAttribute",{attach:"attributes-speed",args:[w,1]}),i.createElement("bufferAttribute",{attach:"attributes-color",args:[V,3]}),i.createElement("bufferAttribute",{attach:"attributes-noise",args:[E,3]})),v||i.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:y,depthWrite:!1}))})}}]);