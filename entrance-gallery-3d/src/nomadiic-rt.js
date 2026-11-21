var D0=Object.defineProperty;var Df=(i,e)=>()=>(i&&(e=i(i=0)),e);var U0=(i,e)=>{for(var t in e)D0(i,t,{get:e[t],enumerable:!0})};function fr(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Jn[i&255]+Jn[i>>8&255]+Jn[i>>16&255]+Jn[i>>24&255]+"-"+Jn[e&255]+Jn[e>>8&255]+"-"+Jn[e>>16&15|64]+Jn[e>>24&255]+"-"+Jn[t&63|128]+Jn[t>>8&255]+"-"+Jn[t>>16&255]+Jn[t>>24&255]+Jn[n&255]+Jn[n>>8&255]+Jn[n>>16&255]+Jn[n>>24&255]).toLowerCase()}function Nn(i,e,t){return Math.max(e,Math.min(t,i))}function bd(i,e){return(i%e+e)%e}function mg(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function gg(i,e,t){return i!==e?(t-i)/(e-i):0}function yo(i,e,t){return(1-t)*i+t*e}function vg(i,e,t,n){return yo(i,e,1-Math.exp(-t*n))}function xg(i,e=1){return e-Math.abs(bd(i,e*2)-e)}function bg(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function yg(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function wg(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Mg(i,e){return i+Math.random()*(e-i)}function Eg(i){return i*(.5-Math.random())}function Sg(i){i!==void 0&&(Hf=i);let e=Hf+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function _g(i){return i*bo}function Tg(i){return i*Ao}function Ag(i){return(i&i-1)===0&&i!==0}function Rg(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Cg(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Pg(i,e,t,n,r){let s=Math.cos,a=Math.sin,o=s(t/2),c=a(t/2),l=s((e+n)/2),u=a((e+n)/2),d=s((e-n)/2),h=a((e-n)/2),p=s((n-e)/2),g=a((n-e)/2);switch(r){case"XYX":i.set(o*u,c*d,c*h,o*l);break;case"YZY":i.set(c*h,o*u,c*d,o*l);break;case"ZXZ":i.set(c*d,c*h,o*u,o*l);break;case"XZX":i.set(o*u,c*g,c*p,o*l);break;case"YXY":i.set(c*p,o*u,c*g,o*l);break;case"ZYZ":i.set(c*g,c*p,o*u,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Zi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ht(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}function gm(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ro(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Lg(){let i=Ro("canvas");return i.style.display="block",i}function go(i){i in Bf||(Bf[i]=!0,console.warn(i))}function Ig(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}function Dg(i){let e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Ug(i){let e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}function Ur(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ya(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}function su(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Mh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}function ou(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){xs.fromArray(i,s);let o=r.x*Math.abs(xs.x)+r.y*Math.abs(xs.y)+r.z*Math.abs(xs.z),c=e.dot(xs),l=t.dot(xs),u=n.dot(xs);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}function yu(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}function Xg(i,e,t,n,r,s,a,o){let c;if(e.side===en?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,e.side===pr,o),c===null)return null;Ac.copy(o),Ac.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Ac);return l<t.near||l>t.far?null:{distance:l,point:Ac.clone(),object:i}}function Rc(i,e,t,n,r,s,a,o,c,l){i.getVertexPosition(o,Ec),i.getVertexPosition(c,Sc),i.getVertexPosition(l,_c);let u=Xg(i,e,t,n,Ec,Sc,_c,rp);if(u){let d=new T;Jr.getBarycoord(rp,Ec,Sc,_c,d),r&&(u.uv=Jr.getInterpolatedAttribute(r,o,c,l,d,new ue)),s&&(u.uv1=Jr.getInterpolatedAttribute(s,o,c,l,d,new ue)),a&&(u.normal=Jr.getInterpolatedAttribute(a,o,c,l,d,new T),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:c,c:l,normal:new T,materialIndex:0};Jr.getNormal(Ec,Sc,_c,h.normal),u.face=h,u.barycoord=d}return u}function Ra(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function ai(i){let e={};for(let t=0;t<i.length;t++){let n=Ra(i[t]);for(let r in n)e[r]=n[r]}return e}function jg(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function xm(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:St.workingColorSpace}function bm(){let i=null,e=!1,t=null,n=null;function r(s,a){t(s,a),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function Qg(i){let e=new WeakMap;function t(o,c){let l=o.array,u=o.usage,d=l.byteLength,h=i.createBuffer();i.bindBuffer(c,h),i.bufferData(c,l,u),o.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){let u=c.array,d=c.updateRanges;if(i.bindBuffer(l,o),d.length===0)i.bufferSubData(l,0,u);else{d.sort((p,g)=>p.start-g.start);let h=0;for(let p=1;p<d.length;p++){let g=d[h],v=d[p];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++h,d[h]=v)}d.length=h+1;for(let p=0,g=d.length;p<g;p++){let v=d[p];i.bufferSubData(l,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}function Db(i,e,t,n,r,s,a){let o=new de(0),c=s===!0?0:1,l,u,d=null,h=0,p=null;function g(y){let w=y.isScene===!0?y.background:null;return w&&w.isTexture&&(w=(y.backgroundBlurriness>0?t:e).get(w)),w}function v(y){let w=!1,x=g(y);x===null?f(o,c):x&&x.isColor&&(f(x,1),w=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,a):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(y,w){let x=g(w);x&&(x.isCubeTexture||x.mapping===yl)?(u===void 0&&(u=new xe(new ei(1,1,1),new ye({name:"BackgroundCubeMaterial",uniforms:Ra(lr.backgroundCube.uniforms),vertexShader:lr.backgroundCube.vertexShader,fragmentShader:lr.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(S,_,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),ws.copy(w.backgroundRotation),ws.x*=-1,ws.y*=-1,ws.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ws.y*=-1,ws.z*=-1),u.material.uniforms.envMap.value=x,u.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Ib.makeRotationFromEuler(ws)),u.material.toneMapped=St.getTransfer(x.colorSpace)!==Dt,(d!==x||h!==x.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,d=x,h=x.version,p=i.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new xe(new Ft(2,2),new ye({name:"BackgroundMaterial",uniforms:Ra(lr.background.uniforms),vertexShader:lr.background.vertexShader,fragmentShader:lr.background.fragmentShader,side:pr,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=St.getTransfer(x.colorSpace)!==Dt,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||h!==x.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,d=x,h=x.version,p=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function f(y,w){y.getRGB(Pc,xm(i)),n.buffers.color.setClear(Pc.r,Pc.g,Pc.b,w,a)}return{getClearColor:function(){return o},setClearColor:function(y,w=1){o.set(y),c=w,f(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,f(o,c)},render:v,addToRenderList:m}}function Ub(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=h(null),s=r,a=!1;function o(b,C,F,U,k){let H=!1,D=d(U,F,C);s!==D&&(s=D,l(s.object)),H=p(b,U,F,k),H&&g(b,U,F,k),k!==null&&e.update(k,i.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,x(b,C,F,U),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function c(){return i.createVertexArray()}function l(b){return i.bindVertexArray(b)}function u(b){return i.deleteVertexArray(b)}function d(b,C,F){let U=F.wireframe===!0,k=n[b.id];k===void 0&&(k={},n[b.id]=k);let H=k[C.id];H===void 0&&(H={},k[C.id]=H);let D=H[U];return D===void 0&&(D=h(c()),H[U]=D),D}function h(b){let C=[],F=[],U=[];for(let k=0;k<t;k++)C[k]=0,F[k]=0,U[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:F,attributeDivisors:U,object:b,attributes:{},index:null}}function p(b,C,F,U){let k=s.attributes,H=C.attributes,D=0,z=F.getAttributes();for(let N in z)if(z[N].location>=0){let ee=k[N],ce=H[N];if(ce===void 0&&(N==="instanceMatrix"&&b.instanceMatrix&&(ce=b.instanceMatrix),N==="instanceColor"&&b.instanceColor&&(ce=b.instanceColor)),ee===void 0||ee.attribute!==ce||ce&&ee.data!==ce.data)return!0;D++}return s.attributesNum!==D||s.index!==U}function g(b,C,F,U){let k={},H=C.attributes,D=0,z=F.getAttributes();for(let N in z)if(z[N].location>=0){let ee=H[N];ee===void 0&&(N==="instanceMatrix"&&b.instanceMatrix&&(ee=b.instanceMatrix),N==="instanceColor"&&b.instanceColor&&(ee=b.instanceColor));let ce={};ce.attribute=ee,ee&&ee.data&&(ce.data=ee.data),k[N]=ce,D++}s.attributes=k,s.attributesNum=D,s.index=U}function v(){let b=s.newAttributes;for(let C=0,F=b.length;C<F;C++)b[C]=0}function m(b){f(b,0)}function f(b,C){let F=s.newAttributes,U=s.enabledAttributes,k=s.attributeDivisors;F[b]=1,U[b]===0&&(i.enableVertexAttribArray(b),U[b]=1),k[b]!==C&&(i.vertexAttribDivisor(b,C),k[b]=C)}function y(){let b=s.newAttributes,C=s.enabledAttributes;for(let F=0,U=C.length;F<U;F++)C[F]!==b[F]&&(i.disableVertexAttribArray(F),C[F]=0)}function w(b,C,F,U,k,H,D){D===!0?i.vertexAttribIPointer(b,C,F,k,H):i.vertexAttribPointer(b,C,F,U,k,H)}function x(b,C,F,U){v();let k=U.attributes,H=F.getAttributes(),D=C.defaultAttributeValues;for(let z in H){let N=H[z];if(N.location>=0){let V=k[z];if(V===void 0&&(z==="instanceMatrix"&&b.instanceMatrix&&(V=b.instanceMatrix),z==="instanceColor"&&b.instanceColor&&(V=b.instanceColor)),V!==void 0){let ee=V.normalized,ce=V.itemSize,Y=e.get(V);if(Y===void 0)continue;let be=Y.buffer,Z=Y.type,ae=Y.bytesPerElement,fe=Z===i.INT||Z===i.UNSIGNED_INT||V.gpuType===hd;if(V.isInterleavedBufferAttribute){let ne=V.data,he=ne.stride,Ge=V.offset;if(ne.isInstancedInterleavedBuffer){for(let We=0;We<N.locationSize;We++)f(N.location+We,ne.meshPerAttribute);b.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let We=0;We<N.locationSize;We++)m(N.location+We);i.bindBuffer(i.ARRAY_BUFFER,be);for(let We=0;We<N.locationSize;We++)w(N.location+We,ce/N.locationSize,Z,ee,he*ae,(Ge+ce/N.locationSize*We)*ae,fe)}else{if(V.isInstancedBufferAttribute){for(let ne=0;ne<N.locationSize;ne++)f(N.location+ne,V.meshPerAttribute);b.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let ne=0;ne<N.locationSize;ne++)m(N.location+ne);i.bindBuffer(i.ARRAY_BUFFER,be);for(let ne=0;ne<N.locationSize;ne++)w(N.location+ne,ce/N.locationSize,Z,ee,ce*ae,ce/N.locationSize*ne*ae,fe)}}else if(D!==void 0){let ee=D[z];if(ee!==void 0)switch(ee.length){case 2:i.vertexAttrib2fv(N.location,ee);break;case 3:i.vertexAttrib3fv(N.location,ee);break;case 4:i.vertexAttrib4fv(N.location,ee);break;default:i.vertexAttrib1fv(N.location,ee)}}}}y()}function S(){E();for(let b in n){let C=n[b];for(let F in C){let U=C[F];for(let k in U)u(U[k].object),delete U[k];delete C[F]}delete n[b]}}function _(b){if(n[b.id]===void 0)return;let C=n[b.id];for(let F in C){let U=C[F];for(let k in U)u(U[k].object),delete U[k];delete C[F]}delete n[b.id]}function R(b){for(let C in n){let F=n[C];if(F[b.id]===void 0)continue;let U=F[b.id];for(let k in U)u(U[k].object),delete U[k];delete F[b.id]}}function E(){M(),a=!0,s!==r&&(s=r,l(s.object))}function M(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:E,resetDefaultState:M,dispose:S,releaseStatesOfGeometry:_,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:m,disableUnusedAttributes:y}}function Fb(i,e,t){let n;function r(l){n=l}function s(l,u){i.drawArrays(n,l,u),t.update(u,n,1)}function a(l,u,d){d!==0&&(i.drawArraysInstanced(n,l,u,d),t.update(u,n,d))}function o(l,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,d);let p=0;for(let g=0;g<d;g++)p+=u[g];t.update(p,n,1)}function c(l,u,d,h){if(d===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)a(l[g],u[g],h[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,u,0,h,0,d);let g=0;for(let v=0;v<d;v++)g+=u[v]*h[v];t.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function kb(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(R){return!(R!==Si&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){let E=R===nn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Fr&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==hr&&!E)}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);let d=t.logarithmicDepthBuffer===!0,h=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=g>0,_=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reverseDepthBuffer:h,maxTextures:p,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:y,maxVaryings:w,maxFragmentUniforms:x,vertexTextures:S,maxSamples:_}}function Nb(i){let e=this,t=null,n=0,r=!1,s=!1,a=new Ei,o=new pt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let p=d.length!==0||h||n!==0||r;return r=h,n=d.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,p){let g=d.clippingPlanes,v=d.clipIntersection,m=d.clipShadows,f=i.get(d);if(!r||g===null||g.length===0||s&&!m)s?u(null):l();else{let y=s?0:n,w=y*4,x=f.clippingState||null;c.value=x,x=u(g,h,w,p);for(let S=0;S!==w;++S)x[S]=t[S];f.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,p,g){let v=d!==null?d.length:0,m=null;if(v!==0){if(m=c.value,g!==!0||m===null){let f=p+v*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<f)&&(m=new Float32Array(f));for(let w=0,x=p;w!==v;++w,x+=4)a.copy(d[w]).applyMatrix4(y,o),a.normal.toArray(m,x),m[x+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function zb(i){let e=new WeakMap;function t(a,o){return o===Xu?a.mapping=Ea:o===ju&&(a.mapping=Sa),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===Xu||o===ju)if(e.has(a)){let c=e.get(a).texture;return t(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let l=new ns(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",r),t(l.texture,a.mapping)}else return null}}return a}function r(a){let o=a.target;o.removeEventListener("dispose",r);let c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}function Ob(i){let e=[],t=[],n=[],r=i,s=i-va+1+op.length;for(let a=0;a<s;a++){let o=Math.pow(2,r);t.push(o);let c=1/o;a>i-va?c=op[a-i+va-1]:a===0&&(c=0),n.push(c);let l=1/(o-2),u=-l,d=1+l,h=[u,u,d,u,d,d,u,u,d,d,u,d],p=6,g=6,v=3,m=2,f=1,y=new Float32Array(v*g*p),w=new Float32Array(m*g*p),x=new Float32Array(f*g*p);for(let _=0;_<p;_++){let R=_%3*2/3-1,E=_>2?0:-1,M=[R,E,0,R+2/3,E,0,R+2/3,E+1,0,R,E,0,R+2/3,E+1,0,R,E+1,0];y.set(M,v*g*_),w.set(h,m*g*_);let b=[_,_,_,_,_,_];x.set(b,f*g*_)}let S=new Xe;S.setAttribute("position",new qe(y,v)),S.setAttribute("uv",new qe(w,m)),S.setAttribute("faceIndex",new qe(x,f)),e.push(S),r>va&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function up(i,e,t){let n=new tn(i,e,t);return n.texture.mapping=yl,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Lc(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Hb(i,e,t){let n=new Float32Array(_s),r=new T(0,1,0);return new ye({name:"SphericalGaussianBlur",defines:{n:_s,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:yd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:dr,depthTest:!1,depthWrite:!1})}function hp(){return new ye({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:yd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:dr,depthTest:!1,depthWrite:!1})}function dp(){return new ye({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:yd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:dr,depthTest:!1,depthWrite:!1})}function yd(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Bb(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){let c=o.mapping,l=c===Xu||c===ju,u=c===Ea||c===Sa;if(l||u){let d=e.get(o),h=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return t===null&&(t=new La(i)),d=l?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{let p=o.image;return l&&p&&p.height>0||u&&p&&r(p)?(t===null&&(t=new La(i)),d=l?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",s),d.texture):null}}}return o}function r(o){let c=0,l=6;for(let u=0;u<l;u++)o[u]!==void 0&&c++;return c===l}function s(o){let c=o.target;c.removeEventListener("dispose",s);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Vb(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let r=t(n);return r===null&&go("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Wb(i,e,t,n){let r={},s=new WeakMap;function a(d){let h=d.target;h.index!==null&&e.remove(h.index);for(let g in h.attributes)e.remove(h.attributes[g]);for(let g in h.morphAttributes){let v=h.morphAttributes[g];for(let m=0,f=v.length;m<f;m++)e.remove(v[m])}h.removeEventListener("dispose",a),delete r[h.id];let p=s.get(h);p&&(e.remove(p),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(d,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,t.memory.geometries++),h}function c(d){let h=d.attributes;for(let g in h)e.update(h[g],i.ARRAY_BUFFER);let p=d.morphAttributes;for(let g in p){let v=p[g];for(let m=0,f=v.length;m<f;m++)e.update(v[m],i.ARRAY_BUFFER)}}function l(d){let h=[],p=d.index,g=d.attributes.position,v=0;if(p!==null){let y=p.array;v=p.version;for(let w=0,x=y.length;w<x;w+=3){let S=y[w+0],_=y[w+1],R=y[w+2];h.push(S,_,_,R,R,S)}}else if(g!==void 0){let y=g.array;v=g.version;for(let w=0,x=y.length/3-1;w<x;w+=3){let S=w+0,_=w+1,R=w+2;h.push(S,_,_,R,R,S)}}else return;let m=new(gm(h)?nl:tl)(h,1);m.version=v;let f=s.get(d);f&&e.remove(f),s.set(d,m)}function u(d){let h=s.get(d);if(h){let p=d.index;p!==null&&h.version<p.version&&l(d)}else l(d);return s.get(d)}return{get:o,update:c,getWireframeAttribute:u}}function Gb(i,e,t){let n;function r(h){n=h}let s,a;function o(h){s=h.type,a=h.bytesPerElement}function c(h,p){i.drawElements(n,p,s,h*a),t.update(p,n,1)}function l(h,p,g){g!==0&&(i.drawElementsInstanced(n,p,s,h*a,g),t.update(p,n,g))}function u(h,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,s,h,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,n,1)}function d(h,p,g,v){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<h.length;f++)l(h[f]/a,p[f],v[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,s,h,0,v,0,g);let f=0;for(let y=0;y<g;y++)f+=p[y]*v[y];t.update(f,n,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function qb(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function Xb(i,e,t){let n=new WeakMap,r=new nt;function s(a,o,c){let l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0,h=n.get(o);if(h===void 0||h.count!==d){let M=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",M)};h!==void 0&&h.texture.dispose();let p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],w=0;p===!0&&(w=1),g===!0&&(w=2),v===!0&&(w=3);let x=o.attributes.position.count*w,S=1;x>e.maxTextureSize&&(S=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let _=new Float32Array(x*S*4*d),R=new el(_,x,S,d);R.type=hr,R.needsUpdate=!0;let E=w*4;for(let b=0;b<d;b++){let C=m[b],F=f[b],U=y[b],k=x*S*4*b;for(let H=0;H<C.count;H++){let D=H*E;p===!0&&(r.fromBufferAttribute(C,H),_[k+D+0]=r.x,_[k+D+1]=r.y,_[k+D+2]=r.z,_[k+D+3]=0),g===!0&&(r.fromBufferAttribute(F,H),_[k+D+4]=r.x,_[k+D+5]=r.y,_[k+D+6]=r.z,_[k+D+7]=0),v===!0&&(r.fromBufferAttribute(U,H),_[k+D+8]=r.x,_[k+D+9]=r.y,_[k+D+10]=r.z,_[k+D+11]=U.itemSize===4?r.w:1)}}h={count:d,texture:R,size:new ue(x,S)},n.set(o,h),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let p=0;for(let v=0;v<l.length;v++)p+=l[v];let g=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:s}}function jb(i,e,t,n){let r=new WeakMap;function s(c){let l=n.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==l&&(e.update(d),r.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){let h=c.skeleton;r.get(h)!==l&&(h.update(),r.set(h,l))}return d}function a(){r=new WeakMap}function o(c){let l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:a}}function Va(i,e,t){let n=i[0];if(n<=0||n>0)return i;let r=e*t,s=pp[r];if(s===void 0&&(s=new Float32Array(r),pp[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function Cn(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Pn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ml(i,e){let t=mp[e];t===void 0&&(t=new Int32Array(e),mp[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Kb(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Yb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Cn(t,e))return;i.uniform2fv(this.addr,e),Pn(t,e)}}function Zb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Cn(t,e))return;i.uniform3fv(this.addr,e),Pn(t,e)}}function Jb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Cn(t,e))return;i.uniform4fv(this.addr,e),Pn(t,e)}}function Qb(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Cn(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Pn(t,e)}else{if(Cn(t,n))return;xp.set(n),i.uniformMatrix2fv(this.addr,!1,xp),Pn(t,n)}}function $b(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Cn(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Pn(t,e)}else{if(Cn(t,n))return;vp.set(n),i.uniformMatrix3fv(this.addr,!1,vp),Pn(t,n)}}function ey(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Cn(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Pn(t,e)}else{if(Cn(t,n))return;gp.set(n),i.uniformMatrix4fv(this.addr,!1,gp),Pn(t,n)}}function ty(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function ny(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Cn(t,e))return;i.uniform2iv(this.addr,e),Pn(t,e)}}function iy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Cn(t,e))return;i.uniform3iv(this.addr,e),Pn(t,e)}}function ry(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Cn(t,e))return;i.uniform4iv(this.addr,e),Pn(t,e)}}function sy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function ay(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Cn(t,e))return;i.uniform2uiv(this.addr,e),Pn(t,e)}}function oy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Cn(t,e))return;i.uniform3uiv(this.addr,e),Pn(t,e)}}function cy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Cn(t,e))return;i.uniform4uiv(this.addr,e),Pn(t,e)}}function ly(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(fp.compareFunction=pm,s=fp):s=ym,t.setTexture2D(e||s,r)}function uy(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Mm,r)}function hy(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Em,r)}function dy(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||wm,r)}function fy(i){switch(i){case 5126:return Kb;case 35664:return Yb;case 35665:return Zb;case 35666:return Jb;case 35674:return Qb;case 35675:return $b;case 35676:return ey;case 5124:case 35670:return ty;case 35667:case 35671:return ny;case 35668:case 35672:return iy;case 35669:case 35673:return ry;case 5125:return sy;case 36294:return ay;case 36295:return oy;case 36296:return cy;case 35678:case 36198:case 36298:case 36306:case 35682:return ly;case 35679:case 36299:case 36307:return uy;case 35680:case 36300:case 36308:case 36293:return hy;case 36289:case 36303:case 36311:case 36292:return dy}}function py(i,e){i.uniform1fv(this.addr,e)}function my(i,e){let t=Va(e,this.size,2);i.uniform2fv(this.addr,t)}function gy(i,e){let t=Va(e,this.size,3);i.uniform3fv(this.addr,t)}function vy(i,e){let t=Va(e,this.size,4);i.uniform4fv(this.addr,t)}function xy(i,e){let t=Va(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function by(i,e){let t=Va(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function yy(i,e){let t=Va(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function wy(i,e){i.uniform1iv(this.addr,e)}function My(i,e){i.uniform2iv(this.addr,e)}function Ey(i,e){i.uniform3iv(this.addr,e)}function Sy(i,e){i.uniform4iv(this.addr,e)}function _y(i,e){i.uniform1uiv(this.addr,e)}function Ty(i,e){i.uniform2uiv(this.addr,e)}function Ay(i,e){i.uniform3uiv(this.addr,e)}function Ry(i,e){i.uniform4uiv(this.addr,e)}function Cy(i,e,t){let n=this.cache,r=e.length,s=Ml(t,r);Cn(n,s)||(i.uniform1iv(this.addr,s),Pn(n,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||ym,s[a])}function Py(i,e,t){let n=this.cache,r=e.length,s=Ml(t,r);Cn(n,s)||(i.uniform1iv(this.addr,s),Pn(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Mm,s[a])}function Ly(i,e,t){let n=this.cache,r=e.length,s=Ml(t,r);Cn(n,s)||(i.uniform1iv(this.addr,s),Pn(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||Em,s[a])}function Iy(i,e,t){let n=this.cache,r=e.length,s=Ml(t,r);Cn(n,s)||(i.uniform1iv(this.addr,s),Pn(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||wm,s[a])}function Dy(i){switch(i){case 5126:return py;case 35664:return my;case 35665:return gy;case 35666:return vy;case 35674:return xy;case 35675:return by;case 35676:return yy;case 5124:case 35670:return wy;case 35667:case 35671:return My;case 35668:case 35672:return Ey;case 35669:case 35673:return Sy;case 5125:return _y;case 36294:return Ty;case 36295:return Ay;case 36296:return Ry;case 35678:case 36198:case 36298:case 36306:case 35682:return Cy;case 35679:case 36299:case 36307:return Py;case 35680:case 36300:case 36308:case 36293:return Ly;case 36289:case 36303:case 36311:case 36292:return Iy}}function bp(i,e){i.seq.push(e),i.map[e.id]=e}function Uy(i,e,t){let n=i.name,r=n.length;for(Cu.lastIndex=0;;){let s=Cu.exec(n),a=Cu.lastIndex,o=s[1],c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){bp(t,l===void 0?new _h(o,i,e):new Th(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new Ah(o),bp(t,d)),t=d}}}function yp(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}function Ny(i,e){let t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function zy(i){St._getMatrix(wp,St.workingColorSpace,i);let e=`mat3( ${wp.elements.map(t=>t.toFixed(4))} )`;switch(St.getTransfer(i)){case wl:return[e,"LinearTransferOETF"];case Dt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Mp(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";let s=/ERROR: 0:(\d+)/.exec(r);if(s){let a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+Ny(i.getShaderSource(e),a)}else return r}function Oy(i,e){let t=zy(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Hy(i,e){let t;switch(e){case sd:t="Linear";break;case ad:t="Reinhard";break;case od:t="Cineon";break;case cd:t="ACESFilmic";break;case Bo:t="AgX";break;case ld:t="Neutral";break;case rg:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function By(){St.getLuminanceCoefficients(Ic);let i=Ic.x.toFixed(4),e=Ic.y.toFixed(4),t=Ic.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Vy(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vo).join(`
`)}function Wy(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Gy(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){let s=i.getActiveAttrib(e,r),a=s.name,o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function vo(i){return i!==""}function Ep(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Sp(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function Rh(i){return i.replace(qy,jy)}function jy(i,e){let t=gt[e];if(t===void 0){let n=Xy.get(e);if(n!==void 0)t=gt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Rh(t)}function _p(i){return i.replace(Ky,Yy)}function Yy(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Tp(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Zy(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===$p?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===N0?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ir&&(e="SHADOWMAP_TYPE_VSM"),e}function Jy(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ea:case Sa:e="ENVMAP_TYPE_CUBE";break;case yl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Qy(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Sa:e="ENVMAP_MODE_REFRACTION";break}return e}function $y(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case em:e="ENVMAP_BLENDING_MULTIPLY";break;case ng:e="ENVMAP_BLENDING_MIX";break;case ig:e="ENVMAP_BLENDING_ADD";break}return e}function e1(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function t1(i,e,t,n){let r=i.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,c=Zy(t),l=Jy(t),u=Qy(t),d=$y(t),h=e1(t),p=Vy(t),g=Wy(s),v=r.createProgram(),m,f,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(vo).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(vo).join(`
`),f.length>0&&(f+=`
`)):(m=[Tp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vo).join(`
`),f=[Tp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==$r?"#define TONE_MAPPING":"",t.toneMapping!==$r?gt.tonemapping_pars_fragment:"",t.toneMapping!==$r?Hy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",gt.colorspace_pars_fragment,Oy("linearToOutputTexel",t.outputColorSpace),By(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(vo).join(`
`)),a=Rh(a),a=Ep(a,t),a=Sp(a,t),o=Rh(o),o=Ep(o,t),o=Sp(o,t),a=_p(a),o=_p(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===Qc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Qc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let w=y+m+a,x=y+f+o,S=yp(r,r.VERTEX_SHADER,w),_=yp(r,r.FRAGMENT_SHADER,x);r.attachShader(v,S),r.attachShader(v,_),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function R(C){if(i.debug.checkShaderErrors){let F=r.getProgramInfoLog(v).trim(),U=r.getShaderInfoLog(S).trim(),k=r.getShaderInfoLog(_).trim(),H=!0,D=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,v,S,_);else{let z=Mp(r,S,"vertex"),N=Mp(r,_,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+F+`
`+z+`
`+N)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(U===""||k==="")&&(D=!1);D&&(C.diagnostics={runnable:H,programLog:F,vertexShader:{log:U,prefix:m},fragmentShader:{log:k,prefix:f}})}r.deleteShader(S),r.deleteShader(_),E=new wa(r,v),M=Gy(r,v)}let E;this.getUniforms=function(){return E===void 0&&R(this),E};let M;this.getAttributes=function(){return M===void 0&&R(this),M};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=r.getProgramParameter(v,Fy)),b},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ky++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=S,this.fragmentShader=_,this}function i1(i,e,t,n,r,s,a){let o=new Co,c=new Ch,l=new Set,u=[],d=r.logarithmicDepthBuffer,h=r.vertexTextures,p=r.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return l.add(M),M===0?"uv":`uv${M}`}function m(M,b,C,F,U){let k=F.fog,H=U.geometry,D=M.isMeshStandardMaterial?F.environment:null,z=(M.isMeshStandardMaterial?t:e).get(M.envMap||D),N=z&&z.mapping===yl?z.image.height:null,V=g[M.type];M.precision!==null&&(p=r.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));let ee=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,ce=ee!==void 0?ee.length:0,Y=0;H.morphAttributes.position!==void 0&&(Y=1),H.morphAttributes.normal!==void 0&&(Y=2),H.morphAttributes.color!==void 0&&(Y=3);let be,Z,ae,fe;if(V){let Lt=lr[V];be=Lt.vertexShader,Z=Lt.fragmentShader}else be=M.vertexShader,Z=M.fragmentShader,c.update(M),ae=c.getVertexShaderID(M),fe=c.getFragmentShaderID(M);let ne=i.getRenderTarget(),he=i.state.buffers.depth.getReversed(),Ge=U.isInstancedMesh===!0,We=U.isBatchedMesh===!0,ut=!!M.map,me=!!M.matcap,Je=!!z,O=!!M.aoMap,it=!!M.lightMap,ze=!!M.bumpMap,Pe=!!M.normalMap,we=!!M.displacementMap,Qe=!!M.emissiveMap,Fe=!!M.metalnessMap,I=!!M.roughnessMap,A=M.anisotropy>0,K=M.clearcoat>0,re=M.dispersion>0,oe=M.iridescence>0,se=M.sheen>0,He=M.transmission>0,Ae=A&&!!M.anisotropyMap,De=K&&!!M.clearcoatMap,rt=K&&!!M.clearcoatNormalMap,ve=K&&!!M.clearcoatRoughnessMap,ke=oe&&!!M.iridescenceMap,Ne=oe&&!!M.iridescenceThicknessMap,tt=se&&!!M.sheenColorMap,Be=se&&!!M.sheenRoughnessMap,xt=!!M.specularMap,lt=!!M.specularColorMap,It=!!M.specularIntensityMap,G=He&&!!M.transmissionMap,Ce=He&&!!M.thicknessMap,ie=!!M.gradientMap,le=!!M.alphaMap,Ie=M.alphaTest>0,Ue=!!M.alphaHash,ot=!!M.extensions,Vt=$r;M.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Vt=i.toneMapping);let qt={shaderID:V,shaderType:M.type,shaderName:M.name,vertexShader:be,fragmentShader:Z,defines:M.defines,customVertexShaderID:ae,customFragmentShaderID:fe,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:We,batchingColor:We&&U._colorsTexture!==null,instancing:Ge,instancingColor:Ge&&U.instanceColor!==null,instancingMorph:Ge&&U.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ne===null?i.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Ba,alphaToCoverage:!!M.alphaToCoverage,map:ut,matcap:me,envMap:Je,envMapMode:Je&&z.mapping,envMapCubeUVHeight:N,aoMap:O,lightMap:it,bumpMap:ze,normalMap:Pe,displacementMap:h&&we,emissiveMap:Qe,normalMapObjectSpace:Pe&&M.normalMapType===og,normalMapTangentSpace:Pe&&M.normalMapType===fm,metalnessMap:Fe,roughnessMap:I,anisotropy:A,anisotropyMap:Ae,clearcoat:K,clearcoatMap:De,clearcoatNormalMap:rt,clearcoatRoughnessMap:ve,dispersion:re,iridescence:oe,iridescenceMap:ke,iridescenceThicknessMap:Ne,sheen:se,sheenColorMap:tt,sheenRoughnessMap:Be,specularMap:xt,specularColorMap:lt,specularIntensityMap:It,transmission:He,transmissionMap:G,thicknessMap:Ce,gradientMap:ie,opaque:M.transparent===!1&&M.blending===Qr&&M.alphaToCoverage===!1,alphaMap:le,alphaTest:Ie,alphaHash:Ue,combine:M.combine,mapUv:ut&&v(M.map.channel),aoMapUv:O&&v(M.aoMap.channel),lightMapUv:it&&v(M.lightMap.channel),bumpMapUv:ze&&v(M.bumpMap.channel),normalMapUv:Pe&&v(M.normalMap.channel),displacementMapUv:we&&v(M.displacementMap.channel),emissiveMapUv:Qe&&v(M.emissiveMap.channel),metalnessMapUv:Fe&&v(M.metalnessMap.channel),roughnessMapUv:I&&v(M.roughnessMap.channel),anisotropyMapUv:Ae&&v(M.anisotropyMap.channel),clearcoatMapUv:De&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:rt&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ve&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:ke&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:Ne&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:tt&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:Be&&v(M.sheenRoughnessMap.channel),specularMapUv:xt&&v(M.specularMap.channel),specularColorMapUv:lt&&v(M.specularColorMap.channel),specularIntensityMapUv:It&&v(M.specularIntensityMap.channel),transmissionMapUv:G&&v(M.transmissionMap.channel),thicknessMapUv:Ce&&v(M.thicknessMap.channel),alphaMapUv:le&&v(M.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(Pe||A),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!H.attributes.uv&&(ut||le),fog:!!k,useFog:M.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:he,skinning:U.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:Y,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:Vt,decodeVideoTexture:ut&&M.map.isVideoTexture===!0&&St.getTransfer(M.map.colorSpace)===Dt,decodeVideoTextureEmissive:Qe&&M.emissiveMap.isVideoTexture===!0&&St.getTransfer(M.emissiveMap.colorSpace)===Dt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===mt,flipSided:M.side===en,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:ot&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ot&&M.extensions.multiDraw===!0||We)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return qt.vertexUv1s=l.has(1),qt.vertexUv2s=l.has(2),qt.vertexUv3s=l.has(3),l.clear(),qt}function f(M){let b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(let C in M.defines)b.push(C),b.push(M.defines[C]);return M.isRawShaderMaterial===!1&&(y(b,M),w(b,M),b.push(i.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function y(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function w(M,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),M.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reverseDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),M.push(o.mask)}function x(M){let b=g[M.type],C;if(b){let F=lr[b];C=Ni.clone(F.uniforms)}else C=M.uniforms;return C}function S(M,b){let C;for(let F=0,U=u.length;F<U;F++){let k=u[F];if(k.cacheKey===b){C=k,++C.usedTimes;break}}return C===void 0&&(C=new t1(i,b,M,s),u.push(C)),C}function _(M){if(--M.usedTimes===0){let b=u.indexOf(M);u[b]=u[u.length-1],u.pop(),M.destroy()}}function R(M){c.remove(M)}function E(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:x,acquireProgram:S,releaseProgram:_,releaseShaderCache:R,programs:u,dispose:E}}function r1(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,c){i.get(a)[o]=c}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function s1(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Ap(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Rp(){let i=[],e=0,t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(d,h,p,g,v,m){let f=i[e];return f===void 0?(f={id:d.id,object:d,geometry:h,material:p,groupOrder:g,renderOrder:d.renderOrder,z:v,group:m},i[e]=f):(f.id=d.id,f.object=d,f.geometry=h,f.material=p,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=v,f.group=m),e++,f}function o(d,h,p,g,v,m){let f=a(d,h,p,g,v,m);p.transmission>0?n.push(f):p.transparent===!0?r.push(f):t.push(f)}function c(d,h,p,g,v,m){let f=a(d,h,p,g,v,m);p.transmission>0?n.unshift(f):p.transparent===!0?r.unshift(f):t.unshift(f)}function l(d,h){t.length>1&&t.sort(d||s1),n.length>1&&n.sort(h||Ap),r.length>1&&r.sort(h||Ap)}function u(){for(let d=e,h=i.length;d<h;d++){let p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:u,sort:l}}function a1(){let i=new WeakMap;function e(n,r){let s=i.get(n),a;return s===void 0?(a=new Rp,i.set(n,[a])):r>=s.length?(a=new Rp,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function o1(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new T,color:new de};break;case"SpotLight":t={position:new T,direction:new T,color:new de,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new T,color:new de,distance:0,decay:0};break;case"HemisphereLight":t={direction:new T,skyColor:new de,groundColor:new de};break;case"RectAreaLight":t={color:new de,position:new T,halfWidth:new T,halfHeight:new T};break}return i[e.id]=t,t}}}function c1(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}function u1(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function h1(i){let e=new o1,t=c1(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new T);let r=new T,s=new et,a=new et;function o(l){let u=0,d=0,h=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let p=0,g=0,v=0,m=0,f=0,y=0,w=0,x=0,S=0,_=0,R=0;l.sort(u1);for(let M=0,b=l.length;M<b;M++){let C=l[M],F=C.color,U=C.intensity,k=C.distance,H=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=F.r*U,d+=F.g*U,h+=F.b*U;else if(C.isLightProbe){for(let D=0;D<9;D++)n.probe[D].addScaledVector(C.sh.coefficients[D],U);R++}else if(C.isDirectionalLight){let D=e.get(C);if(D.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let z=C.shadow,N=t.get(C);N.shadowIntensity=z.intensity,N.shadowBias=z.bias,N.shadowNormalBias=z.normalBias,N.shadowRadius=z.radius,N.shadowMapSize=z.mapSize,n.directionalShadow[p]=N,n.directionalShadowMap[p]=H,n.directionalShadowMatrix[p]=C.shadow.matrix,y++}n.directional[p]=D,p++}else if(C.isSpotLight){let D=e.get(C);D.position.setFromMatrixPosition(C.matrixWorld),D.color.copy(F).multiplyScalar(U),D.distance=k,D.coneCos=Math.cos(C.angle),D.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),D.decay=C.decay,n.spot[v]=D;let z=C.shadow;if(C.map&&(n.spotLightMap[S]=C.map,S++,z.updateMatrices(C),C.castShadow&&_++),n.spotLightMatrix[v]=z.matrix,C.castShadow){let N=t.get(C);N.shadowIntensity=z.intensity,N.shadowBias=z.bias,N.shadowNormalBias=z.normalBias,N.shadowRadius=z.radius,N.shadowMapSize=z.mapSize,n.spotShadow[v]=N,n.spotShadowMap[v]=H,x++}v++}else if(C.isRectAreaLight){let D=e.get(C);D.color.copy(F).multiplyScalar(U),D.halfWidth.set(C.width*.5,0,0),D.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=D,m++}else if(C.isPointLight){let D=e.get(C);if(D.color.copy(C.color).multiplyScalar(C.intensity),D.distance=C.distance,D.decay=C.decay,C.castShadow){let z=C.shadow,N=t.get(C);N.shadowIntensity=z.intensity,N.shadowBias=z.bias,N.shadowNormalBias=z.normalBias,N.shadowRadius=z.radius,N.shadowMapSize=z.mapSize,N.shadowCameraNear=z.camera.near,N.shadowCameraFar=z.camera.far,n.pointShadow[g]=N,n.pointShadowMap[g]=H,n.pointShadowMatrix[g]=C.shadow.matrix,w++}n.point[g]=D,g++}else if(C.isHemisphereLight){let D=e.get(C);D.skyColor.copy(C.color).multiplyScalar(U),D.groundColor.copy(C.groundColor).multiplyScalar(U),n.hemi[f]=D,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Le.LTC_FLOAT_1,n.rectAreaLTC2=Le.LTC_FLOAT_2):(n.rectAreaLTC1=Le.LTC_HALF_1,n.rectAreaLTC2=Le.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;let E=n.hash;(E.directionalLength!==p||E.pointLength!==g||E.spotLength!==v||E.rectAreaLength!==m||E.hemiLength!==f||E.numDirectionalShadows!==y||E.numPointShadows!==w||E.numSpotShadows!==x||E.numSpotMaps!==S||E.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=x+S-_,n.spotLightMap.length=S,n.numSpotLightShadowsWithMaps=_,n.numLightProbes=R,E.directionalLength=p,E.pointLength=g,E.spotLength=v,E.rectAreaLength=m,E.hemiLength=f,E.numDirectionalShadows=y,E.numPointShadows=w,E.numSpotShadows=x,E.numSpotMaps=S,E.numLightProbes=R,n.version=l1++)}function c(l,u){let d=0,h=0,p=0,g=0,v=0,m=u.matrixWorldInverse;for(let f=0,y=l.length;f<y;f++){let w=l[f];if(w.isDirectionalLight){let x=n.directional[d];x.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),d++}else if(w.isSpotLight){let x=n.spot[p];x.position.setFromMatrixPosition(w.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),p++}else if(w.isRectAreaLight){let x=n.rectArea[g];x.position.setFromMatrixPosition(w.matrixWorld),x.position.applyMatrix4(m),a.identity(),s.copy(w.matrixWorld),s.premultiply(m),a.extractRotation(s),x.halfWidth.set(w.width*.5,0,0),x.halfHeight.set(0,w.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),g++}else if(w.isPointLight){let x=n.point[h];x.position.setFromMatrixPosition(w.matrixWorld),x.position.applyMatrix4(m),h++}else if(w.isHemisphereLight){let x=n.hemi[v];x.direction.setFromMatrixPosition(w.matrixWorld),x.direction.transformDirection(m),v++}}}return{setup:o,setupView:c,state:n}}function Cp(i){let e=new h1(i),t=[],n=[];function r(u){l.camera=u,t.length=0,n.length=0}function s(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function c(u){e.setupView(t,u)}let l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function d1(i){let e=new WeakMap;function t(r,s=0){let a=e.get(r),o;return a===void 0?(o=new Cp(i),e.set(r,[o])):s>=a.length?(o=new Cp(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}function m1(i,e,t){let n=new Ps,r=new ue,s=new ue,a=new nt,o=new Lh({depthPacking:ag}),c=new Ih,l={},u=t.maxTextureSize,d={[pr]:en,[en]:pr,[mt]:mt},h=new ye({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ue},radius:{value:4}},vertexShader:f1,fragmentShader:p1}),p=h.clone();p.defines.HORIZONTAL_PASS=1;let g=new Xe;g.setAttribute("position",new qe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new xe(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=$p;let f=this.type;this.render=function(_,R,E){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||_.length===0)return;let M=i.getRenderTarget(),b=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),F=i.state;F.setBlending(dr),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let U=f!==Ir&&this.type===Ir,k=f===Ir&&this.type!==Ir;for(let H=0,D=_.length;H<D;H++){let z=_[H],N=z.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",z,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;r.copy(N.mapSize);let V=N.getFrameExtents();if(r.multiply(V),s.copy(N.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/V.x),r.x=s.x*V.x,N.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/V.y),r.y=s.y*V.y,N.mapSize.y=s.y)),N.map===null||U===!0||k===!0){let ce=this.type!==Ir?{minFilter:Xn,magFilter:Xn}:{};N.map!==null&&N.map.dispose(),N.map=new tn(r.x,r.y,ce),N.map.texture.name=z.name+".shadowMap",N.camera.updateProjectionMatrix()}i.setRenderTarget(N.map),i.clear();let ee=N.getViewportCount();for(let ce=0;ce<ee;ce++){let Y=N.getViewport(ce);a.set(s.x*Y.x,s.y*Y.y,s.x*Y.z,s.y*Y.w),F.viewport(a),N.updateMatrices(z,ce),n=N.getFrustum(),x(R,E,N.camera,z,this.type)}N.isPointLightShadow!==!0&&this.type===Ir&&y(N,E),N.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(M,b,C)};function y(_,R){let E=e.update(v);h.defines.VSM_SAMPLES!==_.blurSamples&&(h.defines.VSM_SAMPLES=_.blurSamples,p.defines.VSM_SAMPLES=_.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),_.mapPass===null&&(_.mapPass=new tn(r.x,r.y)),h.uniforms.shadow_pass.value=_.map.texture,h.uniforms.resolution.value=_.mapSize,h.uniforms.radius.value=_.radius,i.setRenderTarget(_.mapPass),i.clear(),i.renderBufferDirect(R,null,E,h,v,null),p.uniforms.shadow_pass.value=_.mapPass.texture,p.uniforms.resolution.value=_.mapSize,p.uniforms.radius.value=_.radius,i.setRenderTarget(_.map),i.clear(),i.renderBufferDirect(R,null,E,p,v,null)}function w(_,R,E,M){let b=null,C=E.isPointLight===!0?_.customDistanceMaterial:_.customDepthMaterial;if(C!==void 0)b=C;else if(b=E.isPointLight===!0?c:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){let F=b.uuid,U=R.uuid,k=l[F];k===void 0&&(k={},l[F]=k);let H=k[U];H===void 0&&(H=b.clone(),k[U]=H,R.addEventListener("dispose",S)),b=H}if(b.visible=R.visible,b.wireframe=R.wireframe,M===Ir?b.side=R.shadowSide!==null?R.shadowSide:R.side:b.side=R.shadowSide!==null?R.shadowSide:d[R.side],b.alphaMap=R.alphaMap,b.alphaTest=R.alphaTest,b.map=R.map,b.clipShadows=R.clipShadows,b.clippingPlanes=R.clippingPlanes,b.clipIntersection=R.clipIntersection,b.displacementMap=R.displacementMap,b.displacementScale=R.displacementScale,b.displacementBias=R.displacementBias,b.wireframeLinewidth=R.wireframeLinewidth,b.linewidth=R.linewidth,E.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let F=i.properties.get(b);F.light=E}return b}function x(_,R,E,M,b){if(_.visible===!1)return;if(_.layers.test(R.layers)&&(_.isMesh||_.isLine||_.isPoints)&&(_.castShadow||_.receiveShadow&&b===Ir)&&(!_.frustumCulled||n.intersectsObject(_))){_.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,_.matrixWorld);let U=e.update(_),k=_.material;if(Array.isArray(k)){let H=U.groups;for(let D=0,z=H.length;D<z;D++){let N=H[D],V=k[N.materialIndex];if(V&&V.visible){let ee=w(_,V,M,b);_.onBeforeShadow(i,_,R,E,U,ee,N),i.renderBufferDirect(E,null,U,ee,_,N),_.onAfterShadow(i,_,R,E,U,ee,N)}}}else if(k.visible){let H=w(_,k,M,b);_.onBeforeShadow(i,_,R,E,U,H,null),i.renderBufferDirect(E,null,U,H,_,null),_.onAfterShadow(i,_,R,E,U,H,null)}}let F=_.children;for(let U=0,k=F.length;U<k;U++)x(F[U],R,E,M,b)}function S(_){_.target.removeEventListener("dispose",S);for(let E in l){let M=l[E],b=_.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}function v1(i,e){function t(){let G=!1,Ce=new nt,ie=null,le=new nt(0,0,0,0);return{setMask:function(Ie){ie!==Ie&&!G&&(i.colorMask(Ie,Ie,Ie,Ie),ie=Ie)},setLocked:function(Ie){G=Ie},setClear:function(Ie,Ue,ot,Vt,qt){qt===!0&&(Ie*=Vt,Ue*=Vt,ot*=Vt),Ce.set(Ie,Ue,ot,Vt),le.equals(Ce)===!1&&(i.clearColor(Ie,Ue,ot,Vt),le.copy(Ce))},reset:function(){G=!1,ie=null,le.set(-1,0,0,0)}}}function n(){let G=!1,Ce=!1,ie=null,le=null,Ie=null;return{setReversed:function(Ue){if(Ce!==Ue){let ot=e.get("EXT_clip_control");Ce?ot.clipControlEXT(ot.LOWER_LEFT_EXT,ot.ZERO_TO_ONE_EXT):ot.clipControlEXT(ot.LOWER_LEFT_EXT,ot.NEGATIVE_ONE_TO_ONE_EXT);let Vt=Ie;Ie=null,this.setClear(Vt)}Ce=Ue},getReversed:function(){return Ce},setTest:function(Ue){Ue?ne(i.DEPTH_TEST):he(i.DEPTH_TEST)},setMask:function(Ue){ie!==Ue&&!G&&(i.depthMask(Ue),ie=Ue)},setFunc:function(Ue){if(Ce&&(Ue=g1[Ue]),le!==Ue){switch(Ue){case Ou:i.depthFunc(i.NEVER);break;case Hu:i.depthFunc(i.ALWAYS);break;case Bu:i.depthFunc(i.LESS);break;case Ma:i.depthFunc(i.LEQUAL);break;case Vu:i.depthFunc(i.EQUAL);break;case Wu:i.depthFunc(i.GEQUAL);break;case Gu:i.depthFunc(i.GREATER);break;case qu:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}le=Ue}},setLocked:function(Ue){G=Ue},setClear:function(Ue){Ie!==Ue&&(Ce&&(Ue=1-Ue),i.clearDepth(Ue),Ie=Ue)},reset:function(){G=!1,ie=null,le=null,Ie=null,Ce=!1}}}function r(){let G=!1,Ce=null,ie=null,le=null,Ie=null,Ue=null,ot=null,Vt=null,qt=null;return{setTest:function(Lt){G||(Lt?ne(i.STENCIL_TEST):he(i.STENCIL_TEST))},setMask:function(Lt){Ce!==Lt&&!G&&(i.stencilMask(Lt),Ce=Lt)},setFunc:function(Lt,ni,Ti){(ie!==Lt||le!==ni||Ie!==Ti)&&(i.stencilFunc(Lt,ni,Ti),ie=Lt,le=ni,Ie=Ti)},setOp:function(Lt,ni,Ti){(Ue!==Lt||ot!==ni||Vt!==Ti)&&(i.stencilOp(Lt,ni,Ti),Ue=Lt,ot=ni,Vt=Ti)},setLocked:function(Lt){G=Lt},setClear:function(Lt){qt!==Lt&&(i.clearStencil(Lt),qt=Lt)},reset:function(){G=!1,Ce=null,ie=null,le=null,Ie=null,Ue=null,ot=null,Vt=null,qt=null}}}let s=new t,a=new n,o=new r,c=new WeakMap,l=new WeakMap,u={},d={},h=new WeakMap,p=[],g=null,v=!1,m=null,f=null,y=null,w=null,x=null,S=null,_=null,R=new de(0,0,0),E=0,M=!1,b=null,C=null,F=null,U=null,k=null,H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),D=!1,z=0,N=i.getParameter(i.VERSION);N.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(N)[1]),D=z>=1):N.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),D=z>=2);let V=null,ee={},ce=i.getParameter(i.SCISSOR_BOX),Y=i.getParameter(i.VIEWPORT),be=new nt().fromArray(ce),Z=new nt().fromArray(Y);function ae(G,Ce,ie,le){let Ie=new Uint8Array(4),Ue=i.createTexture();i.bindTexture(G,Ue),i.texParameteri(G,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(G,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ot=0;ot<ie;ot++)G===i.TEXTURE_3D||G===i.TEXTURE_2D_ARRAY?i.texImage3D(Ce,0,i.RGBA,1,1,le,0,i.RGBA,i.UNSIGNED_BYTE,Ie):i.texImage2D(Ce+ot,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ie);return Ue}let fe={};fe[i.TEXTURE_2D]=ae(i.TEXTURE_2D,i.TEXTURE_2D,1),fe[i.TEXTURE_CUBE_MAP]=ae(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),fe[i.TEXTURE_2D_ARRAY]=ae(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),fe[i.TEXTURE_3D]=ae(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ne(i.DEPTH_TEST),a.setFunc(Ma),ze(!1),Pe(Uf),ne(i.CULL_FACE),O(dr);function ne(G){u[G]!==!0&&(i.enable(G),u[G]=!0)}function he(G){u[G]!==!1&&(i.disable(G),u[G]=!1)}function Ge(G,Ce){return d[G]!==Ce?(i.bindFramebuffer(G,Ce),d[G]=Ce,G===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=Ce),G===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=Ce),!0):!1}function We(G,Ce){let ie=p,le=!1;if(G){ie=h.get(Ce),ie===void 0&&(ie=[],h.set(Ce,ie));let Ie=G.textures;if(ie.length!==Ie.length||ie[0]!==i.COLOR_ATTACHMENT0){for(let Ue=0,ot=Ie.length;Ue<ot;Ue++)ie[Ue]=i.COLOR_ATTACHMENT0+Ue;ie.length=Ie.length,le=!0}}else ie[0]!==i.BACK&&(ie[0]=i.BACK,le=!0);le&&i.drawBuffers(ie)}function ut(G){return g!==G?(i.useProgram(G),g=G,!0):!1}let me={[Ss]:i.FUNC_ADD,[O0]:i.FUNC_SUBTRACT,[H0]:i.FUNC_REVERSE_SUBTRACT};me[B0]=i.MIN,me[V0]=i.MAX;let Je={[W0]:i.ZERO,[G0]:i.ONE,[q0]:i.SRC_COLOR,[Nu]:i.SRC_ALPHA,[J0]:i.SRC_ALPHA_SATURATE,[Y0]:i.DST_COLOR,[j0]:i.DST_ALPHA,[X0]:i.ONE_MINUS_SRC_COLOR,[zu]:i.ONE_MINUS_SRC_ALPHA,[Z0]:i.ONE_MINUS_DST_COLOR,[K0]:i.ONE_MINUS_DST_ALPHA,[Q0]:i.CONSTANT_COLOR,[$0]:i.ONE_MINUS_CONSTANT_COLOR,[eg]:i.CONSTANT_ALPHA,[tg]:i.ONE_MINUS_CONSTANT_ALPHA};function O(G,Ce,ie,le,Ie,Ue,ot,Vt,qt,Lt){if(G===dr){v===!0&&(he(i.BLEND),v=!1);return}if(v===!1&&(ne(i.BLEND),v=!0),G!==z0){if(G!==m||Lt!==M){if((f!==Ss||x!==Ss)&&(i.blendEquation(i.FUNC_ADD),f=Ss,x=Ss),Lt)switch(G){case Qr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Pt:i.blendFunc(i.ONE,i.ONE);break;case Ff:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Zc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}else switch(G){case Qr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Pt:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Ff:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Zc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}y=null,w=null,S=null,_=null,R.set(0,0,0),E=0,m=G,M=Lt}return}Ie=Ie||Ce,Ue=Ue||ie,ot=ot||le,(Ce!==f||Ie!==x)&&(i.blendEquationSeparate(me[Ce],me[Ie]),f=Ce,x=Ie),(ie!==y||le!==w||Ue!==S||ot!==_)&&(i.blendFuncSeparate(Je[ie],Je[le],Je[Ue],Je[ot]),y=ie,w=le,S=Ue,_=ot),(Vt.equals(R)===!1||qt!==E)&&(i.blendColor(Vt.r,Vt.g,Vt.b,qt),R.copy(Vt),E=qt),m=G,M=!1}function it(G,Ce){G.side===mt?he(i.CULL_FACE):ne(i.CULL_FACE);let ie=G.side===en;Ce&&(ie=!ie),ze(ie),G.blending===Qr&&G.transparent===!1?O(dr):O(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),a.setFunc(G.depthFunc),a.setTest(G.depthTest),a.setMask(G.depthWrite),s.setMask(G.colorWrite);let le=G.stencilWrite;o.setTest(le),le&&(o.setMask(G.stencilWriteMask),o.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),o.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),Qe(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?ne(i.SAMPLE_ALPHA_TO_COVERAGE):he(i.SAMPLE_ALPHA_TO_COVERAGE)}function ze(G){b!==G&&(G?i.frontFace(i.CW):i.frontFace(i.CCW),b=G)}function Pe(G){G!==F0?(ne(i.CULL_FACE),G!==C&&(G===Uf?i.cullFace(i.BACK):G===k0?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):he(i.CULL_FACE),C=G}function we(G){G!==F&&(D&&i.lineWidth(G),F=G)}function Qe(G,Ce,ie){G?(ne(i.POLYGON_OFFSET_FILL),(U!==Ce||k!==ie)&&(i.polygonOffset(Ce,ie),U=Ce,k=ie)):he(i.POLYGON_OFFSET_FILL)}function Fe(G){G?ne(i.SCISSOR_TEST):he(i.SCISSOR_TEST)}function I(G){G===void 0&&(G=i.TEXTURE0+H-1),V!==G&&(i.activeTexture(G),V=G)}function A(G,Ce,ie){ie===void 0&&(V===null?ie=i.TEXTURE0+H-1:ie=V);let le=ee[ie];le===void 0&&(le={type:void 0,texture:void 0},ee[ie]=le),(le.type!==G||le.texture!==Ce)&&(V!==ie&&(i.activeTexture(ie),V=ie),i.bindTexture(G,Ce||fe[G]),le.type=G,le.texture=Ce)}function K(){let G=ee[V];G!==void 0&&G.type!==void 0&&(i.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function re(){try{i.compressedTexImage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function oe(){try{i.compressedTexImage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function se(){try{i.texSubImage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function He(){try{i.texSubImage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ae(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function De(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function rt(){try{i.texStorage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ve(){try{i.texStorage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function ke(){try{i.texImage2D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ne(){try{i.texImage3D.apply(i,arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function tt(G){be.equals(G)===!1&&(i.scissor(G.x,G.y,G.z,G.w),be.copy(G))}function Be(G){Z.equals(G)===!1&&(i.viewport(G.x,G.y,G.z,G.w),Z.copy(G))}function xt(G,Ce){let ie=l.get(Ce);ie===void 0&&(ie=new WeakMap,l.set(Ce,ie));let le=ie.get(G);le===void 0&&(le=i.getUniformBlockIndex(Ce,G.name),ie.set(G,le))}function lt(G,Ce){let le=l.get(Ce).get(G);c.get(Ce)!==le&&(i.uniformBlockBinding(Ce,le,G.__bindingPointIndex),c.set(Ce,le))}function It(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},V=null,ee={},d={},h=new WeakMap,p=[],g=null,v=!1,m=null,f=null,y=null,w=null,x=null,S=null,_=null,R=new de(0,0,0),E=0,M=!1,b=null,C=null,F=null,U=null,k=null,be.set(0,0,i.canvas.width,i.canvas.height),Z.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ne,disable:he,bindFramebuffer:Ge,drawBuffers:We,useProgram:ut,setBlending:O,setMaterial:it,setFlipSided:ze,setCullFace:Pe,setLineWidth:we,setPolygonOffset:Qe,setScissorTest:Fe,activeTexture:I,bindTexture:A,unbindTexture:K,compressedTexImage2D:re,compressedTexImage3D:oe,texImage2D:ke,texImage3D:Ne,updateUBOMapping:xt,uniformBlockBinding:lt,texStorage2D:rt,texStorage3D:ve,texSubImage2D:se,texSubImage3D:He,compressedTexSubImage2D:Ae,compressedTexSubImage3D:De,scissor:tt,viewport:Be,reset:It}}function Pp(i,e,t,n){let r=x1(n);switch(t){case sm:return i*e;case om:return i*e;case cm:return i*e*2;case pd:return i*e/r.components*r.byteLength;case md:return i*e/r.components*r.byteLength;case lm:return i*e*2/r.components*r.byteLength;case gd:return i*e*2/r.components*r.byteLength;case am:return i*e*3/r.components*r.byteLength;case Si:return i*e*4/r.components*r.byteLength;case vd:return i*e*4/r.components*r.byteLength;case qc:case Xc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case jc:case Kc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Yu:case Ju:return Math.max(i,16)*Math.max(e,8)/4;case Ku:case Zu:return Math.max(i,8)*Math.max(e,8)/2;case Qu:case $u:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case eh:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case th:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case nh:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ih:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case rh:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case sh:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ah:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case oh:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ch:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case lh:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case uh:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case hh:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case dh:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case fh:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ph:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Yc:case mh:case gh:return Math.ceil(i/4)*Math.ceil(e/4)*16;case um:case vh:return Math.ceil(i/4)*Math.ceil(e/4)*8;case xh:case bh:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function x1(i){switch(i){case Fr:case nm:return{byteLength:1,components:1};case To:case im:case nn:return{byteLength:2,components:1};case dd:case fd:return{byteLength:2,components:4};case As:case hd:case hr:return{byteLength:4,components:1};case rm:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function b1(i,e,t,n,r,s,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ue,u=new WeakMap,d,h=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(I,A){return p?new OffscreenCanvas(I,A):Ro("canvas")}function v(I,A,K){let re=1,oe=Fe(I);if((oe.width>K||oe.height>K)&&(re=K/Math.max(oe.width,oe.height)),re<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){let se=Math.floor(re*oe.width),He=Math.floor(re*oe.height);d===void 0&&(d=g(se,He));let Ae=A?g(se,He):d;return Ae.width=se,Ae.height=He,Ae.getContext("2d").drawImage(I,0,0,se,He),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+se+"x"+He+")."),Ae}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),I;return I}function m(I){return I.generateMipmaps}function f(I){i.generateMipmap(I)}function y(I){return I.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?i.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(I,A,K,re,oe=!1){if(I!==null){if(i[I]!==void 0)return i[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let se=A;if(A===i.RED&&(K===i.FLOAT&&(se=i.R32F),K===i.HALF_FLOAT&&(se=i.R16F),K===i.UNSIGNED_BYTE&&(se=i.R8)),A===i.RED_INTEGER&&(K===i.UNSIGNED_BYTE&&(se=i.R8UI),K===i.UNSIGNED_SHORT&&(se=i.R16UI),K===i.UNSIGNED_INT&&(se=i.R32UI),K===i.BYTE&&(se=i.R8I),K===i.SHORT&&(se=i.R16I),K===i.INT&&(se=i.R32I)),A===i.RG&&(K===i.FLOAT&&(se=i.RG32F),K===i.HALF_FLOAT&&(se=i.RG16F),K===i.UNSIGNED_BYTE&&(se=i.RG8)),A===i.RG_INTEGER&&(K===i.UNSIGNED_BYTE&&(se=i.RG8UI),K===i.UNSIGNED_SHORT&&(se=i.RG16UI),K===i.UNSIGNED_INT&&(se=i.RG32UI),K===i.BYTE&&(se=i.RG8I),K===i.SHORT&&(se=i.RG16I),K===i.INT&&(se=i.RG32I)),A===i.RGB_INTEGER&&(K===i.UNSIGNED_BYTE&&(se=i.RGB8UI),K===i.UNSIGNED_SHORT&&(se=i.RGB16UI),K===i.UNSIGNED_INT&&(se=i.RGB32UI),K===i.BYTE&&(se=i.RGB8I),K===i.SHORT&&(se=i.RGB16I),K===i.INT&&(se=i.RGB32I)),A===i.RGBA_INTEGER&&(K===i.UNSIGNED_BYTE&&(se=i.RGBA8UI),K===i.UNSIGNED_SHORT&&(se=i.RGBA16UI),K===i.UNSIGNED_INT&&(se=i.RGBA32UI),K===i.BYTE&&(se=i.RGBA8I),K===i.SHORT&&(se=i.RGBA16I),K===i.INT&&(se=i.RGBA32I)),A===i.RGB&&K===i.UNSIGNED_INT_5_9_9_9_REV&&(se=i.RGB9_E5),A===i.RGBA){let He=oe?wl:St.getTransfer(re);K===i.FLOAT&&(se=i.RGBA32F),K===i.HALF_FLOAT&&(se=i.RGBA16F),K===i.UNSIGNED_BYTE&&(se=He===Dt?i.SRGB8_ALPHA8:i.RGBA8),K===i.UNSIGNED_SHORT_4_4_4_4&&(se=i.RGBA4),K===i.UNSIGNED_SHORT_5_5_5_1&&(se=i.RGB5_A1)}return(se===i.R16F||se===i.R32F||se===i.RG16F||se===i.RG32F||se===i.RGBA16F||se===i.RGBA32F)&&e.get("EXT_color_buffer_float"),se}function x(I,A){let K;return I?A===null||A===As||A===_a?K=i.DEPTH24_STENCIL8:A===hr?K=i.DEPTH32F_STENCIL8:A===To&&(K=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===As||A===_a?K=i.DEPTH_COMPONENT24:A===hr?K=i.DEPTH_COMPONENT32F:A===To&&(K=i.DEPTH_COMPONENT16),K}function S(I,A){return m(I)===!0||I.isFramebufferTexture&&I.minFilter!==Xn&&I.minFilter!==$t?Math.log2(Math.max(A.width,A.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?A.mipmaps.length:1}function _(I){let A=I.target;A.removeEventListener("dispose",_),E(A),A.isVideoTexture&&u.delete(A)}function R(I){let A=I.target;A.removeEventListener("dispose",R),b(A)}function E(I){let A=n.get(I);if(A.__webglInit===void 0)return;let K=I.source,re=h.get(K);if(re){let oe=re[A.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&M(I),Object.keys(re).length===0&&h.delete(K)}n.remove(I)}function M(I){let A=n.get(I);i.deleteTexture(A.__webglTexture);let K=I.source,re=h.get(K);delete re[A.__cacheKey],a.memory.textures--}function b(I){let A=n.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),n.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let re=0;re<6;re++){if(Array.isArray(A.__webglFramebuffer[re]))for(let oe=0;oe<A.__webglFramebuffer[re].length;oe++)i.deleteFramebuffer(A.__webglFramebuffer[re][oe]);else i.deleteFramebuffer(A.__webglFramebuffer[re]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[re])}else{if(Array.isArray(A.__webglFramebuffer))for(let re=0;re<A.__webglFramebuffer.length;re++)i.deleteFramebuffer(A.__webglFramebuffer[re]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let re=0;re<A.__webglColorRenderbuffer.length;re++)A.__webglColorRenderbuffer[re]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[re]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}let K=I.textures;for(let re=0,oe=K.length;re<oe;re++){let se=n.get(K[re]);se.__webglTexture&&(i.deleteTexture(se.__webglTexture),a.memory.textures--),n.remove(K[re])}n.remove(I)}let C=0;function F(){C=0}function U(){let I=C;return I>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+r.maxTextures),C+=1,I}function k(I){let A=[];return A.push(I.wrapS),A.push(I.wrapT),A.push(I.wrapR||0),A.push(I.magFilter),A.push(I.minFilter),A.push(I.anisotropy),A.push(I.internalFormat),A.push(I.format),A.push(I.type),A.push(I.generateMipmaps),A.push(I.premultiplyAlpha),A.push(I.flipY),A.push(I.unpackAlignment),A.push(I.colorSpace),A.join()}function H(I,A){let K=n.get(I);if(I.isVideoTexture&&we(I),I.isRenderTargetTexture===!1&&I.version>0&&K.__version!==I.version){let re=I.image;if(re===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(K,I,A);return}}t.bindTexture(i.TEXTURE_2D,K.__webglTexture,i.TEXTURE0+A)}function D(I,A){let K=n.get(I);if(I.version>0&&K.__version!==I.version){Z(K,I,A);return}t.bindTexture(i.TEXTURE_2D_ARRAY,K.__webglTexture,i.TEXTURE0+A)}function z(I,A){let K=n.get(I);if(I.version>0&&K.__version!==I.version){Z(K,I,A);return}t.bindTexture(i.TEXTURE_3D,K.__webglTexture,i.TEXTURE0+A)}function N(I,A){let K=n.get(I);if(I.version>0&&K.__version!==I.version){ae(K,I,A);return}t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture,i.TEXTURE0+A)}let V={[es]:i.REPEAT,[ur]:i.CLAMP_TO_EDGE,[_o]:i.MIRRORED_REPEAT},ee={[Xn]:i.NEAREST,[ud]:i.NEAREST_MIPMAP_NEAREST,[Ts]:i.NEAREST_MIPMAP_LINEAR,[$t]:i.LINEAR,[xo]:i.LINEAR_MIPMAP_NEAREST,[oi]:i.LINEAR_MIPMAP_LINEAR},ce={[cg]:i.NEVER,[pg]:i.ALWAYS,[lg]:i.LESS,[pm]:i.LEQUAL,[ug]:i.EQUAL,[fg]:i.GEQUAL,[hg]:i.GREATER,[dg]:i.NOTEQUAL};function Y(I,A){if(A.type===hr&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===$t||A.magFilter===xo||A.magFilter===Ts||A.magFilter===oi||A.minFilter===$t||A.minFilter===xo||A.minFilter===Ts||A.minFilter===oi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(I,i.TEXTURE_WRAP_S,V[A.wrapS]),i.texParameteri(I,i.TEXTURE_WRAP_T,V[A.wrapT]),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,V[A.wrapR]),i.texParameteri(I,i.TEXTURE_MAG_FILTER,ee[A.magFilter]),i.texParameteri(I,i.TEXTURE_MIN_FILTER,ee[A.minFilter]),A.compareFunction&&(i.texParameteri(I,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(I,i.TEXTURE_COMPARE_FUNC,ce[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Xn||A.minFilter!==Ts&&A.minFilter!==oi||A.type===hr&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){let K=e.get("EXT_texture_filter_anisotropic");i.texParameterf(I,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,r.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function be(I,A){let K=!1;I.__webglInit===void 0&&(I.__webglInit=!0,A.addEventListener("dispose",_));let re=A.source,oe=h.get(re);oe===void 0&&(oe={},h.set(re,oe));let se=k(A);if(se!==I.__cacheKey){oe[se]===void 0&&(oe[se]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,K=!0),oe[se].usedTimes++;let He=oe[I.__cacheKey];He!==void 0&&(oe[I.__cacheKey].usedTimes--,He.usedTimes===0&&M(A)),I.__cacheKey=se,I.__webglTexture=oe[se].texture}return K}function Z(I,A,K){let re=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(re=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(re=i.TEXTURE_3D);let oe=be(I,A),se=A.source;t.bindTexture(re,I.__webglTexture,i.TEXTURE0+K);let He=n.get(se);if(se.version!==He.__version||oe===!0){t.activeTexture(i.TEXTURE0+K);let Ae=St.getPrimaries(St.workingColorSpace),De=A.colorSpace===qn?null:St.getPrimaries(A.colorSpace),rt=A.colorSpace===qn||Ae===De?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,rt);let ve=v(A.image,!1,r.maxTextureSize);ve=Qe(A,ve);let ke=s.convert(A.format,A.colorSpace),Ne=s.convert(A.type),tt=w(A.internalFormat,ke,Ne,A.colorSpace,A.isVideoTexture);Y(re,A);let Be,xt=A.mipmaps,lt=A.isVideoTexture!==!0,It=He.__version===void 0||oe===!0,G=se.dataReady,Ce=S(A,ve);if(A.isDepthTexture)tt=x(A.format===Ta,A.type),It&&(lt?t.texStorage2D(i.TEXTURE_2D,1,tt,ve.width,ve.height):t.texImage2D(i.TEXTURE_2D,0,tt,ve.width,ve.height,0,ke,Ne,null));else if(A.isDataTexture)if(xt.length>0){lt&&It&&t.texStorage2D(i.TEXTURE_2D,Ce,tt,xt[0].width,xt[0].height);for(let ie=0,le=xt.length;ie<le;ie++)Be=xt[ie],lt?G&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,Be.width,Be.height,ke,Ne,Be.data):t.texImage2D(i.TEXTURE_2D,ie,tt,Be.width,Be.height,0,ke,Ne,Be.data);A.generateMipmaps=!1}else lt?(It&&t.texStorage2D(i.TEXTURE_2D,Ce,tt,ve.width,ve.height),G&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ve.width,ve.height,ke,Ne,ve.data)):t.texImage2D(i.TEXTURE_2D,0,tt,ve.width,ve.height,0,ke,Ne,ve.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){lt&&It&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ce,tt,xt[0].width,xt[0].height,ve.depth);for(let ie=0,le=xt.length;ie<le;ie++)if(Be=xt[ie],A.format!==Si)if(ke!==null)if(lt){if(G)if(A.layerUpdates.size>0){let Ie=Pp(Be.width,Be.height,A.format,A.type);for(let Ue of A.layerUpdates){let ot=Be.data.subarray(Ue*Ie/Be.data.BYTES_PER_ELEMENT,(Ue+1)*Ie/Be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,Ue,Be.width,Be.height,1,ke,ot)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,0,Be.width,Be.height,ve.depth,ke,Be.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ie,tt,Be.width,Be.height,ve.depth,0,Be.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else lt?G&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,0,Be.width,Be.height,ve.depth,ke,Ne,Be.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ie,tt,Be.width,Be.height,ve.depth,0,ke,Ne,Be.data)}else{lt&&It&&t.texStorage2D(i.TEXTURE_2D,Ce,tt,xt[0].width,xt[0].height);for(let ie=0,le=xt.length;ie<le;ie++)Be=xt[ie],A.format!==Si?ke!==null?lt?G&&t.compressedTexSubImage2D(i.TEXTURE_2D,ie,0,0,Be.width,Be.height,ke,Be.data):t.compressedTexImage2D(i.TEXTURE_2D,ie,tt,Be.width,Be.height,0,Be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):lt?G&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,Be.width,Be.height,ke,Ne,Be.data):t.texImage2D(i.TEXTURE_2D,ie,tt,Be.width,Be.height,0,ke,Ne,Be.data)}else if(A.isDataArrayTexture)if(lt){if(It&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ce,tt,ve.width,ve.height,ve.depth),G)if(A.layerUpdates.size>0){let ie=Pp(ve.width,ve.height,A.format,A.type);for(let le of A.layerUpdates){let Ie=ve.data.subarray(le*ie/ve.data.BYTES_PER_ELEMENT,(le+1)*ie/ve.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,le,ve.width,ve.height,1,ke,Ne,Ie)}A.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ve.width,ve.height,ve.depth,ke,Ne,ve.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,tt,ve.width,ve.height,ve.depth,0,ke,Ne,ve.data);else if(A.isData3DTexture)lt?(It&&t.texStorage3D(i.TEXTURE_3D,Ce,tt,ve.width,ve.height,ve.depth),G&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ve.width,ve.height,ve.depth,ke,Ne,ve.data)):t.texImage3D(i.TEXTURE_3D,0,tt,ve.width,ve.height,ve.depth,0,ke,Ne,ve.data);else if(A.isFramebufferTexture){if(It)if(lt)t.texStorage2D(i.TEXTURE_2D,Ce,tt,ve.width,ve.height);else{let ie=ve.width,le=ve.height;for(let Ie=0;Ie<Ce;Ie++)t.texImage2D(i.TEXTURE_2D,Ie,tt,ie,le,0,ke,Ne,null),ie>>=1,le>>=1}}else if(xt.length>0){if(lt&&It){let ie=Fe(xt[0]);t.texStorage2D(i.TEXTURE_2D,Ce,tt,ie.width,ie.height)}for(let ie=0,le=xt.length;ie<le;ie++)Be=xt[ie],lt?G&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,ke,Ne,Be):t.texImage2D(i.TEXTURE_2D,ie,tt,ke,Ne,Be);A.generateMipmaps=!1}else if(lt){if(It){let ie=Fe(ve);t.texStorage2D(i.TEXTURE_2D,Ce,tt,ie.width,ie.height)}G&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ke,Ne,ve)}else t.texImage2D(i.TEXTURE_2D,0,tt,ke,Ne,ve);m(A)&&f(re),He.__version=se.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function ae(I,A,K){if(A.image.length!==6)return;let re=be(I,A),oe=A.source;t.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+K);let se=n.get(oe);if(oe.version!==se.__version||re===!0){t.activeTexture(i.TEXTURE0+K);let He=St.getPrimaries(St.workingColorSpace),Ae=A.colorSpace===qn?null:St.getPrimaries(A.colorSpace),De=A.colorSpace===qn||He===Ae?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);let rt=A.isCompressedTexture||A.image[0].isCompressedTexture,ve=A.image[0]&&A.image[0].isDataTexture,ke=[];for(let le=0;le<6;le++)!rt&&!ve?ke[le]=v(A.image[le],!0,r.maxCubemapSize):ke[le]=ve?A.image[le].image:A.image[le],ke[le]=Qe(A,ke[le]);let Ne=ke[0],tt=s.convert(A.format,A.colorSpace),Be=s.convert(A.type),xt=w(A.internalFormat,tt,Be,A.colorSpace),lt=A.isVideoTexture!==!0,It=se.__version===void 0||re===!0,G=oe.dataReady,Ce=S(A,Ne);Y(i.TEXTURE_CUBE_MAP,A);let ie;if(rt){lt&&It&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ce,xt,Ne.width,Ne.height);for(let le=0;le<6;le++){ie=ke[le].mipmaps;for(let Ie=0;Ie<ie.length;Ie++){let Ue=ie[Ie];A.format!==Si?tt!==null?lt?G&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ie,0,0,Ue.width,Ue.height,tt,Ue.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ie,xt,Ue.width,Ue.height,0,Ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):lt?G&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ie,0,0,Ue.width,Ue.height,tt,Be,Ue.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ie,xt,Ue.width,Ue.height,0,tt,Be,Ue.data)}}}else{if(ie=A.mipmaps,lt&&It){ie.length>0&&Ce++;let le=Fe(ke[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ce,xt,le.width,le.height)}for(let le=0;le<6;le++)if(ve){lt?G&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,ke[le].width,ke[le].height,tt,Be,ke[le].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,xt,ke[le].width,ke[le].height,0,tt,Be,ke[le].data);for(let Ie=0;Ie<ie.length;Ie++){let ot=ie[Ie].image[le].image;lt?G&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ie+1,0,0,ot.width,ot.height,tt,Be,ot.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ie+1,xt,ot.width,ot.height,0,tt,Be,ot.data)}}else{lt?G&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,tt,Be,ke[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,xt,tt,Be,ke[le]);for(let Ie=0;Ie<ie.length;Ie++){let Ue=ie[Ie];lt?G&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ie+1,0,0,tt,Be,Ue.image[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ie+1,xt,tt,Be,Ue.image[le])}}}m(A)&&f(i.TEXTURE_CUBE_MAP),se.__version=oe.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function fe(I,A,K,re,oe,se){let He=s.convert(K.format,K.colorSpace),Ae=s.convert(K.type),De=w(K.internalFormat,He,Ae,K.colorSpace),rt=n.get(A),ve=n.get(K);if(ve.__renderTarget=A,!rt.__hasExternalTextures){let ke=Math.max(1,A.width>>se),Ne=Math.max(1,A.height>>se);oe===i.TEXTURE_3D||oe===i.TEXTURE_2D_ARRAY?t.texImage3D(oe,se,De,ke,Ne,A.depth,0,He,Ae,null):t.texImage2D(oe,se,De,ke,Ne,0,He,Ae,null)}t.bindFramebuffer(i.FRAMEBUFFER,I),Pe(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,re,oe,ve.__webglTexture,0,ze(A)):(oe===i.TEXTURE_2D||oe>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,re,oe,ve.__webglTexture,se),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ne(I,A,K){if(i.bindRenderbuffer(i.RENDERBUFFER,I),A.depthBuffer){let re=A.depthTexture,oe=re&&re.isDepthTexture?re.type:null,se=x(A.stencilBuffer,oe),He=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ae=ze(A);Pe(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ae,se,A.width,A.height):K?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ae,se,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,se,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,He,i.RENDERBUFFER,I)}else{let re=A.textures;for(let oe=0;oe<re.length;oe++){let se=re[oe],He=s.convert(se.format,se.colorSpace),Ae=s.convert(se.type),De=w(se.internalFormat,He,Ae,se.colorSpace),rt=ze(A);K&&Pe(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,rt,De,A.width,A.height):Pe(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,rt,De,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,De,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function he(I,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,I),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let re=n.get(A.depthTexture);re.__renderTarget=A,(!re.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),H(A.depthTexture,0);let oe=re.__webglTexture,se=ze(A);if(A.depthTexture.format===ba)Pe(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,oe,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,oe,0);else if(A.depthTexture.format===Ta)Pe(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,oe,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,oe,0);else throw new Error("Unknown depthTexture format")}function Ge(I){let A=n.get(I),K=I.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==I.depthTexture){let re=I.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),re){let oe=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,re.removeEventListener("dispose",oe)};re.addEventListener("dispose",oe),A.__depthDisposeCallback=oe}A.__boundDepthTexture=re}if(I.depthTexture&&!A.__autoAllocateDepthBuffer){if(K)throw new Error("target.depthTexture not supported in Cube render targets");he(A.__webglFramebuffer,I)}else if(K){A.__webglDepthbuffer=[];for(let re=0;re<6;re++)if(t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[re]),A.__webglDepthbuffer[re]===void 0)A.__webglDepthbuffer[re]=i.createRenderbuffer(),ne(A.__webglDepthbuffer[re],I,!1);else{let oe=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=A.__webglDepthbuffer[re];i.bindRenderbuffer(i.RENDERBUFFER,se),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,se)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),ne(A.__webglDepthbuffer,I,!1);else{let re=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,oe),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,oe)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function We(I,A,K){let re=n.get(I);A!==void 0&&fe(re.__webglFramebuffer,I,I.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),K!==void 0&&Ge(I)}function ut(I){let A=I.texture,K=n.get(I),re=n.get(A);I.addEventListener("dispose",R);let oe=I.textures,se=I.isWebGLCubeRenderTarget===!0,He=oe.length>1;if(He||(re.__webglTexture===void 0&&(re.__webglTexture=i.createTexture()),re.__version=A.version,a.memory.textures++),se){K.__webglFramebuffer=[];for(let Ae=0;Ae<6;Ae++)if(A.mipmaps&&A.mipmaps.length>0){K.__webglFramebuffer[Ae]=[];for(let De=0;De<A.mipmaps.length;De++)K.__webglFramebuffer[Ae][De]=i.createFramebuffer()}else K.__webglFramebuffer[Ae]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){K.__webglFramebuffer=[];for(let Ae=0;Ae<A.mipmaps.length;Ae++)K.__webglFramebuffer[Ae]=i.createFramebuffer()}else K.__webglFramebuffer=i.createFramebuffer();if(He)for(let Ae=0,De=oe.length;Ae<De;Ae++){let rt=n.get(oe[Ae]);rt.__webglTexture===void 0&&(rt.__webglTexture=i.createTexture(),a.memory.textures++)}if(I.samples>0&&Pe(I)===!1){K.__webglMultisampledFramebuffer=i.createFramebuffer(),K.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let Ae=0;Ae<oe.length;Ae++){let De=oe[Ae];K.__webglColorRenderbuffer[Ae]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,K.__webglColorRenderbuffer[Ae]);let rt=s.convert(De.format,De.colorSpace),ve=s.convert(De.type),ke=w(De.internalFormat,rt,ve,De.colorSpace,I.isXRRenderTarget===!0),Ne=ze(I);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ne,ke,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.RENDERBUFFER,K.__webglColorRenderbuffer[Ae])}i.bindRenderbuffer(i.RENDERBUFFER,null),I.depthBuffer&&(K.__webglDepthRenderbuffer=i.createRenderbuffer(),ne(K.__webglDepthRenderbuffer,I,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(se){t.bindTexture(i.TEXTURE_CUBE_MAP,re.__webglTexture),Y(i.TEXTURE_CUBE_MAP,A);for(let Ae=0;Ae<6;Ae++)if(A.mipmaps&&A.mipmaps.length>0)for(let De=0;De<A.mipmaps.length;De++)fe(K.__webglFramebuffer[Ae][De],I,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,De);else fe(K.__webglFramebuffer[Ae],I,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,0);m(A)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(He){for(let Ae=0,De=oe.length;Ae<De;Ae++){let rt=oe[Ae],ve=n.get(rt);t.bindTexture(i.TEXTURE_2D,ve.__webglTexture),Y(i.TEXTURE_2D,rt),fe(K.__webglFramebuffer,I,rt,i.COLOR_ATTACHMENT0+Ae,i.TEXTURE_2D,0),m(rt)&&f(i.TEXTURE_2D)}t.unbindTexture()}else{let Ae=i.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Ae=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Ae,re.__webglTexture),Y(Ae,A),A.mipmaps&&A.mipmaps.length>0)for(let De=0;De<A.mipmaps.length;De++)fe(K.__webglFramebuffer[De],I,A,i.COLOR_ATTACHMENT0,Ae,De);else fe(K.__webglFramebuffer,I,A,i.COLOR_ATTACHMENT0,Ae,0);m(A)&&f(Ae),t.unbindTexture()}I.depthBuffer&&Ge(I)}function me(I){let A=I.textures;for(let K=0,re=A.length;K<re;K++){let oe=A[K];if(m(oe)){let se=y(I),He=n.get(oe).__webglTexture;t.bindTexture(se,He),f(se),t.unbindTexture()}}}let Je=[],O=[];function it(I){if(I.samples>0){if(Pe(I)===!1){let A=I.textures,K=I.width,re=I.height,oe=i.COLOR_BUFFER_BIT,se=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,He=n.get(I),Ae=A.length>1;if(Ae)for(let De=0;De<A.length;De++)t.bindFramebuffer(i.FRAMEBUFFER,He.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+De,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,He.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+De,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,He.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,He.__webglFramebuffer);for(let De=0;De<A.length;De++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(oe|=i.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(oe|=i.STENCIL_BUFFER_BIT)),Ae){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,He.__webglColorRenderbuffer[De]);let rt=n.get(A[De]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,rt,0)}i.blitFramebuffer(0,0,K,re,0,0,K,re,oe,i.NEAREST),c===!0&&(Je.length=0,O.length=0,Je.push(i.COLOR_ATTACHMENT0+De),I.depthBuffer&&I.resolveDepthBuffer===!1&&(Je.push(se),O.push(se),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,O)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Je))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Ae)for(let De=0;De<A.length;De++){t.bindFramebuffer(i.FRAMEBUFFER,He.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+De,i.RENDERBUFFER,He.__webglColorRenderbuffer[De]);let rt=n.get(A[De]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,He.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+De,i.TEXTURE_2D,rt,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,He.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&c){let A=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function ze(I){return Math.min(r.maxSamples,I.samples)}function Pe(I){let A=n.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function we(I){let A=a.render.frame;u.get(I)!==A&&(u.set(I,A),I.update())}function Qe(I,A){let K=I.colorSpace,re=I.format,oe=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||K!==Ba&&K!==qn&&(St.getTransfer(K)===Dt?(re!==Si||oe!==Fr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",K)),A}function Fe(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(l.width=I.naturalWidth||I.width,l.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(l.width=I.displayWidth,l.height=I.displayHeight):(l.width=I.width,l.height=I.height),l}this.allocateTextureUnit=U,this.resetTextureUnits=F,this.setTexture2D=H,this.setTexture2DArray=D,this.setTexture3D=z,this.setTextureCube=N,this.rebindTextures=We,this.setupRenderTarget=ut,this.updateRenderTargetMipmap=me,this.updateMultisampleRenderTarget=it,this.setupDepthRenderbuffer=Ge,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=Pe}function y1(i,e){function t(n,r=qn){let s,a=St.getTransfer(r);if(n===Fr)return i.UNSIGNED_BYTE;if(n===dd)return i.UNSIGNED_SHORT_4_4_4_4;if(n===fd)return i.UNSIGNED_SHORT_5_5_5_1;if(n===rm)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===nm)return i.BYTE;if(n===im)return i.SHORT;if(n===To)return i.UNSIGNED_SHORT;if(n===hd)return i.INT;if(n===As)return i.UNSIGNED_INT;if(n===hr)return i.FLOAT;if(n===nn)return i.HALF_FLOAT;if(n===sm)return i.ALPHA;if(n===am)return i.RGB;if(n===Si)return i.RGBA;if(n===om)return i.LUMINANCE;if(n===cm)return i.LUMINANCE_ALPHA;if(n===ba)return i.DEPTH_COMPONENT;if(n===Ta)return i.DEPTH_STENCIL;if(n===pd)return i.RED;if(n===md)return i.RED_INTEGER;if(n===lm)return i.RG;if(n===gd)return i.RG_INTEGER;if(n===vd)return i.RGBA_INTEGER;if(n===qc||n===Xc||n===jc||n===Kc)if(a===Dt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===qc)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Xc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===jc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Kc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===qc)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Xc)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===jc)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Kc)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ku||n===Yu||n===Zu||n===Ju)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Ku)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Yu)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Zu)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ju)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Qu||n===$u||n===eh)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Qu||n===$u)return a===Dt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===eh)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===th||n===nh||n===ih||n===rh||n===sh||n===ah||n===oh||n===ch||n===lh||n===uh||n===hh||n===dh||n===fh||n===ph)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===th)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===nh)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ih)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===rh)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===sh)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ah)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===oh)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ch)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===lh)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===uh)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===hh)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===dh)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===fh)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ph)return a===Dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Yc||n===mh||n===gh)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===Yc)return a===Dt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===mh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===gh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===um||n===vh||n===xh||n===bh)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Yc)return s.COMPRESSED_RED_RGTC1_EXT;if(n===vh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===xh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===bh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===_a?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}function _1(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,xm(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function r(m,f,y,w,x){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),d(m,f)):f.isMeshPhongMaterial?(s(m,f),u(m,f)):f.isMeshStandardMaterial?(s(m,f),h(m,f),f.isMeshPhysicalMaterial&&p(m,f,x)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),v(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?c(m,f,y,w):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===en&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===en&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let y=e.get(f),w=y.envMap,x=y.envMapRotation;w&&(m.envMap.value=w,Ms.copy(x),Ms.x*=-1,Ms.y*=-1,Ms.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Ms.y*=-1,Ms.z*=-1),m.envMapRotation.value.setFromMatrix4(S1.makeRotationFromEuler(Ms)),m.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,y,w){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*y,m.scale.value=w*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function h(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,y){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===en&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function v(m,f){let y=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function T1(i,e,t,n){let r={},s={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,w){let x=w.program;n.uniformBlockBinding(y,x)}function l(y,w){let x=r[y.id];x===void 0&&(g(y),x=u(y),r[y.id]=x,y.addEventListener("dispose",m));let S=w.program;n.updateUBOMapping(y,S);let _=e.render.frame;s[y.id]!==_&&(h(y),s[y.id]=_)}function u(y){let w=d();y.__bindingPointIndex=w;let x=i.createBuffer(),S=y.__size,_=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,S,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,x),x}function d(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(y){let w=r[y.id],x=y.uniforms,S=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let _=0,R=x.length;_<R;_++){let E=Array.isArray(x[_])?x[_]:[x[_]];for(let M=0,b=E.length;M<b;M++){let C=E[M];if(p(C,_,M,S)===!0){let F=C.__offset,U=Array.isArray(C.value)?C.value:[C.value],k=0;for(let H=0;H<U.length;H++){let D=U[H],z=v(D);typeof D=="number"||typeof D=="boolean"?(C.__data[0]=D,i.bufferSubData(i.UNIFORM_BUFFER,F+k,C.__data)):D.isMatrix3?(C.__data[0]=D.elements[0],C.__data[1]=D.elements[1],C.__data[2]=D.elements[2],C.__data[3]=0,C.__data[4]=D.elements[3],C.__data[5]=D.elements[4],C.__data[6]=D.elements[5],C.__data[7]=0,C.__data[8]=D.elements[6],C.__data[9]=D.elements[7],C.__data[10]=D.elements[8],C.__data[11]=0):(D.toArray(C.__data,k),k+=z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(y,w,x,S){let _=y.value,R=w+"_"+x;if(S[R]===void 0)return typeof _=="number"||typeof _=="boolean"?S[R]=_:S[R]=_.clone(),!0;{let E=S[R];if(typeof _=="number"||typeof _=="boolean"){if(E!==_)return S[R]=_,!0}else if(E.equals(_)===!1)return E.copy(_),!0}return!1}function g(y){let w=y.uniforms,x=0,S=16;for(let R=0,E=w.length;R<E;R++){let M=Array.isArray(w[R])?w[R]:[w[R]];for(let b=0,C=M.length;b<C;b++){let F=M[b],U=Array.isArray(F.value)?F.value:[F.value];for(let k=0,H=U.length;k<H;k++){let D=U[k],z=v(D),N=x%S,V=N%z.boundary,ee=N+V;x+=V,ee!==0&&S-ee<z.storage&&(x+=S-ee),F.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=x,x+=z.storage}}}let _=x%S;return _>0&&(x+=S-_),y.__size=x,y.__cache={},this}function v(y){let w={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(w.boundary=4,w.storage=4):y.isVector2?(w.boundary=8,w.storage=8):y.isVector3||y.isColor?(w.boundary=16,w.storage=12):y.isVector4?(w.boundary=16,w.storage=16):y.isMatrix3?(w.boundary=48,w.storage=48):y.isMatrix4?(w.boundary=64,w.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),w}function m(y){let w=y.target;w.removeEventListener("dispose",m);let x=a.indexOf(w.__bindingPointIndex);a.splice(x,1),i.deleteBuffer(r[w.id]),delete r[w.id],delete s[w.id]}function f(){for(let y in r)i.deleteBuffer(r[y]);a=[],r={},s={}}return{bind:c,update:l,dispose:f}}function Fc(i,e,t,n,r,s){ma.subVectors(i,t).addScalar(.5).multiply(n),r!==void 0?(lo.x=s*ma.x-r*ma.y,lo.y=r*ma.x+s*ma.y):lo.copy(ma),i.copy(e),i.x+=lo.x,i.y+=lo.y,i.applyMatrix4(Sm)}function zc(i,e,t,n,r,s){let a=i.geometry.attributes.position;if(ol.fromBufferAttribute(a,r),cl.fromBufferAttribute(a,s),t.distanceSqToSegment(ol,cl,Lu,kp)>n)return;Lu.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Lu);if(!(c<e.near||c>e.far))return{distance:c,point:kp.clone().applyMatrix4(i.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:i}}function Hp(i,e,t,n,r,s,a){let o=kh.distanceSqToPoint(i);if(o<t){let c=new T;kh.closestPointToPoint(i,c),c.applyMatrix4(n);let l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}function wd(){let i=0,e=0,t=0,n=0;function r(s,a,o,c){i=s,e=o,t=-3*s+3*a-2*o-c,n=2*s-2*a+o+c}return{initCatmullRom:function(s,a,o,c,l){r(a,o,l*(o-s),l*(c-a))},initNonuniformCatmullRom:function(s,a,o,c,l,u,d){let h=(a-s)/l-(o-s)/(l+u)+(o-a)/u,p=(o-a)/u-(c-a)/(u+d)+(c-o)/d;h*=u,p*=u,r(a,o,h,p)},calc:function(s){let a=s*s,o=a*s;return i+e*s+t*a+n*o}}}function Bp(i,e,t,n,r){let s=(n-e)*.5,a=(r-t)*.5,o=i*i,c=i*o;return(2*t-2*n+s+a)*c+(-3*t+3*n-2*s-a)*o+s*i+t}function R1(i,e){let t=1-i;return t*t*e}function C1(i,e){return 2*(1-i)*i*e}function P1(i,e){return i*i*e}function Mo(i,e,t,n){return R1(i,e)+C1(i,t)+P1(i,n)}function L1(i,e){let t=1-i;return t*t*t*e}function I1(i,e){let t=1-i;return 3*t*t*i*e}function D1(i,e){return 3*(1-i)*i*i*e}function U1(i,e){return i*i*i*e}function Eo(i,e,t,n,r){return L1(i,e)+I1(i,t)+D1(i,n)+U1(i,r)}function _m(i,e,t,n,r){let s,a;if(r===J1(i,e,t,n)>0)for(s=e;s<t;s+=n)a=Wp(s,i[s],i[s+1],a);else for(s=t-n;s>=e;s-=n)a=Wp(s,i[s],i[s+1],a);return a&&El(a,a.next)&&(No(a),a=a.next),a}function Is(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(El(t,t.next)||Qt(t.prev,t,t.next)===0)){if(No(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Fo(i,e,t,n,r,s,a){if(!i)return;!a&&s&&q1(i,n,r,s);let o=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,s?N1(i,n,r,s):k1(i)){e.push(c.i/t|0),e.push(i.i/t|0),e.push(l.i/t|0),No(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=z1(Is(i),e,t),Fo(i,e,t,n,r,s,2)):a===2&&O1(i,e,t,n,r,s):Fo(Is(i),e,t,n,r,s,1);break}}}function k1(i){let e=i.prev,t=i,n=i.next;if(Qt(e,t,n)>=0)return!1;let r=e.x,s=t.x,a=n.x,o=e.y,c=t.y,l=n.y,u=r<s?r<a?r:a:s<a?s:a,d=o<c?o<l?o:l:c<l?c:l,h=r>s?r>a?r:a:s>a?s:a,p=o>c?o>l?o:l:c>l?c:l,g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=h&&g.y>=d&&g.y<=p&&xa(r,o,s,c,a,l,g.x,g.y)&&Qt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function N1(i,e,t,n){let r=i.prev,s=i,a=i.next;if(Qt(r,s,a)>=0)return!1;let o=r.x,c=s.x,l=a.x,u=r.y,d=s.y,h=a.y,p=o<c?o<l?o:l:c<l?c:l,g=u<d?u<h?u:h:d<h?d:h,v=o>c?o>l?o:l:c>l?c:l,m=u>d?u>h?u:h:d>h?d:h,f=Wh(p,g,e,t,n),y=Wh(v,m,e,t,n),w=i.prevZ,x=i.nextZ;for(;w&&w.z>=f&&x&&x.z<=y;){if(w.x>=p&&w.x<=v&&w.y>=g&&w.y<=m&&w!==r&&w!==a&&xa(o,u,c,d,l,h,w.x,w.y)&&Qt(w.prev,w,w.next)>=0||(w=w.prevZ,x.x>=p&&x.x<=v&&x.y>=g&&x.y<=m&&x!==r&&x!==a&&xa(o,u,c,d,l,h,x.x,x.y)&&Qt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;w&&w.z>=f;){if(w.x>=p&&w.x<=v&&w.y>=g&&w.y<=m&&w!==r&&w!==a&&xa(o,u,c,d,l,h,w.x,w.y)&&Qt(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;x&&x.z<=y;){if(x.x>=p&&x.x<=v&&x.y>=g&&x.y<=m&&x!==r&&x!==a&&xa(o,u,c,d,l,h,x.x,x.y)&&Qt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function z1(i,e,t){let n=i;do{let r=n.prev,s=n.next.next;!El(r,s)&&Tm(r,n,n.next,s)&&ko(r,s)&&ko(s,r)&&(e.push(r.i/t|0),e.push(n.i/t|0),e.push(s.i/t|0),No(n),No(n.next),n=i=s),n=n.next}while(n!==i);return Is(n)}function O1(i,e,t,n,r,s){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&K1(a,o)){let c=Am(a,o);a=Is(a,a.next),c=Is(c,c.next),Fo(a,e,t,n,r,s,0),Fo(c,e,t,n,r,s,0);return}o=o.next}a=a.next}while(a!==i)}function H1(i,e,t,n){let r=[],s,a,o,c,l;for(s=0,a=e.length;s<a;s++)o=e[s]*n,c=s<a-1?e[s+1]*n:i.length,l=_m(i,o,c,n,!1),l===l.next&&(l.steiner=!0),r.push(j1(l));for(r.sort(B1),s=0;s<r.length;s++)t=V1(r[s],t);return t}function B1(i,e){return i.x-e.x}function V1(i,e){let t=W1(i,e);if(!t)return e;let n=Am(t,i);return Is(n,n.next),Is(t,t.next)}function W1(i,e){let t=e,n=-1/0,r,s=i.x,a=i.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){let h=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=s&&h>n&&(n=h,r=t.x<t.next.x?t:t.next,h===s))return r}t=t.next}while(t!==e);if(!r)return null;let o=r,c=r.x,l=r.y,u=1/0,d;t=r;do s>=t.x&&t.x>=c&&s!==t.x&&xa(a<l?s:n,a,c,l,a<l?n:s,a,t.x,t.y)&&(d=Math.abs(a-t.y)/(s-t.x),ko(t,i)&&(d<u||d===u&&(t.x>r.x||t.x===r.x&&G1(r,t)))&&(r=t,u=d)),t=t.next;while(t!==o);return r}function G1(i,e){return Qt(i.prev,i,e.prev)<0&&Qt(e.next,i,i.next)<0}function q1(i,e,t,n){let r=i;do r.z===0&&(r.z=Wh(r.x,r.y,e,t,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,X1(r)}function X1(i){let e,t,n,r,s,a,o,c,l=1;do{for(t=i,i=null,s=null,a=0;t;){for(a++,n=t,o=0,e=0;e<l&&(o++,n=n.nextZ,!!n);e++);for(c=l;o>0||c>0&&n;)o!==0&&(c===0||!n||t.z<=n.z)?(r=t,t=t.nextZ,o--):(r=n,n=n.nextZ,c--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;t=n}s.nextZ=null,l*=2}while(a>1);return i}function Wh(i,e,t,n,r){return i=(i-t)*r|0,e=(e-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function j1(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function xa(i,e,t,n,r,s,a,o){return(r-a)*(e-o)>=(i-a)*(s-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(r-a)*(n-o)}function K1(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Y1(i,e)&&(ko(i,e)&&ko(e,i)&&Z1(i,e)&&(Qt(i.prev,i,e.prev)||Qt(i,e.prev,e))||El(i,e)&&Qt(i.prev,i,i.next)>0&&Qt(e.prev,e,e.next)>0)}function Qt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function El(i,e){return i.x===e.x&&i.y===e.y}function Tm(i,e,t,n){let r=Wc(Qt(i,e,t)),s=Wc(Qt(i,e,n)),a=Wc(Qt(t,n,i)),o=Wc(Qt(t,n,e));return!!(r!==s&&a!==o||r===0&&Vc(i,t,e)||s===0&&Vc(i,n,e)||a===0&&Vc(t,i,n)||o===0&&Vc(t,e,n))}function Vc(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Wc(i){return i>0?1:i<0?-1:0}function Y1(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Tm(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function ko(i,e){return Qt(i.prev,i,i.next)<0?Qt(i,e,i.next)>=0&&Qt(i,i.prev,e)>=0:Qt(i,e,i.prev)<0||Qt(i,i.next,e)<0}function Z1(i,e){let t=i,n=!1,r=(i.x+e.x)/2,s=(i.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Am(i,e){let t=new Gh(i.i,i.x,i.y),n=new Gh(e.i,e.x,e.y),r=i.next,s=e.prev;return i.next=e,e.prev=i,t.next=r,r.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function Wp(i,e,t,n){let r=new Gh(i,e,t);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function No(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Gh(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function J1(i,e,t,n){let r=0;for(let s=e,a=t-n;s<t;s+=n)r+=(i[a]-i[s])*(i[s+1]+i[a+1]),a=s;return r}function Gp(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function qp(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}function Q1(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let r=i[t];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e}function Gc(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function $1(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Zp(){return performance.now()}function Qp(i,e){return i.distance-e.distance}function id(i,e,t,n){let r=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(r=!1),r===!0&&n===!0){let s=i.children;for(let a=0,o=s.length;a<o;a++)id(s[a],e,t,!0)}}var rd,F0,Uf,k0,$p,N0,Ir,pr,en,mt,dr,Qr,Pt,Ff,Zc,z0,Ss,O0,H0,B0,V0,W0,G0,q0,X0,Nu,zu,j0,K0,Y0,Z0,J0,Q0,$0,eg,tg,Ou,Hu,Bu,Ma,Vu,Wu,Gu,qu,em,ng,ig,$r,sd,ad,od,cd,rg,Bo,ld,tm,Ea,Sa,Xu,ju,yl,es,ur,_o,Xn,ud,Ts,$t,xo,oi,Fr,nm,im,To,hd,As,hr,nn,dd,fd,_a,rm,sm,am,Si,om,cm,ba,Ta,pd,md,lm,gd,vd,qc,Xc,jc,Kc,Ku,Yu,Zu,Ju,Qu,$u,eh,th,nh,ih,rh,sh,ah,oh,ch,lh,uh,hh,dh,fh,ph,Yc,mh,gh,um,vh,xh,bh,Jc,yh,iu,kf,Nf,zf,hm,dm,xd,sg,ag,fm,og,qn,Gt,Ba,wl,Dt,Qs,Of,cg,lg,ug,pm,hg,dg,fg,pg,wh,mm,Qc,Dr,$c,ts,Jn,Hf,bo,Ao,ht,ue,pt,ru,Bf,St,Vf,Wf,Gf,qf,Xf,$s,Mh,Fg,Rs,kg,jn,nt,Eh,tn,el,Sh,Ut,T,au,jf,Di,Ar,ji,fc,ea,ta,na,qr,Xr,vs,ro,pc,mc,xs,Ng,so,cu,An,Rr,lu,gc,jr,uu,vc,hu,Aa,et,ia,Ki,zg,Og,Kr,xc,wi,Kf,Yf,Rn,Co,Hg,Zf,ra,Cr,bc,ao,Bg,Vg,Jf,Qf,$f,ep,Wg,sa,du,yn,Yi,Pr,fu,Lr,aa,oa,tp,pu,mu,gu,vu,xu,bu,Jr,vm,Yr,yc,de,Qn,Gg,mr,ci,bn,wc,qe,tl,nl,Ye,qg,Ii,wu,ca,Mi,oo,kn,Xe,np,bs,Mc,ip,Ec,Sc,_c,Mu,Tc,rp,Ac,xe,ei,Ni,Kg,Yg,ye,il,Zr,sp,ap,Tn,la,ua,Cs,Ca,ns,Eu,Zg,Jg,Ei,ys,Cc,Ps,Ft,$g,ev,tv,nv,iv,rv,sv,av,ov,cv,lv,uv,hv,dv,fv,pv,mv,gv,vv,xv,bv,yv,wv,Mv,Ev,Sv,_v,Tv,Av,Rv,Cv,Pv,Lv,Iv,Dv,Uv,Fv,kv,Nv,zv,Ov,Hv,Bv,Vv,Wv,Gv,qv,Xv,jv,Kv,Yv,Zv,Jv,Qv,$v,ex,tx,nx,ix,rx,sx,ax,ox,cx,lx,ux,hx,dx,fx,px,mx,gx,vx,xx,bx,yx,wx,Mx,Ex,Sx,_x,Tx,Ax,Rx,Cx,Px,Lx,Ix,Dx,Ux,Fx,kx,Nx,zx,Ox,Hx,Bx,Vx,Wx,Gx,qx,Xx,jx,Kx,Yx,Zx,Jx,Qx,$x,eb,tb,nb,ib,rb,sb,ab,ob,cb,lb,ub,hb,db,fb,pb,mb,gb,vb,xb,bb,yb,wb,Mb,Eb,Sb,_b,Tb,Ab,Rb,Cb,Pb,Lb,gt,Le,lr,Pc,ws,Ib,Pa,va,op,_s,Su,cp,_u,Tu,Au,Ru,Es,ha,lp,La,rl,ym,fp,wm,Mm,Em,pp,mp,gp,vp,xp,_h,Th,Ah,Cu,wa,Fy,ky,wp,Ic,qy,Xy,Ky,n1,Ch,Ph,l1,Lh,Ih,f1,p1,g1,Dh,$n,w1,wo,M1,E1,Uh,Fh,Ms,S1,sl,Ji,Po,si,Ia,Lo,da,co,fa,pa,ma,lo,Sm,Dc,uo,Uc,Lp,Pu,Ip,al,Ls,kt,ga,Dp,kc,Up,A1,ho,fo,wn,Da,ol,cl,Fp,po,Nc,Lu,kp,Io,Np,zp,Ua,Do,Op,kh,Oc,Hc,on,Qi,Ui,Uo,Nh,Bc,Iu,Du,Uu,Fa,ll,zh,ul,Oh,hl,Hh,dl,Vp,Bh,fl,gr,ka,vr,Vh,Na,F1,So,pl,zo,zn,za,cn,Oa,qh,Xh,jh,$i,Ds,Kh,Yh,Zh,ml,Us,Jh,Xp,Qh,Md,Oo,$h,gl,Ho,Fi,Fu,jp,Kp,vl,Yp,mo,ku,ed,xl,td,ki,pi,Ha,Ed,ew,Sd,tw,nw,iw,rw,sw,aw,ow,nd,Yt,dM,Jp,bl,Nt=Df(()=>{rd="170",F0=0,Uf=1,k0=2,$p=1,N0=2,Ir=3,pr=0,en=1,mt=2,dr=0,Qr=1,Pt=2,Ff=3,Zc=4,z0=5,Ss=100,O0=101,H0=102,B0=103,V0=104,W0=200,G0=201,q0=202,X0=203,Nu=204,zu=205,j0=206,K0=207,Y0=208,Z0=209,J0=210,Q0=211,$0=212,eg=213,tg=214,Ou=0,Hu=1,Bu=2,Ma=3,Vu=4,Wu=5,Gu=6,qu=7,em=0,ng=1,ig=2,$r=0,sd=1,ad=2,od=3,cd=4,rg=5,Bo=6,ld=7,tm=300,Ea=301,Sa=302,Xu=303,ju=304,yl=306,es=1e3,ur=1001,_o=1002,Xn=1003,ud=1004,Ts=1005,$t=1006,xo=1007,oi=1008,Fr=1009,nm=1010,im=1011,To=1012,hd=1013,As=1014,hr=1015,nn=1016,dd=1017,fd=1018,_a=1020,rm=35902,sm=1021,am=1022,Si=1023,om=1024,cm=1025,ba=1026,Ta=1027,pd=1028,md=1029,lm=1030,gd=1031,vd=1033,qc=33776,Xc=33777,jc=33778,Kc=33779,Ku=35840,Yu=35841,Zu=35842,Ju=35843,Qu=36196,$u=37492,eh=37496,th=37808,nh=37809,ih=37810,rh=37811,sh=37812,ah=37813,oh=37814,ch=37815,lh=37816,uh=37817,hh=37818,dh=37819,fh=37820,ph=37821,Yc=36492,mh=36494,gh=36495,um=36283,vh=36284,xh=36285,bh=36286,Jc=2300,yh=2301,iu=2302,kf=2400,Nf=2401,zf=2402,hm=0,dm=1,xd=2,sg=3200,ag=3201,fm=0,og=1,qn="",Gt="srgb",Ba="srgb-linear",wl="linear",Dt="srgb",Qs=7680,Of=519,cg=512,lg=513,ug=514,pm=515,hg=516,dg=517,fg=518,pg=519,wh=35044,mm=35048,Qc="300 es",Dr=2e3,$c=2001,ts=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let r=this._listeners[e];if(r!==void 0){let s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}},Jn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Hf=1234567,bo=Math.PI/180,Ao=180/Math.PI;ht={DEG2RAD:bo,RAD2DEG:Ao,generateUUID:fr,clamp:Nn,euclideanModulo:bd,mapLinear:mg,inverseLerp:gg,lerp:yo,damp:vg,pingpong:xg,smoothstep:bg,smootherstep:yg,randInt:wg,randFloat:Mg,randFloatSpread:Eg,seededRandom:Sg,degToRad:_g,radToDeg:Tg,isPowerOfTwo:Ag,ceilPowerOfTwo:Rg,floorPowerOfTwo:Cg,setQuaternionFromProperEuler:Pg,normalize:Ht,denormalize:Zi},ue=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Nn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},pt=class i{constructor(e,t,n,r,s,a,o,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,c,l)}set(e,t,n,r,s,a,o,c,l){let u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=c,u[6]=n,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],u=n[4],d=n[7],h=n[2],p=n[5],g=n[8],v=r[0],m=r[3],f=r[6],y=r[1],w=r[4],x=r[7],S=r[2],_=r[5],R=r[8];return s[0]=a*v+o*y+c*S,s[3]=a*m+o*w+c*_,s[6]=a*f+o*x+c*R,s[1]=l*v+u*y+d*S,s[4]=l*m+u*w+d*_,s[7]=l*f+u*x+d*R,s[2]=h*v+p*y+g*S,s[5]=h*m+p*w+g*_,s[8]=h*f+p*x+g*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*a*u-t*o*l-n*s*u+n*o*c+r*s*l-r*a*c}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=u*a-o*l,h=o*c-u*s,p=l*s-a*c,g=t*d+n*h+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/g;return e[0]=d*v,e[1]=(r*l-u*n)*v,e[2]=(o*n-r*a)*v,e[3]=h*v,e[4]=(u*t-r*c)*v,e[5]=(r*s-o*t)*v,e[6]=p*v,e[7]=(n*c-l*t)*v,e[8]=(a*t-n*s)*v,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){let c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-r*l,r*c,-r*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(ru.makeScale(e,t)),this}rotate(e){return this.premultiply(ru.makeRotation(-e)),this}translate(e,t){return this.premultiply(ru.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},ru=new pt;Bf={};St={enabled:!0,workingColorSpace:Ba,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===Dt&&(i.r=Ur(i.r),i.g=Ur(i.g),i.b=Ur(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Dt&&(i.r=ya(i.r),i.g=ya(i.g),i.b=ya(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===qn?wl:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};Vf=[.64,.33,.3,.6,.15,.06],Wf=[.2126,.7152,.0722],Gf=[.3127,.329],qf=new pt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xf=new pt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);St.define({[Ba]:{primaries:Vf,whitePoint:Gf,transfer:wl,toXYZ:qf,fromXYZ:Xf,luminanceCoefficients:Wf,workingColorSpaceConfig:{unpackColorSpace:Gt},outputColorSpaceConfig:{drawingBufferColorSpace:Gt}},[Gt]:{primaries:Vf,whitePoint:Gf,transfer:Dt,toXYZ:qf,fromXYZ:Xf,luminanceCoefficients:Wf,outputColorSpaceConfig:{drawingBufferColorSpace:Gt}}});Mh=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{$s===void 0&&($s=Ro("canvas")),$s.width=e.width,$s.height=e.height;let n=$s.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=$s}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Ro("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Ur(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ur(t[n]/255)*255):t[n]=Ur(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Fg=0,Rs=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Fg++}),this.uuid=fr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(su(r[a].image)):s.push(su(r[a]))}else s=su(r);n.url=s}return t||(e.images[this.uuid]=n),n}};kg=0,jn=class i extends ts{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=ur,r=ur,s=$t,a=oi,o=Si,c=Fr,l=i.DEFAULT_ANISOTROPY,u=qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:kg++}),this.uuid=fr(),this.name="",this.source=new Rs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ue(0,0),this.repeat=new ue(1,1),this.center=new ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new pt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==tm)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case es:e.x=e.x-Math.floor(e.x);break;case ur:e.x=e.x<0?0:1;break;case _o:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case es:e.y=e.y-Math.floor(e.y);break;case ur:e.y=e.y<0?0:1;break;case _o:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};jn.DEFAULT_IMAGE=null;jn.DEFAULT_MAPPING=tm;jn.DEFAULT_ANISOTROPY=1;nt=class i{constructor(e=0,t=0,n=0,r=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s,c=e.elements,l=c[0],u=c[4],d=c[8],h=c[1],p=c[5],g=c[9],v=c[2],m=c[6],f=c[10];if(Math.abs(u-h)<.01&&Math.abs(d-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let w=(l+1)/2,x=(p+1)/2,S=(f+1)/2,_=(u+h)/4,R=(d+v)/4,E=(g+m)/4;return w>x&&w>S?w<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(w),r=_/n,s=R/n):x>S?x<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(x),n=_/r,s=E/r):S<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(S),n=R/s,r=E/s),this.set(n,r,s,t),this}let y=Math.sqrt((m-g)*(m-g)+(d-v)*(d-v)+(h-u)*(h-u));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(d-v)/y,this.z=(h-u)/y,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Eh=class extends ts{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new nt(0,0,e,t),this.scissorTest=!1,this.viewport=new nt(0,0,e,t);let r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$t,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let s=new jn(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Rs(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},tn=class extends Eh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},el=class extends jn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Xn,this.minFilter=Xn,this.wrapR=ur,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Sh=class extends jn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Xn,this.minFilter=Xn,this.wrapR=ur,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ut=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let c=n[r+0],l=n[r+1],u=n[r+2],d=n[r+3],h=s[a+0],p=s[a+1],g=s[a+2],v=s[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d;return}if(o===1){e[t+0]=h,e[t+1]=p,e[t+2]=g,e[t+3]=v;return}if(d!==v||c!==h||l!==p||u!==g){let m=1-o,f=c*h+l*p+u*g+d*v,y=f>=0?1:-1,w=1-f*f;if(w>Number.EPSILON){let S=Math.sqrt(w),_=Math.atan2(S,f*y);m=Math.sin(m*_)/S,o=Math.sin(o*_)/S}let x=o*y;if(c=c*m+h*x,l=l*m+p*x,u=u*m+g*x,d=d*m+v*x,m===1-o){let S=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=S,l*=S,u*=S,d*=S}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,r,s,a){let o=n[r],c=n[r+1],l=n[r+2],u=n[r+3],d=s[a],h=s[a+1],p=s[a+2],g=s[a+3];return e[t]=o*g+u*d+c*p-l*h,e[t+1]=c*g+u*h+l*d-o*p,e[t+2]=l*g+u*p+o*h-c*d,e[t+3]=u*g-o*d-c*h-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),u=o(r/2),d=o(s/2),h=c(n/2),p=c(r/2),g=c(s/2);switch(a){case"XYZ":this._x=h*u*d+l*p*g,this._y=l*p*d-h*u*g,this._z=l*u*g+h*p*d,this._w=l*u*d-h*p*g;break;case"YXZ":this._x=h*u*d+l*p*g,this._y=l*p*d-h*u*g,this._z=l*u*g-h*p*d,this._w=l*u*d+h*p*g;break;case"ZXY":this._x=h*u*d-l*p*g,this._y=l*p*d+h*u*g,this._z=l*u*g+h*p*d,this._w=l*u*d-h*p*g;break;case"ZYX":this._x=h*u*d-l*p*g,this._y=l*p*d+h*u*g,this._z=l*u*g-h*p*d,this._w=l*u*d+h*p*g;break;case"YZX":this._x=h*u*d+l*p*g,this._y=l*p*d+h*u*g,this._z=l*u*g-h*p*d,this._w=l*u*d-h*p*g;break;case"XZY":this._x=h*u*d-l*p*g,this._y=l*p*d-h*u*g,this._z=l*u*g+h*p*d,this._w=l*u*d+h*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],c=t[9],l=t[2],u=t[6],d=t[10],h=n+o+d;if(h>0){let p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-c)*p,this._y=(s-l)*p,this._z=(a-r)*p}else if(n>o&&n>d){let p=2*Math.sqrt(1+n-o-d);this._w=(u-c)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+l)/p}else if(o>d){let p=2*Math.sqrt(1+o-n-d);this._w=(s-l)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(c+u)/p}else{let p=2*Math.sqrt(1+d-n-o);this._w=(a-r)/p,this._x=(s+l)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Nn(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+a*o+r*l-s*c,this._y=r*u+a*c+s*o-n*l,this._z=s*u+a*l+n*c-r*o,this._w=a*u-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,r=this._y,s=this._z,a=this._w,o=a*e._w+n*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;let c=1-o*o;if(c<=Number.EPSILON){let p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}let l=Math.sqrt(c),u=Math.atan2(l,o),d=Math.sin((1-t)*u)/l,h=Math.sin(t*u)/l;return this._w=a*d+this._w*h,this._x=n*d+this._x*h,this._y=r*d+this._y*h,this._z=s*d+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},T=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(jf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(jf.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*r-o*n),u=2*(o*t-s*r),d=2*(s*n-a*t);return this.x=t+c*l+a*d-o*u,this.y=n+c*u+o*l-s*d,this.z=r+c*d+s*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,c=t.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return au.copy(this).projectOnVector(e),this.sub(au)}reflect(e){return this.sub(au.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Nn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},au=new T,jf=new Ut,Di=class{constructor(e=new T(1/0,1/0,1/0),t=new T(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ji.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ji.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ji.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ji):ji.fromBufferAttribute(s,a),ji.applyMatrix4(e.matrixWorld),this.expandByPoint(ji);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),fc.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),fc.copy(n.boundingBox)),fc.applyMatrix4(e.matrixWorld),this.union(fc)}let r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ji),ji.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ro),pc.subVectors(this.max,ro),ea.subVectors(e.a,ro),ta.subVectors(e.b,ro),na.subVectors(e.c,ro),qr.subVectors(ta,ea),Xr.subVectors(na,ta),vs.subVectors(ea,na);let t=[0,-qr.z,qr.y,0,-Xr.z,Xr.y,0,-vs.z,vs.y,qr.z,0,-qr.x,Xr.z,0,-Xr.x,vs.z,0,-vs.x,-qr.y,qr.x,0,-Xr.y,Xr.x,0,-vs.y,vs.x,0];return!ou(t,ea,ta,na,pc)||(t=[1,0,0,0,1,0,0,0,1],!ou(t,ea,ta,na,pc))?!1:(mc.crossVectors(qr,Xr),t=[mc.x,mc.y,mc.z],ou(t,ea,ta,na,pc))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ji).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ji).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ar[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ar[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ar[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ar[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ar[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ar[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ar[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ar[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ar),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Ar=[new T,new T,new T,new T,new T,new T,new T,new T],ji=new T,fc=new Di,ea=new T,ta=new T,na=new T,qr=new T,Xr=new T,vs=new T,ro=new T,pc=new T,mc=new T,xs=new T;Ng=new Di,so=new T,cu=new T,An=class{constructor(e=new T,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Ng.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;so.subVectors(e,this.center);let t=so.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(so,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(cu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(so.copy(e.center).add(cu)),this.expandByPoint(so.copy(e.center).sub(cu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Rr=new T,lu=new T,gc=new T,jr=new T,uu=new T,vc=new T,hu=new T,Aa=class{constructor(e=new T,t=new T(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Rr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Rr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Rr.copy(this.origin).addScaledVector(this.direction,t),Rr.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){lu.copy(e).add(t).multiplyScalar(.5),gc.copy(t).sub(e).normalize(),jr.copy(this.origin).sub(lu);let s=e.distanceTo(t)*.5,a=-this.direction.dot(gc),o=jr.dot(this.direction),c=-jr.dot(gc),l=jr.lengthSq(),u=Math.abs(1-a*a),d,h,p,g;if(u>0)if(d=a*c-o,h=a*o-c,g=s*u,d>=0)if(h>=-g)if(h<=g){let v=1/u;d*=v,h*=v,p=d*(d+a*h+2*o)+h*(a*d+h+2*c)+l}else h=s,d=Math.max(0,-(a*h+o)),p=-d*d+h*(h+2*c)+l;else h=-s,d=Math.max(0,-(a*h+o)),p=-d*d+h*(h+2*c)+l;else h<=-g?(d=Math.max(0,-(-a*s+o)),h=d>0?-s:Math.min(Math.max(-s,-c),s),p=-d*d+h*(h+2*c)+l):h<=g?(d=0,h=Math.min(Math.max(-s,-c),s),p=h*(h+2*c)+l):(d=Math.max(0,-(a*s+o)),h=d>0?s:Math.min(Math.max(-s,-c),s),p=-d*d+h*(h+2*c)+l);else h=a>0?-s:s,d=Math.max(0,-(a*h+o)),p=-d*d+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(lu).addScaledVector(gc,h),p}intersectSphere(e,t){Rr.subVectors(e.center,this.origin);let n=Rr.dot(this.direction),r=Rr.dot(Rr)-n*n,s=e.radius*e.radius;if(r>s)return null;let a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,c,l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return l>=0?(n=(e.min.x-h.x)*l,r=(e.max.x-h.x)*l):(n=(e.max.x-h.x)*l,r=(e.min.x-h.x)*l),u>=0?(s=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(e.min.z-h.z)*d,c=(e.max.z-h.z)*d):(o=(e.max.z-h.z)*d,c=(e.min.z-h.z)*d),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Rr)!==null}intersectTriangle(e,t,n,r,s){uu.subVectors(t,e),vc.subVectors(n,e),hu.crossVectors(uu,vc);let a=this.direction.dot(hu),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;jr.subVectors(this.origin,e);let c=o*this.direction.dot(vc.crossVectors(jr,vc));if(c<0)return null;let l=o*this.direction.dot(uu.cross(jr));if(l<0||c+l>a)return null;let u=-o*jr.dot(hu);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},et=class i{constructor(e,t,n,r,s,a,o,c,l,u,d,h,p,g,v,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,c,l,u,d,h,p,g,v,m)}set(e,t,n,r,s,a,o,c,l,u,d,h,p,g,v,m){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=r,f[1]=s,f[5]=a,f[9]=o,f[13]=c,f[2]=l,f[6]=u,f[10]=d,f[14]=h,f[3]=p,f[7]=g,f[11]=v,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,r=1/ia.setFromMatrixColumn(e,0).length(),s=1/ia.setFromMatrixColumn(e,1).length(),a=1/ia.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){let h=a*u,p=a*d,g=o*u,v=o*d;t[0]=c*u,t[4]=-c*d,t[8]=l,t[1]=p+g*l,t[5]=h-v*l,t[9]=-o*c,t[2]=v-h*l,t[6]=g+p*l,t[10]=a*c}else if(e.order==="YXZ"){let h=c*u,p=c*d,g=l*u,v=l*d;t[0]=h+v*o,t[4]=g*o-p,t[8]=a*l,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=p*o-g,t[6]=v+h*o,t[10]=a*c}else if(e.order==="ZXY"){let h=c*u,p=c*d,g=l*u,v=l*d;t[0]=h-v*o,t[4]=-a*d,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*u,t[9]=v-h*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let h=a*u,p=a*d,g=o*u,v=o*d;t[0]=c*u,t[4]=g*l-p,t[8]=h*l+v,t[1]=c*d,t[5]=v*l+h,t[9]=p*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let h=a*c,p=a*l,g=o*c,v=o*l;t[0]=c*u,t[4]=v-h*d,t[8]=g*d+p,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-l*u,t[6]=p*d+g,t[10]=h-v*d}else if(e.order==="XZY"){let h=a*c,p=a*l,g=o*c,v=o*l;t[0]=c*u,t[4]=-d,t[8]=l*u,t[1]=h*d+v,t[5]=a*u,t[9]=p*d-g,t[2]=g*d-p,t[6]=o*u,t[10]=v*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(zg,e,Og)}lookAt(e,t,n){let r=this.elements;return wi.subVectors(e,t),wi.lengthSq()===0&&(wi.z=1),wi.normalize(),Kr.crossVectors(n,wi),Kr.lengthSq()===0&&(Math.abs(n.z)===1?wi.x+=1e-4:wi.z+=1e-4,wi.normalize(),Kr.crossVectors(n,wi)),Kr.normalize(),xc.crossVectors(wi,Kr),r[0]=Kr.x,r[4]=xc.x,r[8]=wi.x,r[1]=Kr.y,r[5]=xc.y,r[9]=wi.y,r[2]=Kr.z,r[6]=xc.z,r[10]=wi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],u=n[1],d=n[5],h=n[9],p=n[13],g=n[2],v=n[6],m=n[10],f=n[14],y=n[3],w=n[7],x=n[11],S=n[15],_=r[0],R=r[4],E=r[8],M=r[12],b=r[1],C=r[5],F=r[9],U=r[13],k=r[2],H=r[6],D=r[10],z=r[14],N=r[3],V=r[7],ee=r[11],ce=r[15];return s[0]=a*_+o*b+c*k+l*N,s[4]=a*R+o*C+c*H+l*V,s[8]=a*E+o*F+c*D+l*ee,s[12]=a*M+o*U+c*z+l*ce,s[1]=u*_+d*b+h*k+p*N,s[5]=u*R+d*C+h*H+p*V,s[9]=u*E+d*F+h*D+p*ee,s[13]=u*M+d*U+h*z+p*ce,s[2]=g*_+v*b+m*k+f*N,s[6]=g*R+v*C+m*H+f*V,s[10]=g*E+v*F+m*D+f*ee,s[14]=g*M+v*U+m*z+f*ce,s[3]=y*_+w*b+x*k+S*N,s[7]=y*R+w*C+x*H+S*V,s[11]=y*E+w*F+x*D+S*ee,s[15]=y*M+w*U+x*z+S*ce,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],d=e[6],h=e[10],p=e[14],g=e[3],v=e[7],m=e[11],f=e[15];return g*(+s*c*d-r*l*d-s*o*h+n*l*h+r*o*p-n*c*p)+v*(+t*c*p-t*l*h+s*a*h-r*a*p+r*l*u-s*c*u)+m*(+t*l*d-t*o*p-s*a*d+n*a*p+s*o*u-n*l*u)+f*(-r*o*u-t*c*d+t*o*h+r*a*d-n*a*h+n*c*u)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=e[9],h=e[10],p=e[11],g=e[12],v=e[13],m=e[14],f=e[15],y=d*m*l-v*h*l+v*c*p-o*m*p-d*c*f+o*h*f,w=g*h*l-u*m*l-g*c*p+a*m*p+u*c*f-a*h*f,x=u*v*l-g*d*l+g*o*p-a*v*p-u*o*f+a*d*f,S=g*d*c-u*v*c-g*o*h+a*v*h+u*o*m-a*d*m,_=t*y+n*w+r*x+s*S;if(_===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/_;return e[0]=y*R,e[1]=(v*h*s-d*m*s-v*r*p+n*m*p+d*r*f-n*h*f)*R,e[2]=(o*m*s-v*c*s+v*r*l-n*m*l-o*r*f+n*c*f)*R,e[3]=(d*c*s-o*h*s-d*r*l+n*h*l+o*r*p-n*c*p)*R,e[4]=w*R,e[5]=(u*m*s-g*h*s+g*r*p-t*m*p-u*r*f+t*h*f)*R,e[6]=(g*c*s-a*m*s-g*r*l+t*m*l+a*r*f-t*c*f)*R,e[7]=(a*h*s-u*c*s+u*r*l-t*h*l-a*r*p+t*c*p)*R,e[8]=x*R,e[9]=(g*d*s-u*v*s-g*n*p+t*v*p+u*n*f-t*d*f)*R,e[10]=(a*v*s-g*o*s+g*n*l-t*v*l-a*n*f+t*o*f)*R,e[11]=(u*o*s-a*d*s-u*n*l+t*d*l+a*n*p-t*o*p)*R,e[12]=S*R,e[13]=(u*v*r-g*d*r+g*n*h-t*v*h-u*n*m+t*d*m)*R,e[14]=(g*o*r-a*v*r-g*n*c+t*v*c+a*n*m-t*o*m)*R,e[15]=(a*d*r-u*o*r+u*n*c-t*d*c-a*n*h+t*o*h)*R,this}scale(e){let t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,c=e.z,l=s*a,u=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,u*o+n,u*c-r*a,0,l*c-r*o,u*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,s=t._x,a=t._y,o=t._z,c=t._w,l=s+s,u=a+a,d=o+o,h=s*l,p=s*u,g=s*d,v=a*u,m=a*d,f=o*d,y=c*l,w=c*u,x=c*d,S=n.x,_=n.y,R=n.z;return r[0]=(1-(v+f))*S,r[1]=(p+x)*S,r[2]=(g-w)*S,r[3]=0,r[4]=(p-x)*_,r[5]=(1-(h+f))*_,r[6]=(m+y)*_,r[7]=0,r[8]=(g+w)*R,r[9]=(m-y)*R,r[10]=(1-(h+v))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements,s=ia.set(r[0],r[1],r[2]).length(),a=ia.set(r[4],r[5],r[6]).length(),o=ia.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Ki.copy(this);let l=1/s,u=1/a,d=1/o;return Ki.elements[0]*=l,Ki.elements[1]*=l,Ki.elements[2]*=l,Ki.elements[4]*=u,Ki.elements[5]*=u,Ki.elements[6]*=u,Ki.elements[8]*=d,Ki.elements[9]*=d,Ki.elements[10]*=d,t.setFromRotationMatrix(Ki),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,r,s,a,o=Dr){let c=this.elements,l=2*s/(t-e),u=2*s/(n-r),d=(t+e)/(t-e),h=(n+r)/(n-r),p,g;if(o===Dr)p=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===$c)p=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=Dr){let c=this.elements,l=1/(t-e),u=1/(n-r),d=1/(a-s),h=(t+e)*l,p=(n+r)*u,g,v;if(o===Dr)g=(a+s)*d,v=-2*d;else if(o===$c)g=s*d,v=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},ia=new T,Ki=new et,zg=new T(0,0,0),Og=new T(1,1,1),Kr=new T,xc=new T,wi=new T,Kf=new et,Yf=new Ut,Rn=class i{constructor(e=0,t=0,n=0,r=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],u=r[9],d=r[2],h=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(Nn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Nn(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Nn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Nn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Nn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Nn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Kf.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Kf,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Yf.setFromEuler(this),this.setFromQuaternion(Yf,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Rn.DEFAULT_ORDER="XYZ";Co=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Hg=0,Zf=new T,ra=new Ut,Cr=new et,bc=new T,ao=new T,Bg=new T,Vg=new Ut,Jf=new T(1,0,0),Qf=new T(0,1,0),$f=new T(0,0,1),ep={type:"added"},Wg={type:"removed"},sa={type:"childadded",child:null},du={type:"childremoved",child:null},yn=class i extends ts{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hg++}),this.uuid=fr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new T,t=new Rn,n=new Ut,r=new T(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new et},normalMatrix:{value:new pt}}),this.matrix=new et,this.matrixWorld=new et,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Co,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ra.setFromAxisAngle(e,t),this.quaternion.multiply(ra),this}rotateOnWorldAxis(e,t){return ra.setFromAxisAngle(e,t),this.quaternion.premultiply(ra),this}rotateX(e){return this.rotateOnAxis(Jf,e)}rotateY(e){return this.rotateOnAxis(Qf,e)}rotateZ(e){return this.rotateOnAxis($f,e)}translateOnAxis(e,t){return Zf.copy(e).applyQuaternion(this.quaternion),this.position.add(Zf.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Jf,e)}translateY(e){return this.translateOnAxis(Qf,e)}translateZ(e){return this.translateOnAxis($f,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Cr.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?bc.copy(e):bc.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),ao.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cr.lookAt(ao,bc,this.up):Cr.lookAt(bc,ao,this.up),this.quaternion.setFromRotationMatrix(Cr),r&&(Cr.extractRotation(r.matrixWorld),ra.setFromRotationMatrix(Cr),this.quaternion.premultiply(ra.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ep),sa.child=e,this.dispatchEvent(sa),sa.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Wg),du.child=e,this.dispatchEvent(du),du.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Cr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Cr.multiply(e.parent.matrixWorld)),e.applyMatrix4(Cr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ep),sa.child=e,this.dispatchEvent(sa),sa.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ao,e,Bg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ao,Vg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){let d=c[l];s(e.shapes,d)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(e.materials,this.material[c]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];r.animations.push(s(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),d=a(e.shapes),h=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){let c=[];for(let l in o){let u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let r=e.children[n];this.add(r.clone())}return this}};yn.DEFAULT_UP=new T(0,1,0);yn.DEFAULT_MATRIX_AUTO_UPDATE=!0;yn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;Yi=new T,Pr=new T,fu=new T,Lr=new T,aa=new T,oa=new T,tp=new T,pu=new T,mu=new T,gu=new T,vu=new nt,xu=new nt,bu=new nt,Jr=class i{constructor(e=new T,t=new T,n=new T){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Yi.subVectors(e,t),r.cross(Yi);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){Yi.subVectors(r,t),Pr.subVectors(n,t),fu.subVectors(e,t);let a=Yi.dot(Yi),o=Yi.dot(Pr),c=Yi.dot(fu),l=Pr.dot(Pr),u=Pr.dot(fu),d=a*l-o*o;if(d===0)return s.set(0,0,0),null;let h=1/d,p=(l*c-o*u)*h,g=(a*u-o*c)*h;return s.set(1-p-g,g,p)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Lr)===null?!1:Lr.x>=0&&Lr.y>=0&&Lr.x+Lr.y<=1}static getInterpolation(e,t,n,r,s,a,o,c){return this.getBarycoord(e,t,n,r,Lr)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Lr.x),c.addScaledVector(a,Lr.y),c.addScaledVector(o,Lr.z),c)}static getInterpolatedAttribute(e,t,n,r,s,a){return vu.setScalar(0),xu.setScalar(0),bu.setScalar(0),vu.fromBufferAttribute(e,t),xu.fromBufferAttribute(e,n),bu.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(vu,s.x),a.addScaledVector(xu,s.y),a.addScaledVector(bu,s.z),a}static isFrontFacing(e,t,n,r){return Yi.subVectors(n,t),Pr.subVectors(e,t),Yi.cross(Pr).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Yi.subVectors(this.c,this.b),Pr.subVectors(this.a,this.b),Yi.cross(Pr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return i.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,s=this.c,a,o;aa.subVectors(r,n),oa.subVectors(s,n),pu.subVectors(e,n);let c=aa.dot(pu),l=oa.dot(pu);if(c<=0&&l<=0)return t.copy(n);mu.subVectors(e,r);let u=aa.dot(mu),d=oa.dot(mu);if(u>=0&&d<=u)return t.copy(r);let h=c*d-u*l;if(h<=0&&c>=0&&u<=0)return a=c/(c-u),t.copy(n).addScaledVector(aa,a);gu.subVectors(e,s);let p=aa.dot(gu),g=oa.dot(gu);if(g>=0&&p<=g)return t.copy(s);let v=p*l-c*g;if(v<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(oa,o);let m=u*g-p*d;if(m<=0&&d-u>=0&&p-g>=0)return tp.subVectors(s,r),o=(d-u)/(d-u+(p-g)),t.copy(r).addScaledVector(tp,o);let f=1/(m+v+h);return a=v*f,o=h*f,t.copy(n).addScaledVector(aa,a).addScaledVector(oa,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},vm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yr={h:0,s:0,l:0},yc={h:0,s:0,l:0};de=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Gt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,St.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=St.workingColorSpace){return this.r=e,this.g=t,this.b=n,St.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=St.workingColorSpace){if(e=bd(e,1),t=Nn(t,0,1),n=Nn(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=yu(a,s,e+1/3),this.g=yu(a,s,e),this.b=yu(a,s,e-1/3)}return St.toWorkingColorSpace(this,r),this}setStyle(e,t=Gt){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Gt){let n=vm[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ur(e.r),this.g=Ur(e.g),this.b=Ur(e.b),this}copyLinearToSRGB(e){return this.r=ya(e.r),this.g=ya(e.g),this.b=ya(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Gt){return St.fromWorkingColorSpace(Qn.copy(this),e),Math.round(Nn(Qn.r*255,0,255))*65536+Math.round(Nn(Qn.g*255,0,255))*256+Math.round(Nn(Qn.b*255,0,255))}getHexString(e=Gt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=St.workingColorSpace){St.fromWorkingColorSpace(Qn.copy(this),t);let n=Qn.r,r=Qn.g,s=Qn.b,a=Math.max(n,r,s),o=Math.min(n,r,s),c,l,u=(o+a)/2;if(o===a)c=0,l=0;else{let d=a-o;switch(l=u<=.5?d/(a+o):d/(2-a-o),a){case n:c=(r-s)/d+(r<s?6:0);break;case r:c=(s-n)/d+2;break;case s:c=(n-r)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=St.workingColorSpace){return St.fromWorkingColorSpace(Qn.copy(this),t),e.r=Qn.r,e.g=Qn.g,e.b=Qn.b,e}getStyle(e=Gt){St.fromWorkingColorSpace(Qn.copy(this),e);let t=Qn.r,n=Qn.g,r=Qn.b;return e!==Gt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Yr),this.setHSL(Yr.h+e,Yr.s+t,Yr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Yr),e.getHSL(yc);let n=yo(Yr.h,yc.h,t),r=yo(Yr.s,yc.s,t),s=yo(Yr.l,yc.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Qn=new de;de.NAMES=vm;Gg=0,mr=class extends ts{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Gg++}),this.uuid=fr(),this.name="",this.blending=Qr,this.side=pr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Nu,this.blendDst=zu,this.blendEquation=Ss,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new de(0,0,0),this.blendAlpha=0,this.depthFunc=Ma,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Of,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Qs,this.stencilZFail=Qs,this.stencilZPass=Qs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Qr&&(n.blending=this.blending),this.side!==pr&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Nu&&(n.blendSrc=this.blendSrc),this.blendDst!==zu&&(n.blendDst=this.blendDst),this.blendEquation!==Ss&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ma&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Of&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Qs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Qs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Qs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){let a=[];for(let o in s){let c=s[o];delete c.metadata,a.push(c)}return a}if(t){let s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},ci=class extends mr{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new de(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.combine=em,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},bn=new T,wc=new ue,qe=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=wh,this.updateRanges=[],this.gpuType=hr,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)wc.fromBufferAttribute(this,t),wc.applyMatrix3(e),this.setXY(t,wc.x,wc.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)bn.fromBufferAttribute(this,t),bn.applyMatrix3(e),this.setXYZ(t,bn.x,bn.y,bn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)bn.fromBufferAttribute(this,t),bn.applyMatrix4(e),this.setXYZ(t,bn.x,bn.y,bn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)bn.fromBufferAttribute(this,t),bn.applyNormalMatrix(e),this.setXYZ(t,bn.x,bn.y,bn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)bn.fromBufferAttribute(this,t),bn.transformDirection(e),this.setXYZ(t,bn.x,bn.y,bn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Zi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ht(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Zi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Zi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Zi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Zi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),r=Ht(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),r=Ht(r,this.array),s=Ht(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==wh&&(e.usage=this.usage),e}},tl=class extends qe{constructor(e,t,n){super(new Uint16Array(e),t,n)}},nl=class extends qe{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Ye=class extends qe{constructor(e,t,n){super(new Float32Array(e),t,n)}},qg=0,Ii=new et,wu=new yn,ca=new T,Mi=new Di,oo=new Di,kn=new T,Xe=class i extends ts{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:qg++}),this.uuid=fr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(gm(e)?nl:tl)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new pt().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ii.makeRotationFromQuaternion(e),this.applyMatrix4(Ii),this}rotateX(e){return Ii.makeRotationX(e),this.applyMatrix4(Ii),this}rotateY(e){return Ii.makeRotationY(e),this.applyMatrix4(Ii),this}rotateZ(e){return Ii.makeRotationZ(e),this.applyMatrix4(Ii),this}translate(e,t,n){return Ii.makeTranslation(e,t,n),this.applyMatrix4(Ii),this}scale(e,t,n){return Ii.makeScale(e,t,n),this.applyMatrix4(Ii),this}lookAt(e){return wu.lookAt(e),wu.updateMatrix(),this.applyMatrix4(wu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ca).negate(),this.translate(ca.x,ca.y,ca.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let r=0,s=e.length;r<s;r++){let a=e[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ye(n,3))}else{for(let n=0,r=t.count;n<r;n++){let s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Di);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new T(-1/0,-1/0,-1/0),new T(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){let s=t[n];Mi.setFromBufferAttribute(s),this.morphTargetsRelative?(kn.addVectors(this.boundingBox.min,Mi.min),this.boundingBox.expandByPoint(kn),kn.addVectors(this.boundingBox.max,Mi.max),this.boundingBox.expandByPoint(kn)):(this.boundingBox.expandByPoint(Mi.min),this.boundingBox.expandByPoint(Mi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new An);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new T,1/0);return}if(e){let n=this.boundingSphere.center;if(Mi.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];oo.setFromBufferAttribute(o),this.morphTargetsRelative?(kn.addVectors(Mi.min,oo.min),Mi.expandByPoint(kn),kn.addVectors(Mi.max,oo.max),Mi.expandByPoint(kn)):(Mi.expandByPoint(oo.min),Mi.expandByPoint(oo.max))}Mi.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)kn.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(kn));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)kn.fromBufferAttribute(o,l),c&&(ca.fromBufferAttribute(e,l),kn.add(ca)),r=Math.max(r,n.distanceToSquared(kn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qe(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],c=[];for(let E=0;E<n.count;E++)o[E]=new T,c[E]=new T;let l=new T,u=new T,d=new T,h=new ue,p=new ue,g=new ue,v=new T,m=new T;function f(E,M,b){l.fromBufferAttribute(n,E),u.fromBufferAttribute(n,M),d.fromBufferAttribute(n,b),h.fromBufferAttribute(s,E),p.fromBufferAttribute(s,M),g.fromBufferAttribute(s,b),u.sub(l),d.sub(l),p.sub(h),g.sub(h);let C=1/(p.x*g.y-g.x*p.y);isFinite(C)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(C),m.copy(d).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(C),o[E].add(v),o[M].add(v),o[b].add(v),c[E].add(m),c[M].add(m),c[b].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let E=0,M=y.length;E<M;++E){let b=y[E],C=b.start,F=b.count;for(let U=C,k=C+F;U<k;U+=3)f(e.getX(U+0),e.getX(U+1),e.getX(U+2))}let w=new T,x=new T,S=new T,_=new T;function R(E){S.fromBufferAttribute(r,E),_.copy(S);let M=o[E];w.copy(M),w.sub(S.multiplyScalar(S.dot(M))).normalize(),x.crossVectors(_,M);let C=x.dot(c[E])<0?-1:1;a.setXYZW(E,w.x,w.y,w.z,C)}for(let E=0,M=y.length;E<M;++E){let b=y[E],C=b.start,F=b.count;for(let U=C,k=C+F;U<k;U+=3)R(e.getX(U+0)),R(e.getX(U+1)),R(e.getX(U+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new qe(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,p=n.count;h<p;h++)n.setXYZ(h,0,0,0);let r=new T,s=new T,a=new T,o=new T,c=new T,l=new T,u=new T,d=new T;if(e)for(let h=0,p=e.count;h<p;h+=3){let g=e.getX(h+0),v=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),o.add(u),c.add(u),l.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,p=t.count;h<p;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)kn.fromBufferAttribute(e,t),kn.normalize(),e.setXYZ(t,kn.x,kn.y,kn.z)}toNonIndexed(){function e(o,c){let l=o.array,u=o.itemSize,d=o.normalized,h=new l.constructor(c.length*u),p=0,g=0;for(let v=0,m=c.length;v<m;v++){o.isInterleavedBufferAttribute?p=c[v]*o.data.stride+o.offset:p=c[v]*u;for(let f=0;f<u;f++)h[g++]=l[p++]}return new qe(h,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,r=this.attributes;for(let o in r){let c=r[o],l=e(c,n);t.setAttribute(o,l)}let s=this.morphAttributes;for(let o in s){let c=[],l=s[o];for(let u=0,d=l.length;u<d;u++){let h=l[u],p=e(h,n);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let r={},s=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],u=[];for(let d=0,h=l.length;d<h;d++){let p=l[d];u.push(p.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let r=e.attributes;for(let l in r){let u=r[l];this.setAttribute(l,u.clone(t))}let s=e.morphAttributes;for(let l in s){let u=[],d=s[l];for(let h=0,p=d.length;h<p;h++)u.push(d[h].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let l=0,u=a.length;l<u;l++){let d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},np=new et,bs=new Aa,Mc=new An,ip=new T,Ec=new T,Sc=new T,_c=new T,Mu=new T,Tc=new T,rp=new T,Ac=new T,xe=class extends yn{constructor(e=new Xe,t=new ci){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){let o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(s&&o){Tc.set(0,0,0);for(let c=0,l=s.length;c<l;c++){let u=o[c],d=s[c];u!==0&&(Mu.fromBufferAttribute(d,e),a?Tc.addScaledVector(Mu,u):Tc.addScaledVector(Mu.sub(t),u))}t.add(Tc)}return t}raycast(e,t){let n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Mc.copy(n.boundingSphere),Mc.applyMatrix4(s),bs.copy(e.ray).recast(e.near),!(Mc.containsPoint(bs.origin)===!1&&(bs.intersectSphere(Mc,ip)===null||bs.origin.distanceToSquared(ip)>(e.far-e.near)**2))&&(np.copy(s).invert(),bs.copy(e.ray).applyMatrix4(np),!(n.boundingBox!==null&&bs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,bs)))}_computeIntersections(e,t,n){let r,s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,h=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=h.length;g<v;g++){let m=h[g],f=a[m.materialIndex],y=Math.max(m.start,p.start),w=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let x=y,S=w;x<S;x+=3){let _=o.getX(x),R=o.getX(x+1),E=o.getX(x+2);r=Rc(this,f,e,n,l,u,d,_,R,E),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,p.start),v=Math.min(o.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){let y=o.getX(m),w=o.getX(m+1),x=o.getX(m+2);r=Rc(this,a,e,n,l,u,d,y,w,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=h.length;g<v;g++){let m=h[g],f=a[m.materialIndex],y=Math.max(m.start,p.start),w=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let x=y,S=w;x<S;x+=3){let _=x,R=x+1,E=x+2;r=Rc(this,f,e,n,l,u,d,_,R,E),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,p.start),v=Math.min(c.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){let y=m,w=m+1,x=m+2;r=Rc(this,a,e,n,l,u,d,y,w,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}};ei=class i extends Xe{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};let o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);let c=[],l=[],u=[],d=[],h=0,p=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,r,a,2),g("x","z","y",1,-1,e,n,-t,r,a,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new Ye(l,3)),this.setAttribute("normal",new Ye(u,3)),this.setAttribute("uv",new Ye(d,2));function g(v,m,f,y,w,x,S,_,R,E,M){let b=x/R,C=S/E,F=x/2,U=S/2,k=_/2,H=R+1,D=E+1,z=0,N=0,V=new T;for(let ee=0;ee<D;ee++){let ce=ee*C-U;for(let Y=0;Y<H;Y++){let be=Y*b-F;V[v]=be*y,V[m]=ce*w,V[f]=k,l.push(V.x,V.y,V.z),V[v]=0,V[m]=0,V[f]=_>0?1:-1,u.push(V.x,V.y,V.z),d.push(Y/R),d.push(1-ee/E),z+=1}}for(let ee=0;ee<E;ee++)for(let ce=0;ce<R;ce++){let Y=h+ce+H*ee,be=h+ce+H*(ee+1),Z=h+(ce+1)+H*(ee+1),ae=h+(ce+1)+H*ee;c.push(Y,be,ae),c.push(be,Z,ae),N+=6}o.addGroup(p,N,M),p+=N,h+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};Ni={clone:Ra,merge:ai},Kg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Yg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ye=class extends mr{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Kg,this.fragmentShader=Yg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ra(e.uniforms),this.uniformsGroups=jg(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},il=class extends yn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new et,this.projectionMatrix=new et,this.projectionMatrixInverse=new et,this.coordinateSystem=Dr}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Zr=new T,sp=new ue,ap=new ue,Tn=class extends il{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ao*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(bo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ao*2*Math.atan(Math.tan(bo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Zr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Zr.x,Zr.y).multiplyScalar(-e/Zr.z),Zr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Zr.x,Zr.y).multiplyScalar(-e/Zr.z)}getViewSize(e,t){return this.getViewBounds(e,sp,ap),t.subVectors(ap,sp)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(bo*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,t-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},la=-90,ua=1,Cs=class extends yn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Tn(la,ua,e,t);r.layers=this.layers,this.add(r);let s=new Tn(la,ua,e,t);s.layers=this.layers,this.add(s);let a=new Tn(la,ua,e,t);a.layers=this.layers,this.add(a);let o=new Tn(la,ua,e,t);o.layers=this.layers,this.add(o);let c=new Tn(la,ua,e,t);c.layers=this.layers,this.add(c);let l=new Tn(la,ua,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,c]=t;for(let l of t)this.remove(l);if(e===Dr)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===$c)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,c,l,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,c),e.setRenderTarget(n,4,r),e.render(t,l),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,r),e.render(t,u),e.setRenderTarget(d,h,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Ca=class extends jn{constructor(e,t,n,r,s,a,o,c,l,u){e=e!==void 0?e:[],t=t!==void 0?t:Ea,super(e,t,n,r,s,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ns=class extends tn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Ca(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:$t}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new ei(5,5,5),s=new ye({name:"CubemapFromEquirect",uniforms:Ra(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:dr});s.uniforms.tEquirect.value=t;let a=new xe(r,s),o=t.minFilter;return t.minFilter===oi&&(t.minFilter=$t),new Cs(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,r){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}},Eu=new T,Zg=new T,Jg=new pt,Ei=class{constructor(e=new T(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Eu.subVectors(n,t).cross(Zg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Eu),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Jg.getNormalMatrix(e),r=this.coplanarPoint(Eu).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},ys=new An,Cc=new T,Ps=class{constructor(e=new Ei,t=new Ei,n=new Ei,r=new Ei,s=new Ei,a=new Ei){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Dr){let n=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],c=r[3],l=r[4],u=r[5],d=r[6],h=r[7],p=r[8],g=r[9],v=r[10],m=r[11],f=r[12],y=r[13],w=r[14],x=r[15];if(n[0].setComponents(c-s,h-l,m-p,x-f).normalize(),n[1].setComponents(c+s,h+l,m+p,x+f).normalize(),n[2].setComponents(c+a,h+u,m+g,x+y).normalize(),n[3].setComponents(c-a,h-u,m-g,x-y).normalize(),n[4].setComponents(c-o,h-d,m-v,x-w).normalize(),t===Dr)n[5].setComponents(c+o,h+d,m+v,x+w).normalize();else if(t===$c)n[5].setComponents(o,d,v,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ys.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ys.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ys)}intersectsSprite(e){return ys.center.set(0,0,0),ys.radius=.7071067811865476,ys.applyMatrix4(e.matrixWorld),this.intersectsSphere(ys)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Cc.x=r.normal.x>0?e.max.x:e.min.x,Cc.y=r.normal.y>0?e.max.y:e.min.y,Cc.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Cc)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};Ft=class i extends Xe{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let s=e/2,a=t/2,o=Math.floor(n),c=Math.floor(r),l=o+1,u=c+1,d=e/o,h=t/c,p=[],g=[],v=[],m=[];for(let f=0;f<u;f++){let y=f*h-a;for(let w=0;w<l;w++){let x=w*d-s;g.push(x,-y,0),v.push(0,0,1),m.push(w/o),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let y=0;y<o;y++){let w=y+l*f,x=y+l*(f+1),S=y+1+l*(f+1),_=y+1+l*f;p.push(w,x,_),p.push(x,S,_)}this.setIndex(p),this.setAttribute("position",new Ye(g,3)),this.setAttribute("normal",new Ye(v,3)),this.setAttribute("uv",new Ye(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},$g=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ev=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,tv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,nv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,iv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,rv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,sv=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,av=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ov=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,cv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,lv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,uv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hv=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,dv=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,fv=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,pv=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,mv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,gv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,xv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,bv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,yv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,wv=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Mv=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ev=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Sv=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,_v=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Tv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Av=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Rv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Cv="gl_FragColor = linearToOutputTexel( gl_FragColor );",Pv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Lv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Iv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Dv=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Uv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Fv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,kv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Nv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,zv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ov=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hv=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Bv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Wv=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Gv=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,qv=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Xv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,jv=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Kv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Yv=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Zv=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Jv=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Qv=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,$v=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ex=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,tx=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,nx=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ix=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rx=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,sx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ax=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ox=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,cx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ux=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,hx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,dx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,fx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,px=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,mx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,vx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,xx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,wx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Mx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ex=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Sx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_x=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Tx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ax=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Rx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Cx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Px=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Lx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ix=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Dx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ux=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Fx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,kx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Nx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,zx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ox=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Hx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Bx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Vx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Wx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Gx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Xx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,jx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Kx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Yx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Zx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Jx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Qx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$x=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,tb=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ib=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,sb=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ab=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ob=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,cb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,lb=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ub=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hb=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,db=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,fb=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pb=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mb=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gb=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,vb=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xb=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,bb=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,yb=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wb=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mb=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Eb=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sb=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_b=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tb=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ab=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Rb=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Cb=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Pb=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Lb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,gt={alphahash_fragment:$g,alphahash_pars_fragment:ev,alphamap_fragment:tv,alphamap_pars_fragment:nv,alphatest_fragment:iv,alphatest_pars_fragment:rv,aomap_fragment:sv,aomap_pars_fragment:av,batching_pars_vertex:ov,batching_vertex:cv,begin_vertex:lv,beginnormal_vertex:uv,bsdfs:hv,iridescence_fragment:dv,bumpmap_pars_fragment:fv,clipping_planes_fragment:pv,clipping_planes_pars_fragment:mv,clipping_planes_pars_vertex:gv,clipping_planes_vertex:vv,color_fragment:xv,color_pars_fragment:bv,color_pars_vertex:yv,color_vertex:wv,common:Mv,cube_uv_reflection_fragment:Ev,defaultnormal_vertex:Sv,displacementmap_pars_vertex:_v,displacementmap_vertex:Tv,emissivemap_fragment:Av,emissivemap_pars_fragment:Rv,colorspace_fragment:Cv,colorspace_pars_fragment:Pv,envmap_fragment:Lv,envmap_common_pars_fragment:Iv,envmap_pars_fragment:Dv,envmap_pars_vertex:Uv,envmap_physical_pars_fragment:qv,envmap_vertex:Fv,fog_vertex:kv,fog_pars_vertex:Nv,fog_fragment:zv,fog_pars_fragment:Ov,gradientmap_pars_fragment:Hv,lightmap_pars_fragment:Bv,lights_lambert_fragment:Vv,lights_lambert_pars_fragment:Wv,lights_pars_begin:Gv,lights_toon_fragment:Xv,lights_toon_pars_fragment:jv,lights_phong_fragment:Kv,lights_phong_pars_fragment:Yv,lights_physical_fragment:Zv,lights_physical_pars_fragment:Jv,lights_fragment_begin:Qv,lights_fragment_maps:$v,lights_fragment_end:ex,logdepthbuf_fragment:tx,logdepthbuf_pars_fragment:nx,logdepthbuf_pars_vertex:ix,logdepthbuf_vertex:rx,map_fragment:sx,map_pars_fragment:ax,map_particle_fragment:ox,map_particle_pars_fragment:cx,metalnessmap_fragment:lx,metalnessmap_pars_fragment:ux,morphinstance_vertex:hx,morphcolor_vertex:dx,morphnormal_vertex:fx,morphtarget_pars_vertex:px,morphtarget_vertex:mx,normal_fragment_begin:gx,normal_fragment_maps:vx,normal_pars_fragment:xx,normal_pars_vertex:bx,normal_vertex:yx,normalmap_pars_fragment:wx,clearcoat_normal_fragment_begin:Mx,clearcoat_normal_fragment_maps:Ex,clearcoat_pars_fragment:Sx,iridescence_pars_fragment:_x,opaque_fragment:Tx,packing:Ax,premultiplied_alpha_fragment:Rx,project_vertex:Cx,dithering_fragment:Px,dithering_pars_fragment:Lx,roughnessmap_fragment:Ix,roughnessmap_pars_fragment:Dx,shadowmap_pars_fragment:Ux,shadowmap_pars_vertex:Fx,shadowmap_vertex:kx,shadowmask_pars_fragment:Nx,skinbase_vertex:zx,skinning_pars_vertex:Ox,skinning_vertex:Hx,skinnormal_vertex:Bx,specularmap_fragment:Vx,specularmap_pars_fragment:Wx,tonemapping_fragment:Gx,tonemapping_pars_fragment:qx,transmission_fragment:Xx,transmission_pars_fragment:jx,uv_pars_fragment:Kx,uv_pars_vertex:Yx,uv_vertex:Zx,worldpos_vertex:Jx,background_vert:Qx,background_frag:$x,backgroundCube_vert:eb,backgroundCube_frag:tb,cube_vert:nb,cube_frag:ib,depth_vert:rb,depth_frag:sb,distanceRGBA_vert:ab,distanceRGBA_frag:ob,equirect_vert:cb,equirect_frag:lb,linedashed_vert:ub,linedashed_frag:hb,meshbasic_vert:db,meshbasic_frag:fb,meshlambert_vert:pb,meshlambert_frag:mb,meshmatcap_vert:gb,meshmatcap_frag:vb,meshnormal_vert:xb,meshnormal_frag:bb,meshphong_vert:yb,meshphong_frag:wb,meshphysical_vert:Mb,meshphysical_frag:Eb,meshtoon_vert:Sb,meshtoon_frag:_b,points_vert:Tb,points_frag:Ab,shadow_vert:Rb,shadow_frag:Cb,sprite_vert:Pb,sprite_frag:Lb},Le={common:{diffuse:{value:new de(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new pt}},envmap:{envMap:{value:null},envMapRotation:{value:new pt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new pt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new pt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new pt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new pt},normalScale:{value:new ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new pt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new pt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new pt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new pt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new de(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new de(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0},uvTransform:{value:new pt}},sprite:{diffuse:{value:new de(16777215)},opacity:{value:1},center:{value:new ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}}},lr={basic:{uniforms:ai([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.fog]),vertexShader:gt.meshbasic_vert,fragmentShader:gt.meshbasic_frag},lambert:{uniforms:ai([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,Le.lights,{emissive:{value:new de(0)}}]),vertexShader:gt.meshlambert_vert,fragmentShader:gt.meshlambert_frag},phong:{uniforms:ai([Le.common,Le.specularmap,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,Le.lights,{emissive:{value:new de(0)},specular:{value:new de(1118481)},shininess:{value:30}}]),vertexShader:gt.meshphong_vert,fragmentShader:gt.meshphong_frag},standard:{uniforms:ai([Le.common,Le.envmap,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.roughnessmap,Le.metalnessmap,Le.fog,Le.lights,{emissive:{value:new de(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:gt.meshphysical_vert,fragmentShader:gt.meshphysical_frag},toon:{uniforms:ai([Le.common,Le.aomap,Le.lightmap,Le.emissivemap,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.gradientmap,Le.fog,Le.lights,{emissive:{value:new de(0)}}]),vertexShader:gt.meshtoon_vert,fragmentShader:gt.meshtoon_frag},matcap:{uniforms:ai([Le.common,Le.bumpmap,Le.normalmap,Le.displacementmap,Le.fog,{matcap:{value:null}}]),vertexShader:gt.meshmatcap_vert,fragmentShader:gt.meshmatcap_frag},points:{uniforms:ai([Le.points,Le.fog]),vertexShader:gt.points_vert,fragmentShader:gt.points_frag},dashed:{uniforms:ai([Le.common,Le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:gt.linedashed_vert,fragmentShader:gt.linedashed_frag},depth:{uniforms:ai([Le.common,Le.displacementmap]),vertexShader:gt.depth_vert,fragmentShader:gt.depth_frag},normal:{uniforms:ai([Le.common,Le.bumpmap,Le.normalmap,Le.displacementmap,{opacity:{value:1}}]),vertexShader:gt.meshnormal_vert,fragmentShader:gt.meshnormal_frag},sprite:{uniforms:ai([Le.sprite,Le.fog]),vertexShader:gt.sprite_vert,fragmentShader:gt.sprite_frag},background:{uniforms:{uvTransform:{value:new pt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:gt.background_vert,fragmentShader:gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new pt}},vertexShader:gt.backgroundCube_vert,fragmentShader:gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:gt.cube_vert,fragmentShader:gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:gt.equirect_vert,fragmentShader:gt.equirect_frag},distanceRGBA:{uniforms:ai([Le.common,Le.displacementmap,{referencePosition:{value:new T},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:gt.distanceRGBA_vert,fragmentShader:gt.distanceRGBA_frag},shadow:{uniforms:ai([Le.lights,Le.fog,{color:{value:new de(0)},opacity:{value:1}}]),vertexShader:gt.shadow_vert,fragmentShader:gt.shadow_frag}};lr.physical={uniforms:ai([lr.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new pt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new pt},clearcoatNormalScale:{value:new ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new pt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new pt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new pt},sheen:{value:0},sheenColor:{value:new de(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new pt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new pt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new pt},transmissionSamplerSize:{value:new ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new pt},attenuationDistance:{value:0},attenuationColor:{value:new de(0)},specularColor:{value:new de(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new pt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new pt},anisotropyVector:{value:new ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new pt}}]),vertexShader:gt.meshphysical_vert,fragmentShader:gt.meshphysical_frag};Pc={r:0,b:0,g:0},ws=new Rn,Ib=new et;Pa=class extends il{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=n-e,a=n+e,o=r+t,c=r-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},va=4,op=[.125,.215,.35,.446,.526,.582],_s=20,Su=new Pa,cp=new de,_u=null,Tu=0,Au=0,Ru=!1,Es=(1+Math.sqrt(5))/2,ha=1/Es,lp=[new T(-Es,ha,0),new T(Es,ha,0),new T(-ha,0,Es),new T(ha,0,Es),new T(0,Es,-ha),new T(0,Es,ha),new T(-1,1,-1),new T(1,1,-1),new T(-1,1,1),new T(1,1,1)],La=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){_u=this._renderer.getRenderTarget(),Tu=this._renderer.getActiveCubeFace(),Au=this._renderer.getActiveMipmapLevel(),Ru=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=dp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=hp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(_u,Tu,Au),this._renderer.xr.enabled=Ru,e.scissorTest=!1,Lc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ea||e.mapping===Sa?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_u=this._renderer.getRenderTarget(),Tu=this._renderer.getActiveCubeFace(),Au=this._renderer.getActiveMipmapLevel(),Ru=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:$t,minFilter:$t,generateMipmaps:!1,type:nn,format:Si,colorSpace:Ba,depthBuffer:!1},r=up(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=up(e,t,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ob(s)),this._blurMaterial=Hb(s,e,t)}return r}_compileMaterial(e){let t=new xe(this._lodPlanes[0],e);this._renderer.compile(t,Su)}_sceneToCubeUV(e,t,n,r){let o=new Tn(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,h=u.toneMapping;u.getClearColor(cp),u.toneMapping=$r,u.autoClear=!1;let p=new ci({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1}),g=new xe(new ei,p),v=!1,m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,v=!0):(p.color.copy(cp),v=!0);for(let f=0;f<6;f++){let y=f%3;y===0?(o.up.set(0,c[f],0),o.lookAt(l[f],0,0)):y===1?(o.up.set(0,0,c[f]),o.lookAt(0,l[f],0)):(o.up.set(0,c[f],0),o.lookAt(0,0,l[f]));let w=this._cubeSize;Lc(r,y*w,f>2?w:0,w,w),u.setRenderTarget(r),v&&u.render(g,o),u.render(e,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=h,u.autoClear=d,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===Ea||e.mapping===Sa;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=dp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=hp());let s=r?this._cubemapMaterial:this._equirectMaterial,a=new xe(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;let c=this._cubeSize;Lc(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Su)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodPlanes.length;for(let s=1;s<r;s++){let a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=lp[(r-s-1)%lp.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,r,s){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,"latitudinal",s),this._halfBlur(a,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,d=new xe(this._lodPlanes[r],l),h=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*_s-1),v=s/g,m=isFinite(s)?1+Math.floor(u*v):_s;m>_s&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${_s}`);let f=[],y=0;for(let R=0;R<_s;++R){let E=R/v,M=Math.exp(-E*E/2);f.push(M),R===0?y+=M:R<m&&(y+=2*M)}for(let R=0;R<f.length;R++)f[R]=f[R]/y;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=f,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);let{_lodMax:w}=this;h.dTheta.value=g,h.mipInt.value=w-n;let x=this._sizeLods[r],S=3*x*(r>w-va?r-w+va:0),_=4*(this._cubeSize-x);Lc(t,S,_,3*x,2*x),c.setRenderTarget(t),c.render(d,Su)}};rl=class extends jn{constructor(e,t,n,r,s,a,o,c,l,u=ba){if(u!==ba&&u!==Ta)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===ba&&(n=As),n===void 0&&u===Ta&&(n=_a),super(null,r,s,a,o,c,u,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Xn,this.minFilter=c!==void 0?c:Xn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ym=new jn,fp=new rl(1,1),wm=new el,Mm=new Sh,Em=new Ca,pp=[],mp=[],gp=new Float32Array(16),vp=new Float32Array(9),xp=new Float32Array(4);_h=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=fy(t.type)}},Th=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Dy(t.type)}},Ah=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let s=0,a=r.length;s!==a;++s){let o=r[s];o.setValue(e,t[o.id],n)}}},Cu=/(\w+)(\])?(\[|\.)?/g;wa=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);Uy(s,a,this)}}setValue(e,t,n,r){let s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){let o=t[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,s=e.length;r!==s;++r){let a=e[r];a.id in t&&n.push(a)}return n}};Fy=37297,ky=0;wp=new pt;Ic=new T;qy=/^[ \t]*#include +<([\w\d./]+)>/gm;Xy=new Map;Ky=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;n1=0,Ch=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Ph(e),t.set(e,n)),n}},Ph=class{constructor(e){this.id=n1++,this.code=e,this.usedTimes=0}};l1=0;Lh=class extends mr{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=sg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ih=class extends mr{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},f1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,p1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;g1={[Ou]:Hu,[Bu]:Gu,[Vu]:qu,[Ma]:Wu,[Hu]:Ou,[Gu]:Bu,[qu]:Vu,[Wu]:Ma};Dh=class extends Tn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},$n=class extends yn{constructor(){super(),this.isGroup=!0,this.type="Group"}},w1={type:"move"},wo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $n,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $n,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new T,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new T),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $n,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new T,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new T),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(let v of e.hand.values()){let m=t.getJointPose(v,n),f=this._getHandJoint(l,v);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],h=u.position.distanceTo(d.position),p=.02,g=.005;l.inputState.pinching&&h>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&h<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(w1)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new $n;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},M1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,E1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Uh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let r=new jn,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ye({vertexShader:M1,fragmentShader:E1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new xe(new Ft(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Fh=class extends ts{constructor(e,t){super();let n=this,r=null,s=1,a=null,o="local-floor",c=1,l=null,u=null,d=null,h=null,p=null,g=null,v=new Uh,m=t.getContextAttributes(),f=null,y=null,w=[],x=[],S=new ue,_=null,R=new Tn;R.viewport=new nt;let E=new Tn;E.viewport=new nt;let M=[R,E],b=new Dh,C=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ae=w[Z];return ae===void 0&&(ae=new wo,w[Z]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(Z){let ae=w[Z];return ae===void 0&&(ae=new wo,w[Z]=ae),ae.getGripSpace()},this.getHand=function(Z){let ae=w[Z];return ae===void 0&&(ae=new wo,w[Z]=ae),ae.getHandSpace()};function U(Z){let ae=x.indexOf(Z.inputSource);if(ae===-1)return;let fe=w[ae];fe!==void 0&&(fe.update(Z.inputSource,Z.frame,l||a),fe.dispatchEvent({type:Z.type,data:Z.inputSource}))}function k(){r.removeEventListener("select",U),r.removeEventListener("selectstart",U),r.removeEventListener("selectend",U),r.removeEventListener("squeeze",U),r.removeEventListener("squeezestart",U),r.removeEventListener("squeezeend",U),r.removeEventListener("end",k),r.removeEventListener("inputsourceschange",H);for(let Z=0;Z<w.length;Z++){let ae=x[Z];ae!==null&&(x[Z]=null,w[Z].disconnect(ae))}C=null,F=null,v.reset(),e.setRenderTarget(f),p=null,h=null,d=null,r=null,y=null,be.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(S.width,S.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Z){if(r=Z,r!==null){if(f=e.getRenderTarget(),r.addEventListener("select",U),r.addEventListener("selectstart",U),r.addEventListener("selectend",U),r.addEventListener("squeeze",U),r.addEventListener("squeezestart",U),r.addEventListener("squeezeend",U),r.addEventListener("end",k),r.addEventListener("inputsourceschange",H),m.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(S),r.renderState.layers===void 0){let ae={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,ae),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new tn(p.framebufferWidth,p.framebufferHeight,{format:Si,type:Fr,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ae=null,fe=null,ne=null;m.depth&&(ne=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=m.stencil?Ta:ba,fe=m.stencil?_a:As);let he={colorFormat:t.RGBA8,depthFormat:ne,scaleFactor:s};d=new XRWebGLBinding(r,t),h=d.createProjectionLayer(he),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),y=new tn(h.textureWidth,h.textureHeight,{format:Si,type:Fr,depthTexture:new rl(h.textureWidth,h.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),be.setContext(r),be.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function H(Z){for(let ae=0;ae<Z.removed.length;ae++){let fe=Z.removed[ae],ne=x.indexOf(fe);ne>=0&&(x[ne]=null,w[ne].disconnect(fe))}for(let ae=0;ae<Z.added.length;ae++){let fe=Z.added[ae],ne=x.indexOf(fe);if(ne===-1){for(let Ge=0;Ge<w.length;Ge++)if(Ge>=x.length){x.push(fe),ne=Ge;break}else if(x[Ge]===null){x[Ge]=fe,ne=Ge;break}if(ne===-1)break}let he=w[ne];he&&he.connect(fe)}}let D=new T,z=new T;function N(Z,ae,fe){D.setFromMatrixPosition(ae.matrixWorld),z.setFromMatrixPosition(fe.matrixWorld);let ne=D.distanceTo(z),he=ae.projectionMatrix.elements,Ge=fe.projectionMatrix.elements,We=he[14]/(he[10]-1),ut=he[14]/(he[10]+1),me=(he[9]+1)/he[5],Je=(he[9]-1)/he[5],O=(he[8]-1)/he[0],it=(Ge[8]+1)/Ge[0],ze=We*O,Pe=We*it,we=ne/(-O+it),Qe=we*-O;if(ae.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Qe),Z.translateZ(we),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),he[10]===-1)Z.projectionMatrix.copy(ae.projectionMatrix),Z.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{let Fe=We+we,I=ut+we,A=ze-Qe,K=Pe+(ne-Qe),re=me*ut/I*Fe,oe=Je*ut/I*Fe;Z.projectionMatrix.makePerspective(A,K,re,oe,Fe,I),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function V(Z,ae){ae===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ae.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(r===null)return;let ae=Z.near,fe=Z.far;v.texture!==null&&(v.depthNear>0&&(ae=v.depthNear),v.depthFar>0&&(fe=v.depthFar)),b.near=E.near=R.near=ae,b.far=E.far=R.far=fe,(C!==b.near||F!==b.far)&&(r.updateRenderState({depthNear:b.near,depthFar:b.far}),C=b.near,F=b.far),R.layers.mask=Z.layers.mask|2,E.layers.mask=Z.layers.mask|4,b.layers.mask=R.layers.mask|E.layers.mask;let ne=Z.parent,he=b.cameras;V(b,ne);for(let Ge=0;Ge<he.length;Ge++)V(he[Ge],ne);he.length===2?N(b,R,E):b.projectionMatrix.copy(R.projectionMatrix),ee(Z,b,ne)};function ee(Z,ae,fe){fe===null?Z.matrix.copy(ae.matrixWorld):(Z.matrix.copy(fe.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ae.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ae.projectionMatrix),Z.projectionMatrixInverse.copy(ae.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Ao*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(h===null&&p===null))return c},this.setFoveation=function(Z){c=Z,h!==null&&(h.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(b)};let ce=null;function Y(Z,ae){if(u=ae.getViewerPose(l||a),g=ae,u!==null){let fe=u.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let ne=!1;fe.length!==b.cameras.length&&(b.cameras.length=0,ne=!0);for(let Ge=0;Ge<fe.length;Ge++){let We=fe[Ge],ut=null;if(p!==null)ut=p.getViewport(We);else{let Je=d.getViewSubImage(h,We);ut=Je.viewport,Ge===0&&(e.setRenderTargetTextures(y,Je.colorTexture,h.ignoreDepthValues?void 0:Je.depthStencilTexture),e.setRenderTarget(y))}let me=M[Ge];me===void 0&&(me=new Tn,me.layers.enable(Ge),me.viewport=new nt,M[Ge]=me),me.matrix.fromArray(We.transform.matrix),me.matrix.decompose(me.position,me.quaternion,me.scale),me.projectionMatrix.fromArray(We.projectionMatrix),me.projectionMatrixInverse.copy(me.projectionMatrix).invert(),me.viewport.set(ut.x,ut.y,ut.width,ut.height),Ge===0&&(b.matrix.copy(me.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),ne===!0&&b.cameras.push(me)}let he=r.enabledFeatures;if(he&&he.includes("depth-sensing")){let Ge=d.getDepthInformation(fe[0]);Ge&&Ge.isValid&&Ge.texture&&v.init(e,Ge,r.renderState)}}for(let fe=0;fe<w.length;fe++){let ne=x[fe],he=w[fe];ne!==null&&he!==void 0&&he.update(ne,ae,l||a)}ce&&ce(Z,ae),ae.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ae}),g=null}let be=new bm;be.setAnimationLoop(Y),this.setAnimationLoop=function(Z){ce=Z},this.dispose=function(){}}},Ms=new Rn,S1=new et;sl=class{constructor(e={}){let{canvas:t=Lg(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let g=new Uint32Array(4),v=new Int32Array(4),m=null,f=null,y=[],w=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Gt,this.toneMapping=$r,this.toneMappingExposure=1;let x=this,S=!1,_=0,R=0,E=null,M=-1,b=null,C=new nt,F=new nt,U=null,k=new de(0),H=0,D=t.width,z=t.height,N=1,V=null,ee=null,ce=new nt(0,0,D,z),Y=new nt(0,0,D,z),be=!1,Z=new Ps,ae=!1,fe=!1,ne=new et,he=new et,Ge=new T,We=new nt,ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},me=!1;function Je(){return E===null?N:1}let O=n;function it(P,q){return t.getContext(P,q)}try{let P={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${rd}`),t.addEventListener("webglcontextlost",le,!1),t.addEventListener("webglcontextrestored",Ie,!1),t.addEventListener("webglcontextcreationerror",Ue,!1),O===null){let q="webgl2";if(O=it(q,P),O===null)throw it(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let ze,Pe,we,Qe,Fe,I,A,K,re,oe,se,He,Ae,De,rt,ve,ke,Ne,tt,Be,xt,lt,It,G;function Ce(){ze=new Vb(O),ze.init(),lt=new y1(O,ze),Pe=new kb(O,ze,e,lt),we=new v1(O,ze),Pe.reverseDepthBuffer&&h&&we.buffers.depth.setReversed(!0),Qe=new qb(O),Fe=new r1,I=new b1(O,ze,we,Fe,Pe,lt,Qe),A=new zb(x),K=new Bb(x),re=new Qg(O),It=new Ub(O,re),oe=new Wb(O,re,Qe,It),se=new jb(O,oe,re,Qe),tt=new Xb(O,Pe,I),ve=new Nb(Fe),He=new i1(x,A,K,ze,Pe,It,ve),Ae=new _1(x,Fe),De=new a1,rt=new d1(ze),Ne=new Db(x,A,K,we,se,p,c),ke=new m1(x,se,Pe),G=new T1(O,Qe,Pe,we),Be=new Fb(O,ze,Qe),xt=new Gb(O,ze,Qe),Qe.programs=He.programs,x.capabilities=Pe,x.extensions=ze,x.properties=Fe,x.renderLists=De,x.shadowMap=ke,x.state=we,x.info=Qe}Ce();let ie=new Fh(x,O);this.xr=ie,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let P=ze.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){let P=ze.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(P){P!==void 0&&(N=P,this.setSize(D,z,!1))},this.getSize=function(P){return P.set(D,z)},this.setSize=function(P,q,J=!0){if(ie.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=P,z=q,t.width=Math.floor(P*N),t.height=Math.floor(q*N),J===!0&&(t.style.width=P+"px",t.style.height=q+"px"),this.setViewport(0,0,P,q)},this.getDrawingBufferSize=function(P){return P.set(D*N,z*N).floor()},this.setDrawingBufferSize=function(P,q,J){D=P,z=q,N=J,t.width=Math.floor(P*J),t.height=Math.floor(q*J),this.setViewport(0,0,P,q)},this.getCurrentViewport=function(P){return P.copy(C)},this.getViewport=function(P){return P.copy(ce)},this.setViewport=function(P,q,J,$){P.isVector4?ce.set(P.x,P.y,P.z,P.w):ce.set(P,q,J,$),we.viewport(C.copy(ce).multiplyScalar(N).round())},this.getScissor=function(P){return P.copy(Y)},this.setScissor=function(P,q,J,$){P.isVector4?Y.set(P.x,P.y,P.z,P.w):Y.set(P,q,J,$),we.scissor(F.copy(Y).multiplyScalar(N).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(P){we.setScissorTest(be=P)},this.setOpaqueSort=function(P){V=P},this.setTransparentSort=function(P){ee=P},this.getClearColor=function(P){return P.copy(Ne.getClearColor())},this.setClearColor=function(){Ne.setClearColor.apply(Ne,arguments)},this.getClearAlpha=function(){return Ne.getClearAlpha()},this.setClearAlpha=function(){Ne.setClearAlpha.apply(Ne,arguments)},this.clear=function(P=!0,q=!0,J=!0){let $=0;if(P){let X=!1;if(E!==null){let Me=E.texture.format;X=Me===vd||Me===gd||Me===md}if(X){let Me=E.texture.type,Re=Me===Fr||Me===As||Me===To||Me===_a||Me===dd||Me===fd,Oe=Ne.getClearColor(),je=Ne.getClearAlpha(),ct=Oe.r,st=Oe.g,Ke=Oe.b;Re?(g[0]=ct,g[1]=st,g[2]=Ke,g[3]=je,O.clearBufferuiv(O.COLOR,0,g)):(v[0]=ct,v[1]=st,v[2]=Ke,v[3]=je,O.clearBufferiv(O.COLOR,0,v))}else $|=O.COLOR_BUFFER_BIT}q&&($|=O.DEPTH_BUFFER_BIT),J&&($|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",le,!1),t.removeEventListener("webglcontextrestored",Ie,!1),t.removeEventListener("webglcontextcreationerror",Ue,!1),De.dispose(),rt.dispose(),Fe.dispose(),A.dispose(),K.dispose(),se.dispose(),It.dispose(),G.dispose(),He.dispose(),ie.dispose(),ie.removeEventListener("sessionstart",tc),ie.removeEventListener("sessionend",xi),Zt.stop()};function le(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function Ie(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;let P=Qe.autoReset,q=ke.enabled,J=ke.autoUpdate,$=ke.needsUpdate,X=ke.type;Ce(),Qe.autoReset=P,ke.enabled=q,ke.autoUpdate=J,ke.needsUpdate=$,ke.type=X}function Ue(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function ot(P){let q=P.target;q.removeEventListener("dispose",ot),Vt(q)}function Vt(P){qt(P),Fe.remove(P)}function qt(P){let q=Fe.get(P).programs;q!==void 0&&(q.forEach(function(J){He.releaseProgram(J)}),P.isShaderMaterial&&He.releaseShaderCache(P))}this.renderBufferDirect=function(P,q,J,$,X,Me){q===null&&(q=ut);let Re=X.isMesh&&X.matrixWorld.determinant()<0,Oe=nr(P,q,J,$,X);we.setMaterial($,Re);let je=J.index,ct=1;if($.wireframe===!0){if(je=oe.getWireframeAttribute(J),je===void 0)return;ct=2}let st=J.drawRange,Ke=J.attributes.position,_t=st.start*ct,zt=(st.start+st.count)*ct;Me!==null&&(_t=Math.max(_t,Me.start*ct),zt=Math.min(zt,(Me.start+Me.count)*ct)),je!==null?(_t=Math.max(_t,0),zt=Math.min(zt,je.count)):Ke!=null&&(_t=Math.max(_t,0),zt=Math.min(zt,Ke.count));let _e=zt-_t;if(_e<0||_e===1/0)return;It.setup(X,$,Oe,J,je);let Wn,Tt=Be;if(je!==null&&(Wn=re.get(je),Tt=xt,Tt.setIndex(Wn)),X.isMesh)$.wireframe===!0?(we.setLineWidth($.wireframeLinewidth*Je()),Tt.setMode(O.LINES)):Tt.setMode(O.TRIANGLES);else if(X.isLine){let Ze=$.linewidth;Ze===void 0&&(Ze=1),we.setLineWidth(Ze*Je()),X.isLineSegments?Tt.setMode(O.LINES):X.isLineLoop?Tt.setMode(O.LINE_LOOP):Tt.setMode(O.LINE_STRIP)}else X.isPoints?Tt.setMode(O.POINTS):X.isSprite&&Tt.setMode(O.TRIANGLES);if(X.isBatchedMesh)if(X._multiDrawInstances!==null)Tt.renderMultiDrawInstances(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount,X._multiDrawInstances);else if(ze.get("WEBGL_multi_draw"))Tt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{let Ze=X._multiDrawStarts,Ai=X._multiDrawCounts,Rt=X._multiDrawCount,bi=je?re.get(je).bytesPerElement:1,Br=Fe.get($).currentProgram.getUniforms();for(let Kn=0;Kn<Rt;Kn++)Br.setValue(O,"_gl_DrawID",Kn),Tt.render(Ze[Kn]/bi,Ai[Kn])}else if(X.isInstancedMesh)Tt.renderInstances(_t,_e,X.count);else if(J.isInstancedBufferGeometry){let Ze=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Ai=Math.min(J.instanceCount,Ze);Tt.renderInstances(_t,_e,Ai)}else Tt.render(_t,_e)};function Lt(P,q,J){P.transparent===!0&&P.side===mt&&P.forceSinglePass===!1?(P.side=en,P.needsUpdate=!0,Bs(P,q,J),P.side=pr,P.needsUpdate=!0,Bs(P,q,J),P.side=mt):Bs(P,q,J)}this.compile=function(P,q,J=null){J===null&&(J=P),f=rt.get(J),f.init(q),w.push(f),J.traverseVisible(function(X){X.isLight&&X.layers.test(q.layers)&&(f.pushLight(X),X.castShadow&&f.pushShadow(X))}),P!==J&&P.traverseVisible(function(X){X.isLight&&X.layers.test(q.layers)&&(f.pushLight(X),X.castShadow&&f.pushShadow(X))}),f.setupLights();let $=new Set;return P.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;let Me=X.material;if(Me)if(Array.isArray(Me))for(let Re=0;Re<Me.length;Re++){let Oe=Me[Re];Lt(Oe,J,X),$.add(Oe)}else Lt(Me,J,X),$.add(Me)}),w.pop(),f=null,$},this.compileAsync=function(P,q,J=null){let $=this.compile(P,q,J);return new Promise(X=>{function Me(){if($.forEach(function(Re){Fe.get(Re).currentProgram.isReady()&&$.delete(Re)}),$.size===0){X(P);return}setTimeout(Me,10)}ze.get("KHR_parallel_shader_compile")!==null?Me():setTimeout(Me,10)})};let ni=null;function Ti(P){ni&&ni(P)}function tc(){Zt.stop()}function xi(){Zt.start()}let Zt=new bm;Zt.setAnimationLoop(Ti),typeof self<"u"&&Zt.setContext(self),this.setAnimationLoop=function(P){ni=P,ie.setAnimationLoop(P),P===null?Zt.stop():Zt.start()},ie.addEventListener("sessionstart",tc),ie.addEventListener("sessionend",xi),this.render=function(P,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),ie.enabled===!0&&ie.isPresenting===!0&&(ie.cameraAutoUpdate===!0&&ie.updateCamera(q),q=ie.getCamera()),P.isScene===!0&&P.onBeforeRender(x,P,q,E),f=rt.get(P,w.length),f.init(q),w.push(f),he.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),Z.setFromProjectionMatrix(he),fe=this.localClippingEnabled,ae=ve.init(this.clippingPlanes,fe),m=De.get(P,y.length),m.init(),y.push(m),ie.enabled===!0&&ie.isPresenting===!0){let Me=x.xr.getDepthSensingMesh();Me!==null&&Hr(Me,q,-1/0,x.sortObjects)}Hr(P,q,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(V,ee),me=ie.enabled===!1||ie.isPresenting===!1||ie.hasDepthSensing()===!1,me&&Ne.addToRenderList(m,P),this.info.render.frame++,ae===!0&&ve.beginShadows();let J=f.state.shadowsArray;ke.render(J,P,q),ae===!0&&ve.endShadows(),this.info.autoReset===!0&&this.info.reset();let $=m.opaque,X=m.transmissive;if(f.setupLights(),q.isArrayCamera){let Me=q.cameras;if(X.length>0)for(let Re=0,Oe=Me.length;Re<Oe;Re++){let je=Me[Re];vt($,X,P,je)}me&&Ne.render(P);for(let Re=0,Oe=Me.length;Re<Oe;Re++){let je=Me[Re];Vn(m,P,je,je.viewport)}}else X.length>0&&vt($,X,P,q),me&&Ne.render(P),Vn(m,P,q);E!==null&&(I.updateMultisampleRenderTarget(E),I.updateRenderTargetMipmap(E)),P.isScene===!0&&P.onAfterRender(x,P,q),It.resetDefaultState(),M=-1,b=null,w.pop(),w.length>0?(f=w[w.length-1],ae===!0&&ve.setGlobalState(x.clippingPlanes,f.state.camera)):f=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function Hr(P,q,J,$){if(P.visible===!1)return;if(P.layers.test(q.layers)){if(P.isGroup)J=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(q);else if(P.isLight)f.pushLight(P),P.castShadow&&f.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||Z.intersectsSprite(P)){$&&We.setFromMatrixPosition(P.matrixWorld).applyMatrix4(he);let Re=se.update(P),Oe=P.material;Oe.visible&&m.push(P,Re,Oe,J,We.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||Z.intersectsObject(P))){let Re=se.update(P),Oe=P.material;if($&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),We.copy(P.boundingSphere.center)):(Re.boundingSphere===null&&Re.computeBoundingSphere(),We.copy(Re.boundingSphere.center)),We.applyMatrix4(P.matrixWorld).applyMatrix4(he)),Array.isArray(Oe)){let je=Re.groups;for(let ct=0,st=je.length;ct<st;ct++){let Ke=je[ct],_t=Oe[Ke.materialIndex];_t&&_t.visible&&m.push(P,Re,_t,J,We.z,Ke)}}else Oe.visible&&m.push(P,Re,Oe,J,We.z,null)}}let Me=P.children;for(let Re=0,Oe=Me.length;Re<Oe;Re++)Hr(Me[Re],q,J,$)}function Vn(P,q,J,$){let X=P.opaque,Me=P.transmissive,Re=P.transparent;f.setupLightsView(J),ae===!0&&ve.setGlobalState(x.clippingPlanes,J),$&&we.viewport(C.copy($)),X.length>0&&Er(X,q,J),Me.length>0&&Er(Me,q,J),Re.length>0&&Er(Re,q,J),we.buffers.depth.setTest(!0),we.buffers.depth.setMask(!0),we.buffers.color.setMask(!0),we.setPolygonOffset(!1)}function vt(P,q,J,$){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[$.id]===void 0&&(f.state.transmissionRenderTarget[$.id]=new tn(1,1,{generateMipmaps:!0,type:ze.has("EXT_color_buffer_half_float")||ze.has("EXT_color_buffer_float")?nn:Fr,minFilter:oi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:St.workingColorSpace}));let Me=f.state.transmissionRenderTarget[$.id],Re=$.viewport||C;Me.setSize(Re.z,Re.w);let Oe=x.getRenderTarget();x.setRenderTarget(Me),x.getClearColor(k),H=x.getClearAlpha(),H<1&&x.setClearColor(16777215,.5),x.clear(),me&&Ne.render(J);let je=x.toneMapping;x.toneMapping=$r;let ct=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),f.setupLightsView($),ae===!0&&ve.setGlobalState(x.clippingPlanes,$),Er(P,J,$),I.updateMultisampleRenderTarget(Me),I.updateRenderTargetMipmap(Me),ze.has("WEBGL_multisampled_render_to_texture")===!1){let st=!1;for(let Ke=0,_t=q.length;Ke<_t;Ke++){let zt=q[Ke],_e=zt.object,Wn=zt.geometry,Tt=zt.material,Ze=zt.group;if(Tt.side===mt&&_e.layers.test($.layers)){let Ai=Tt.side;Tt.side=en,Tt.needsUpdate=!0,Za(_e,J,$,Wn,Tt,Ze),Tt.side=Ai,Tt.needsUpdate=!0,st=!0}}st===!0&&(I.updateMultisampleRenderTarget(Me),I.updateRenderTargetMipmap(Me))}x.setRenderTarget(Oe),x.setClearColor(k,H),ct!==void 0&&($.viewport=ct),x.toneMapping=je}function Er(P,q,J){let $=q.isScene===!0?q.overrideMaterial:null;for(let X=0,Me=P.length;X<Me;X++){let Re=P[X],Oe=Re.object,je=Re.geometry,ct=$===null?Re.material:$,st=Re.group;Oe.layers.test(J.layers)&&Za(Oe,q,J,je,ct,st)}}function Za(P,q,J,$,X,Me){P.onBeforeRender(x,q,J,$,X,Me),P.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),X.onBeforeRender(x,q,J,$,P,Me),X.transparent===!0&&X.side===mt&&X.forceSinglePass===!1?(X.side=en,X.needsUpdate=!0,x.renderBufferDirect(J,q,$,X,P,Me),X.side=pr,X.needsUpdate=!0,x.renderBufferDirect(J,q,$,X,P,Me),X.side=mt):x.renderBufferDirect(J,q,$,X,P,Me),P.onAfterRender(x,q,J,$,X,Me)}function Bs(P,q,J){q.isScene!==!0&&(q=ut);let $=Fe.get(P),X=f.state.lights,Me=f.state.shadowsArray,Re=X.state.version,Oe=He.getParameters(P,X.state,Me,q,J),je=He.getProgramCacheKey(Oe),ct=$.programs;$.environment=P.isMeshStandardMaterial?q.environment:null,$.fog=q.fog,$.envMap=(P.isMeshStandardMaterial?K:A).get(P.envMap||$.environment),$.envMapRotation=$.environment!==null&&P.envMap===null?q.environmentRotation:P.envMapRotation,ct===void 0&&(P.addEventListener("dispose",ot),ct=new Map,$.programs=ct);let st=ct.get(je);if(st!==void 0){if($.currentProgram===st&&$.lightsStateVersion===Re)return Hl(P,Oe),st}else Oe.uniforms=He.getUniforms(P),P.onBeforeCompile(Oe,x),st=He.acquireProgram(Oe,je),ct.set(je,st),$.uniforms=Oe.uniforms;let Ke=$.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Ke.clippingPlanes=ve.uniform),Hl(P,Oe),$.needsLights=tf(P),$.lightsStateVersion=Re,$.needsLights&&(Ke.ambientLightColor.value=X.state.ambient,Ke.lightProbe.value=X.state.probe,Ke.directionalLights.value=X.state.directional,Ke.directionalLightShadows.value=X.state.directionalShadow,Ke.spotLights.value=X.state.spot,Ke.spotLightShadows.value=X.state.spotShadow,Ke.rectAreaLights.value=X.state.rectArea,Ke.ltc_1.value=X.state.rectAreaLTC1,Ke.ltc_2.value=X.state.rectAreaLTC2,Ke.pointLights.value=X.state.point,Ke.pointLightShadows.value=X.state.pointShadow,Ke.hemisphereLights.value=X.state.hemi,Ke.directionalShadowMap.value=X.state.directionalShadowMap,Ke.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ke.spotShadowMap.value=X.state.spotShadowMap,Ke.spotLightMatrix.value=X.state.spotLightMatrix,Ke.spotLightMap.value=X.state.spotLightMap,Ke.pointShadowMap.value=X.state.pointShadowMap,Ke.pointShadowMatrix.value=X.state.pointShadowMatrix),$.currentProgram=st,$.uniformsList=null,st}function sn(P){if(P.uniformsList===null){let q=P.currentProgram.getUniforms();P.uniformsList=wa.seqWithValue(q.seq,P.uniforms)}return P.uniformsList}function Hl(P,q){let J=Fe.get(P);J.outputColorSpace=q.outputColorSpace,J.batching=q.batching,J.batchingColor=q.batchingColor,J.instancing=q.instancing,J.instancingColor=q.instancingColor,J.instancingMorph=q.instancingMorph,J.skinning=q.skinning,J.morphTargets=q.morphTargets,J.morphNormals=q.morphNormals,J.morphColors=q.morphColors,J.morphTargetsCount=q.morphTargetsCount,J.numClippingPlanes=q.numClippingPlanes,J.numIntersection=q.numClipIntersection,J.vertexAlphas=q.vertexAlphas,J.vertexTangents=q.vertexTangents,J.toneMapping=q.toneMapping}function nr(P,q,J,$,X){q.isScene!==!0&&(q=ut),I.resetTextureUnits();let Me=q.fog,Re=$.isMeshStandardMaterial?q.environment:null,Oe=E===null?x.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Ba,je=($.isMeshStandardMaterial?K:A).get($.envMap||Re),ct=$.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,st=!!J.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Ke=!!J.morphAttributes.position,_t=!!J.morphAttributes.normal,zt=!!J.morphAttributes.color,_e=$r;$.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(_e=x.toneMapping);let Wn=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Tt=Wn!==void 0?Wn.length:0,Ze=Fe.get($),Ai=f.state.lights;if(ae===!0&&(fe===!0||P!==b)){let ii=P===b&&$.id===M;ve.setState($,P,ii)}let Rt=!1;$.version===Ze.__version?(Ze.needsLights&&Ze.lightsStateVersion!==Ai.state.version||Ze.outputColorSpace!==Oe||X.isBatchedMesh&&Ze.batching===!1||!X.isBatchedMesh&&Ze.batching===!0||X.isBatchedMesh&&Ze.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Ze.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Ze.instancing===!1||!X.isInstancedMesh&&Ze.instancing===!0||X.isSkinnedMesh&&Ze.skinning===!1||!X.isSkinnedMesh&&Ze.skinning===!0||X.isInstancedMesh&&Ze.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ze.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ze.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ze.instancingMorph===!1&&X.morphTexture!==null||Ze.envMap!==je||$.fog===!0&&Ze.fog!==Me||Ze.numClippingPlanes!==void 0&&(Ze.numClippingPlanes!==ve.numPlanes||Ze.numIntersection!==ve.numIntersection)||Ze.vertexAlphas!==ct||Ze.vertexTangents!==st||Ze.morphTargets!==Ke||Ze.morphNormals!==_t||Ze.morphColors!==zt||Ze.toneMapping!==_e||Ze.morphTargetsCount!==Tt)&&(Rt=!0):(Rt=!0,Ze.__version=$.version);let bi=Ze.currentProgram;Rt===!0&&(bi=Bs($,q,X));let Br=!1,Kn=!1,hs=!1,Ot=bi.getUniforms(),Yn=Ze.uniforms;if(we.useProgram(bi.program)&&(Br=!0,Kn=!0,hs=!0),$.id!==M&&(M=$.id,Kn=!0),Br||b!==P){we.buffers.depth.getReversed()?(ne.copy(P.projectionMatrix),Dg(ne),Ug(ne),Ot.setValue(O,"projectionMatrix",ne)):Ot.setValue(O,"projectionMatrix",P.projectionMatrix),Ot.setValue(O,"viewMatrix",P.matrixWorldInverse);let Bi=Ot.map.cameraPosition;Bi!==void 0&&Bi.setValue(O,Ge.setFromMatrixPosition(P.matrixWorld)),Pe.logarithmicDepthBuffer&&Ot.setValue(O,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&Ot.setValue(O,"isOrthographic",P.isOrthographicCamera===!0),b!==P&&(b=P,Kn=!0,hs=!0)}if(X.isSkinnedMesh){Ot.setOptional(O,X,"bindMatrix"),Ot.setOptional(O,X,"bindMatrixInverse");let ii=X.skeleton;ii&&(ii.boneTexture===null&&ii.computeBoneTexture(),Ot.setValue(O,"boneTexture",ii.boneTexture,I))}X.isBatchedMesh&&(Ot.setOptional(O,X,"batchingTexture"),Ot.setValue(O,"batchingTexture",X._matricesTexture,I),Ot.setOptional(O,X,"batchingIdTexture"),Ot.setValue(O,"batchingIdTexture",X._indirectTexture,I),Ot.setOptional(O,X,"batchingColorTexture"),X._colorsTexture!==null&&Ot.setValue(O,"batchingColorTexture",X._colorsTexture,I));let ir=J.morphAttributes;if((ir.position!==void 0||ir.normal!==void 0||ir.color!==void 0)&&tt.update(X,J,bi),(Kn||Ze.receiveShadow!==X.receiveShadow)&&(Ze.receiveShadow=X.receiveShadow,Ot.setValue(O,"receiveShadow",X.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(Yn.envMap.value=je,Yn.flipEnvMap.value=je.isCubeTexture&&je.isRenderTargetTexture===!1?-1:1),$.isMeshStandardMaterial&&$.envMap===null&&q.environment!==null&&(Yn.envMapIntensity.value=q.environmentIntensity),Kn&&(Ot.setValue(O,"toneMappingExposure",x.toneMappingExposure),Ze.needsLights&&nc(Yn,hs),Me&&$.fog===!0&&Ae.refreshFogUniforms(Yn,Me),Ae.refreshMaterialUniforms(Yn,$,N,z,f.state.transmissionRenderTarget[P.id]),wa.upload(O,sn(Ze),Yn,I)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(wa.upload(O,sn(Ze),Yn,I),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&Ot.setValue(O,"center",X.center),Ot.setValue(O,"modelViewMatrix",X.modelViewMatrix),Ot.setValue(O,"normalMatrix",X.normalMatrix),Ot.setValue(O,"modelMatrix",X.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){let ii=$.uniformsGroups;for(let Bi=0,Ri=ii.length;Bi<Ri;Bi++){let Ja=ii[Bi];G.update(Ja,bi),G.bind(Ja,bi)}}return bi}function nc(P,q){P.ambientLightColor.needsUpdate=q,P.lightProbe.needsUpdate=q,P.directionalLights.needsUpdate=q,P.directionalLightShadows.needsUpdate=q,P.pointLights.needsUpdate=q,P.pointLightShadows.needsUpdate=q,P.spotLights.needsUpdate=q,P.spotLightShadows.needsUpdate=q,P.rectAreaLights.needsUpdate=q,P.hemisphereLights.needsUpdate=q}function tf(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return _},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(P,q,J){Fe.get(P.texture).__webglTexture=q,Fe.get(P.depthTexture).__webglTexture=J;let $=Fe.get(P);$.__hasExternalTextures=!0,$.__autoAllocateDepthBuffer=J===void 0,$.__autoAllocateDepthBuffer||ze.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),$.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,q){let J=Fe.get(P);J.__webglFramebuffer=q,J.__useDefaultFramebuffer=q===void 0},this.setRenderTarget=function(P,q=0,J=0){E=P,_=q,R=J;let $=!0,X=null,Me=!1,Re=!1;if(P){let je=Fe.get(P);if(je.__useDefaultFramebuffer!==void 0)we.bindFramebuffer(O.FRAMEBUFFER,null),$=!1;else if(je.__webglFramebuffer===void 0)I.setupRenderTarget(P);else if(je.__hasExternalTextures)I.rebindTextures(P,Fe.get(P.texture).__webglTexture,Fe.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){let Ke=P.depthTexture;if(je.__boundDepthTexture!==Ke){if(Ke!==null&&Fe.has(Ke)&&(P.width!==Ke.image.width||P.height!==Ke.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");I.setupDepthRenderbuffer(P)}}let ct=P.texture;(ct.isData3DTexture||ct.isDataArrayTexture||ct.isCompressedArrayTexture)&&(Re=!0);let st=Fe.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(st[q])?X=st[q][J]:X=st[q],Me=!0):P.samples>0&&I.useMultisampledRTT(P)===!1?X=Fe.get(P).__webglMultisampledFramebuffer:Array.isArray(st)?X=st[J]:X=st,C.copy(P.viewport),F.copy(P.scissor),U=P.scissorTest}else C.copy(ce).multiplyScalar(N).floor(),F.copy(Y).multiplyScalar(N).floor(),U=be;if(we.bindFramebuffer(O.FRAMEBUFFER,X)&&$&&we.drawBuffers(P,X),we.viewport(C),we.scissor(F),we.setScissorTest(U),Me){let je=Fe.get(P.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+q,je.__webglTexture,J)}else if(Re){let je=Fe.get(P.texture),ct=q||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,je.__webglTexture,J||0,ct)}M=-1},this.readRenderTargetPixels=function(P,q,J,$,X,Me,Re){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Oe=Fe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Re!==void 0&&(Oe=Oe[Re]),Oe){we.bindFramebuffer(O.FRAMEBUFFER,Oe);try{let je=P.texture,ct=je.format,st=je.type;if(!Pe.textureFormatReadable(ct)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Pe.textureTypeReadable(st)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=P.width-$&&J>=0&&J<=P.height-X&&O.readPixels(q,J,$,X,lt.convert(ct),lt.convert(st),Me)}finally{let je=E!==null?Fe.get(E).__webglFramebuffer:null;we.bindFramebuffer(O.FRAMEBUFFER,je)}}},this.readRenderTargetPixelsAsync=async function(P,q,J,$,X,Me,Re){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Oe=Fe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Re!==void 0&&(Oe=Oe[Re]),Oe){let je=P.texture,ct=je.format,st=je.type;if(!Pe.textureFormatReadable(ct))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Pe.textureTypeReadable(st))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(q>=0&&q<=P.width-$&&J>=0&&J<=P.height-X){we.bindFramebuffer(O.FRAMEBUFFER,Oe);let Ke=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Ke),O.bufferData(O.PIXEL_PACK_BUFFER,Me.byteLength,O.STREAM_READ),O.readPixels(q,J,$,X,lt.convert(ct),lt.convert(st),0);let _t=E!==null?Fe.get(E).__webglFramebuffer:null;we.bindFramebuffer(O.FRAMEBUFFER,_t);let zt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await Ig(O,zt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Ke),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Me),O.deleteBuffer(Ke),O.deleteSync(zt),Me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(P,q=null,J=0){P.isTexture!==!0&&(go("WebGLRenderer: copyFramebufferToTexture function signature has changed."),q=arguments[0]||null,P=arguments[1]);let $=Math.pow(2,-J),X=Math.floor(P.image.width*$),Me=Math.floor(P.image.height*$),Re=q!==null?q.x:0,Oe=q!==null?q.y:0;I.setTexture2D(P,0),O.copyTexSubImage2D(O.TEXTURE_2D,J,0,0,Re,Oe,X,Me),we.unbindTexture()},this.copyTextureToTexture=function(P,q,J=null,$=null,X=0){P.isTexture!==!0&&(go("WebGLRenderer: copyTextureToTexture function signature has changed."),$=arguments[0]||null,P=arguments[1],q=arguments[2],X=arguments[3]||0,J=null);let Me,Re,Oe,je,ct,st,Ke,_t,zt,_e=P.isCompressedTexture?P.mipmaps[X]:P.image;J!==null?(Me=J.max.x-J.min.x,Re=J.max.y-J.min.y,Oe=J.isBox3?J.max.z-J.min.z:1,je=J.min.x,ct=J.min.y,st=J.isBox3?J.min.z:0):(Me=_e.width,Re=_e.height,Oe=_e.depth||1,je=0,ct=0,st=0),$!==null?(Ke=$.x,_t=$.y,zt=$.z):(Ke=0,_t=0,zt=0);let Wn=lt.convert(q.format),Tt=lt.convert(q.type),Ze;q.isData3DTexture?(I.setTexture3D(q,0),Ze=O.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(I.setTexture2DArray(q,0),Ze=O.TEXTURE_2D_ARRAY):(I.setTexture2D(q,0),Ze=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,q.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,q.unpackAlignment);let Ai=O.getParameter(O.UNPACK_ROW_LENGTH),Rt=O.getParameter(O.UNPACK_IMAGE_HEIGHT),bi=O.getParameter(O.UNPACK_SKIP_PIXELS),Br=O.getParameter(O.UNPACK_SKIP_ROWS),Kn=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,_e.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,_e.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,je),O.pixelStorei(O.UNPACK_SKIP_ROWS,ct),O.pixelStorei(O.UNPACK_SKIP_IMAGES,st);let hs=P.isDataArrayTexture||P.isData3DTexture,Ot=q.isDataArrayTexture||q.isData3DTexture;if(P.isRenderTargetTexture||P.isDepthTexture){let Yn=Fe.get(P),ir=Fe.get(q),ii=Fe.get(Yn.__renderTarget),Bi=Fe.get(ir.__renderTarget);we.bindFramebuffer(O.READ_FRAMEBUFFER,ii.__webglFramebuffer),we.bindFramebuffer(O.DRAW_FRAMEBUFFER,Bi.__webglFramebuffer);for(let Ri=0;Ri<Oe;Ri++)hs&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Fe.get(P).__webglTexture,X,st+Ri),P.isDepthTexture?(Ot&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Fe.get(q).__webglTexture,X,zt+Ri),O.blitFramebuffer(je,ct,Me,Re,Ke,_t,Me,Re,O.DEPTH_BUFFER_BIT,O.NEAREST)):Ot?O.copyTexSubImage3D(Ze,X,Ke,_t,zt+Ri,je,ct,Me,Re):O.copyTexSubImage2D(Ze,X,Ke,_t,zt+Ri,je,ct,Me,Re);we.bindFramebuffer(O.READ_FRAMEBUFFER,null),we.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Ot?P.isDataTexture||P.isData3DTexture?O.texSubImage3D(Ze,X,Ke,_t,zt,Me,Re,Oe,Wn,Tt,_e.data):q.isCompressedArrayTexture?O.compressedTexSubImage3D(Ze,X,Ke,_t,zt,Me,Re,Oe,Wn,_e.data):O.texSubImage3D(Ze,X,Ke,_t,zt,Me,Re,Oe,Wn,Tt,_e):P.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,X,Ke,_t,Me,Re,Wn,Tt,_e.data):P.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,X,Ke,_t,_e.width,_e.height,Wn,_e.data):O.texSubImage2D(O.TEXTURE_2D,X,Ke,_t,Me,Re,Wn,Tt,_e);O.pixelStorei(O.UNPACK_ROW_LENGTH,Ai),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Rt),O.pixelStorei(O.UNPACK_SKIP_PIXELS,bi),O.pixelStorei(O.UNPACK_SKIP_ROWS,Br),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Kn),X===0&&q.generateMipmaps&&O.generateMipmap(Ze),we.unbindTexture()},this.copyTextureToTexture3D=function(P,q,J=null,$=null,X=0){return P.isTexture!==!0&&(go("WebGLRenderer: copyTextureToTexture3D function signature has changed."),J=arguments[0]||null,$=arguments[1]||null,P=arguments[2],q=arguments[3],X=arguments[4]||0),go('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(P,q,J,$,X)},this.initRenderTarget=function(P){Fe.get(P).__webglFramebuffer===void 0&&I.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?I.setTextureCube(P,0):P.isData3DTexture?I.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?I.setTexture2DArray(P,0):I.setTexture2D(P,0),we.unbindTexture()},this.resetState=function(){_=0,R=0,E=null,we.reset(),It.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Dr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=St._getDrawingBufferColorSpace(e),t.unpackColorSpace=St._getUnpackColorSpace()}},Ji=class extends yn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Rn,this.environmentIntensity=1,this.environmentRotation=new Rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Po=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=wh,this.updateRanges=[],this.version=0,this.uuid=fr()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=fr()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=fr()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},si=new T,Ia=class i{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)si.fromBufferAttribute(this,t),si.applyMatrix4(e),this.setXYZ(t,si.x,si.y,si.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)si.fromBufferAttribute(this,t),si.applyNormalMatrix(e),this.setXYZ(t,si.x,si.y,si.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)si.fromBufferAttribute(this,t),si.transformDirection(e),this.setXYZ(t,si.x,si.y,si.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Zi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ht(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Zi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Zi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Zi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Zi(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),r=Ht(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),r=Ht(r,this.array),s=Ht(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new qe(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Lo=class extends mr{static get type(){return"SpriteMaterial"}constructor(e){super(),this.isSpriteMaterial=!0,this.color=new de(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},co=new T,fa=new T,pa=new T,ma=new ue,lo=new ue,Sm=new et,Dc=new T,uo=new T,Uc=new T,Lp=new ue,Pu=new ue,Ip=new ue,al=class extends yn{constructor(e=new Lo){if(super(),this.isSprite=!0,this.type="Sprite",da===void 0){da=new Xe;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Po(t,5);da.setIndex([0,1,2,0,2,3]),da.setAttribute("position",new Ia(n,3,0,!1)),da.setAttribute("uv",new Ia(n,2,3,!1))}this.geometry=da,this.material=e,this.center=new ue(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),fa.setFromMatrixScale(this.matrixWorld),Sm.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),pa.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&fa.multiplyScalar(-pa.z);let n=this.material.rotation,r,s;n!==0&&(s=Math.cos(n),r=Math.sin(n));let a=this.center;Fc(Dc.set(-.5,-.5,0),pa,a,fa,r,s),Fc(uo.set(.5,-.5,0),pa,a,fa,r,s),Fc(Uc.set(.5,.5,0),pa,a,fa,r,s),Lp.set(0,0),Pu.set(1,0),Ip.set(1,1);let o=e.ray.intersectTriangle(Dc,uo,Uc,!1,co);if(o===null&&(Fc(uo.set(-.5,.5,0),pa,a,fa,r,s),Pu.set(0,1),o=e.ray.intersectTriangle(Dc,Uc,uo,!1,co),o===null))return;let c=e.ray.origin.distanceTo(co);c<e.near||c>e.far||t.push({distance:c,point:co.clone(),uv:Jr.getInterpolation(co,Dc,uo,Uc,Lp,Pu,Ip,new ue),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};Ls=class extends jn{constructor(e=null,t=1,n=1,r,s,a,o,c,l=Xn,u=Xn,d,h){super(null,a,o,c,l,u,r,s,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},kt=class extends qe{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},ga=new et,Dp=new et,kc=[],Up=new Di,A1=new et,ho=new xe,fo=new An,wn=class extends xe{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new kt(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,A1)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Di),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ga),Up.copy(e.boundingBox).applyMatrix4(ga),this.boundingBox.union(Up)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new An),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ga),fo.copy(e.boundingSphere).applyMatrix4(ga),this.boundingSphere.union(fo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let o=0;o<n.length;o++)n[o]=r[a+o]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(ho.geometry=this.geometry,ho.material=this.material,ho.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),fo.copy(this.boundingSphere),fo.applyMatrix4(n),e.ray.intersectsSphere(fo)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,ga),Dp.multiplyMatrices(n,ga),ho.matrixWorld=Dp,ho.raycast(e,kc);for(let a=0,o=kc.length;a<o;a++){let c=kc[a];c.instanceId=s,c.object=this,t.push(c)}kc.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new kt(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ls(new Float32Array(r*this.count),r,this.count,pd,hr));let s=this.morphTexture.source.data.data,a=0;for(let l=0;l<n.length;l++)a+=n[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=r*e;s[c]=o,s.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}},Da=class extends mr{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new de(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ol=new T,cl=new T,Fp=new et,po=new Aa,Nc=new An,Lu=new T,kp=new T,Io=class extends yn{constructor(e=new Xe,t=new Da){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let r=1,s=t.count;r<s;r++)ol.fromBufferAttribute(t,r-1),cl.fromBufferAttribute(t,r),n[r]=n[r-1],n[r]+=ol.distanceTo(cl);e.setAttribute("lineDistance",new Ye(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Nc.copy(n.boundingSphere),Nc.applyMatrix4(r),Nc.radius+=s,e.ray.intersectsSphere(Nc)===!1)return;Fp.copy(r).invert(),po.copy(e.ray).applyMatrix4(Fp);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){let p=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let v=p,m=g-1;v<m;v+=l){let f=u.getX(v),y=u.getX(v+1),w=zc(this,e,po,c,f,y);w&&t.push(w)}if(this.isLineLoop){let v=u.getX(g-1),m=u.getX(p),f=zc(this,e,po,c,v,m);f&&t.push(f)}}else{let p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=p,m=g-1;v<m;v+=l){let f=zc(this,e,po,c,v,v+1);f&&t.push(f)}if(this.isLineLoop){let v=zc(this,e,po,c,g-1,p);v&&t.push(v)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){let o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};Np=new T,zp=new T,Ua=class extends Io{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let r=0,s=t.count;r<s;r+=2)Np.fromBufferAttribute(t,r),zp.fromBufferAttribute(t,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+Np.distanceTo(zp);e.setAttribute("lineDistance",new Ye(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Do=class extends mr{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new de(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Op=new et,kh=new Aa,Oc=new An,Hc=new T,on=class extends yn{constructor(e=new Xe,t=new Do){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Oc.copy(n.boundingSphere),Oc.applyMatrix4(r),Oc.radius+=s,e.ray.intersectsSphere(Oc)===!1)return;Op.copy(r).invert(),kh.copy(e.ray).applyMatrix4(Op);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,d=n.attributes.position;if(l!==null){let h=Math.max(0,a.start),p=Math.min(l.count,a.start+a.count);for(let g=h,v=p;g<v;g++){let m=l.getX(g);Hc.fromBufferAttribute(d,m),Hp(Hc,m,c,r,e,t,this)}}else{let h=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let g=h,v=p;g<v;g++)Hc.fromBufferAttribute(d,g),Hp(Hc,g,c,r,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){let o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};Qi=class extends jn{constructor(e,t,n,r,s,a,o,c,l){super(e,t,n,r,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ui=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(r),t.push(s),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),r=0,s=n.length,a;t?a=t:a=e*n[s-1];let o=0,c=s-1,l;for(;o<=c;)if(r=Math.floor(o+(c-o)/2),l=n[r]-a,l<0)o=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===a)return r/(s-1);let u=n[r],h=n[r+1]-u,p=(a-u)/h;return(r+p)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);let a=this.getPoint(r),o=this.getPoint(s),c=t||(a.isVector2?new ue:new T);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new T,r=[],s=[],a=[],o=new T,c=new et;for(let p=0;p<=e;p++){let g=p/e;r[p]=this.getTangentAt(g,new T)}s[0]=new T,a[0]=new T;let l=Number.MAX_VALUE,u=Math.abs(r[0].x),d=Math.abs(r[0].y),h=Math.abs(r[0].z);u<=l&&(l=u,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),h<=l&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let p=1;p<=e;p++){if(s[p]=s[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(r[p-1],r[p]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(Nn(r[p-1].dot(r[p]),-1,1));s[p].applyMatrix4(c.makeRotationAxis(o,g))}a[p].crossVectors(r[p],s[p])}if(t===!0){let p=Math.acos(Nn(s[0].dot(s[e]),-1,1));p/=e,r[0].dot(o.crossVectors(s[0],s[e]))>0&&(p=-p);for(let g=1;g<=e;g++)s[g].applyMatrix4(c.makeRotationAxis(r[g],p*g)),a[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Uo=class extends Ui{constructor(e=0,t=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new ue){let n=t,r=Math.PI*2,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);let o=this.aStartAngle+e*s,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),d=Math.sin(this.aRotation),h=c-this.aX,p=l-this.aY;c=h*u-p*d+this.aX,l=h*d+p*u+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Nh=class extends Uo{constructor(e,t,n,r,s,a){super(e,t,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};Bc=new T,Iu=new wd,Du=new wd,Uu=new wd,Fa=class extends Ui{constructor(e=[],t=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new T){let n=t,r=this.points,s=r.length,a=(s-(this.closed?0:1))*e,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:c===0&&o===s-1&&(o=s-2,c=1);let l,u;this.closed||o>0?l=r[(o-1)%s]:(Bc.subVectors(r[0],r[1]).add(r[0]),l=Bc);let d=r[o%s],h=r[(o+1)%s];if(this.closed||o+2<s?u=r[(o+2)%s]:(Bc.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=Bc),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(d),p),v=Math.pow(d.distanceToSquared(h),p),m=Math.pow(h.distanceToSquared(u),p);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Iu.initNonuniformCatmullRom(l.x,d.x,h.x,u.x,g,v,m),Du.initNonuniformCatmullRom(l.y,d.y,h.y,u.y,g,v,m),Uu.initNonuniformCatmullRom(l.z,d.z,h.z,u.z,g,v,m)}else this.curveType==="catmullrom"&&(Iu.initCatmullRom(l.x,d.x,h.x,u.x,this.tension),Du.initCatmullRom(l.y,d.y,h.y,u.y,this.tension),Uu.initCatmullRom(l.z,d.z,h.z,u.z,this.tension));return n.set(Iu.calc(c),Du.calc(c),Uu.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(new T().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};ll=class extends Ui{constructor(e=new ue,t=new ue,n=new ue,r=new ue){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new ue){let n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Eo(e,r.x,s.x,a.x,o.x),Eo(e,r.y,s.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},zh=class extends Ui{constructor(e=new T,t=new T,n=new T,r=new T){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new T){let n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Eo(e,r.x,s.x,a.x,o.x),Eo(e,r.y,s.y,a.y,o.y),Eo(e,r.z,s.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ul=class extends Ui{constructor(e=new ue,t=new ue){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ue){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ue){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Oh=class extends Ui{constructor(e=new T,t=new T){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new T){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new T){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},hl=class extends Ui{constructor(e=new ue,t=new ue,n=new ue){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ue){let n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(Mo(e,r.x,s.x,a.x),Mo(e,r.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Hh=class extends Ui{constructor(e=new T,t=new T,n=new T){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new T){let n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(Mo(e,r.x,s.x,a.x),Mo(e,r.y,s.y,a.y),Mo(e,r.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},dl=class extends Ui{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ue){let n=t,r=this.points,s=(r.length-1)*e,a=Math.floor(s),o=s-a,c=r[a===0?a:a-1],l=r[a],u=r[a>r.length-2?r.length-1:a+1],d=r[a>r.length-3?r.length-1:a+2];return n.set(Bp(o,c.x,l.x,u.x,d.x),Bp(o,c.y,l.y,u.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let r=e.points[t];this.points.push(new ue().fromArray(r))}return this}},Vp=Object.freeze({__proto__:null,ArcCurve:Nh,CatmullRomCurve3:Fa,CubicBezierCurve:ll,CubicBezierCurve3:zh,EllipseCurve:Uo,LineCurve:ul,LineCurve3:Oh,QuadraticBezierCurve:hl,QuadraticBezierCurve3:Hh,SplineCurve:dl}),Bh=class extends Ui{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Vp[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),s=0;for(;s<r.length;){if(r[s]>=n){let a=r[s]-n,o=this.curves[s],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,s=this.curves;r<s.length;r++){let a=s[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){let u=c[l];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let r=e.curves[t];this.curves.push(new Vp[r.type]().fromJSON(r))}return this}},fl=class extends Bh{constructor(e){super(),this.type="Path",this.currentPoint=new ue,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ul(this.currentPoint.clone(),new ue(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let s=new hl(this.currentPoint.clone(),new ue(e,t),new ue(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,s,a){let o=new ll(this.currentPoint.clone(),new ue(e,t),new ue(n,r),new ue(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new dl(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,s,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,r,s,a),this}absarc(e,t,n,r,s,a){return this.absellipse(e,t,n,n,r,s,a),this}ellipse(e,t,n,r,s,a,o,c){let l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+l,t+u,n,r,s,a,o,c),this}absellipse(e,t,n,r,s,a,o,c){let l=new Uo(e,t,n,r,s,a,o,c);if(this.curves.length>0){let d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);let u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},gr=class i extends Xe{constructor(e=[new ue(0,-.5),new ue(.5,0),new ue(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=Nn(r,0,Math.PI*2);let s=[],a=[],o=[],c=[],l=[],u=1/t,d=new T,h=new ue,p=new T,g=new T,v=new T,m=0,f=0;for(let y=0;y<=e.length-1;y++)switch(y){case 0:m=e[y+1].x-e[y].x,f=e[y+1].y-e[y].y,p.x=f*1,p.y=-m,p.z=f*0,v.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case e.length-1:c.push(v.x,v.y,v.z);break;default:m=e[y+1].x-e[y].x,f=e[y+1].y-e[y].y,p.x=f*1,p.y=-m,p.z=f*0,g.copy(p),p.x+=v.x,p.y+=v.y,p.z+=v.z,p.normalize(),c.push(p.x,p.y,p.z),v.copy(g)}for(let y=0;y<=t;y++){let w=n+y*u*r,x=Math.sin(w),S=Math.cos(w);for(let _=0;_<=e.length-1;_++){d.x=e[_].x*x,d.y=e[_].y,d.z=e[_].x*S,a.push(d.x,d.y,d.z),h.x=y/t,h.y=_/(e.length-1),o.push(h.x,h.y);let R=c[3*_+0]*x,E=c[3*_+1],M=c[3*_+0]*S;l.push(R,E,M)}}for(let y=0;y<t;y++)for(let w=0;w<e.length-1;w++){let x=w+y*e.length,S=x,_=x+e.length,R=x+e.length+1,E=x+1;s.push(S,_,E),s.push(R,E,_)}this.setIndex(s),this.setAttribute("position",new Ye(a,3)),this.setAttribute("uv",new Ye(o,2)),this.setAttribute("normal",new Ye(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},ka=class i extends Xe{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let s=[],a=[],o=[],c=[],l=new T,u=new ue;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let d=0,h=3;d<=t;d++,h+=3){let p=n+d/t*r;l.x=e*Math.cos(p),l.y=e*Math.sin(p),a.push(l.x,l.y,l.z),o.push(0,0,1),u.x=(a[h]/e+1)/2,u.y=(a[h+1]/e+1)/2,c.push(u.x,u.y)}for(let d=1;d<=t;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new Ye(a,3)),this.setAttribute("normal",new Ye(o,3)),this.setAttribute("uv",new Ye(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},vr=class i extends Xe{constructor(e=1,t=1,n=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};let l=this;r=Math.floor(r),s=Math.floor(s);let u=[],d=[],h=[],p=[],g=0,v=[],m=n/2,f=0;y(),a===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(u),this.setAttribute("position",new Ye(d,3)),this.setAttribute("normal",new Ye(h,3)),this.setAttribute("uv",new Ye(p,2));function y(){let x=new T,S=new T,_=0,R=(t-e)/n;for(let E=0;E<=s;E++){let M=[],b=E/s,C=b*(t-e)+e;for(let F=0;F<=r;F++){let U=F/r,k=U*c+o,H=Math.sin(k),D=Math.cos(k);S.x=C*H,S.y=-b*n+m,S.z=C*D,d.push(S.x,S.y,S.z),x.set(H,R,D).normalize(),h.push(x.x,x.y,x.z),p.push(U,1-b),M.push(g++)}v.push(M)}for(let E=0;E<r;E++)for(let M=0;M<s;M++){let b=v[M][E],C=v[M+1][E],F=v[M+1][E+1],U=v[M][E+1];(e>0||M!==0)&&(u.push(b,C,U),_+=3),(t>0||M!==s-1)&&(u.push(C,F,U),_+=3)}l.addGroup(f,_,0),f+=_}function w(x){let S=g,_=new ue,R=new T,E=0,M=x===!0?e:t,b=x===!0?1:-1;for(let F=1;F<=r;F++)d.push(0,m*b,0),h.push(0,b,0),p.push(.5,.5),g++;let C=g;for(let F=0;F<=r;F++){let k=F/r*c+o,H=Math.cos(k),D=Math.sin(k);R.x=M*D,R.y=m*b,R.z=M*H,d.push(R.x,R.y,R.z),h.push(0,b,0),_.x=H*.5+.5,_.y=D*.5*b+.5,p.push(_.x,_.y),g++}for(let F=0;F<r;F++){let U=S+F,k=C+F;x===!0?u.push(k,k+1,U):u.push(k+1,k,U),E+=3}l.addGroup(f,E,x===!0?1:2),f+=E}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Vh=class i extends Xe{constructor(e=[],t=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:r};let s=[],a=[];o(r),l(n),u(),this.setAttribute("position",new Ye(s,3)),this.setAttribute("normal",new Ye(s.slice(),3)),this.setAttribute("uv",new Ye(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(y){let w=new T,x=new T,S=new T;for(let _=0;_<t.length;_+=3)p(t[_+0],w),p(t[_+1],x),p(t[_+2],S),c(w,x,S,y)}function c(y,w,x,S){let _=S+1,R=[];for(let E=0;E<=_;E++){R[E]=[];let M=y.clone().lerp(x,E/_),b=w.clone().lerp(x,E/_),C=_-E;for(let F=0;F<=C;F++)F===0&&E===_?R[E][F]=M:R[E][F]=M.clone().lerp(b,F/C)}for(let E=0;E<_;E++)for(let M=0;M<2*(_-E)-1;M++){let b=Math.floor(M/2);M%2===0?(h(R[E][b+1]),h(R[E+1][b]),h(R[E][b])):(h(R[E][b+1]),h(R[E+1][b+1]),h(R[E+1][b]))}}function l(y){let w=new T;for(let x=0;x<s.length;x+=3)w.x=s[x+0],w.y=s[x+1],w.z=s[x+2],w.normalize().multiplyScalar(y),s[x+0]=w.x,s[x+1]=w.y,s[x+2]=w.z}function u(){let y=new T;for(let w=0;w<s.length;w+=3){y.x=s[w+0],y.y=s[w+1],y.z=s[w+2];let x=m(y)/2/Math.PI+.5,S=f(y)/Math.PI+.5;a.push(x,1-S)}g(),d()}function d(){for(let y=0;y<a.length;y+=6){let w=a[y+0],x=a[y+2],S=a[y+4],_=Math.max(w,x,S),R=Math.min(w,x,S);_>.9&&R<.1&&(w<.2&&(a[y+0]+=1),x<.2&&(a[y+2]+=1),S<.2&&(a[y+4]+=1))}}function h(y){s.push(y.x,y.y,y.z)}function p(y,w){let x=y*3;w.x=e[x+0],w.y=e[x+1],w.z=e[x+2]}function g(){let y=new T,w=new T,x=new T,S=new T,_=new ue,R=new ue,E=new ue;for(let M=0,b=0;M<s.length;M+=9,b+=6){y.set(s[M+0],s[M+1],s[M+2]),w.set(s[M+3],s[M+4],s[M+5]),x.set(s[M+6],s[M+7],s[M+8]),_.set(a[b+0],a[b+1]),R.set(a[b+2],a[b+3]),E.set(a[b+4],a[b+5]),S.copy(y).add(w).add(x).divideScalar(3);let C=m(S);v(_,b+0,y,C),v(R,b+2,w,C),v(E,b+4,x,C)}}function v(y,w,x,S){S<0&&y.x===1&&(a[w]=y.x-1),x.x===0&&x.z===0&&(a[w]=S/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function f(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}},Na=class extends fl{constructor(e){super(e),this.uuid=fr(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let r=e.holes[t];this.holes.push(new fl().fromJSON(r))}return this}},F1={triangulate:function(i,e,t=2){let n=e&&e.length,r=n?e[0]*t:i.length,s=_m(i,0,r,t,!0),a=[];if(!s||s.next===s.prev)return a;let o,c,l,u,d,h,p;if(n&&(s=H1(i,e,s,t)),i.length>80*t){o=l=i[0],c=u=i[1];for(let g=t;g<r;g+=t)d=i[g],h=i[g+1],d<o&&(o=d),h<c&&(c=h),d>l&&(l=d),h>u&&(u=h);p=Math.max(l-o,u-c),p=p!==0?32767/p:0}return Fo(s,a,t,o,c,p,0),a}};So=class i{static area(e){let t=e.length,n=0;for(let r=t-1,s=0;s<t;r=s++)n+=e[r].x*e[s].y-e[s].x*e[r].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],r=[],s=[];Gp(e),qp(n,e);let a=e.length;t.forEach(Gp);for(let c=0;c<t.length;c++)r.push(a),a+=t[c].length,qp(n,t[c]);let o=F1.triangulate(n,r);for(let c=0;c<o.length;c+=3)s.push(o.slice(c,c+3));return s}};pl=class i extends Vh{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}},zo=class i extends Xe{constructor(e=new Na([new ue(0,.5),new ue(-.5,-.5),new ue(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],r=[],s=[],a=[],o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let u=0;u<e.length;u++)l(e[u]),this.addGroup(o,c,u),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new Ye(r,3)),this.setAttribute("normal",new Ye(s,3)),this.setAttribute("uv",new Ye(a,2));function l(u){let d=r.length/3,h=u.extractPoints(t),p=h.shape,g=h.holes;So.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,f=g.length;m<f;m++){let y=g[m];So.isClockWise(y)===!0&&(g[m]=y.reverse())}let v=So.triangulateShape(p,g);for(let m=0,f=g.length;m<f;m++){let y=g[m];p=p.concat(y)}for(let m=0,f=p.length;m<f;m++){let y=p[m];r.push(y.x,y.y,0),s.push(0,0,1),a.push(y.x,y.y)}for(let m=0,f=v.length;m<f;m++){let y=v[m],w=y[0]+d,x=y[1]+d,S=y[2]+d;n.push(w,x,S),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Q1(t,e)}static fromJSON(e,t){let n=[];for(let r=0,s=e.shapes.length;r<s;r++){let a=t[e.shapes[r]];n.push(a)}return new i(n,e.curveSegments)}};zn=class i extends Xe{constructor(e=1,t=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,u=[],d=new T,h=new T,p=[],g=[],v=[],m=[];for(let f=0;f<=n;f++){let y=[],w=f/n,x=0;f===0&&a===0?x=.5/t:f===n&&c===Math.PI&&(x=-.5/t);for(let S=0;S<=t;S++){let _=S/t;d.x=-e*Math.cos(r+_*s)*Math.sin(a+w*o),d.y=e*Math.cos(a+w*o),d.z=e*Math.sin(r+_*s)*Math.sin(a+w*o),g.push(d.x,d.y,d.z),h.copy(d).normalize(),v.push(h.x,h.y,h.z),m.push(_+x,1-w),y.push(l++)}u.push(y)}for(let f=0;f<n;f++)for(let y=0;y<t;y++){let w=u[f][y+1],x=u[f][y],S=u[f+1][y],_=u[f+1][y+1];(f!==0||a>0)&&p.push(w,x,_),(f!==n-1||c<Math.PI)&&p.push(x,S,_)}this.setIndex(p),this.setAttribute("position",new Ye(g,3)),this.setAttribute("normal",new Ye(v,3)),this.setAttribute("uv",new Ye(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},za=class extends ye{static get type(){return"RawShaderMaterial"}constructor(e){super(e),this.isRawShaderMaterial=!0}},cn=class extends mr{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new de(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new de(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fm,this.normalScale=new ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Rn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};Oa=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],s=t[n-1];e:{t:{let a;n:{i:if(!(e<r)){for(let o=n+2;;){if(r===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=r,r=t[++n],e<r)break t}a=t.length;break n}if(!(e>=s)){let o=t[1];e<o&&(n=2,s=o);for(let c=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(r=s,s=t[--n-1],e>=s)break t}a=n,n=0;break n}break e}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(r=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r;for(let a=0;a!==r;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},qh=class extends Oa{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:kf,endingEnd:kf}}intervalChanged_(e,t,n){let r=this.parameterPositions,s=e-2,a=e+1,o=r[s],c=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Nf:s=e,o=2*t-n;break;case zf:s=r.length-2,o=t+r[s]-r[s+1];break;default:s=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Nf:a=e,c=2*n-t;break;case zf:a=1,c=n+r[1]-r[0];break;default:a=e-1,c=t}let l=(n-t)*.5,u=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=s*u,this._offsetNext=a*u}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,p=this._weightNext,g=(n-t)/(r-t),v=g*g,m=v*g,f=-h*m+2*h*v-h*g,y=(1+h)*m+(-1.5-2*h)*v+(-.5+h)*g+1,w=(-1-p)*m+(1.5+p)*v+.5*g,x=p*m-p*v;for(let S=0;S!==o;++S)s[S]=f*a[u+S]+y*a[l+S]+w*a[c+S]+x*a[d+S];return s}},Xh=class extends Oa{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,u=(n-t)/(r-t),d=1-u;for(let h=0;h!==o;++h)s[h]=a[l+h]*d+a[c+h]*u;return s}},jh=class extends Oa{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},$i=class{constructor(e,t,n,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Gc(t,this.TimeBufferType),this.values=Gc(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Gc(e.times,Array),values:Gc(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(n.interpolation=r)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new jh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Xh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new qh(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Jc:t=this.InterpolantFactoryMethodDiscrete;break;case yh:t=this.InterpolantFactoryMethodLinear;break;case iu:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Jc;case this.InterpolantFactoryMethodLinear:return yh;case this.InterpolantFactoryMethodSmooth:return iu}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,s=0,a=r-1;for(;s!==r&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==r){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,r=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(r!==void 0&&$1(r))for(let o=0,c=r.length;o!==c;++o){let l=r[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===iu,s=e.length-1,a=1;for(let o=1;o<s;++o){let c=!1,l=e[o],u=e[o+1];if(l!==u&&(o!==1||l!==e[0]))if(r)c=!0;else{let d=o*n,h=d-n,p=d+n;for(let g=0;g!==n;++g){let v=t[d+g];if(v!==t[h+g]||v!==t[p+g]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let d=o*n,h=a*n;for(let p=0;p!==n;++p)t[h+p]=t[d+p]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};$i.prototype.TimeBufferType=Float32Array;$i.prototype.ValueBufferType=Float32Array;$i.prototype.DefaultInterpolation=yh;Ds=class extends $i{constructor(e,t,n){super(e,t,n)}};Ds.prototype.ValueTypeName="bool";Ds.prototype.ValueBufferType=Array;Ds.prototype.DefaultInterpolation=Jc;Ds.prototype.InterpolantFactoryMethodLinear=void 0;Ds.prototype.InterpolantFactoryMethodSmooth=void 0;Kh=class extends $i{};Kh.prototype.ValueTypeName="color";Yh=class extends $i{};Yh.prototype.ValueTypeName="number";Zh=class extends Oa{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(r-t),l=e*o;for(let u=l+o;l!==u;l+=4)Ut.slerpFlat(s,0,a,l-o,a,l,c);return s}},ml=class extends $i{InterpolantFactoryMethodLinear(e){return new Zh(this.times,this.values,this.getValueSize(),e)}};ml.prototype.ValueTypeName="quaternion";ml.prototype.InterpolantFactoryMethodSmooth=void 0;Us=class extends $i{constructor(e,t,n){super(e,t,n)}};Us.prototype.ValueTypeName="string";Us.prototype.ValueBufferType=Array;Us.prototype.DefaultInterpolation=Jc;Us.prototype.InterpolantFactoryMethodLinear=void 0;Us.prototype.InterpolantFactoryMethodSmooth=void 0;Jh=class extends $i{};Jh.prototype.ValueTypeName="vector";Xp={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},Qh=class{constructor(e,t,n){let r=this,s=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){o++,s===!1&&r.onStart!==void 0&&r.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,r.onProgress!==void 0&&r.onProgress(u,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,d){return l.push(u,d),this},this.removeHandler=function(u){let d=l.indexOf(u);return d!==-1&&l.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=l.length;d<h;d+=2){let p=l[d],g=l[d+1];if(p.global&&(p.lastIndex=0),p.test(u))return g}return null}}},Md=new Qh,Oo=class{constructor(e){this.manager=e!==void 0?e:Md,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Oo.DEFAULT_MATERIAL_NAME="__DEFAULT";$h=class extends Oo{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=Xp.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;let o=Ro("img");function c(){u(),Xp.add(e,this),t&&t(this),s.manager.itemEnd(e)}function l(d){u(),r&&r(d),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}},gl=class extends Oo{constructor(e){super(e)}load(e,t,n,r){let s=new jn,a=new $h(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,r),s}},Ho=class extends yn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new de(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Fi=class extends Ho{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(yn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new de(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Fu=new et,jp=new T,Kp=new T,vl=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ue(512,512),this.map=null,this.mapPass=null,this.matrix=new et,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ps,this._frameExtents=new ue(1,1),this._viewportCount=1,this._viewports=[new nt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;jp.setFromMatrixPosition(e.matrixWorld),t.position.copy(jp),Kp.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Kp),t.updateMatrixWorld(),Fu.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Fu),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Fu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Yp=new et,mo=new T,ku=new T,ed=class extends vl{constructor(){super(new Tn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ue(4,2),this._viewportCount=6,this._viewports=[new nt(2,1,1,1),new nt(0,1,1,1),new nt(3,1,1,1),new nt(1,1,1,1),new nt(3,0,1,1),new nt(1,0,1,1)],this._cubeDirections=[new T(1,0,0),new T(-1,0,0),new T(0,0,1),new T(0,0,-1),new T(0,1,0),new T(0,-1,0)],this._cubeUps=[new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,0,1),new T(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,r=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),mo.setFromMatrixPosition(e.matrixWorld),n.position.copy(mo),ku.copy(n.position),ku.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ku),n.updateMatrixWorld(),r.makeTranslation(-mo.x,-mo.y,-mo.z),Yp.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Yp)}},xl=class extends Ho{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new ed}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},td=class extends vl{constructor(){super(new Pa(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ki=class extends Ho{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(yn.DEFAULT_UP),this.updateMatrix(),this.target=new yn,this.shadow=new td}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},pi=class extends Xe{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}},Ha=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Zp(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=Zp();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};Ed="\\[\\]\\.:\\/",ew=new RegExp("["+Ed+"]","g"),Sd="[^"+Ed+"]",tw="[^"+Ed.replace("\\.","")+"]",nw=/((?:WC+[\/:])*)/.source.replace("WC",Sd),iw=/(WCOD+)?/.source.replace("WCOD",tw),rw=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Sd),sw=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Sd),aw=new RegExp("^"+nw+iw+rw+sw+"$"),ow=["material","materials","bones","map"],nd=class{constructor(e,t,n){let r=n||Yt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=n.length;r!==s;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Yt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(ew,"")}static parseTrackName(e){let t=aw.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=n.nodeName.substring(r+1);ow.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let c=n(o.children);if(c)return c}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let a=e[r];if(a===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+r+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=r;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Yt.Composite=nd;Yt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Yt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Yt.prototype.GetterByBindingType=[Yt.prototype._getValue_direct,Yt.prototype._getValue_array,Yt.prototype._getValue_arrayElement,Yt.prototype._getValue_toArray];Yt.prototype.SetterByBindingTypeAndVersioning=[[Yt.prototype._setValue_direct,Yt.prototype._setValue_direct_setNeedsUpdate,Yt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Yt.prototype._setValue_array,Yt.prototype._setValue_array_setNeedsUpdate,Yt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Yt.prototype._setValue_arrayElement,Yt.prototype._setValue_arrayElement_setNeedsUpdate,Yt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Yt.prototype._setValue_fromArray,Yt.prototype._setValue_fromArray_setNeedsUpdate,Yt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];dM=new Float32Array(1),Jp=new et,bl=class{constructor(e,t,n=0,r=1/0){this.ray=new Aa(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Co,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Jp.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Jp),this}intersectObject(e,t=!0,n=[]){return id(e,this,n,t),n.sort(Qp),n}intersectObjects(e,t=!0,n=[]){for(let r=0,s=e.length;r<s;r++)id(e[r],this,n,t);return n.sort(Qp),n}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:rd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=rd)});var Hd={};U0(Hd,{computeMikkTSpaceTangents:()=>Rw,computeMorphedAttributes:()=>kw,deepCloneAttribute:()=>Pw,deinterleaveAttribute:()=>Ul,deinterleaveGeometry:()=>Iw,estimateBytesUsed:()=>Dw,interleaveAttributes:()=>Lw,mergeAttributes:()=>Od,mergeGeometries:()=>Cw,mergeGroups:()=>Nw,mergeVertices:()=>Uw,toCreasedNormals:()=>zw,toTrianglesDrawMode:()=>Fw});function Rw(i,e,t=!0){if(!e||!e.isReady)throw new Error("BufferGeometryUtils: Initialized MikkTSpace library required.");if(!i.hasAttribute("position")||!i.hasAttribute("normal")||!i.hasAttribute("uv"))throw new Error('BufferGeometryUtils: Tangents require "position", "normal", and "uv" attributes.');function n(a){if(a.normalized||a.isInterleavedBufferAttribute){let o=new Float32Array(a.count*a.itemSize);for(let c=0,l=0;c<a.count;c++)o[l++]=a.getX(c),o[l++]=a.getY(c),a.itemSize>2&&(o[l++]=a.getZ(c));return o}return a.array instanceof Float32Array?a.array:new Float32Array(a.array)}let r=i.index?i.toNonIndexed():i,s=e.generateTangents(n(r.attributes.position),n(r.attributes.normal),n(r.attributes.uv));if(t)for(let a=3;a<s.length;a+=4)s[a]*=-1;return r.setAttribute("tangent",new qe(s,4)),i!==r&&i.copy(r),i}function Cw(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},a={},o=i[0].morphTargetsRelative,c=new Xe,l=0;for(let u=0;u<i.length;++u){let d=i[u],h=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let p in d.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;s[p]===void 0&&(s[p]=[]),s[p].push(d.attributes[p]),h++}if(h!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let p in d.morphAttributes){if(!r.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(d.morphAttributes[p])}if(e){let p;if(t)p=d.index.count;else if(d.attributes.position!==void 0)p=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,p,u),l+=p}}if(t){let u=0,d=[];for(let h=0;h<i.length;++h){let p=i[h].index;for(let g=0;g<p.count;++g)d.push(p.getX(g)+u);u+=i[h].attributes.position.count}c.setIndex(d)}for(let u in s){let d=Od(s[u]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,d)}for(let u in a){let d=a[u][0].length;if(d===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let h=0;h<d;++h){let p=[];for(let v=0;v<a[u].length;++v)p.push(a[u][v][h]);let g=Od(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}return c}function Od(i){let e,t,n,r=-1,s=0;for(let l=0;l<i.length;++l){let u=i[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*t}let a=new e(s),o=new qe(a,t,n),c=0;for(let l=0;l<i.length;++l){let u=i[l];if(u.isInterleavedBufferAttribute){let d=c/t;for(let h=0,p=u.count;h<p;h++)for(let g=0;g<t;g++){let v=u.getComponent(h,g);o.setComponent(h+d,g,v)}}else a.set(u.array,c);c+=u.count*t}return r!==void 0&&(o.gpuType=r),o}function Pw(i){return i.isInstancedInterleavedBufferAttribute||i.isInterleavedBufferAttribute?Ul(i):i.isInstancedBufferAttribute?new kt().copy(i):new qe().copy(i)}function Lw(i){let e,t=0,n=0;for(let l=0,u=i.length;l<u;++l){let d=i[l];if(e===void 0&&(e=d.array.constructor),e!==d.array.constructor)return console.error("AttributeBuffers of different types cannot be interleaved"),null;t+=d.array.length,n+=d.itemSize}let r=new Po(new e(t),n),s=0,a=[],o=["getX","getY","getZ","getW"],c=["setX","setY","setZ","setW"];for(let l=0,u=i.length;l<u;l++){let d=i[l],h=d.itemSize,p=d.count,g=new Ia(r,h,s,d.normalized);a.push(g),s+=h;for(let v=0;v<p;v++)for(let m=0;m<h;m++)g[c[m]](v,d[o[m]](v))}return a}function Ul(i){let e=i.data.array.constructor,t=i.count,n=i.itemSize,r=i.normalized,s=new e(t*n),a;i.isInstancedInterleavedBufferAttribute?a=new kt(s,n,r,i.meshPerAttribute):a=new qe(s,n,r);for(let o=0;o<t;o++)a.setX(o,i.getX(o)),n>=2&&a.setY(o,i.getY(o)),n>=3&&a.setZ(o,i.getZ(o)),n>=4&&a.setW(o,i.getW(o));return a}function Iw(i){let e=i.attributes,t=i.morphTargets,n=new Map;for(let r in e){let s=e[r];s.isInterleavedBufferAttribute&&(n.has(s)||n.set(s,Ul(s)),e[r]=n.get(s))}for(let r in t){let s=t[r];s.isInterleavedBufferAttribute&&(n.has(s)||n.set(s,Ul(s)),t[r]=n.get(s))}}function Dw(i){let e=0;for(let n in i.attributes){let r=i.getAttribute(n);e+=r.count*r.itemSize*r.array.BYTES_PER_ELEMENT}let t=i.getIndex();return e+=t?t.count*t.itemSize*t.array.BYTES_PER_ELEMENT:0,e}function Uw(i,e=1e-4){e=Math.max(e,Number.EPSILON);let t={},n=i.getIndex(),r=i.getAttribute("position"),s=n?n.count:r.count,a=0,o=Object.keys(i.attributes),c={},l={},u=[],d=["getX","getY","getZ","getW"],h=["setX","setY","setZ","setW"];for(let y=0,w=o.length;y<w;y++){let x=o[y],S=i.attributes[x];c[x]=new S.constructor(new S.array.constructor(S.count*S.itemSize),S.itemSize,S.normalized);let _=i.morphAttributes[x];_&&(l[x]||(l[x]=[]),_.forEach((R,E)=>{let M=new R.array.constructor(R.count*R.itemSize);l[x][E]=new R.constructor(M,R.itemSize,R.normalized)}))}let p=e*.5,g=Math.log10(1/e),v=Math.pow(10,g),m=p*v;for(let y=0;y<s;y++){let w=n?n.getX(y):y,x="";for(let S=0,_=o.length;S<_;S++){let R=o[S],E=i.getAttribute(R),M=E.itemSize;for(let b=0;b<M;b++)x+=`${~~(E[d[b]](w)*v+m)},`}if(x in t)u.push(t[x]);else{for(let S=0,_=o.length;S<_;S++){let R=o[S],E=i.getAttribute(R),M=i.morphAttributes[R],b=E.itemSize,C=c[R],F=l[R];for(let U=0;U<b;U++){let k=d[U],H=h[U];if(C[H](a,E[k](w)),M)for(let D=0,z=M.length;D<z;D++)F[D][H](a,M[D][k](w))}}t[x]=a,u.push(a),a++}}let f=i.clone();for(let y in i.attributes){let w=c[y];if(f.setAttribute(y,new w.constructor(w.array.slice(0,a*w.itemSize),w.itemSize,w.normalized)),y in l)for(let x=0;x<l[y].length;x++){let S=l[y][x];f.morphAttributes[y][x]=new S.constructor(S.array.slice(0,a*S.itemSize),S.itemSize,S.normalized)}}return f.setIndex(u),f}function Fw(i,e){if(e===hm)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===xd||e===dm){let t=i.getIndex();if(t===null){let a=[],o=i.getAttribute("position");if(o!==void 0){for(let c=0;c<o.count;c++)a.push(c);i.setIndex(a),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,r=[];if(e===xd)for(let a=1;a<=n;a++)r.push(t.getX(0)),r.push(t.getX(a)),r.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(r.push(t.getX(a)),r.push(t.getX(a+1)),r.push(t.getX(a+2))):(r.push(t.getX(a+2)),r.push(t.getX(a+1)),r.push(t.getX(a)));r.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let s=i.clone();return s.setIndex(r),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function kw(i){let e=new T,t=new T,n=new T,r=new T,s=new T,a=new T,o=new T,c=new T,l=new T;function u(V,ee,ce,Y,be,Z,ae,fe){e.fromBufferAttribute(ee,be),t.fromBufferAttribute(ee,Z),n.fromBufferAttribute(ee,ae);let ne=V.morphTargetInfluences;if(ce&&ne){o.set(0,0,0),c.set(0,0,0),l.set(0,0,0);for(let he=0,Ge=ce.length;he<Ge;he++){let We=ne[he],ut=ce[he];We!==0&&(r.fromBufferAttribute(ut,be),s.fromBufferAttribute(ut,Z),a.fromBufferAttribute(ut,ae),Y?(o.addScaledVector(r,We),c.addScaledVector(s,We),l.addScaledVector(a,We)):(o.addScaledVector(r.sub(e),We),c.addScaledVector(s.sub(t),We),l.addScaledVector(a.sub(n),We)))}e.add(o),t.add(c),n.add(l)}V.isSkinnedMesh&&(V.applyBoneTransform(be,e),V.applyBoneTransform(Z,t),V.applyBoneTransform(ae,n)),fe[be*3+0]=e.x,fe[be*3+1]=e.y,fe[be*3+2]=e.z,fe[Z*3+0]=t.x,fe[Z*3+1]=t.y,fe[Z*3+2]=t.z,fe[ae*3+0]=n.x,fe[ae*3+1]=n.y,fe[ae*3+2]=n.z}let d=i.geometry,h=i.material,p,g,v,m=d.index,f=d.attributes.position,y=d.morphAttributes.position,w=d.morphTargetsRelative,x=d.attributes.normal,S=d.morphAttributes.position,_=d.groups,R=d.drawRange,E,M,b,C,F,U,k,H=new Float32Array(f.count*f.itemSize),D=new Float32Array(x.count*x.itemSize);if(m!==null)if(Array.isArray(h))for(E=0,b=_.length;E<b;E++)for(F=_[E],U=Math.max(F.start,R.start),k=Math.min(F.start+F.count,R.start+R.count),M=U,C=k;M<C;M+=3)p=m.getX(M),g=m.getX(M+1),v=m.getX(M+2),u(i,f,y,w,p,g,v,H),u(i,x,S,w,p,g,v,D);else for(U=Math.max(0,R.start),k=Math.min(m.count,R.start+R.count),E=U,b=k;E<b;E+=3)p=m.getX(E),g=m.getX(E+1),v=m.getX(E+2),u(i,f,y,w,p,g,v,H),u(i,x,S,w,p,g,v,D);else if(Array.isArray(h))for(E=0,b=_.length;E<b;E++)for(F=_[E],U=Math.max(F.start,R.start),k=Math.min(F.start+F.count,R.start+R.count),M=U,C=k;M<C;M+=3)p=M,g=M+1,v=M+2,u(i,f,y,w,p,g,v,H),u(i,x,S,w,p,g,v,D);else for(U=Math.max(0,R.start),k=Math.min(f.count,R.start+R.count),E=U,b=k;E<b;E+=3)p=E,g=E+1,v=E+2,u(i,f,y,w,p,g,v,H),u(i,x,S,w,p,g,v,D);let z=new Ye(H,3),N=new Ye(D,3);return{positionAttribute:f,normalAttribute:x,morphedPositionAttribute:z,morphedNormalAttribute:N}}function Nw(i){if(i.groups.length===0)return console.warn("THREE.BufferGeometryUtils.mergeGroups(): No groups are defined. Nothing to merge."),i;let e=i.groups;if(e=e.sort((a,o)=>a.materialIndex!==o.materialIndex?a.materialIndex-o.materialIndex:a.start-o.start),i.getIndex()===null){let a=i.getAttribute("position"),o=[];for(let c=0;c<a.count;c+=3)o.push(c,c+1,c+2);i.setIndex(o)}let t=i.getIndex(),n=[];for(let a=0;a<e.length;a++){let o=e[a],c=o.start,l=c+o.count;for(let u=c;u<l;u++)n.push(t.getX(u))}i.dispose(),i.setIndex(n);let r=0;for(let a=0;a<e.length;a++){let o=e[a];o.start=r,r+=o.count}let s=e[0];i.groups=[s];for(let a=1;a<e.length;a++){let o=e[a];s.materialIndex===o.materialIndex?s.count+=o.count:(s=o,i.groups.push(s))}return i}function zw(i,e=Math.PI/3){let t=Math.cos(e),n=(1+1e-10)*100,r=[new T,new T,new T],s=new T,a=new T,o=new T,c=new T;function l(v){let m=~~(v.x*n),f=~~(v.y*n),y=~~(v.z*n);return`${m},${f},${y}`}let u=i.index?i.toNonIndexed():i,d=u.attributes.position,h={};for(let v=0,m=d.count/3;v<m;v++){let f=3*v,y=r[0].fromBufferAttribute(d,f+0),w=r[1].fromBufferAttribute(d,f+1),x=r[2].fromBufferAttribute(d,f+2);s.subVectors(x,w),a.subVectors(y,w);let S=new T().crossVectors(s,a).normalize();for(let _=0;_<3;_++){let R=r[_],E=l(R);E in h||(h[E]=[]),h[E].push(S)}}let p=new Float32Array(d.count*3),g=new qe(p,3,!1);for(let v=0,m=d.count/3;v<m;v++){let f=3*v,y=r[0].fromBufferAttribute(d,f+0),w=r[1].fromBufferAttribute(d,f+1),x=r[2].fromBufferAttribute(d,f+2);s.subVectors(x,w),a.subVectors(y,w),o.crossVectors(s,a).normalize();for(let S=0;S<3;S++){let _=r[S],R=l(_),E=h[R];c.set(0,0,0);for(let M=0,b=E.length;M<b;M++){let C=E[M];o.dot(C)>t&&c.add(C)}c.normalize(),g.setXYZ(f+S,c.x,c.y,c.z)}}return u.setAttribute("normal",g),u}var Bd=Df(()=>{Nt()});Nt();Nt();var Sl={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};Nt();Nt();var _i=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},cw=new Pa(-1,1,1,-1,0,1),_d=class extends Xe{constructor(){super(),this.setAttribute("position",new Ye([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ye([0,2,0,0,2,0],2))}},lw=new _d,is=class{constructor(e){this._mesh=new xe(lw,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,cw)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var xr=class extends _i{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof ye?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ni.clone(e.uniforms),this.material=new ye({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new is(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var Vo=class extends _i{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}},_l=class extends _i{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var Wo=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new ue);this._width=n.width,this._height=n.height,t=new tn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:nn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new xr(Sl),this.copyPass.material.blending=dr,this.clock=new Ha}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let r=0,s=this.passes.length;r<s;r++){let a=this.passes[r];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){let o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Vo!==void 0&&(a instanceof Vo?n=!0:a instanceof _l&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new ue);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};Nt();var Go=class extends _i{constructor(e,t,n=null,r=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new de}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let s,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}};Nt();Nt();var Rm={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new de(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var kr=class i extends _i{constructor(e,t,n,r){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=r,this.resolution=e!==void 0?new ue(e.x,e.y):new ue(256,256),this.clearColor=new de(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new tn(s,a,{type:nn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){let h=new tn(s,a,{type:nn});h.texture.name="UnrealBloomPass.h"+d,h.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(h);let p=new tn(s,a,{type:nn});p.texture.name="UnrealBloomPass.v"+d,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),s=Math.round(s/2),a=Math.round(a/2)}let o=Rm;this.highPassUniforms=Ni.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ye({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let c=[3,5,7,9,11];s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new ue(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new T(1,1,1),new T(1,1,1),new T(1,1,1),new T(1,1,1),new T(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;let u=Sl;this.copyUniforms=Ni.clone(u.uniforms),this.blendMaterial=new ye({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:Pt,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new de,this.oldClearAlpha=1,this.basic=new ci,this.fsQuad=new is(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(n,r),this.renderTargetsVertical[s].setSize(n,r),this.separableBlurMaterials[s].uniforms.invSize.value=new ue(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(e,t,n,r,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=i.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=i.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){let t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new ye({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new ue(.5,.5)},direction:{value:new ue(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new ye({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};kr.BlurDirectionX=new ue(1,0);kr.BlurDirectionY=new ue(0,1);Nt();var Cm={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var Tl=class extends _i{constructor(){super();let e=Cm;this.uniforms=Ni.clone(e.uniforms),this.material=new za({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new is(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},St.getTransfer(this._outputColorSpace)===Dt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===sd?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ad?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===od?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===cd?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Bo?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ld&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};Nt();var Nr=class i extends xe{constructor(e,t={}){super(e),this.isReflector=!0,this.type="Reflector",this.camera=new Tn;let n=this,r=t.color!==void 0?new de(t.color):new de(8355711),s=t.textureWidth||512,a=t.textureHeight||512,o=t.clipBias||0,c=t.shader||i.ReflectorShader,l=t.multisample!==void 0?t.multisample:4,u=new Ei,d=new T,h=new T,p=new T,g=new et,v=new T(0,0,-1),m=new nt,f=new T,y=new T,w=new nt,x=new et,S=this.camera,_=new tn(s,a,{samples:l,type:nn}),R=new ye({name:c.name!==void 0?c.name:"unspecified",uniforms:Ni.clone(c.uniforms),fragmentShader:c.fragmentShader,vertexShader:c.vertexShader});R.uniforms.tDiffuse.value=_.texture,R.uniforms.color.value=r,R.uniforms.textureMatrix.value=x,this.material=R,this.onBeforeRender=function(E,M,b){if(h.setFromMatrixPosition(n.matrixWorld),p.setFromMatrixPosition(b.matrixWorld),g.extractRotation(n.matrixWorld),d.set(0,0,1),d.applyMatrix4(g),f.subVectors(h,p),f.dot(d)>0)return;f.reflect(d).negate(),f.add(h),g.extractRotation(b.matrixWorld),v.set(0,0,-1),v.applyMatrix4(g),v.add(p),y.subVectors(h,v),y.reflect(d).negate(),y.add(h),S.position.copy(f),S.up.set(0,1,0),S.up.applyMatrix4(g),S.up.reflect(d),S.lookAt(y),S.far=b.far,S.updateMatrixWorld(),S.projectionMatrix.copy(b.projectionMatrix),x.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),x.multiply(S.projectionMatrix),x.multiply(S.matrixWorldInverse),x.multiply(n.matrixWorld),u.setFromNormalAndCoplanarPoint(d,h),u.applyMatrix4(S.matrixWorldInverse),m.set(u.normal.x,u.normal.y,u.normal.z,u.constant);let C=S.projectionMatrix;w.x=(Math.sign(m.x)+C.elements[8])/C.elements[0],w.y=(Math.sign(m.y)+C.elements[9])/C.elements[5],w.z=-1,w.w=(1+C.elements[10])/C.elements[14],m.multiplyScalar(2/m.dot(w)),C.elements[2]=m.x,C.elements[6]=m.y,C.elements[10]=m.z+1-o,C.elements[14]=m.w,n.visible=!1;let F=E.getRenderTarget(),U=E.xr.enabled,k=E.shadowMap.autoUpdate;E.xr.enabled=!1,E.shadowMap.autoUpdate=!1,E.setRenderTarget(_),E.state.buffers.depth.setMask(!0),E.autoClear===!1&&E.clear(),E.render(M,S),E.xr.enabled=U,E.shadowMap.autoUpdate=k,E.setRenderTarget(F);let H=b.viewport;H!==void 0&&E.state.viewport(H),n.visible=!0},this.getRenderTarget=function(){return _},this.dispose=function(){_.dispose(),n.material.dispose()}}};Nr.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};Nt();var mi=`
  uniform float uTime, uFogK; uniform vec3 uSun, uFogCol;
  vec3 applyFog(vec3 c, vec3 w){
    vec3 d = w - cameraPosition; float l = length(d);
    float f = 1.0 - exp(-max(l - 25.0, 0.0) * uFogK);
    float s = pow(max(dot(d / l, uSun), 0.0), 6.0);
    vec3 col = uFogCol * mix(vec3(1.0), vec3(1.35, 1.05, 0.75), s);
    return mix(c, col, f);
  }`,Pm=`
  float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash12(i), hash12(i + vec2(1, 0)), f.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), f.x), f.y); }`;function qo(i,e,t=1,n=1){let r=new Xe,s=[],a=[],o=4;for(let p=0;p<o;p++){let g=p/o;s.push(-.5,g,0,.5,g,0)}s.push(0,1,0);for(let p=0;p<o-1;p++){let g=p*2;a.push(g,g+1,g+3,g,g+3,g+2)}a.push((o-1)*2,(o-1)*2+1,o*2),r.setAttribute("position",new Ye(s,3)),r.setIndex(a);let c=new pi;c.index=r.index,c.attributes.position=r.attributes.position;let l=n*9301+49297,u=()=>(l=l*16807%2147483647)/2147483647,d=new Float32Array(i*4),h=new Float32Array(i*2);for(let p=0;p<i;p++)d[p*4]=u()*e,d[p*4+1]=u()*e,d[p*4+2]=u()*Math.PI*2,d[p*4+3]=u(),h[p*2]=u(),h[p*2+1]=u()*2-1;return c.setAttribute("aOff",new kt(d,4)),c.setAttribute("aVar",new kt(h,2)),c.instanceCount=i,c}function Td(i,e=!1){return new ye({side:mt,uniforms:{uNear:{value:0},...i},defines:e?{FAR:""}:{},vertexShader:`
      ${Pm}
      uniform float uTime, uTile, uWide, uNear, uPxAng; uniform vec2 uCenter, uFade; uniform vec3 uCam; uniform vec4 uRect, uMask; uniform sampler2D tMask, tLm;
      attribute vec4 aOff; attribute vec2 aVar;
      varying float vY, vVar, vGust; varying vec3 vW, vN; varying vec2 vLmUv;
      void main(){
        vec2 wp = uCenter + mod(aOff.xy - uCenter + 0.5 * uTile, uTile) - 0.5 * uTile;
        float dist = length(wp - uCenter);
        float keep = 1.0 - smoothstep(uFade.x, uFade.y, dist);
        #ifdef FAR
          keep *= smoothstep(uNear - 6.0, uNear + 2.0, length(wp - uCam.xz));   // tufts only beyond the dense field, never under the camera
        #endif
        vec2 muv = (wp - uMask.xz) / (uMask.yw - uMask.xz);
        if (muv.x > 0.0 && muv.x < 1.0 && muv.y > 0.0 && muv.y < 1.0) keep *= smoothstep(0.35, 0.75, texture2D(tMask, muv).r);
        float clump = 0.45 + 1.05 * smoothstep(0.25, 0.75, vnoise(wp * 0.11) * 0.7 + vnoise(wp * 0.6) * 0.3);
        float h = (0.22 + aOff.w * 0.3) * clump * keep;
        #ifdef FAR
          h *= 1.35;
        #endif
        // the avenue lawn is mown short, like a palace garden, so its flower beds read; the meadow beyond stays long
        float lawn = (1.0 - smoothstep(20.0, 22.0, abs(wp.x))) * smoothstep(7.0, 9.0, wp.y) * (1.0 - smoothstep(81.0, 83.0, wp.y));
        h *= mix(1.0, 0.3, lawn);
        float y = position.y; vY = y; vVar = aVar.x;
        float a = aOff.z; vec3 side = vec3(cos(a), 0.0, sin(a)); vec3 face = vec3(-side.z, 0.0, side.x);
        // never thinner than ~1.5 px on screen: sub-pixel blades twinkle as the view moves; wider far blades are a touch shorter and darker
        float camD = length(vec3(wp.x, 0.0, wp.y) - cameraPosition);
        float minW = camD * uPxAng * 1.5;
        float wBase = max(0.03 * uWide, minW);
        float w = wBase * (1.0 - pow(y, 1.6) * 0.92) * step(0.004, h);
        // wind: slow gust fronts rolling across the field + a quick flutter
        vec2 wdir = normalize(vec2(0.8, -0.6));
        float gust = vnoise(wp * 0.045 - wdir * uTime * 1.4) * 1.7 - 0.35;   // visible gust fronts rolling across the meadow
        float flut = sin(uTime * 3.1 + aOff.w * 30.0 + wp.x * 0.9) * 0.08;
        float bend = (aVar.y * 0.25 + gust * 0.95 + flut) * y * y; vGust = clamp(gust, 0.0, 1.5);
        vec3 p = vec3(wp.x, 0.0, wp.y) + side * position.x * w + vec3(0.0, y * h * (1.0 - 0.18 * abs(bend)), 0.0);
        p.xz += (wdir * bend * 0.9 + face.xz * aVar.y * 0.25 * y * y) * h;
        vN = normalize(mix(face, vec3(0.0, 1.0, 0.0), 0.55));
        vLmUv = vec2((wp.x - uRect.x) / (uRect.y - uRect.x), (uRect.w - wp.y) / (uRect.w - uRect.z));
        vec4 wpos = vec4(p, 1.0); vW = wpos.xyz;
        gl_Position = projectionMatrix * viewMatrix * wpos;
      }`,fragmentShader:`
      ${mi}
      uniform sampler2D tLm; uniform float uK;
      varying float vY, vVar, vGust; varying vec3 vW, vN; varying vec2 vLmUv;
      vec3 lmDecode(vec3 c, float K){ return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)) * K; }
      void main(){
        // MSAA can shade a sample just outside a thin blade: varyings arrive extrapolated, so clamp them
        float y = clamp(vY, 0.0, 1.0); float var = clamp(vVar, 0.0, 1.0);
        vec3 nN = dot(vN, vN) > 1e-6 ? normalize(vN) : vec3(0.0, 1.0, 0.0);
        vec2 uv = clamp(vLmUv, 0.002, 0.998);
        float inside = step(0.0, vLmUv.x) * step(vLmUv.x, 1.0) * step(0.0, vLmUv.y) * step(vLmUv.y, 1.0);
        vec3 L = mix(lmDecode(vec3(0.83), uK), lmDecode(texture2D(tLm, uv).rgb, uK), inside);
        vec3 tip = mix(vec3(0.19, 0.25, 0.05), vec3(0.4, 0.36, 0.14), smoothstep(0.55, 1.0, var));
        vec3 root = vec3(0.035, 0.05, 0.015);
        vec3 alb = mix(root, tip, pow(y, 0.7));
        vec3 V = normalize(cameraPosition - vW);
        float lit = clamp(dot(L, vec3(0.33)) / max(dot(lmDecode(vec3(0.83), uK), vec3(0.33)), 1e-3), 0.0, 1.2);   // 1 in sun, low in shadow
        float trans = pow(max(dot(-V, uSun), 0.0), 3.0) * lit * y * 0.6;                                           // backlit blades glow
        vec3 c = alb * L * (0.55 + 0.45 * y) + vec3(0.9, 0.85, 0.3) * alb * trans * 1.6;
        c += vec3(0.02, 0.022, 0.012) * pow(clamp(1.0 - abs(dot(nN, V)), 0.0, 1.0), 3.0) * L * y;                   // sheen at grazing angles
        c *= 1.0 + clamp(vGust, 0.0, 1.5) * 0.22 * y;                                    // bent blades catch more sky: the gusts are visible
        gl_FragColor = vec4(applyFog(clamp(c, vec3(0.0), vec3(1.2)), vW), 1.0);
      }`})}Nt();function Lm(i,e,t){let n=new pl(1,0),r=new pi;r.attributes.position=n.attributes.position,r.attributes.normal=n.attributes.normal;let s=[],a=[],o=77,c=()=>(o=o*16807%2147483647)/2147483647;for(let[u,d,h,p,g]of i){let v=Math.max(g,.6)*1.05,m=Math.round(e*Math.min(1.6,p*v/9));for(let f=0;f<m;f++){let y=Math.pow(c(),.85),w=(y<.22?Math.sqrt(y/.22):Math.pow((1-y)/.78,.85))*v;y<.04&&(w*=.5);let x=c()*Math.PI*2,S=w*(.55+.45*Math.sqrt(c())),_=.16+c()*.2;s.push(u+Math.cos(x)*S,d+.25+y*p,h+Math.sin(x)*S,_*(.7+.6*(1-y))),a.push(u,d,h,p)}}r.setAttribute("aC",new kt(new Float32Array(s),4)),r.setAttribute("aT",new kt(new Float32Array(a),4)),r.instanceCount=s.length/4;let l=new xe(r,new ye({uniforms:t,vertexShader:`
      uniform float uTime; attribute vec4 aC, aT; varying vec3 vW, vN, vR; varying float vRel, vVar;
      float h1(float n){ return fract(sin(n) * 43758.5453); }
      void main(){
        vec3 c = aC.xyz; float rel = clamp((c.y - aT.y) / aT.w, 0.0, 1.0); vRel = rel;
        float ph = aT.x * 0.37 + aT.z * 0.11;
        vec2 sway = vec2(0.8, -0.6) * (sin(uTime * 0.9 + ph) * 0.5 + 0.35) * 0.22 * rel * rel;
        c.xz += sway * aT.w * 0.12;
        vec3 p = c + position * aC.w * vec3(1.0, 1.35, 1.0);
        vR = normalize(vec3(c.x - aT.x, 0.25, c.z - aT.z));
        vN = normalize(normal); vVar = h1(aC.x * 12.9 + aC.z * 7.1);
        vW = p; gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
      }`,fragmentShader:`
      ${mi}
      varying vec3 vW, vN, vR; varying float vRel, vVar;
      void main(){
        vec3 n = mix(vN, vR, 0.6); n = dot(n, n) > 1e-6 ? normalize(n) : vec3(0.0, 1.0, 0.0);
        vec3 alb = mix(vec3(0.022, 0.045, 0.016), vec3(0.06, 0.09, 0.03), vVar);
        float nd = max(dot(n, uSun), 0.0);
        float facing = smoothstep(-0.2, 0.6, dot(vR, uSun));            // the sun side of the crown
        vec3 sun = vec3(1.0, 0.72, 0.48) * 6.0 / 3.14159 * nd * mix(0.25, 1.0, facing);
        vec3 amb = vec3(0.16, 0.2, 0.27) * (0.55 + 0.45 * clamp(vRel, 0.0, 1.0)) * (0.6 + 0.4 * dot(vN, vR));
        vec3 c = alb * (sun + amb);
        c += alb * vec3(0.6, 0.8, 0.2) * pow(max(dot(normalize(vW - cameraPosition), uSun), 0.0), 4.0) * 0.8;   // light through the edge when backlit
        gl_FragColor = vec4(applyFog(clamp(c, vec3(0.0), vec3(1.0)), vW), 1.0);
      }`}));return l.frustumCulled=!1,l}Nt();var Ad=(i,e,t,n)=>Math.floor(i/n)+","+Math.floor(e/n)+","+Math.floor(t/n),Rd=(i,e,t,n)=>{var s;let r=(s=i.userData).cells||(s.cells=[]);for(let a of t)a.userData.far=n>0?5/n:1e9,r.push(a);return e};function Im(i,e,{cell:t=48,fogK:n=0,minTris:r=24e3}={}){let s=i.geometry,a=s.index,o=s.attributes.position;if(!a||a.count/3<r)return i;let c=a.count/3,l=a.array,u=o.array,d=new Int32Array(c),h=new Map,p=[];for(let S=0;S<c;S++){let _=l[S*3]*3,R=l[S*3+1]*3,E=l[S*3+2]*3,M=Ad((u[_]+u[R]+u[E])/3,(u[_+1]+u[R+1]+u[E+1])/3,(u[_+2]+u[R+2]+u[E+2])/3,t),b=h.get(M);b===void 0&&(b=p.length,h.set(M,b),p.push(M)),d[S]=b}let g=p.length,v=new Uint32Array(g+1);for(let S=0;S<c;S++)v[d[S]+1]++;for(let S=0;S<g;S++)v[S+1]+=v[S];let m=v.slice(0,g),f=new Uint32Array(l.length);for(let S=0;S<c;S++){let _=m[d[S]]++*3;f[_]=l[S*3],f[_+1]=l[S*3+1],f[_+2]=l[S*3+2]}let y=new qe(f,1),w=new $n,x=[];for(let S=0;S<g;S++){let _=v[S],R=v[S+1];if(R===_)continue;let E=new Xe;for(let C in s.attributes)E.setAttribute(C,s.attributes[C]);E.setIndex(y),E.setDrawRange(_*3,(R-_)*3);let M=new Di;for(let C=_*3;C<R*3;C++){let F=f[C]*3;M.expandByPoint(Dm.set(u[F],u[F+1],u[F+2]))}E.boundingBox=M,E.boundingSphere=M.getBoundingSphere(new An);let b=new xe(E,i.material);b.frustumCulled=!0,b.renderOrder=i.renderOrder,b.layers.mask=i.layers.mask,w.add(b),x.push(b)}return w.name=(i.name||"static")+"-cells",w.renderOrder=i.renderOrder,Rd(e,w,x,n)}var Dm=new T;function Wa(i,e,{cell:t=40,fogK:n=0,minCount:r=160,far:s=0}={}){let a=i.count;if(a<r)return i;let o=i.instanceMatrix.array,c=i.instanceColor?i.instanceColor.array:null,l=new Map;for(let h=0;h<a;h++){let p=Ad(o[h*16+12],o[h*16+13],o[h*16+14],t);(l.get(p)||l.set(p,[]).get(p)).push(h)}let u=new $n,d=[];for(let h of l.values()){let p=new wn(i.geometry,i.material,h.length);h.forEach((g,v)=>{p.instanceMatrix.array.set(o.subarray(g*16,g*16+16),v*16),c&&p.setColorAt(v,uw.fromArray(c,g*3))}),p.instanceMatrix.needsUpdate=!0,p.instanceColor&&(p.instanceColor.needsUpdate=!0),p.frustumCulled=!0,p.renderOrder=i.renderOrder,p.layers.mask=i.layers.mask,u.add(p),d.push(p)}if(u.name=(i.name||"instances")+"-cells",Rd(e,u,d,n),s)for(let h of d)h.userData.far=Math.min(h.userData.far,s);return u}var uw=new de;function rs(i,e,{at:t="aC",cell:n=40,pad:r=3,fogK:s=0,minCount:a=400}={}){let o=i.geometry,c=o.instanceCount;if(!o.isInstancedBufferGeometry||c<a)return i;let l=[];for(let m in o.attributes)o.attributes[m].isInstancedBufferAttribute&&l.push(m);let u=o.attributes[t],d=u.array,h=u.itemSize,p=new Map;for(let m=0;m<c;m++){let f=Ad(d[m*h],d[m*h+1],d[m*h+2],n);(p.get(f)||p.set(f,[]).get(f)).push(m)}let g=new $n,v=[];for(let m of p.values()){let f=new pi;f.index=o.index;for(let x in o.attributes)l.includes(x)||f.setAttribute(x,o.attributes[x]);for(let x of l){let S=o.attributes[x],_=S.itemSize,R=new Float32Array(m.length*_);m.forEach((E,M)=>{for(let b=0;b<_;b++)R[M*_+b]=S.array[E*_+b]}),f.setAttribute(x,new kt(R,_))}f.instanceCount=m.length;let y=new Di;for(let x of m)y.expandByPoint(Dm.set(d[x*h],d[x*h+1],d[x*h+2]));y.expandByScalar(r),f.boundingBox=y,f.boundingSphere=y.getBoundingSphere(new An);let w=new xe(f,i.material);w.frustumCulled=!0,w.renderOrder=i.renderOrder,w.layers.mask=i.layers.mask,g.add(w),v.push(w)}return g.name=(i.name||"instanced-geo")+"-cells",Rd(e,g,v,s)}var Al=new An;function Cd(i,e){let t=i.userData.cells;if(t)for(let n of t){n.isInstancedMesh?(n.boundingSphere||n.computeBoundingSphere(),Al.copy(n.boundingSphere)):Al.copy(n.geometry.boundingSphere);let r=Math.max(0,e.distanceTo(Al.center)-Al.radius);n.visible=r<n.userData.far}}Nt();var Xo={y:9,z:150},er=7.3,Rl=8.1,Cl=5.5+2.9,Um=[{pos:[0,9.4,Xo.z+26],tgt:[0,5.2,Xo.z],w:1.5},{pos:[-12,7.6,Xo.z-4],tgt:[0,10,60],w:1.4},{pos:[0,7.5,128],tgt:[0,10,20],w:1.4},{pos:[0,1.75,82],tgt:[0,6.5,26],w:1.4},{pos:[-4.3,1.9,48],tgt:[0,7.5,24],w:1},{pos:[2,3.4,18],tgt:[0,14,-30],w:1.2},{pos:[0,5.8,2],tgt:[0,20,-16],w:1.2},{pos:[0,6.8,-9],tgt:[0,9,-40],w:1},{pos:[0,er,-20],tgt:[0,8.6,-50],w:1},{pos:[0,er,-27.5],tgt:[0,8.6,-60],w:1.1},{pos:[.6,er,-31.4],tgt:[-Rl,Cl,-32],w:1.5},{pos:[0,er,-34.6],tgt:[0,8.5,-70],w:.9},{pos:[-.6,er,-35.8],tgt:[Rl,Cl,-36.4],w:1.5},{pos:[0,er,-39],tgt:[0,8.5,-70],w:.9},{pos:[.6,er,-40.2],tgt:[-Rl,Cl,-40.8],w:1.5},{pos:[0,er,-43.4],tgt:[0,8.4,-70],w:.9},{pos:[-.6,er,-44.6],tgt:[Rl,Cl,-45.2],w:1.2},{pos:[-.2,er,-46.4],tgt:[0,8.2,-80],w:.8},{pos:[0,er,-49],tgt:[0,8,-80],w:1},{pos:[0,7.4,-53],tgt:[0,7.6,-90],w:0}],as=[0];Um.slice(0,-1).forEach(i=>as.push(as[as.length-1]+i.w));var Pd=as[as.length-1],ss=i=>as[i]/Pd,Fs=as[2]/Pd,Pl=i=>(as[2]+i*12.2)/Pd,Ga=1,Ll={pos:[0,9.1,-53.35],size:[4.5,7.2]};var ZM=new T(0,Xo.y,Xo.z),Fm=[{at:[0,Fs*.55],kick:"Welcome to Nomadiic Horse Designs",line:"Turn our horse, then scroll to step inside."},{at:[Fs*.55,Pl(.2)],kick:"We are Nomadiic Horse Designs",line:"A very detailed design team from Bangalore, India."},{at:[Pl(.2),Pl(.36)],kick:"Our philosophy",line:"We build brands the way the Greeks built palaces: with proportion, patience and a little audacity."},{at:[Pl(.36),ss(9)],kick:"What we make",line:"Branding and websites for founders who want to be remembered."},{at:[ss(9),ss(11)],kick:"About us",line:"Selected as Top 1% Framer Designers."},{at:[ss(11),ss(13)],kick:"About us",line:"Selected as Framer Experts by Team Framer."},{at:[ss(13),ss(15)],kick:"About us",line:"Selected as a Shopify Partner."},{at:[ss(15),1.01],kick:"About us",line:"20+ clients across India, the USA and Australia. Step through, and meet a few of them."}];function os(i=Um){let e=i.length,t=new Fa(i.map(x=>new T(...x.pos)),!1,"centripetal",.5),n=new Fa(i.map(x=>new T(...x.tgt)),!1,"centripetal"),r=i.slice(0,-1).map(x=>x.w||1),s=[0];r.forEach(x=>s.push(s[s.length-1]+x));let a=s[s.length-1],o=4e3,c=t.getLengths(o),l=i.map((x,S)=>c[Math.round(S/(e-1)*o)]),u=r.map((x,S)=>Math.max(l[S+1]-l[S],.001)),d=r.map((x,S)=>s[S]+x/2),h=r.map((x,S)=>u[S]/x),p=x=>{if(x<=d[0])return h[0];for(let S=0;S<h.length-1;S++)if(x<=d[S+1])return ht.lerp(h[S],h[S+1],(x-d[S])/(d[S+1]-d[S]));return h[h.length-1]},g=x=>{let S=0,_=120;for(let R=0;R<_;R++)S+=p(s[x]+(R+.5)/_*r[x]);return S/_*r[x]};for(let x=0;x<60;x++)h=h.map((S,_)=>Math.max(.05,S*Math.pow(u[_]/Math.max(g(_),1e-6),.7)));let v=6e3,m=new Float32Array(v+1);for(let x=1;x<=v;x++){let S=(x-1)/v*a,_=x/v*a;m[x]=m[x-1]+p((S+_)/2)*(_-S)}let f=c[o]/m[v],y=x=>{let S=0,_=o;for(;S<_;){let b=S+_>>1;c[b]<x?S=b+1:_=b}let R=Math.max(1,S),E=c[R-1],M=c[R];return(R-1+(M>E?(x-E)/(M-E):0))/o},w=x=>{let S=ht.clamp(x,0,1)*v,_=Math.floor(S),R=S-_;return y((_>=v?m[v]:m[_]+(m[_+1]-m[_])*R)*f)};return{sample(x,S,_){let R=w(x);return t.getPoint(R,S),n.getPoint(R,_),R*(e-1)}}}var Ld=[{lines:["Selected as","Top 1% Framer Designers"],x:-7.66,z:-32},{lines:["Selected as","Framer Experts by Team Framer"],x:7.66,z:-36.4},{lines:["Selected as","Shopify Partner"],x:-7.66,z:-40.8},{lines:["20+ clients","India \xB7 USA \xB7 Australia"],x:7.66,z:-45.2}];Nt();var km="data:image/webp;base64,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",Nm="data:image/webp;base64,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";function zm(){let i=typeof matchMedia<"u"&&matchMedia("(prefers-reduced-motion: reduce)").matches,e=null,t="",n=!1,r=0,s=0,a=2.5,o=-99,c=0,l=0,u=[.5,.7],d=.8,h=()=>{e&&(document.hidden?e.pause():n||e.play().catch(()=>{}))};typeof document<"u"&&document.addEventListener("visibilitychange",h);let p=()=>{try{e||(e=new Audio(t+"score2.m4a"),e.loop=!0,e.volume=0,r=0),e.play().catch(v=>{console.warn("[score]",v),n=!0})}catch(v){console.warn("[score]",v),n=!0}},g={flash:0,flashPos:u,rain:1,started:!1,get strikeId(){return c},start(v,m){g.started=!0,t=m,n=!v,v&&p()},strike(v=.6+Math.random()*.4,m=null){o=s,l=v,c++,u[0]=m?m[0]:.2+Math.random()*.6,u[1]=m?m[1]:.62+Math.random()*.3},mix:1,setMix(v){g.mix=v},amb:"",setAmb(v){g.amb=v},setMuted(v){n=v,v||p()},get muted(){return n},get hasSound(){return!!e},update(v,m=!0){if(s+=v,e){let y=n?0:d*Math.min(1,r+=v*.4);e.volume+=(y-e.volume)*Math.min(1,v*3),n&&e.volume<.01&&!e.paused&&e.pause()}g.started&&m&&s>a&&(g.strike(),a=s+2.5+Math.random()*5.5);let f=s-o;return g.flash=f<0?0:(i?.3:1)*l*(f<.05?f/.05:Math.exp(-(f-.05)*14)+(f>.16&&f<.5?.75*Math.exp(-(f-.16)*9):0)+(f>.42?.35*Math.exp(-(f-.42)*6):0)),g.flash},destroy(){try{e&&e.pause(),document.removeEventListener("visibilitychange",h)}catch{}}};return g}var hw=`
.nst{position:absolute;inset:0;z-index:30;color:#e8edf6;font-family:Satoshi,system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0b0f1a}
.nst .sky{position:absolute;inset:-8%;background:#0b0f1a center/cover no-repeat;animation:nstDrift 40s ease-in-out infinite alternate;transition:opacity 1.1s ease .1s;will-change:transform,opacity}
@keyframes nstDrift{from{transform:scale(1)}to{transform:scale(1.09) translate(-1.5%,1%)}}
.nst .coin{position:relative;width:min(44vmin,340px);aspect-ratio:1;flex:none;transition:transform 1.1s cubic-bezier(.45,0,.15,1),opacity .7s ease .55s;will-change:transform,opacity}
.nst .coin img{position:absolute;inset:8.5%;width:83%;height:83%;display:block;-webkit-user-drag:none;user-select:none}
.nst .ring{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg);transition:opacity .5s ease}
.nst .ring circle{fill:none;stroke-width:.55}
.nst .ring .t{stroke:rgba(232,237,246,.14)}
.nst .ring .p{stroke:#f2c778;stroke-linecap:round;transition:stroke-dashoffset .35s linear}
.nst .wm{position:relative;margin-top:30px;font-family:"Nomadiic Line",Satoshi,sans-serif;font-size:13px;letter-spacing:.5em;padding-left:.5em;white-space:nowrap}
.nst .go{position:relative;margin-top:26px;display:flex;flex-direction:column;align-items:center;gap:6px}
.nst .wm,.nst .go{opacity:0;transform:translateY(8px);transition:opacity .7s ease,transform .7s ease;pointer-events:none}
.nst.on .wm,.nst.on .go{opacity:1;transform:none}
.nst.on .go{pointer-events:auto}
.nst.in .wm,.nst.in .go{opacity:0;transition:opacity .25s ease;pointer-events:none}
.nst.in{background:transparent;pointer-events:none}
.nst.in .sky{opacity:0;animation-play-state:paused}
.nst.in .ring{opacity:0}
.nst button{all:unset;cursor:pointer;-webkit-tap-highlight-color:transparent}
.nst .enter{font-size:12px;letter-spacing:.42em;padding:15px 26px 15px 31px;border:1px solid rgba(232,237,246,.42);transition:border-color .3s,background .3s}
.nst .enter:hover{border-color:rgba(232,237,246,.95);background:rgba(232,237,246,.07)}
.nst .quiet{font-size:10.5px;letter-spacing:.26em;padding:12px 10px;color:rgba(232,237,246,.66);transition:color .3s}
.nst .quiet:hover{color:#fff}
.nst button:focus-visible{outline:2px solid #ffd9a8;outline-offset:4px}
.nst .err{position:absolute;bottom:12%;left:0;right:0;text-align:center;font-size:14px;line-height:1.6;padding:0 24px}
.nst .err button{display:block;margin:10px auto 0;font-size:12px;letter-spacing:.3em;padding:12px 22px;border:1px solid rgba(232,237,246,.42)}
@media (max-width:640px){.nst .wm{font-size:10px;letter-spacing:.38em;padding-left:.38em;margin-top:24px}.nst .coin{width:min(58vw,300px)}}
@media (max-height:480px){.nst .coin{width:38vh}.nst .wm{margin-top:12px}.nst .go{margin-top:10px;flex-direction:row;gap:14px}}
@media (prefers-reduced-motion:reduce){.nst .sky{animation:none}}
`;function Om(i,e,t,{onDone:n}={}){if(!document.getElementById("nst-css")){let m=document.createElement("style");m.id="nst-css",m.textContent=hw,document.head.appendChild(m)}let r=document.createElement("div");r.className="nst";let s=2*Math.PI*49;r.innerHTML=`<div class="sky" style="background-image:url(${km})"></div>
    <div class="coin"><img src="${Nm}" alt="Nomadiic Horse Designs" draggable="false"><svg class="ring" viewBox="0 0 100 100" aria-hidden="true"><circle class="t" cx="50" cy="50" r="49"/><circle class="p" cx="50" cy="50" r="49" stroke-dasharray="${s}" stroke-dashoffset="${s}"/></svg></div>
    <div class="wm">NOMADIIC HORSE DESIGNS</div>
    <div class="go"><button class="enter" type="button">ENTER</button><button class="quiet" type="button">WITHOUT SOUND</button></div>`,i.appendChild(r);let a=r.querySelector(".coin"),o=r.querySelector(".p"),c="load",l=0,u=0,d=null,h=!0,p=()=>o.setAttribute("stroke-dashoffset",String(s*(1-Math.max(l,u)))),g=setInterval(()=>{u<.88&&c==="load"&&(u=Math.min(.88,Math.max(u,l)+.004),p())},120),v=m=>{if(c==="ready"){if(c="dive",e.start(m,t),d){let f=a.getBoundingClientRect(),y=i.getBoundingClientRect(),w=2*d[2]*1.14/(f.width*.83);a.style.transform=`translate(${d[0]+y.left-(f.left+f.width/2)}px, ${d[1]+y.top-(f.top+f.height/2)}px) scale(${w})`}a.style.opacity="0",r.classList.add("in"),setTimeout(()=>{n&&n()},950),setTimeout(()=>{h=!1,r.remove()},1750)}};return r.querySelector(".enter").onclick=()=>v(!0),r.querySelector(".quiet").onclick=()=>v(!1),{get diving(){return c==="dive"},get showing(){return c!=="load"},setTarget(m,f,y){d=[m,f,y]},setProgress(m){l=Math.max(l,Math.min(1,m)),p()},ready(){c==="load"&&(c="ready",clearInterval(g),l=1,p(),setTimeout(()=>{h&&r.classList.add("on")},300))},fail(){if(!h||r.querySelector(".err"))return;clearInterval(g);let m=document.createElement("div");m.className="err",m.innerHTML='The connection dropped.<button type="button">TRY AGAIN</button>',m.querySelector("button").onclick=()=>location.reload(),r.appendChild(m)},destroy(){h=!1,clearInterval(g),r.remove()}}}var Il=`
  float sh_(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float sn_(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(sh_(i), sh_(i + vec2(1, 0)), f.x), mix(sh_(i + vec2(0, 1)), sh_(i + vec2(1, 1)), f.x), f.y); }
  float sf_(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * sn_(p); p = mat2(0.8, -0.6, 0.6, 0.8) * p * 2.02 + 7.1; a *= 0.5; } return s * 1.07; }
  float sf2_(vec2 p){ return (sn_(p) * 0.6 + sn_(p * 2.1 + 3.7) * 0.4); }
  vec3 stormSky(vec3 d, float t, float flash){             // a low, heavy deck rolling overhead, its underside lit by the lightning
    vec2 q = d.xz / (max(d.y, 0.0) + 0.12) * 0.55 + vec2(t * 0.012, t * 0.004);
    vec2 w = vec2(sf2_(q * 0.8 + t * 0.01), sf2_(q * 0.8 + 5.3));                 // a cheap warp (4 noise reads), then one detailed deck (4)
    float c = smoothstep(0.34, 0.78, sf_(q + 2.6 * w));
    float edge = clamp(0.5 + (w.x - w.y) * 1.6, 0.0, 1.0);                         // the side facing the light, from the warp itself
    vec3 base = mix(vec3(0.05, 0.055, 0.07), vec3(0.4, 0.42, 0.47), clamp(edge * 0.75 * (1.0 - c * 0.6) + (1.0 - c) * 0.35, 0.0, 1.0));   // heavy dark bellies, lit rims
    base = mix(base, vec3(0.24, 0.26, 0.3), smoothstep(0.25, -0.02, d.y));   // towards the horizon the deck is rain and haze
    return base * (1.0 + flash * 2.6 * (0.35 + c));
  }`;function Hm(){let i=new $n;i.frustumCulled=!1;let e=new ci({color:new de(9,10,14),transparent:!0,opacity:0,blending:Pt,depthWrite:!1,side:mt,fog:!1,toneMapped:!0});e.forceSinglePass=!0;let t=new xe(new Xe().setAttribute("position",new Ye([0,0,0,0,0,0,0,0,0],3)),e);t.frustumCulled=!1,t.renderOrder=9,i.add(t);let n=T,r=new n(0,1,0),s=(o,c,l,u,d)=>{if(u===0){d.push(c.clone());return}let h=o.clone().lerp(c,.5);h.x+=(Math.random()-.5)*l,h.z+=(Math.random()-.5)*l,h.y+=(Math.random()-.5)*l*.3,s(o,h,l*.55,u-1,d),s(h,c,l*.55,u-1,d)},a=(o,c,l,u)=>{for(let d=0;d<o.length-1;d++){let h=o[d],p=o[d+1],g=c*(1-d/o.length*.4),v=c*(1-(d+1)/o.length*.4),m=h.clone().addScaledVector(l,-g),f=h.clone().addScaledVector(l,g),y=p.clone().addScaledVector(l,-v),w=p.clone().addScaledVector(l,v);for(let x of[m,f,w,m,w,y])u.push(x.x,x.y,x.z)}};return{group:i,strike(o,c=0){let l=new n;o.getWorldDirection(l),l.y=0,l.normalize();let u=l.clone().applyAxisAngle(r,(Math.random()-.5)*1.3),d=260+Math.random()*700,h=o.position.clone().addScaledVector(u,d);h.y=c;let p=h.clone();p.y=c+300+Math.random()*220,p.x+=(Math.random()-.5)*140,p.z+=(Math.random()-.5)*140;let g=new n().crossVectors(u,r).normalize(),v=1.2+d*.0042,m=[p.clone()];s(p,h,90,6,m);let f=[];a(m,v,g,f);for(let w=0;w<4;w++){let x=6+Math.floor(Math.random()*(m.length*.6)),S=m[x];if(!S)continue;let _=S.clone().add(new n((Math.random()-.5)*120,-(40+Math.random()*120),(Math.random()-.5)*120)),R=[S.clone()];s(S,_,40,4,R),a(R,v*.45,g,f)}t&&(i.remove(t),t.geometry.dispose());let y=new Xe;y.setAttribute("position",new Ye(f,3)),t=new xe(y,e),t.frustumCulled=!1,t.renderOrder=9,i.add(t)},update(o){e.opacity=Math.min(1,o*1.5),i.visible=o>.01}}}Nt();var cs=new et,ks=new Ut,Dl=new T,qa=new T,Id=new Rn;function jo({count:i=40,center:e=[0,60,0],radius:t=80,height:n=18,size:r=1,color:s=1447964,speed:a=1,glide:o=.5}={}){let c=[],l=[],u=(R,E,M,b,C,F,U,k)=>{c.push(...R,...E,...M,...R,...M,...b),l.push(C,F,U,C,U,k)};for(let R of[-1,1])u([0,0,.18],[R*.45,0,.12],[R*.45,0,-.12],[0,0,-.14],0,.55*R,.55*R,0),u([R*.45,0,.12],[R*1,0,-.02],[R*.95,0,-.2],[R*.45,0,-.12],.55*R,1*R,1*R,.55*R);c.push(0,0,.42,.07,0,0,0,0,-.5,0,0,.42,0,0,-.5,-.07,0,0),l.push(0,0,0,0,0,0);let d=new Xe;d.setAttribute("position",new Ye(c,3)),d.setAttribute("aWing",new Ye(l,1));let h=new Float32Array(i),p=new Float32Array(i);for(let R=0;R<i;R++)h[R]=Math.random()*6.28,p[R]=7+Math.random()*4;d.setAttribute("aPhase",new kt(h,1)),d.setAttribute("aBeat",new kt(p,1));let g=new kt(new Float32Array(i),1);g.setUsage(mm),d.setAttribute("aFlap",g);let v=new ye({side:mt,uniforms:{uTime:{value:0},uCol:{value:new de(s)},uFog:{value:new nt(.6,.65,.7,7e-4)}},vertexShader:`uniform float uTime; attribute float aWing, aPhase, aBeat, aFlap; varying float vD;
      void main(){ vec3 p = position; float w = abs(aWing);
        float a = sin(uTime * aBeat + aPhase) * aFlap;                        // a wing beat; aFlap = 0 when gliding
        p.y += (a * 0.9 + 0.12) * w * w * 1.1; p.x *= 1.0 - abs(a) * 0.12 * w;  // the wingtips travel furthest, the span folds a little on the beat
        vec4 mv = modelViewMatrix * instanceMatrix * vec4(p, 1.0); vD = -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:"uniform vec3 uCol; uniform vec4 uFog; varying float vD; void main(){ gl_FragColor = vec4(mix(uCol, uFog.rgb, 1.0 - exp(-vD * uFog.a)), 1.0); }"}),m=new wn(d,v,i);m.frustumCulled=!1;let f=Array.from({length:i},()=>({o:new T((Math.random()-.5)*30,(Math.random()-.5)*8,(Math.random()-.5)*30),ph:Math.random()*100,glideT:Math.random()*4,gl:!1,prev:new T})),y=new T(...e),w=new T,x=new T,S=new T(0,1,0),_=(R,E,M)=>{let b=R*.045*a;return M.set(y.x+Math.cos(b)*t+Math.sin(b*1.7)*t*.3,y.y+Math.sin(b*.9)*n,y.z+Math.sin(b)*t*.75+Math.cos(b*1.3)*t*.25),M.x+=E.o.x+Math.sin(R*.35+E.ph)*6,M.y+=E.o.y+Math.sin(R*.5+E.ph*1.3)*2.5,M.z+=E.o.z+Math.cos(R*.3+E.ph)*6,M};return{mesh:m,update(R,E,M,b){v.uniforms.uTime.value=R,M&&v.uniforms.uFog.value.set(M.r,M.g,M.b,b);for(let C=0;C<i;C++){let F=f[C];_(R,F,qa),_(R+.25,F,w),x.subVectors(w,qa),F.glideT-=E,F.glideT<0&&(F.gl=!F.gl,F.glideT=F.gl?1.5+Math.random()*3*o:1+Math.random()*2.5),g.array[C]+=((F.gl?.08:1)-g.array[C])*Math.min(1,E*3);let U=Math.atan2(x.x,x.z),k=-Math.atan2(x.y,Math.hypot(x.x,x.z))*.6,H=ht.clamp(-(x.x*F.prev.z-x.z*F.prev.x)*4,-.7,.7);F.prev.copy(x),ks.setFromEuler(Id.set(k,U,H,"YXZ")),cs.compose(qa,ks,Dl.setScalar(r*(.85+C%5*.06))),m.setMatrixAt(C,cs)}m.instanceMatrix.needsUpdate=!0,g.needsUpdate=!0}}}function Bm({count:i=24,box:e=[-20,20,.4,3,-20,20],colors:t=[15905076,15265522,14178090,7317724]}={}){let n=[],r=[];for(let h of[-1,1])n.push(0,0,.05,h*.09,0,.09,h*.1,0,-.02,0,0,.05,h*.1,0,-.02,0,0,-.05,0,0,-.05,h*.1,0,-.02,h*.07,0,-.1),r.push(0,h,h,0,h,0,0,h,h);let s=new Xe;s.setAttribute("position",new Ye(n,3)),s.setAttribute("aWing",new Ye(r,1));let a=new Float32Array(i*3),o=new Float32Array(i),c=new de;for(let h=0;h<i;h++)c.set(t[h%t.length]),a.set([c.r,c.g,c.b],h*3),o[h]=Math.random()*6.28;s.setAttribute("aCol",new kt(a,3)),s.setAttribute("aPhase",new kt(o,1));let l=new ye({side:mt,uniforms:{uTime:{value:0}},vertexShader:`uniform float uTime; attribute float aWing, aPhase; attribute vec3 aCol; varying vec3 vC;
      void main(){ vec3 p = position; float a = (0.5 + 0.5 * sin(uTime * 22.0 + aPhase)) * 1.25; float s = sign(aWing);
        p = vec3(p.x * cos(a), abs(p.x) * sin(a), p.z); vC = aCol * (0.75 + 0.25 * abs(aWing));
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(p, 1.0); }`,fragmentShader:"varying vec3 vC; void main(){ gl_FragColor = vec4(vC, 1.0); }"}),u=new wn(s,l,i);u.frustumCulled=!1;let d=Array.from({length:i},()=>({p:new T(e[0]+Math.random()*(e[1]-e[0]),e[2]+Math.random()*(e[3]-e[2]),e[4]+Math.random()*(e[5]-e[4])),v:new T,ph:Math.random()*100}));return{mesh:u,update(h,p){l.uniforms.uTime.value=h;for(let g=0;g<i;g++){let v=d[g];v.v.x+=(Math.sin(h*1.3+v.ph)+Math.sin(h*3.1+v.ph*2))*p*1.2,v.v.z+=(Math.cos(h*1.1+v.ph)+Math.sin(h*2.7+v.ph))*p*1.2,v.v.y+=Math.sin(h*2.3+v.ph)*p*.9,v.v.multiplyScalar(.97),v.p.addScaledVector(v.v,p*1.6),(v.p.x<e[0]||v.p.x>e[1])&&(v.v.x*=-1),(v.p.z<e[4]||v.p.z>e[5])&&(v.v.z*=-1),v.p.y=ht.clamp(v.p.y,e[2],e[3]),Math.abs(v.p.x-(e[0]+e[1])/2)<3.2&&(v.v.x+=Math.sign(v.p.x-(e[0]+e[1])/2||1)*p*4),ks.setFromEuler(Id.set(0,Math.atan2(v.v.x,v.v.z),0)),cs.compose(v.p,ks,Dl.setScalar(.75)),u.setMatrixAt(g,cs)}u.instanceMatrix.needsUpdate=!0}}}function Vm({count:i=120,box:e=[-15,15,0,16,-15,15],colors:t=[7043626,9071140,11045167,5917212],follow:n=null}={}){let r=new Xe;r.setAttribute("position",new Ye([-.075,0,0,-.02,.026,0,.03,.022,0,.075,0,0,.03,-.022,0,-.02,-.026,0],3)),r.setIndex([0,2,1,0,3,2,0,4,3,0,5,4]);let s=new Float32Array(i*3),a=new de;for(let p=0;p<i;p++)a.set(t[p%t.length]),s.set([a.r,a.g,a.b],p*3);r.setAttribute("aCol",new kt(s,3));let o=new ye({side:mt,uniforms:{uFog:{value:new nt(.6,.6,.6,.02)}},vertexShader:"attribute vec3 aCol; varying vec3 vC; varying float vD; void main(){ vC = aCol; float k = smoothstep(1.6, 3.2, -(modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).z); vec4 mv = modelViewMatrix * instanceMatrix * vec4(position * k, 1.0); vD = -mv.z; gl_Position = projectionMatrix * mv; }",fragmentShader:"uniform vec4 uFog; varying vec3 vC; varying float vD; void main(){ gl_FragColor = vec4(mix(vC, uFog.rgb, 1.0 - exp(-vD * uFog.a)), 1.0); }"}),c=new wn(r,o,i);c.frustumCulled=!1;let l=Array.from({length:i},()=>({x:Math.random(),y:Math.random(),z:Math.random(),ph:Math.random()*100,sp:.5+Math.random()*.5,spin:(Math.random()-.5)*6})),u=e[1]-e[0],d=e[3]-e[2],h=e[5]-e[4];return{mesh:c,leaves:!0,update(p,g,v,m,f){m&&o.uniforms.uFog.value.set(m.r,m.g,m.b,f);let y=v?v.position.x:0,w=v?v.position.z:0;for(let x=0;x<i;x++){let S=l[x];S.y-=g*.045*S.sp,S.y<0&&(S.y+=1);let _=Math.sin(p*1.6*S.sp+S.ph),R=e[0]+((S.x*u+y-e[0])%u+u)%u+_*.5,E=e[4]+((S.z*h+w-e[4])%h+h)%h+Math.cos(p*1.2+S.ph)*.3;n&&(R+=y-(e[0]+e[1])/2,E+=w-(e[4]+e[5])/2),qa.set(R,e[2]+S.y*d,E),ks.setFromEuler(Id.set(_*1.1,p*S.spin+S.ph,Math.cos(p*2+S.ph)*.8)),cs.compose(qa,ks,Dl.setScalar(1)),c.setMatrixAt(x,cs)}c.instanceMatrix.needsUpdate=!0}}}function Dd({count:i=18,box:e=[-60,60,.5,6,-60,60],color:t=[.8,.84,.86],opacity:n=.22,size:r=[26,6]}={}){let s=new Ft(1,1),a=new ye({transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0},uCol:{value:new de(...t)},uA:{value:n}},vertexShader:`varying vec2 vUv; varying float vI; void main(){ vUv = uv; vI = float(gl_InstanceID);
      vec4 c = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0); vec3 r = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);   // always faces the camera sideways, stays upright
      vec3 sx = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), 1.0);
      vec3 w = c.xyz + r * position.x * sx.x + vec3(0.0, 1.0, 0.0) * position.y * sx.y; gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0); }`,fragmentShader:`uniform float uTime; uniform vec3 uCol; uniform float uA; varying vec2 vUv; varying float vI;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
      void main(){ vec2 q = vUv * vec2(4.0, 1.4) + vec2(uTime * 0.03 + vI * 3.7, vI);
        float d = n(q) * 0.6 + n(q * 2.3) * 0.3 + n(q * 5.1) * 0.1;
        float edge = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x) * smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.45, vUv.y);
        gl_FragColor = vec4(uCol, smoothstep(0.35, 0.8, d) * edge * uA); }`}),o=new wn(s,a,i);o.frustumCulled=!1,o.renderOrder=5;let c=Array.from({length:i},()=>({x:e[0]+Math.random()*(e[1]-e[0]),y:e[2]+Math.random()*(e[3]-e[2]),z:e[4]+Math.random()*(e[5]-e[4]),v:.3+Math.random()*.6,s:.7+Math.random()*.6}));return{mesh:o,update(l,u){a.uniforms.uTime.value=l;for(let d=0;d<i;d++){let h=c[d];h.x+=h.v*u,h.x>e[1]&&(h.x=e[0]),cs.compose(qa.set(h.x,h.y,h.z),ks.identity(),Dl.set(r[0]*h.s,r[1]*h.s,1)),o.setMatrixAt(d,cs)}o.instanceMatrix.needsUpdate=!0}}}Nt();var dw=`
  uniform float uTime, uSway, uH, uFar, uFade; uniform vec4 uRect; uniform sampler2D tLm; uniform float uK;
  attribute float ao;
  varying vec2 vUv; varying vec3 vW, vN; varying float vAo, vLit, vY, vKeep; varying vec3 vL;
  vec3 lmDecode(vec3 c, float K){ return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)) * K; }
  float h11(float n){ return fract(sin(n) * 43758.5453); }
  void main(){
    vUv = uv; vAo = ao / 255.0;
    vec3 n = normal / 127.5 - 1.0;
    vec3 root = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float y = clamp(position.y / max(uH, 0.01), 0.0, 1.5); vY = y;
    vec3 p = position;
    // sway: the whole plant leans with the gust, tips flutter
    vec2 wdir = normalize(vec2(0.8, -0.6));
    float ph = h11(root.x * 1.7 + root.z * 3.1) * 6.28;
    float gust = sin(uTime * 0.9 - dot(root.xz, wdir) * 0.05 + ph * 0.2) * 0.5 + 0.5;
    float sway = (gust * 0.8 + sin(uTime * 2.3 + ph) * 0.25) * uSway * y * y;
    vec4 w = instanceMatrix * vec4(p, 1.0);
    w.xz += wdir * sway + vec2(sin(uTime * 3.7 + ph + position.x * 4.0), cos(uTime * 3.1 + ph + position.z * 4.0)) * 0.02 * uSway * y;
    vW = w.xyz;
    vN = normalize(mat3(instanceMatrix) * n);
    // sun or shade at the plant's foot (baked in Blender, includes the colonnades' shadows)
    vec2 lu = vec2((root.x - uRect.x) / (uRect.y - uRect.x), (uRect.w - root.z) / (uRect.w - uRect.z));
    float inside = step(0.0, lu.x) * step(lu.x, 1.0) * step(0.0, lu.y) * step(lu.y, 1.0);
    vec3 open = lmDecode(vec3(0.83), uK);
    vL = mix(open, lmDecode(texture2D(tLm, clamp(lu, 0.002, 0.998)).rgb, uK), inside);
    vLit = clamp(dot(vL, vec3(0.333)) / max(dot(open, vec3(0.333)), 1e-3), 0.12, 1.1);
    // far small things fade out (flowers beyond ~140 m cost triangles and add nothing)
    float d = length(root - cameraPosition);
    vKeep = (1.0 - smoothstep(uFar * 0.8, uFar, d)) * uFade;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`,fw=`
  ${mi}
  uniform sampler2D tAlb; uniform float uLeaf, uHasTex; uniform vec3 uTint;
  varying vec2 vUv; varying vec3 vW, vN; varying float vAo, vLit, vY, vKeep; varying vec3 vL;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main(){
    if (hash(gl_FragCoord.xy) > vKeep) discard;                       // dissolve in / fade out, no alpha sorting
    vec3 alb = uHasTex > 0.5 ? texture2D(tAlb, vUv).rgb : uTint;
    // Poly Haven foliage atlases sit on black: slimmed cards would show it, so cut it away like an alpha mask
    if (uLeaf > 0.5 && uHasTex > 0.5 && max(alb.r, max(alb.g, alb.b)) < 0.055) discard;
    vec3 n = vN; n = dot(n, n) > 1e-6 ? normalize(n) : vec3(0.0, 1.0, 0.0);
    if (!gl_FrontFacing) n = -n;
    float ao = clamp(vAo, 0.0, 1.0);
    vec3 V = normalize(cameraPosition - vW);
    float nl = dot(n, uSun);
    float diff = uLeaf > 0.5 ? pow(clamp(nl * 0.5 + 0.5, 0.0, 1.0), 1.6) : max(nl, 0.0);
    vec3 sun = vec3(1.0, 0.72, 0.48) * (6.0 / 3.14159) * diff * vLit * mix(0.55, 1.0, ao) * (uLeaf > 0.5 ? 1.25 : 1.0);
    vec3 sky = vec3(0.17, 0.21, 0.28) * (0.5 + 0.5 * ao) * (0.75 + 0.25 * n.y) * (uLeaf > 0.5 ? 1.35 : 1.0);
    vec3 c = alb * (sun + sky);
    if (uLeaf > 0.5) c += alb * vec3(0.55, 0.7, 0.25) * pow(max(dot(-V, uSun), 0.0), 4.0) * vLit * 0.9 * ao;   // light through the leaves
    else c += vec3(0.05, 0.057, 0.075) * (0.45 + 0.55 * n.y) * (0.4 + 0.6 * ao) + vec3(0.04) * pow(clamp(1.0 - max(dot(n, V), 0.0), 0.0, 1.0), 5.0) * vLit;                     // a little sheen on glaze and stone, and a floor of ambient so no rock is ever pure black
    gl_FragColor = vec4(applyFog(clamp(c, vec3(0.0), vec3(1.4)), vW), 1.0);
  }`,Wm=async i=>{for(let e=0;;e++)try{let t=await fetch(i);if(t.ok)return t.json();throw 0}catch(t){if(e>2)throw t;await new Promise(n=>setTimeout(n,500))}};async function br({base:i,unpack:e,loader:t,U:n,groundLm:r,groundK:s,rect:a,tier:o,onPart:c,scene:l=null,layout:u=null}){let[d,h]=await Promise.all([Wm(i+"plants/protos.json"),u?Promise.resolve(u):Wm(i+"garden.json")]),p=new $n;p.name="garden";let g={};h.items.forEach((E,M)=>{o!=="high"&&E[0].startsWith("flower")&&M%2||o!=="high"&&(d[E[0]]?.size?.[1]??9)<1.2&&M%2||(g[E[0]]=g[E[0]]||[]).push(E)});let v={},m=E=>v[E]||(v[E]=new Promise(M=>t.load(i+"plants/"+E,b=>{b.colorSpace=Gt,b.flipY=!0,b.anisotropy=4,M(b)},void 0,()=>M(null)))),f={value:0},y=new et,w=new Ut,x=new T,S=new T,_=new T(0,1,0),R=[];for(let[E,M]of Object.entries(g)){let b=d[E];if(!b)continue;let C=b.size[1],F=E.startsWith("flower")||E.startsWith("periwinkle")||E.startsWith("fern"),U=Math.min(o==="high"?520:320,o==="high"?70+C*90:26+C*44);for(let k of b.parts)R.push((async()=>{let H,D;try{[H,D]=await Promise.all([e(i+"plants/"+k.pack),k.tex?m(k.tex):null])}catch(V){console.warn("[garden] skipped",k.pack,V);return}let z=new ye({side:mt,uniforms:{...n,tAlb:{value:D},uHasTex:{value:D?1:0},uTint:{value:new de(.5,.45,.4)},uLeaf:{value:k.leaf?1:0},uSway:{value:k.leaf?C>2?.35:.12:0},uH:{value:Math.max(C,.2)},uFar:{value:U},uFade:f,tLm:{value:r},uK:{value:s},uRect:{value:a}},vertexShader:dw,fragmentShader:fw});if(b.kind==="solid"&&b.parts.length===1){H.computeBoundingBox();let V=H.boundingBox;V.min.y>.01&&H.translate(0,-V.min.y-(V.max.y-V.min.y)*.06,0)}let N=new wn(H,z,M.length);M.forEach((V,ee)=>{let[,ce,Y,be,Z,ae]=V;y.compose(S.set(ce,Y,be),w.setFromAxisAngle(_,Z),x.set(ae,ae,ae)),N.setMatrixAt(ee,y)}),N.instanceMatrix.needsUpdate=!0,N.frustumCulled=!1,N.layers.set(1),p.add(l?Wa(N,l,{cell:M.length<200?80:48,minCount:6,fogK:n.uFogK?n.uFogK.value:0,far:U+10}):N),c&&c()})())}return await Promise.all(R),{group:p,fade:f,layout:h}}Nt();function Gm(i,e,t,n){let r=new Xe,s=new Float32Array(t*4);for(let c=0;c<t;c++){let l=Math.random();s[c*4]=l<.45?0:l<.9?1:2,s[c*4+1]=Math.random()*Math.PI*2,s[c*4+2]=Math.random(),s[c*4+3]=Math.random()}r.setAttribute("position",new qe(new Float32Array(t*3),3)),r.setAttribute("aD",new qe(s,4)),r.boundingSphere=new An(new T(i,1.5,e),6);let a=new ye({transparent:!0,depthWrite:!1,blending:Pt,uniforms:{...n,uC:{value:new T(i,0,e)},uPx:{value:1}},vertexShader:`
      uniform float uTime, uPx; uniform vec3 uC; attribute vec4 aD; varying float vA; varying vec3 vW;
      void main(){
        float kind = aD.x, ang = aD.y, ph = aD.z, sj = aD.w;
        vec3 p; float life; float g = 9.8;
        if (kind < 0.5) {                       // crown jets: up and out from the finial, landing in the lower bowl
          float T = 0.95; life = fract(uTime / T + ph); float t = life * T;
          float vh = 1.15 + sj * 0.25, vy = 2.1 + sj * 0.3;
          p = uC + vec3(cos(ang) * vh * t, 2.5 + vy * t - 0.5 * g * t * t, sin(ang) * vh * t);
          vA = smoothstep(0.0, 0.08, life) * (1.0 - smoothstep(0.85, 1.0, life));
        } else if (kind < 1.5) {                // curtain: spills over the lower bowl's lip and drops into the pool
          float T = 0.55; life = fract(uTime / T + ph); float t = life * T;
          float r = 1.3 + 0.35 * t;
          p = uC + vec3(cos(ang) * r, 1.58 - 0.5 * g * t * t * (0.9 + sj * 0.2), sin(ang) * r);
          p.y = max(p.y, 0.34);
          vA = 0.55 * smoothstep(0.0, 0.1, life) * (1.0 - smoothstep(0.8, 1.0, life));
        } else {                                // mist where the curtain lands
          float T = 2.4; life = fract(uTime / T + ph);
          float r = 1.5 + sj * 0.9;
          p = uC + vec3(cos(ang + life) * r, 0.4 + life * 0.6, sin(ang + life) * r);
          vA = 0.18 * sin(life * 3.14159);
        }
        vW = p;
        vec4 mv = viewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float size = kind > 1.5 ? 0.16 : kind > 0.5 ? 0.02 : 0.026;   // fine droplets, not beads
        gl_PointSize = clamp(size * uPx / max(-mv.z, 0.5), 1.0, 22.0);
      }`,fragmentShader:`
      ${mi}
      varying float vA; varying vec3 vW;
      void main(){
        vec2 d = gl_PointCoord - 0.5; float r = dot(d, d);
        float a = (1.0 - smoothstep(0.0, 0.25, r)) * clamp(vA, 0.0, 1.0);
        a *= 0.7; vec3 c = vec3(0.85, 0.9, 0.95) * a * 0.9;
        gl_FragColor = vec4(c, a);
      }`}),o=new on(r,a);return o.frustumCulled=!1,o}var qm="data:font/woff2;base64,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";var pw=`
.nrt-ui{position:absolute;inset:0;pointer-events:none;font-family:Satoshi,system-ui,sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
.nrt-ui .brand{position:absolute;left:28px;top:24px;font-family:"Nomadiic Line",Satoshi,sans-serif;font-size:15px;letter-spacing:.14em;color:#fff;
  text-shadow:0 1px 12px rgba(20,24,30,.35);opacity:0;transition:opacity 1.4s}
.nrt-ui .topr{position:absolute;right:24px;top:18px;display:flex;align-items:center;gap:10px}
.nrt-ui .ig{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;pointer-events:auto;color:#fff;border:1px solid rgba(255,255,255,.6);background:rgba(14,18,24,.34);opacity:0;transition:opacity 1.4s,background .25s,transform .25s}
.nrt-ui .ig svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.nrt-ui .ig svg .d{fill:currentColor;stroke:none}
.nrt-ui .ig:hover{background:rgba(14,18,24,.6);transform:translateY(-1px)}
.nrt-ui .cta{position:static;pointer-events:auto;text-decoration:none;color:#fff;font-weight:600;font-size:13px;letter-spacing:.06em;
  padding:11px 20px;border-radius:999px;background:linear-gradient(110deg,#f2822f,#ffb067,#f2822f);background-size:220% 100%;animation:nrtGrad 6s ease-in-out infinite;
  box-shadow:0 6px 22px rgba(242,130,47,.35);opacity:0;transition:opacity 1.4s,transform .25s}
.nrt-ui .cta:hover{transform:translateY(-1px)}
@keyframes nrtGrad{0%,100%{background-position:0% 0}50%{background-position:100% 0}}
.nrt-ui .scrim{position:absolute;left:0;right:0;bottom:0;height:42%;background:linear-gradient(to top,rgba(14,18,24,.55),rgba(14,18,24,0));opacity:0;transition:opacity 1.2s}
.nrt-ui .story{position:absolute;left:50%;bottom:104px;transform:translateX(-50%);width:min(760px,86%);text-align:center}
.nrt-ui .kick{font-size:12px;font-weight:600;letter-spacing:.32em;text-transform:uppercase;color:#ffc48f;margin-bottom:12px}
.nrt-ui .line{font-size:28px;line-height:1.35;font-weight:500;letter-spacing:-.005em;text-shadow:0 2px 18px rgba(10,14,20,.45);text-wrap:balance}
.nrt-ui .ch{position:absolute;left:0;right:0;bottom:0;opacity:0;transform:translateY(-6px);transition:opacity .35s ease,transform .35s ease}
.nrt-ui .ch.on{opacity:1;transform:none;transition:opacity .9s ease .4s,transform .9s ease .4s}   /* the old line leaves before the new one arrives */
.nrt-ui .book,.nrt-ui .endcta{display:inline-block;margin-top:18px;pointer-events:auto;cursor:pointer;font:700 12px/1 Satoshi,system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;color:#2a1704;background:linear-gradient(180deg,#ffe2a2 0%,#f2b24c 45%,#c98a2c 100%);border:1px solid rgba(255,232,180,.9);padding:13px 24px;border-radius:999px;transform:translateZ(0);animation:nrtGlow 2.4s ease-in-out infinite;transition:transform .25s}
@keyframes nrtGlow{0%,100%{box-shadow:0 0 14px rgba(242,178,76,.55),0 0 34px rgba(242,178,76,.25)}50%{box-shadow:0 0 22px rgba(255,205,120,.9),0 0 60px rgba(242,178,76,.45)}}
.nrt-ui .endcta{font-size:13px;padding:15px 30px}   /* no backdrop blur: over a live canvas it flickers */
.nrt-ui .book:hover,.nrt-ui .endcta:hover{transform:translateY(-2px) scale(1.03)}
.nrt-ui .ch:not(.on) .book,.nrt-ui .ch:not(.on) .endcta{pointer-events:none}
.nrt-ui .help{position:absolute;right:24px;bottom:26px;display:flex;align-items:center;gap:12px;max-width:min(320px,60vw);text-align:right;text-decoration:none;color:#fff;font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;line-height:1.7;text-shadow:0 1px 12px rgba(14,18,24,.55);pointer-events:none;opacity:0;transform:translateX(10px);transition:opacity 1.2s ease,transform 1.2s ease}
.nrt-ui .help.show{pointer-events:auto;transform:none}
.nrt-ui .help span{border-bottom:1px solid rgba(255,255,255,.5);padding-bottom:3px;transition:border-color .25s}
.nrt-ui .help svg{flex:none;width:30px;height:12px;fill:none;stroke:currentColor;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round;animation:nrtNudge 2.4s ease-in-out infinite}
.nrt-ui .help:hover span{border-bottom-color:#fff}
.nrt-ui .help:hover svg{animation:none;transform:translateX(5px)}
@keyframes nrtNudge{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}
.nrt-ui .hint{position:absolute;left:50%;bottom:26px;transform:translateX(-50%);font-size:12px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.92);opacity:0;transition:opacity 1s}
.nrt-ui .snd{position:absolute;left:20px;bottom:22px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.55);background:rgba(14,18,24,.38);color:#fff;display:grid;place-items:center;cursor:pointer;pointer-events:auto;opacity:0;transition:opacity 1s,background .25s}
.nrt-ui .snd svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}
.nrt-ui .snd:hover{background:rgba(14,18,24,.6)}
.nrt-ui .busy{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);padding:7px 13px;border-radius:999px;background:rgba(14,18,24,.5);color:rgba(255,255,255,.9);font-size:10.5px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;opacity:0;transition:opacity .5s;white-space:nowrap}
.nrt-ui .busy:before{content:"";display:inline-block;width:6px;height:6px;margin-right:8px;border-radius:50%;background:#ffb067;animation:nrtGlow 1.2s ease-in-out infinite}
.nrt-ui .prog{position:absolute;left:0;bottom:0;height:3px;width:0;background:linear-gradient(90deg,#f2822f,#ffb067);opacity:0;transition:opacity 1s}
.nrt-ui a:focus-visible,.nrt-ui button:focus-visible{outline:2px solid #ffd9a8;outline-offset:3px}
@media (prefers-reduced-motion:reduce){.nrt-ui *,.nrt-ui *:after{animation:none!important;transition-duration:.01s!important}}
.nrt-ui .hint:after{content:"";display:block;width:1px;height:18px;margin:10px auto 0;background:rgba(255,255,255,.8);animation:nrtDrop 1.8s ease-in-out infinite}
@keyframes nrtDrop{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
@media (max-width:640px){.nrt-ui .brand{left:16px;top:22px;font-size:11px;letter-spacing:.1em;max-width:calc(100% - 200px);white-space:nowrap}.nrt-ui .topr{right:16px;top:14px;gap:8px}.nrt-ui .ig{width:38px;height:38px}.nrt-ui .ig svg{width:17px;height:17px}.nrt-ui .cta{padding:9px 15px;font-size:12px}
  .nrt-ui .help{right:16px;bottom:20px;gap:10px;font-size:10px;letter-spacing:.16em;max-width:min(236px,58vw)}.nrt-ui .help svg{width:24px}
  .nrt-ui .line{font-size:19px;line-height:1.42}.nrt-ui .story{bottom:92px}.nrt-ui .kick{font-size:11.5px;letter-spacing:.24em}.nrt-ui .snd{left:14px;bottom:18px}}
`,mw=2.4;function Xm(i,e,{contactUrl:t="https://nomadiichorse.com/contact-us",instagramUrl:n="https://www.instagram.com/nomadiic.horse.designs/",onBook:r=null,sound:s=null}={}){if(!document.getElementById("nrt-css")){let E=document.createElement("style");E.id="nrt-css",E.textContent=`@font-face{font-family:"Nomadiic Line";src:url(${qm}) format("woff2");font-display:block}`+pw,document.head.appendChild(E);let M=document.createElement("link");M.rel="stylesheet",M.href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap",document.head.appendChild(M)}let a=document.createElement("div");a.className="nrt-ui",a.innerHTML=`<div class="scrim"></div><div class="brand">NOMADIIC HORSE DESIGNS</div><div class="topr"><a class="ig" href="${n}" target="_blank" rel="noopener noreferrer" aria-label="Nomadiic Horse on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="d" cx="17.2" cy="6.8" r="1.1"/></svg></a><a class="cta" href="${t}">Contact us</a></div><a class="help" href="${t}"><span>Need a website or branding help? Reach us by tapping here</span><svg viewBox="0 0 30 12" aria-hidden="true"><path d="M1 6h27M23 1.5L28 6l-5 4.5"/></svg></a><button class="snd" type="button" aria-label="Sound" aria-pressed="true"></button><div class="prog" aria-hidden="true"></div><div class="busy" role="status">Loading</div>
    <div class="story">${e.map((E,M)=>`<div class="ch" data-i="${M}"><div class="kick">${E.kick}</div><div class="line">${E.line}</div>${E.book?`<button class="book" data-book="${E.book}">Explore the book</button>`:""}${E.contact?`<div><a class="endcta" href="${t}">Contact us</a></div>`:""}</div>`).join("")}</div>
    <div class="hint">${matchMedia("(pointer: coarse)").matches?"Swipe up to enter":"Scroll to enter"}</div>`,a.querySelector(".story").setAttribute("role","region"),a.querySelector(".story").setAttribute("aria-label","Story"),a.querySelector(".story").setAttribute("aria-live","polite"),i.appendChild(a);let o=[...a.querySelectorAll(".ch")],c=E=>a.querySelector(E);a.querySelectorAll(".book").forEach(E=>E.addEventListener("click",M=>{M.stopPropagation(),r&&r(E.dataset.book)}));let l=c(".snd"),u=E=>E?'<svg viewBox="0 0 16 16"><path d="M2 8h1.5M5 5v6M8 3v10M11 6v4M14 7.3v1.4"/></svg>':'<svg viewBox="0 0 16 16"><path d="M2 8h12"/></svg>',d=()=>{let E=!(s&&s.muted);l.innerHTML=u(E),l.setAttribute("aria-pressed",String(E)),l.setAttribute("aria-label",E?"Mute sound":"Turn sound on")};d(),l.addEventListener("click",E=>{E.stopPropagation(),s&&(s.setMuted(!s.muted),d())});let h=-2,p=null,g={story:c(".story"),hint:c(".hint"),brand:c(".brand"),cta:c(".cta"),ig:c(".ig"),help:c(".help"),scrim:c(".scrim"),prog:c(".prog"),busy:c(".busy")};g.prog.style.width="100%",g.prog.style.transformOrigin="0 50%",g.prog.style.transform="scaleX(0)";let v=new Map,m=(E,M,b)=>{let C=E.className+M,F=String(b);v.get(C)!==F&&(v.set(C,F),E.style[M]=F)},f=-1,y=!0,w=()=>{y=!0};addEventListener("resize",w),addEventListener("scroll",w,{passive:!0}),window.visualViewport&&visualViewport.addEventListener("resize",w);let x=typeof ResizeObserver<"u"?new ResizeObserver(w):null;x&&x.observe(i);let S=-1,_=!1,R=matchMedia("(max-width:640px)");return{el:a,update(E,M){if(y){y=!1;let H=window.visualViewport?window.visualViewport.height:innerHeight,D=Math.max(0,Math.round(i.getBoundingClientRect().bottom-H));D!==f&&(f=D,g.story.style.transform=`translate(-50%, ${-D}px)`,g.hint.style.transform=`translate(-50%, ${-D}px)`)}let b=M>1.2;m(g.brand,"opacity",b?1:0),m(g.cta,"opacity",b?1:0),m(g.ig,"opacity",b?1:0),m(g.scrim,"opacity",b?1:0),m(g.hint,"opacity",b&&E<.004&&M>3?1:0);let C=b&&s&&s.started?1:0;m(l,"opacity",C),m(l,"pointerEvents",C?"auto":"none"),s&&s.muted!==p&&(p=s.muted,d()),m(g.prog,"opacity",b?1:0);let F=Math.round(Math.max(0,Math.min(1,E))*2e3)/2e3;F!==S&&(S=F,g.prog.style.transform=`scaleX(${F})`);let U=b?e.findIndex(H=>E>=H.at[0]&&E<H.at[1]):-1,k=b&&M>mw&&(!R.matches||E>=.004)&&!(U>=0&&e[U].contact);m(g.help,"opacity",k?1:0),k!==_&&(_=k,g.help.classList.toggle("show",k),g.help.setAttribute("aria-hidden",String(!k)),g.help.tabIndex=k?0:-1),U!==h&&(h=U,o.forEach((H,D)=>{H.classList.toggle("on",D===U),H.setAttribute("aria-hidden",String(D!==U))}))},setBusy(E){m(g.busy,"opacity",E?"1":"0")},destroy(){removeEventListener("resize",w),removeEventListener("scroll",w),window.visualViewport&&visualViewport.removeEventListener("resize",w),x&&x.disconnect(),a.remove()}}}function jm(i){let e=document.createElement("canvas");e.width=4096,e.height=160;let t=e.getContext("2d");return t.fillStyle="#000",t.fillRect(0,0,e.width,e.height),t.fillStyle="#fff",t.textAlign="center",t.textBaseline="middle",t.font='120px "Nomadiic Line", Satoshi, serif',"letterSpacing"in t&&(t.letterSpacing="38px"),t.fillText(i,e.width/2,e.height/2+6),e}function Km(i){let n=document.createElement("canvas");n.width=1024,n.height=372;let r=n.getContext("2d"),s=r.createLinearGradient(0,0,0,372);s.addColorStop(0,"#6b4a2b"),s.addColorStop(.5,"#4f341d"),s.addColorStop(1,"#3a2614"),r.fillStyle=s,r.fillRect(0,0,1024,372);for(let l=0;l<90;l++){let u=Math.random()*1024,d=Math.random()*372,h=20+Math.random()*90,p=r.createRadialGradient(u,d,0,u,d,h);p.addColorStop(0,Math.random()<.5?"rgba(70,90,60,0.10)":"rgba(30,18,8,0.14)"),p.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=p,r.fillRect(u-h,d-h,h*2,h*2)}let a=r.getImageData(0,0,1024,372);for(let l=0;l<a.data.length;l+=4){let u=(Math.random()-.5)*14;a.data[l]+=u,a.data[l+1]+=u,a.data[l+2]+=u}r.putImageData(a,0,0);let o=(l,u="#f6d58e",d="rgba(20,10,4,0.75)")=>{r.save(),r.translate(2,3),r.fillStyle=d,r.strokeStyle=d,l(),r.restore(),r.save(),r.translate(-1,-1.5),r.fillStyle="#fff3c9",r.strokeStyle="#fff3c9",l(),r.restore();let h=r.createLinearGradient(0,0,0,372);h.addColorStop(0,"#f2c66e"),h.addColorStop(1,"#b9832f"),r.fillStyle=h,r.strokeStyle=h,l()};o(()=>{r.lineWidth=7,r.strokeRect(26,26,972,320),r.lineWidth=2,r.strokeRect(42,42,940,288)}),r.textAlign="center",r.textBaseline="middle";let c=(l,u,d)=>{let h=d;do r.font=`${u} ${h}px Satoshi, system-ui, sans-serif`,h-=2;while(r.measureText(l).width>874&&h>30)};return i[0]==="Selected as"?(o(()=>{r.font="600 46px Satoshi, system-ui, sans-serif","letterSpacing"in r&&(r.letterSpacing="14px"),r.fillText("SELECTED AS",1024/2,118),"letterSpacing"in r&&(r.letterSpacing="0px")}),o(()=>{c(i[1],600,100),r.fillText(i[1],1024/2,230)})):(o(()=>{c(i[0],600,i.length>1?106:112),r.fillText(i[0],1024/2,i.length>1?140:190)}),i[1]&&o(()=>{c(i[1],500,70),"letterSpacing"in r&&(r.letterSpacing="4px"),r.fillText(i[1],1024/2,258),"letterSpacing"in r&&(r.letterSpacing="0px")})),n}Nt();Nt();var gw=`
  uniform sampler2D tLm, tGrain; uniform samplerCube tEnv; uniform float uK, uTime, uHasEnv; uniform vec3 uFogCol; uniform float uFogK;
  varying vec2 vUv; varying vec3 vW, vN; varying float vKind;
  vec3 lmDecode(vec3 c, float K){ return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)) * K; }
  vec3 tri(vec3 p, vec3 n, float s){ vec3 w = pow(abs(n), vec3(4.0)); w /= dot(w, vec3(1.0));
    return texture2D(tGrain, p.zy / s).rgb * w.x + texture2D(tGrain, p.xz / s).rgb * w.y + texture2D(tGrain, p.xy / s).rgb * w.z; }
  vec3 env(vec3 R, float lod){ return uHasEnv > 0.5 ? textureLod(tEnv, R, lod).rgb : vec3(0.2); }
  float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  uniform vec3 uSunDir, uSunCol; uniform float uScatter;
  // aerial perspective: the haze thickens with distance and glows warm looking towards the sun, as real air does
  vec3 fog(vec3 c){ vec3 dv = vW - cameraPosition; float d = length(dv); float s = pow(max(dot(dv / max(d, 1e-3), uSunDir), 0.0), 6.0);
    return mix(c, uFogCol + uSunCol * s * uScatter, 1.0 - exp(-d * uFogK)); }
  vec3 triw(vec3 n){ vec3 w = pow(abs(n), vec3(4.0)); return w / dot(w, vec3(1.0)); }
  // detail shading from a normal map against the world's sun: >1 where the texture's relief faces the light, <1 in its pits
  float relief(vec3 nd, vec3 n){ return clamp(1.0 + (dot(nd, uSunDir) - dot(n, uSunDir)) * 0.9, 0.45, 1.6); }`;function vw(i){return Object.entries(i||{}).map(([e,t])=>`
  uniform sampler2D tD_${e}, tN_${e};
  vec3 D_${e}(vec3 p, vec3 n){ vec3 w = triw(n); float s = ${(1/t.s).toFixed(5)};
    return texture2D(tD_${e}, p.zy * s).rgb * w.x + texture2D(tD_${e}, p.xz * s).rgb * w.y + texture2D(tD_${e}, p.xy * s).rgb * w.z; }
  vec3 N_${e}(vec3 p, vec3 n, float k){ vec3 w = triw(n); float s = ${(1/t.s).toFixed(5)};
    vec3 tx = texture2D(tN_${e}, p.zy * s).xyz * 2.0 - 1.0, ty = texture2D(tN_${e}, p.xz * s).xyz * 2.0 - 1.0, tz = texture2D(tN_${e}, p.xy * s).xyz * 2.0 - 1.0;
    tx.xy *= k; ty.xy *= k; tz.xy *= k;
    vec3 nx = vec3(tx.xy + n.zy, abs(tx.z) * n.x), ny = vec3(ty.xy + n.xz, abs(ty.z) * n.y), nz = vec3(tz.xy + n.xy, abs(tz.z) * n.z);
    return normalize(nx.zyx * w.x + ny.xzy * w.y + nz.xyz * w.z); }`).join(`
`)}function xw(i,e=1,t=0,n=[.5,.5,.55],r=.03){let s=new xe(new zn(3500,64,32),new ye({side:en,depthWrite:!1,uniforms:{tSky:{value:i},uExp:{value:e},uRot:{value:t},uHaze:{value:new de(...n)},uCut:{value:r},uStorm:{value:0},uFlash:{value:0},uT:{value:0}},vertexShader:"varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }",fragmentShader:`uniform sampler2D tSky; uniform float uExp, uRot, uCut, uStorm, uFlash, uT; uniform vec3 uHaze; varying vec3 vD; ${Il}
      void main(){ vec3 d = normalize(vD); float k = smoothstep(uCut, uCut + 0.12, d.y);
        vec3 c = uHaze;
        if (k > 0.0) { float lon = atan(d.z, d.x) + uRot, lat = asin(clamp(d.y, -1.0, 1.0));      // only the photograph's sky is ever sampled: no stretched rows
          c = mix(uHaze, pow(texture2D(tSky, vec2(0.5 + lon / 6.2831853, 0.5 + lat / 3.1415927)).rgb, vec3(2.2)) * uExp, k); }
        if (uStorm > 0.001) { vec3 ph = c * mix(vec3(1.0), vec3(0.42, 0.47, 0.58), uStorm);           // the skyline (mountains) stays, darkened under the deck
          c = mix(ph, stormSky(d, uT, uFlash), uStorm * smoothstep(0.035, 0.16, d.y)); }
        gl_FragColor = vec4(c, 1.0); }`}));return s.renderOrder=-1,s.frustumCulled=!1,s}var bw=`
  attribute float kind; varying vec2 vUv; varying vec3 vW, vN; varying float vKind;
  #ifdef PLANAR
    uniform vec4 uRect;
  #endif
  void main(){ vec4 w = modelMatrix * vec4(position, 1.0);
    #ifdef PLANAR
      vUv = vec2((w.x - uRect.x) / (uRect.y - uRect.x), (uRect.w - w.z) / (uRect.w - uRect.z));   // ground lightmaps are top-down
    #else
      vUv = uv;
    #endif
    vKind = kind; vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * w; }`;function Zm(i,e){let t=new et().makeTranslation(...i.origin);return t.multiply(new et().makeRotationY(i.yaw-e.yaw)),t.multiply(new et().makeTranslation(-e.origin[0],-e.origin[1],-e.origin[2])),t}async function Ud(i,e,t){let n=t.renderTarget,r=i.getRenderTarget();try{i.setRenderTarget(n,0);let s=i.compileAsync(e,t.children[0]||t);i.setRenderTarget(r),await s}catch{i.setRenderTarget(r)}t.update(i,e)}var Ym=(i,e)=>{globalThis.__nrtProf&&(globalThis.__nrtLog||(globalThis.__nrtLog=[])).push(i,Math.round(performance.now()-e)+"ms")};async function zi(i,{base:e,unpack:t,loader:n,renderer:r,tier:s,grainTex:a}){let o=e+i.dir+"/",c=b=>new Promise((C,F)=>n.load(o+b,U=>{U.colorSpace=qn,U.anisotropy=4,U.generateMipmaps=/_lm\./.test(b)?!1:U.generateMipmaps,/_lm\./.test(b)&&(U.minFilter=$t),C(U)},void 0,F)),l=await fetch(o+"scene.json").then(b=>b.json()),u=new Ji;u.background=new de(...i.background||[.1,.1,.1]);let d={uTime:{value:0},uFogCol:{value:new de(...i.fog?.col||[.5,.5,.5])},uFogK:{value:i.fog?.k??0}},h=new ns(s==="high"?256:128,{generateMipmaps:!0,minFilter:oi,type:nn}),p=[],g={},v={};await Promise.all(Object.entries(i.textures||{}).map(async([b,C])=>{let F=(H,D)=>new Promise((z,N)=>n.load(e+"tex/"+H,V=>{V.wrapS=V.wrapT=es,V.anisotropy=8,V.colorSpace=D?Gt:qn,z(V)},void 0,N)),[U,k]=await Promise.all([F(C.id+"_diff.webp",!0),F(C.id+"_nor.webp",!1)]);v["tD_"+b]={value:U},v["tN_"+b]={value:k}}));let m=vw(i.textures),f={value:new T(...i.sun||[.4,.8,.3]).normalize()},y={value:new de(...i.sunCol||[1,.82,.58])},w={value:i.scatter??.5};for(let b of i.parts){let C=typeof b=="string"?b:b.name,F=typeof b=="object"&&b.planar,[U,k]=await Promise.all([t(o+C+".pack"),c(C+"_lm.webp")]),H=performance.now();U.computeVertexNormals(),Ym(i.dir+" normals "+C,H);let D=new ye({uniforms:{...d,tLm:{value:k},tGrain:{value:a},tEnv:{value:h.texture},uHasEnv:{value:0},uK:{value:l.lm[C]},uRect:{value:new nt(...l.rect||[0,1,0,1])},uSunDir:f,uSunCol:y,uScatter:w,...v,...i.uniforms||{}},defines:F?{PLANAR:""}:{},side:F?mt:pr,vertexShader:bw,fragmentShader:`${gw}
${m}
${i.glsl||""}
void main(){
          vec3 n = vN; n = dot(n, n) > 1e-6 ? normalize(n) : vec3(0.0, 1.0, 0.0);
          vec3 L = lmDecode(texture2D(tLm, vUv).rgb, uK);
          vec3 V = normalize(cameraPosition - vW), R = reflect(-V, n);
          float fres = pow(clamp(1.0 - max(dot(n, V), 0.0), 0.0, 1.0), 5.0);
          float k = vKind + 0.5; vec3 c = vec3(0.5) * L;
          ${i.palette}
          gl_FragColor = vec4(clamp(fog(c), vec3(0.0), vec3(16.0)), 1.0); }`}),z=new xe(U,D);z.frustumCulled=!1,u.add(Im(z,u,{fogK:i.fog?.k||0})),p.push(D),F&&(g.groundLm=k)}if(i.sky){let b=await new Promise((C,F)=>n.load(e+"tex/"+i.sky.file,U=>{U.colorSpace=qn,U.generateMipmaps=!1,U.minFilter=$t,C(U)},void 0,F));g.sky=xw(b,i.sky.exposure??1,i.sky.rot??0,i.sky.haze||i.fog?.col||[.5,.5,.55],i.sky.cut??.03),u.add(g.sky)}let x={scene:u,U:d,info:l,renderer:r,tier:s,loader:n,dir:o,unpack:t,texL:c,envTex:h.texture,base:e,groundLm:g.groundLm,texU:v,sunDir:f,sky:g.sky},S=performance.now(),_=i.extras?await i.extras(x):null;if(Ym(i.dir+" extras (incl. awaits)",S),i.envAt){let b=new Cs(.3,4e3,h);b.position.set(...i.envAt),u.add(b);let C=new ns(2),F=[];u.traverse(U=>{for(let k of[].concat(U.material||[]))k.uniforms&&k.uniforms.tEnv&&k.uniforms.tEnv.value===h.texture&&(F.push(()=>{k.uniforms.tEnv.value=h.texture}),k.uniforms.tEnv.value=C.texture),k.envMap===h.texture&&(F.push(()=>{k.envMap=h.texture,k.needsUpdate=!0}),k.envMap=null,k.needsUpdate=!0)});try{await Ud(r,u,b)}finally{F.forEach(U=>U()),C.dispose()}p.forEach(U=>U.uniforms.uHasEnv.value=1)}let R=os(i.way),E=new T,M=new T;return{key:i.dir,scene:u,sky:g.sky,chapters:i.chapters,exposure:i.exposure??1,sun:f.value.clone(),entry:i.entry,exit:i.exit,exitPortal:i.exitPortal,pose(b,C){R.sample(b,E,M),C.position.copy(E),C.lookAt(M)},closeUp(b){return(i.closeUps||[]).some(([C,F,U,k])=>(b.x-C)**2+(b.y-F)**2+(b.z-U)**2<k*k)},update(b,C,F,U){d.uTime.value=b,_?.update?.(b,C,F,U)},setPx(b){_?.setPx?.(b)},dispose(){u.traverse(b=>{b.geometry?.dispose?.();let C=b.material;C&&(Array.isArray(C)?C:[C]).forEach(F=>{F.uniforms?.tLm?.value?.dispose?.(),F.dispose()})}),h.dispose(),_?.dispose?.()}}}var yw="M\u012B\u1E6Dhr\u0101k\u012B",Oi={w:44,h:22,z:-46,y:11},Ko=-7,Yo=-16,ln=(i,e,t)=>[i,e,t],ww=[{pos:ln(0,1.9,42),tgt:ln(0,2.1,5),w:1},{pos:ln(0,7,34),tgt:ln(-4,6,-16),w:1.2},{pos:ln(-16,6.5,8),tgt:ln(Ko,6,Yo),w:1.2},{pos:ln(-12.5,5,1.5),tgt:ln(Ko+1,4.6,Yo+3),w:1.1},{pos:ln(-7.2,3.9,-5.4),tgt:ln(Ko+2.6,2.05,Yo+3.9),w:1.3},{pos:ln(-1.8,3.9,-4.2),tgt:ln(Ko+4.5,2.2,Yo+5),w:1.3},{pos:ln(4,9,6),tgt:ln(0,11,Oi.z),w:1.3},{pos:ln(0,11,-14),tgt:ln(0,11.5,Oi.z),w:1.4},{pos:ln(0,11,-26),tgt:ln(0,11,Oi.z),w:1},{pos:ln(12,4.5,-31),tgt:ln(27,3.6,-36),w:1},{pos:ln(25.6,1.9,-36),tgt:ln(60,2.1,-36),w:0}],kd=[{at:[.06,.42],kick:"Our own brand \xB7 "+yw,line:"Pure Arabica from Shimoga, treated like engineering. Brand identity, packaging and a Shopify store."},{at:[.42,.86],kick:"We do not brew. We execute.",line:"Every bean measured, every mark specified, and a warm face against the cold data.",book:"mithraki"}],Jm=`
  attribute float kind; varying vec2 vUv; varying vec3 vW, vN; varying float vKind;
  void main(){ vUv = uv; vKind = kind; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * w; }`,Fd=`
  uniform sampler2D tLm, tGrain; uniform samplerCube tEnv; uniform float uK, uTime, uWake, uHandOn; uniform vec3 uHand;
  varying vec2 vUv; varying vec3 vW, vN; varying float vKind;
  vec3 lmDecode(vec3 c, float K){ return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)) * K; }
  vec3 tri(vec3 p, vec3 n, float s){ vec3 w = pow(abs(n), vec3(4.0)); w /= dot(w, vec3(1.0));
    return texture2D(tGrain, p.zy / s).rgb * w.x + texture2D(tGrain, p.xz / s).rgb * w.y + texture2D(tGrain, p.xy / s).rgb * w.z; }
  vec3 env(vec3 R, float lod){ return textureLod(tEnv, R, lod).rgb; }
  void main(){
    vec3 n = vN; n = dot(n, n) > 1e-6 ? normalize(n) : vec3(0.0, 1.0, 0.0);
    vec3 L = lmDecode(texture2D(tLm, vUv).rgb, uK);
    vec3 V = normalize(cameraPosition - vW), R = reflect(-V, n);
    float fres = pow(clamp(1.0 - max(dot(n, V), 0.0), 0.0, 1.0), 5.0);
    float k = vKind + 0.5; vec3 c;
    if (k > 4.0 && k < 5.0 && distance(vW.xy, vec2(-7.0, 5.75)) < 0.82 && vW.z > -12.48) k = 2.5;   // the disc under the gauges: embossed enamel, not brass (in brass it read as a face)
    vec3 grain = tri(vW, n, 4.0);
    // small end faces that got no light in the bake must not show as dark squares and steps in the bright plaster
    if (k < 1.0)       c = vec3(0.95, 0.90, 0.83) * mix(vec3(1.0), grain * 1.08, 0.35) * max(L, vec3(0.62, 0.58, 0.52));                       // lime plaster
    else if (k < 2.0) { vec3 a = vec3(0.17, 0.035, 0.04) * mix(vec3(1.0), grain, 0.25);                            // oxblood polished floor
                        c = a * L + env(R, 1.2) * (0.02 + 0.35 * fres) * 0.7; }
    else if (k < 3.0) { c = vec3(0.42, 0.05, 0.06) * L + env(R, 1.5) * (0.04 + 0.6 * fres); }                     // oxblood enamel, lacquered
    else if (k < 4.0) { c = vec3(0.50, 0.51, 0.53) * L * 0.55 + env(R, 3.4) * vec3(0.66, 0.68, 0.70) * (0.5 + 0.35 * fres); }   // brushed steel: a soft, broad reflection so flutes never smear                                // brushed steel
    else if (k < 5.0) { c = vec3(0.62, 0.42, 0.18) * L * 0.5 + env(R, 3.4) * vec3(0.95, 0.70, 0.36) * (0.5 + 0.3 * fres); }                                // brass
    else if (k < 6.0) { c = vec3(0.86, 0.84, 0.80) * L + env(R, 1.0) * (0.04 + 0.4 * fres); }                     // glazed ceramic
    else if (k < 7.0) { c = vec3(0.03, 0.025, 0.024) * L + env(R, 2.0) * (0.04 + 0.3 * fres); }                   // dark bakelite, rubber
    else if (k < 8.0) {                                                                                               // the carved wall
      vec3 alb = vec3(0.91, 0.87, 0.81) * mix(vec3(1.0), grain * 1.08, 0.3);
      vec3 d = uHand - vW; float dist = length(d); vec3 l = d / max(dist, 1e-3);
      float hand = max(dot(n, l), 0.0) * exp(-dist * dist / 18.0) * uHandOn;                // a warm light held close to the plaster
      c = alb * (L * (0.8 + 0.2 * uWake) + vec3(1.0, 0.62, 0.34) * hand * 2.6 * (0.4 + 0.6 * uWake));
    }
    else if (k < 9.0) {                                                                                             // roasted beans: each its own roast, oily
      float hb = fract(sin(dot(floor(vW * 3.2), vec3(12.9, 78.2, 37.7))) * 43758.5);
      vec3 roast = mix(vec3(0.05, 0.024, 0.012), vec3(0.11, 0.058, 0.028), hb);
      vec3 Lb = mix(vec3(dot(L, vec3(0.333))), L, 0.3);                    // the lightmap's island edges pick up the red floor: keep the beans' light neutral
      c = roast * Lb * 0.8 + vec3(dot(env(R, 0.7), vec3(0.333))) * (0.04 + 0.4 * fres) * 0.7 + vec3(1.0, 0.88, 0.75) * pow(max(dot(R, normalize(vec3(-0.4, 0.85, 0.3))), 0.0), 60.0) * 0.5 * dot(Lb, vec3(0.33));
    }
    else if (k < 10.0) c = vec3(0.26, 0.06, 0.065) * mix(vec3(1.0), grain, 0.3) * L;                                // oxblood dado plaster
    else if (k < 11.0) {                                                                                            // espresso crema: tiger-striped, glossy
      vec2 q = vW.xz; float r = fract(length(q - floor(q / 2.6 + 0.5) * 2.6) * 2.2);
      float tig = 0.5 + 0.5 * sin(atan(vW.z, vW.x) * 9.0 + vW.x * 14.0 + grain.r * 6.0);
      vec3 cr = mix(vec3(0.36, 0.19, 0.08), vec3(0.72, 0.47, 0.24), 0.45 + 0.35 * tig) * (0.85 + 0.15 * r);
      c = cr * (L * 0.8 + 0.25) + env(R, 0.4) * (0.04 + 0.5 * fres);
    }
    else {                                                                                                          // jute: a coarse open weave
      vec2 pq = abs(n.y) > 0.7 ? vW.xz : vec2(abs(n.x) > abs(n.z) ? vW.z : vW.x, vW.y);   // the weave runs along the sack's own surface
      vec2 f = pq * 9.0; float aa = 1.0 - smoothstep(0.25, 0.6, length(fwidth(f)));        // fades out where it would shimmer (moir\xE9)
      float weave = (0.5 + 0.5 * sin(f.x * 6.2832) * sin(f.y * 6.2832 + 1.57 * step(0.5, fract(f.x * 0.5)))) * aa + 0.5 * (1.0 - aa);
      vec3 jute = vec3(0.5, 0.39, 0.24) * mix(vec3(1.0), grain, 0.45) * (0.8 + 0.2 * weave);
      c = jute * max(mix(vec3(dot(L, vec3(0.333))), L, 0.5), vec3(0.62, 0.56, 0.5));   // the sack's bake faced inwards: a floor of room light
    }
    gl_FragColor = vec4(clamp(c, vec3(0.0), vec3(16.0)), 1.0);
  }`;async function Qm({base:i,unpack:e,loader:t,renderer:n,tier:r,grainTex:s}){let a=i+"mithraki/",o=ne=>new Promise((he,Ge)=>t.load(a+ne,We=>{We.colorSpace=qn,We.anisotropy=8,he(We)},void 0,Ge)),[c,l,u,d,h,p,g]=await Promise.all([fetch(a+"scene.json").then(ne=>ne.json()),e(a+"room.pack"),o("room_lm.webp"),e(a+"relief.pack"),o("relief_lm.webp"),e(a+"machine.pack"),o("machine_lm.webp")]);l.computeVertexNormals();let v=new Ji;v.background=new de(.85,.82,.78);let m={uTime:{value:0},uWake:{value:0},uHandOn:{value:0},uHand:{value:new T(0,11,Oi.z+3)}},f=new ns(r==="high"?256:128,{generateMipmaps:!0,minFilter:oi,type:nn}),y=new ye({uniforms:{...m,tLm:{value:u},tGrain:{value:s},tEnv:{value:f.texture},uK:{value:c.lm}},vertexShader:Jm,fragmentShader:Fd}),w=new xe(l,y);w.frustumCulled=!1,v.add(w),p.computeVertexNormals();let x=new ye({uniforms:{...m,tLm:{value:g},tGrain:{value:s},tEnv:{value:f.texture},uK:{value:c.lmMachine}},vertexShader:Jm,fragmentShader:Fd}),S=new xe(p,x);S.frustumCulled=!1,v.add(S),d.computeVertexNormals();let _=c.relief.rect,R=new ye({uniforms:{...m,tLm:{value:h},tGrain:{value:s},uK:{value:c.relief.k},uRect:{value:new nt(_[0],_[1],_[2],_[3])}},vertexShader:"varying vec3 vW, vN; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform sampler2D tLm, tGrain; uniform float uK, uWake, uHandOn; uniform vec3 uHand; uniform vec4 uRect; varying vec3 vW, vN;
      vec3 lmDecode(vec3 c, float K){ return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)) * K; }
      void main(){
        // the true face of the surface, not the averaged vertex normals: on these long thin triangles those fan out into shards
        vec3 n = normalize(cross(dFdx(vW), dFdy(vW))); if (n.z < 0.0) n = -n;
        vec2 uv = vec2((vW.x - uRect.x) / (uRect.y - uRect.x), (vW.y - uRect.z) / (uRect.w - uRect.z));
        vec3 L = lmDecode(texture2D(tLm, uv).rgb, uK);
        vec3 alb = vec3(0.93, 0.89, 0.83) * mix(1.0, texture2D(tGrain, vW.xy / 3.0).r * 1.08, 0.3);
        vec3 d = uHand - vW; float dist = length(d); vec3 l = d / max(dist, 1e-3);
        float hand = max(dot(n, l), 0.0) * exp(-dist * dist / 16.0) * uHandOn;          // a warm light held close to the plaster
        vec3 c = alb * (L * (0.85 + 0.15 * uWake) + vec3(1.0, 0.6, 0.32) * hand * 2.4 * (0.4 + 0.6 * uWake));
        gl_FragColor = vec4(clamp(c, vec3(0.0), vec3(16.0)), 1.0); }`}),E=new xe(d,R);E.frustumCulled=!1,v.add(E);let M=new Ca;y.uniforms.tEnv.value=null;let b=new Cs(.5,300,f);b.position.set(-2,4,-2),v.add(b);let C=y.clone();C.uniforms={...y.uniforms,tEnv:{value:null}},C.fragmentShader=Fd.replace("vec3 env(vec3 R, float lod){ return textureLod(tEnv, R, lod).rgb; }","vec3 env(vec3 R, float lod){ return vec3(0.18, 0.16, 0.15); }");let F=C.clone();F.uniforms={...C.uniforms,tLm:{value:g},uK:{value:c.lmMachine}},w.material=C,S.material=F,await Ud(n,v,b),w.material=y,S.material=x,y.uniforms.tEnv.value=f.texture,C.dispose(),F.dispose();{let ne=r==="high",he=new Nr(new Ft(54,92),{textureWidth:ne?1024:512,textureHeight:ne?1024:512,clipBias:.003,shader:{name:"mithrakiFloor",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:"uniform mat4 textureMatrix; varying vec4 vUv4; varying vec3 vW; void main(){ vUv4 = textureMatrix * vec4(position, 1.0); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform sampler2D tDiffuse; varying vec4 vUv4; varying vec3 vW; void main(){ vec3 V = normalize(cameraPosition - vW); float f = pow(1.0 - clamp(V.y, 0.0, 1.0), 3.0);
          vec3 r = texture2DProj(tDiffuse, vUv4).rgb; gl_FragColor = vec4(r, clamp(0.16 + 0.6 * f, 0.0, 0.72)); }`}});he.rotation.x=-Math.PI/2,he.position.set(0,.012,-4),he.material.transparent=!0,he.material.depthWrite=!1,he.renderOrder=1,v.add(he)}let U=r==="high"?700:300,k=new Xe,H=new Float32Array(U*4);for(let ne=0;ne<U;ne++)H[ne*4]=ne%2?1:-1,H[ne*4+1]=Math.random(),H[ne*4+2]=Math.random()*6.28,H[ne*4+3]=Math.random();k.setAttribute("position",new qe(new Float32Array(U*3),3)),k.setAttribute("aD",new qe(H,4));let D=new on(k,new ye({transparent:!0,depthWrite:!1,uniforms:{uTime:m.uTime,uPx:{value:600}},vertexShader:`uniform float uTime, uPx; attribute vec4 aD; varying float vA;
      void main(){ float life = fract(uTime * 0.12 + aD.y); float gx = ${Ko.toFixed(1)} + aD.x * 2.6;
        vec3 p = vec3(gx + sin(life * 6.0 + aD.z) * 0.5 * life, 2.4 + life * 6.5, ${(Yo+3.85).toFixed(2)} + cos(life * 5.0 + aD.z) * 0.4 * life);
        vA = 0.045 * sin(life * 3.14159) * (0.5 + aD.w * 0.5);
        vec4 mv = viewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = clamp((0.35 + life * 1.6) * uPx / max(-mv.z, 0.5), 1.0, 90.0); }`,fragmentShader:"varying float vA; void main(){ vec2 d = gl_PointCoord - 0.5; float a = (1.0 - smoothstep(0.0, 0.25, dot(d, d))) * vA; gl_FragColor = vec4(vec3(0.95, 0.93, 0.9) * a, a); }",blending:Pt}));D.frustumCulled=!1,v.add(D);let z=new ue(-9,-9),N=new bl,V=new Ei(new T(0,0,1),-Oi.z-.3),ee=-10,ce=new T,Y=ne=>{let he=n.domElement.getBoundingClientRect();z.set((ne.clientX-he.left)/he.width*2-1,-((ne.clientY-he.top)/he.height)*2+1),ee=performance.now()/1e3};n.domElement.addEventListener("pointermove",Y,{passive:!0});let be=os(ww),Z=new T,ae=new T,fe=new T(0,11,Oi.z+3);return{sun:new T(...c.sun||[-.42,.87,-.25]).normalize(),scene:v,chapters:kd,exposure:.98,entry:{origin:[0,0,42],yaw:0},exit:{origin:[26,0,-36],yaw:-Math.PI/2},exitPortal:{pos:[25.97,3.6,-36],size:[4.5,7.2],yaw:-Math.PI/2},pose(ne,he){be.sample(ne,Z,ae),he.position.copy(Z),he.lookAt(ae)},update(ne,he,Ge,We){m.uTime.value=ne,m.uWake.value+=(ht.smoothstep(Ge,.45,.85)-m.uWake.value)*(1-Math.exp(-he*2));let ut=performance.now()/1e3,me=!1;ut-ee<2.5&&(N.setFromCamera(z,We),N.ray.intersectPlane(V,ce)&&Math.abs(ce.x)<Oi.w/2&&Math.abs(ce.y-Oi.y)<Oi.h/2&&(fe.set(ce.x,ce.y,Oi.z+3.2),me=!0)),me||fe.set(Math.sin(ne*.21)*9+Math.sin(ne*.53)*3,Oi.y+Math.sin(ne*.33)*5,Oi.z+3.2),m.uHand.value.lerp(fe,1-Math.exp(-he*4)),m.uHandOn.value+=((Ge>.35?1:0)-m.uHandOn.value)*(1-Math.exp(-he*1.5))},setPx(ne){D.material.uniforms.uPx.value=ne},destroy(){n.domElement.removeEventListener("pointermove",Y),f.dispose()},dispose(){n.domElement.removeEventListener("pointermove",Y),f.dispose(),v.traverse(ne=>{ne.geometry?.dispose?.();for(let he of[].concat(ne.material||[]))he.dispose()})}}}Nt();var On=(i,e,t)=>[i,e,t],Mw=[{pos:On(0,1.9,48.4),tgt:On(0,2.1,10),w:.8},{pos:On(0,2.6,40),tgt:On(0,4,18),w:1.2},{pos:On(-.6,2.4,31),tgt:On(0,4.5,6),w:1.2},{pos:On(.6,2.7,23),tgt:On(3.6,1.4,11),w:1.4},{pos:On(-.6,2.7,9),tgt:On(-3.6,1.4,-3),w:1.4},{pos:On(0,2.8,-6),tgt:On(0,3,-40),w:1},{pos:On(0,2.6,-34),tgt:On(0,2.4,-70),w:1},{pos:On(0,2.1,-50),tgt:On(0,2.1,-80),w:1},{pos:On(0,1.9,-57.6),tgt:On(0,2.1,-95),w:0}],Nd=[{at:[.04,.5],kick:"Client \xB7 Revise Tax",line:"Full branding and website for Revise Tax."},{at:[.5,1.01],kick:"The result",line:"One of the best-looking tax websites in India, where money feels calm, clear and trusted.",book:"revisetax"}],Ew=`
  vec3 grain = tri(vW, n, 3.0);
  if (k < 1.0) { vec3 nd = N_trav(vW, n, 0.8); c = D_trav(vW, n) * vec3(1.0, 0.97, 0.92) * L * 1.12 * relief(nd, n) + env(reflect(-V, nd), 1.6) * (0.02 + 0.2 * fres); }   // the palace's marble, softly polished
  else if (k < 2.0) {                               // polished marble tiles: the vault mirrored in them, softened by their own relief
    // large polished slabs set on the diagonal: cream marble with verde diamonds and fine joints, each slab from its own block
    vec2 q = mat2(0.7071, -0.7071, 0.7071, 0.7071) * vW.xz / 0.62; vec2 cell = floor(q), f = abs(fract(q) - 0.5);
    float chk = mod(cell.x + cell.y, 2.0), joint = smoothstep(0.488, 0.497, max(f.x, f.y));
    vec3 off = vec3(cell.x * 7.3, 0.0, cell.y * 4.1);
    vec3 nd = N_trav(vW + off, n, 0.35); vec3 Rm = reflect(-V, nd);
    vec3 alb = mix(D_trav(vW + off, n) * vec3(1.0, 0.96, 0.9), D_trav(vW * 1.3 + off, n) * vec3(0.32, 0.42, 0.36), chk) * (0.94 + 0.08 * h21(cell)) * (1.0 - joint * 0.6);
    c = alb * L * 1.08 + env(Rm, 0.6) * (0.05 + 0.45 * fres) * (1.0 - joint);
  }
  else if (k < 3.0) { vec3 nd = N_plas(vW, n, 1.0); c = D_plas(vW, n) * vec3(1.0, 0.97, 0.92) * L * 1.1 * relief(nd, n); }   // rough plaster in the coffers
  else if (k < 4.0) { c = env(R, 1.4) * vec3(1.0, 0.72, 0.3) * 1.1 + L * vec3(0.12, 0.08, 0.03); }           // gold coins
  else if (k < 5.0) {                              // brushed brass safe-deposit doors: raised frame, recessed panel, enamel number plate, hinge pins
    vec3 bt = vec3(1.0, 0.74, 0.38); vec3 nd = n; float dly = 0.0; float plate = 0.0, pin = 0.0, edge = 1.0;
    dly = fract((vW.y - 0.425) / 1.35) - 0.5;                                // the doors are real geometry now (each bay laid out differently)
    float brush = 0.85 + 0.15 * h21(vec2(floor(vW.y * 380.0), floor(vW.z * 3.0)));
    float occ = clamp(dot(L, vec3(0.33)) * 1.6, 0.35, 1.0);
    vec3 Rn = reflect(-V, nd);
    float el = pow(dot(env(Rn, 0.9), vec3(0.33)), 0.8), Lg = dot(L, vec3(0.333));
    float streak = pow(max(dot(Rn, normalize(vec3(0.0, 1.0, 0.15))), 0.0), 30.0) + 0.5 * pow(max(dot(Rn, normalize(vec3(0.0, 0.3, 1.0))), 0.0), 12.0);
    float sheen = exp(-pow((dly + Rn.y * 0.55) * 4.0, 2.0));          // brushed metal: a soft band of light slides across each door as you move
    c = (bt * bt * (Lg * 0.4 + el * 1.1 + 0.04) * brush * (0.7 + 0.6 * sheen) + bt * streak * 1.4 * (0.4 + Lg) + bt * sheen * 0.22 * (0.5 + Lg)) * occ * edge;   // polished brass: the room and the skylight in it, warm and bright
    vec2 pd = vec2(0.0); float digits = 0.0;
    c = mix(c, vec3(0.86, 0.82, 0.72) * L * 0.9 + env(Rn, 1.0) * 0.05, plate);                // ivory enamel plate
    c *= 1.0 - pin * 0.6;
  }
  else if (k < 6.0) { vec3 w = mix(vec3(0.16, 0.08, 0.04), vec3(0.28, 0.15, 0.07), tri(vW * vec3(1.0, 6.0, 1.0), n, 1.2).r);   // oiled wood
                      c = w * L + env(R, 2.0) * 0.03 * (0.3 + fres); }
  else if (k < 7.0) { c = vec3(0.035) * L + env(R, 2.0) * vec3(0.12) * (0.4 + fres); }                       // black iron straps
  else if (k < 8.0) { float ridge = 0.75 + 0.25 * smoothstep(0.2, 0.5, abs(fract(vW.y / 0.0055) - 0.5));       // stacked coins: milled edges
                      vec3 gt = vec3(0.92, 0.6, 0.18);
                      c = env(R, 1.2) * gt * gt * 1.4 * ridge + gt * L * 0.12 + gt * pow(max(dot(R, normalize(vec3(-0.3, 0.9, 0.3))), 0.0), 30.0) * 2.2 * ridge; }   // stacked gold, a highlight running up the milled edges
  else { c = tri(vW, n, 1.6) * vec3(0.2, 0.27, 0.23) * L + env(R, 1.0) * (0.04 + 0.4 * fres); }                // verde marble pedestals
`;function $m(i){return zi({dir:"revisetax",parts:["room"],way:Mw,chapters:Nd,palette:Ew,textures:{trav:{id:"palace_marble",s:3.2},marb:{id:"marble_tiles",s:4},plas:{id:"white_plaster_rough_01",s:2}},sun:[-.2,.93,.3],sunCol:[1,.85,.62],scatter:.35,background:[.6,.66,.74],fog:{col:[.78,.74,.66],k:.004},exposure:1,envAt:[0,3,10],entry:{origin:[0,0,48],yaw:0},exit:{origin:[0,0,-58],yaw:0},exitPortal:{pos:[0,3.6,-58.03],size:[4.5,7.2],yaw:0},extras:async({scene:e,info:t,tier:n,U:r,envTex:s})=>{let a=new ye({transparent:!0,depthWrite:!1,blending:Pt,side:mt,uniforms:{uTime:r.uTime},vertexShader:"varying vec3 vL; void main(){ vL = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec3 vL; uniform float uTime;
          void main(){ float h = clamp(vL.y / 9.5 + 0.5, 0.0, 1.0); float edge = 1.0 - smoothstep(0.25, 0.5, max(abs(vL.x) / 3.0, abs(vL.z) / 3.0));
            float a = edge * (0.25 + 0.75 * h) * 0.055 * (0.9 + 0.1 * sin(uTime * 0.7 + vL.y)); gl_FragColor = vec4(vec3(1.0, 0.93, 0.8) * a, a); }`});for(let U of t.sky){let k=new ei(3,9.5,3,1,1,1),H=k.attributes.position;for(let z=0;z<H.count;z++){let N=H.getY(z);H.setX(z,H.getX(z)-N*.19),H.setZ(z,H.getZ(z)+N*.38)}let D=new xe(k,a);D.position.set(1,4.75,U-1.8),D.renderOrder=5,e.add(D)}let o=n==="high"?160:70,c=new vr(.032,.032,.006,16),l=new cn({color:new de("#e6ac40"),metalness:1,roughness:.22,envMapIntensity:1.4});l.envMap=s;let u=new wn(c,l,o);u.frustumCulled=!1,e.add(u);let d=[],h=(()=>{let U=7;return()=>(U=U*16807%2147483647)/2147483647})(),p=()=>(h()+h()+h()-1.5)*.8,g=(U,k)=>.9+.36*Math.pow(Math.max(0,1-(U/.8)**2-(k/.48)**2),.65),v=new zn(1,28,12,0,Math.PI*2,0,Math.PI/2);t.chests.forEach(([U,k,H],D)=>{let z=D<2?2600:1100,N=Math.cos(H),V=Math.sin(H);for(let ce=0;ce<z;ce++){let Y=(h()*2-1)*.8,be=(h()*2-1)*.48,Z=g(Y,be);if(Z<.905&&h()<.7)continue;let ae=Math.floor(h()*3),fe=Z-ae*.011+h()*.004,ne=(g(Y+.02,be)-g(Y-.02,be))/.04,he=(g(Y,be+.02)-g(Y,be-.02))/.04;d.push([U+Y*N+be*V,fe,k-Y*V+be*N,Math.atan(he)+p()*.5,h()*6.28,-Math.atan(ne)+p()*.5])}let ee=new xe(v,l);ee.scale.set(.79,.34,.47),ee.position.set(U,.9,k),ee.rotation.y=H,e.add(ee);for(let ce=0;ce<(D<2?420:160);ce++){let Y=h()*6.283,be=.95+Math.pow(h(),2.2)*1.8;d.push([U+Math.cos(Y)*be*1.1,.004+h()*.006,k+Math.sin(Y)*be*.75,p()*.08,h()*6.28,p()*.08])}});let m=new vr(.032,.032,.006,12),f=new wn(m,l,d.length);f.frustumCulled=!1;{let U=new et,k=new Ut,H=new Rn,D=new T,z=new T(1,1,1);d.forEach((N,V)=>{H.set(N[3],N[4],N[5],"YXZ"),k.setFromEuler(H),U.compose(D.set(N[0],N[1],N[2]),k,z),f.setMatrixAt(V,U)})}e.add(f),e.add(new Fi(16773597,3811864,1.2));let y=new ki(16769720,2.5);y.position.set(-3,10,6),e.add(y);let w=Array.from({length:o},(U,k)=>{let H=t.chests[k%t.chests.length];return{x:H[0]+(Math.random()-.5)*.9,z:H[1]+(Math.random()-.5)*.6,ph:Math.random(),sp:.6+Math.random()*.5,r:Math.random()*6}}),x=new et,S=new Ut,_=new Rn,R=new T,E=new T(1,1,1),M=n==="high"?1400:500,b=new Xe,C=new Float32Array(M*3);for(let U=0;U<M;U++){let k=t.sky[U%t.sky.length];C[U*3]=(Math.random()-.5)*4+1,C[U*3+1]=Math.random()*9,C[U*3+2]=k-1.8+(Math.random()-.5)*4}b.setAttribute("position",new qe(C,3));let F=new on(b,new ye({transparent:!0,depthWrite:!1,blending:Pt,uniforms:{uTime:r.uTime,uPx:{value:600}},vertexShader:`uniform float uTime, uPx; varying float vA; void main(){ vec3 p = position; p.y = mod(p.y + uTime * 0.08, 9.0); p.x += sin(uTime * 0.3 + p.z) * 0.2;
          vA = 0.35 * smoothstep(0.0, 1.0, p.y) * (1.0 - smoothstep(7.5, 9.0, p.y)); vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = clamp(0.02 * uPx / -mv.z, 1.0, 6.0); }`,fragmentShader:"varying float vA; void main(){ vec2 d = gl_PointCoord - 0.5; float a = (1.0 - smoothstep(0.0, 0.25, dot(d, d))) * vA; gl_FragColor = vec4(vec3(1.0, 0.95, 0.85) * a, a); }"}));return F.frustumCulled=!1,e.add(F),{update(U){for(let k=0;k<o;k++){let H=w[k],D=(U*H.sp*.25+H.ph)%1,z=9.6-D*D*8.7;_.set(U*3+H.r,U*2+H.r,0),S.setFromEuler(_),R.set(H.x,Math.max(z,1.15),H.z),x.compose(R,S,E),u.setMatrixAt(k,x)}u.instanceMatrix.needsUpdate=!0},setPx(U){F.material.uniforms.uPx.value=U}}}},i)}Nt();Nt();var Sw=`
  float gh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float gn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(gh(i), gh(i + vec2(1, 0)), f.x), mix(gh(i + vec2(0, 1)), gh(i + vec2(1, 1)), f.x), f.y); }`;function Xa(i){let e={uTime:i.U.uTime,uFogCol:i.U.uFogCol,uFogK:i.U.uFogK,uCenter:{value:new ue},uTile:{value:i.tile||60},uFade:{value:new ue(...i.fade||[24,32])},uH:{value:i.height||.5},uWide:{value:i.wide||1.2},uPxAng:{value:.0015},tLm:{value:i.lm},uK:{value:i.K},uRect:{value:new nt(...i.rect)},uSun:{value:(i.sun||new T(.5,.6,.4)).clone().normalize()},uTip:{value:new de(...i.tip||[.22,.3,.07])},uDry:{value:new de(...i.dry||[.42,.38,.16])},uRoot:{value:new de(...i.root||[.035,.05,.015])},uWind:{value:i.wind??1}},t=new ye({side:mt,uniforms:e,vertexShader:`${Sw}
      ${i.heightGLSL}
      ${i.maskGLSL}
      uniform float uTime, uTile, uH, uWide, uPxAng, uWind; uniform vec2 uCenter, uFade; uniform vec4 uRect;
      attribute vec4 aOff; attribute vec2 aVar; varying float vY, vVar, vGust; varying vec3 vW, vN; varying vec2 vLmUv;
      void main(){
        vec2 wp = uCenter + mod(aOff.xy - uCenter + 0.5 * uTile, uTile) - 0.5 * uTile;
        float keep = (1.0 - smoothstep(uFade.x, uFade.y, length(wp - uCenter))) * grassMask(wp);
        float clump = 0.45 + 1.05 * smoothstep(0.25, 0.75, gn(wp * 0.11) * 0.7 + gn(wp * 0.6) * 0.3);
        float h = (0.45 + aOff.w * 0.6) * uH * clump * keep;
        float y = position.y; vY = y; vVar = aVar.x;
        float a = aOff.z; vec3 side = vec3(cos(a), 0.0, sin(a)), face = vec3(-side.z, 0.0, side.x);
        float camD = length(vec3(wp.x, cameraPosition.y, wp.y) - cameraPosition);
        float w = max(0.028 * uWide, camD * uPxAng * 1.5) * (1.0 - pow(y, 1.6) * 0.92) * step(0.004, h);
        vec2 wdir = normalize(vec2(0.8, -0.6));
        float gust = (gn(wp * 0.05 - wdir * uTime * 1.3) * 1.7 - 0.35) * uWind;
        float flut = sin(uTime * 3.3 + aOff.w * 30.0 + wp.x * 0.9) * 0.08 * uWind;
        float bend = (aVar.y * 0.25 + gust * 0.95 + flut) * y * y; vGust = clamp(gust, 0.0, 1.5);
        vec3 p = vec3(wp.x, groundY(wp), wp.y) + side * position.x * w + vec3(0.0, y * h * (1.0 - 0.18 * abs(bend)), 0.0);
        p.xz += (wdir * bend * 0.9 + face.xz * aVar.y * 0.25 * y * y) * h;
        vN = normalize(mix(face, vec3(0.0, 1.0, 0.0), 0.55));
        vLmUv = vec2((wp.x - uRect.x) / (uRect.y - uRect.x), (uRect.w - wp.y) / (uRect.w - uRect.z));
        vW = p; gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
      }`,fragmentShader:`
      uniform sampler2D tLm; uniform float uK, uFogK; uniform vec3 uSun, uTip, uDry, uRoot, uFogCol;
      varying float vY, vVar, vGust; varying vec3 vW, vN; varying vec2 vLmUv;
      vec3 lmDecode(vec3 c, float K){ return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)) * K; }
      void main(){
        float y = clamp(vY, 0.0, 1.0), var = clamp(vVar, 0.0, 1.0);
        vec3 L = lmDecode(texture2D(tLm, clamp(vLmUv, 0.002, 0.998)).rgb, uK);
        vec3 alb = mix(uRoot, mix(uTip, uDry, smoothstep(0.55, 1.0, var)), pow(y, 0.7));
        vec3 V = normalize(cameraPosition - vW);
        float trans = pow(max(dot(-V, uSun), 0.0), 3.0) * y * 0.6;
        vec3 c = alb * L * (0.55 + 0.45 * y) + alb * trans * dot(L, vec3(0.5)) * 1.4;
        c *= 1.0 + clamp(vGust, 0.0, 1.5) * 0.2 * y;
        float d = length(vW - cameraPosition); c = mix(c, uFogCol, 1.0 - exp(-d * uFogK));
        gl_FragColor = vec4(clamp(c, vec3(0.0), vec3(4.0)), 1.0);
      }`}),n=new xe(qo(i.count||12e4,e.uTile.value,1,i.seed||3),t);n.frustumCulled=!1;let r=new T;return{mesh:n,update(s){s.getWorldDirection(r),e.uCenter.value.set(s.position.x+r.x*e.uTile.value*.38,s.position.z+r.z*e.uTile.value*.38)},setPx(s){e.uPxAng.value=s}}}var Hn=i=>3.2*Math.sin(i*.045)+1.6*Math.sin(i*.11+1.3),un=(i,e,t)=>[i,e,t],li=-58,gi=Hn(li)+3.3;function _w(i,e){let t=Math.abs(i-Hn(e)),n=Math.pow(Math.min(1,Math.max(0,(t-2.6)/6)),1.5),r=1.4*Math.sin(i*.09+.5)*Math.cos(e*.07)+.9*Math.sin((i-e)*.13)+.5*Math.sin(i*.31+e*.23);return r=r*n+.06*Math.sin(e*.5),r*=Math.min(1,Math.abs(e-52)/8)*Math.min(1,Math.abs(e+100)/8),r+.02*t*n*3}var tr=_w(gi,li)+.44,Tw=[{pos:un(0,1.9,52.4),tgt:un(Hn(30),2.2,30),w:.8},{pos:un(Hn(40),2.3,40),tgt:un(Hn(18),2.6,18),w:1},{pos:un(Hn(22),2.4,22),tgt:un(Hn(0),2.8,0),w:1},{pos:un(Hn(2),2.5,2),tgt:un(Hn(-24),2.6,-24),w:1},{pos:un(Hn(-22)+1.2,2.2,-22),tgt:un(Hn(-34)-3.2,1.6,-34),w:1.4},{pos:un(Hn(-34)+1,1.9,-34),tgt:un(Hn(-38)-3,1.9,-38),w:1.6},{pos:un(Hn(-50)-.4,2.3,-50),tgt:un(gi,tr,li),w:1.2},{pos:un(gi-.9,tr+.42,li+.8),tgt:un(gi-.05,tr+.06,li),w:1.6},{pos:un(Hn(-68),2.3,-68),tgt:un(Hn(-86),2.6,-86),w:1},{pos:un(Hn(-78)*.6,2.2,-80),tgt:un(0,3.4,-100),w:1},{pos:un(0,1.9,-99.6),tgt:un(0,2.1,-140),w:0}],zd=[{at:[.04,.42],kick:"Client \xB7 Bisi Kaapi",line:"Branding and website for Bisi Kaapi: filter coffee rooted in the hills of Karnataka."},{at:[.42,1.01],kick:"From the forest to the cup",line:"Coffee grows in forests like this one. We designed a brand that tastes like a Bangalore morning.",book:"bisikaapi"}],Aw=`
  const float HX = ${gi.toFixed(3)}, HZ = ${li.toFixed(1)};
  if (distance(vW.xz, vec2(HX, HZ)) < 2.6 && ((k > 1.0 && k < 3.0) || k > 5.0)) discard;   // the baked stand-ins: the set is drawn live
  vec3 g3 = tri(vW, n, 2.2);
  float pathD = abs(vW.x - (3.2 * sin(vW.z * 0.045) + 1.6 * sin(vW.z * 0.11 + 1.3)));
  if (k < 1.0) {                                     // forest floor: red laterite showing through leaf litter, mud and leaves on the trodden path
    float m1 = tri(vW * 0.18, vec3(0.0, 1.0, 0.0), 1.0).r, m2 = tri(vW * 0.7 + 3.1, vec3(0.0, 1.0, 0.0), 1.0).g;
    vec3 nd = N_leaf(vW, n, 1.0);
    vec3 a = D_leaf(vW, n), lat = D_lat(vW, n) * vec3(1.0, 0.92, 0.88), mud = D_mud(vW, n);
    float bare = smoothstep(0.5, 0.7, m1 * 0.7 + m2 * 0.3) * 0.75 + (1.0 - smoothstep(1.8, 3.4, pathD)) * 0.0;
    a = mix(a, lat, bare);
    a = mix(a, mud * 0.85, 1.0 - smoothstep(1.6, 3.2, pathD));
    nd = normalize(mix(nd, N_lat(vW, n, 1.0), bare));
    float hd = distance(vW.xz, vec2(HX, HZ));                      // the old stand-in's baked shadow is lifted to the forest's own shade
    vec3 Lg = mix(max(L, vec3(0.42, 0.42, 0.38)) * (0.8 + 0.2 * smoothstep(0.6, 1.0, hd)), L, smoothstep(2.0, 3.4, hd));
    c = a * Lg * 1.25 * relief(nd, n);
  } else if (k < 3.0) {                             // the old gates: real moss-grown stone; moss thick on every ledge and near the ground
    vec3 nd = N_wall(vW, n, 1.2); vec3 st = D_wall(vW, n);
    vec3 mo = D_mrock(vW, n) * vec3(0.8, 1.0, 0.7);
    float mossy = clamp(smoothstep(0.45, 0.85, n.y) + (1.0 - smoothstep(0.2, 1.4, vW.y)) * 0.6, 0.0, 1.0);
    vec3 Lh = distance(vW.xz, vec2(HX, HZ)) < 2.3 ? max(L, vec3(0.7, 0.68, 0.6)) : L;     // the coffee stone's bake faced inwards
    c = mix(st, mo, mossy) * Lh * 1.2 * relief(nd, n);
  }
  else if (k < 4.0) { vec3 nd = N_flag(vW, n, 1.2); c = D_flag(vW, n) * L * 1.15 * relief(nd, n) + env(reflect(-V, nd), 2.0) * 0.03; }   // pitted, mossy flagstones, a little damp
  else if (k < 5.0) { vec3 p2 = vW * vec3(1.0, 0.45, 1.0); vec3 nd = N_bark(p2, n, 1.4); c = D_bark(p2, n) * L * 1.15 * relief(nd, n); }   // real bark, stretched up the trunk
  else {                                             // hand-hammered brass: the forest and sky in it, dimpled, a glint of sun
    vec3 bt = vec3(0.78, 0.42, 0.1); float hm = tri(vW * 9.0, n, 1.0).r;
    vec3 Rh = normalize(R + (vec3(hm) - 0.5) * 0.25);                                // hammer dimples break up the reflection
    float band = exp(-pow(Rh.y * 6.0 - 0.4, 2.0)) * (0.35 + 0.65 * step(0.42, fract(atan(Rh.z, Rh.x) * 4.0 + hm * 0.3)));   // misty horizon, cut by reflected trunks
    vec3 envC = mix(mix(vec3(0.03, 0.035, 0.02), vec3(0.08, 0.12, 0.06), step(0.0, Rh.y)), vec3(0.55, 0.58, 0.5), band);
    c = bt * envC * 1.25 + bt * L * 0.08 + vec3(1.0, 0.88, 0.62) * pow(max(dot(Rh, normalize(vec3(0.55, 0.5, 0.45))), 0.0), 60.0) * 3.0;
  }
`;function e0(i){return zi({dir:"bisikaapi",parts:["room",{name:"ground",planar:!0}],way:Tw,chapters:zd,palette:Aw,textures:{leaf:{id:"forest_leaves_02",s:2.4},lat:{id:"red_laterite_soil_stones",s:3.2},mud:{id:"brown_mud_leaves_01",s:2.2},bark:{id:"bark_brown_02",s:1.4},wall:{id:"mossy_stone_wall",s:3},mrock:{id:"mossy_rock",s:2},flag:{id:"rock_pitted_mossy",s:1.1}},sun:[.45,.5,-.6],sunCol:[1,.84,.58],scatter:1.1,envAt:[gi,tr+.5,li],closeUps:[[gi,tr,li,2.6]],sky:{file:"rainforest_trail_sky.webp",exposure:.9,cut:.45},background:[.6,.72,.8],fog:{col:[.5,.6,.55],k:.0048},exposure:1.05,entry:{origin:[0,0,52],yaw:0},exit:{origin:[0,0,-100],yaw:0},exitPortal:{pos:[0,3.6,-100.03],size:[4.5,7.2],yaw:0,arch:!0},extras:async e=>{let{scene:t,info:n,tier:r,U:s,loader:a,base:o,unpack:c,groundLm:l,dir:u}=e,d=new T(.45,.5,-.6).normalize(),h={uTime:s.uTime,uSun:{value:d},uFogCol:s.uFogCol,uFogK:s.uFogK},p=new nt(...n.rect),g=await br({base:o,unpack:c,loader:a,U:h,groundLm:l,groundK:n.lm.ground,rect:p,tier:r,scene:t,layout:{items:n.items.filter(D=>!D[0].startsWith("rock_moss_set"))}}).catch(()=>null);g&&(t.add(g.group),g.fade.value=1);let v=await new Promise(D=>a.load(u+"leaves.webp",z=>{z.colorSpace=Gt,z.anisotropy=4,D(z)})),m=(D,z,N,V)=>{let ee=new Xe,ce=[],Y=[],be=[],Z=[],ae=V,fe=()=>(ae=ae*16807%2147483647)/2147483647;for(let ne=0;ne<D;ne++){let he=new T(fe()-.5,fe()-.5,fe()-.5).multiplyScalar(1.7),Ge=new T(fe()-.5,fe()*.6,fe()-.5).normalize(),We=new T().crossVectors(Ge,new T(fe()-.5,fe()-.5,fe()-.5)).normalize(),ut=.75+fe()*.5,me=Math.floor(fe()*16),Je=me%4/4,O=1-(Math.floor(me/4)+1)/4,it=ce.length/3;for(let[ze,Pe]of[[-1,-1],[1,-1],[1,1],[-1,1]]){let we=he.clone().addScaledVector(We,ze*N*ut).addScaledVector(Ge,Pe*z*ut);ce.push(we.x,we.y,we.z),Y.push(Je+(ze+1)/8,O+(Pe+1)/8),Z.push(he.length()/1.2)}be.push(it,it+1,it+2,it,it+2,it+3)}return ee.setAttribute("position",new Ye(ce,3)),ee.setAttribute("uv",new Ye(Y,2)),ee.setAttribute("aOut",new Ye(Z,1)),ee.setIndex(be),ee},f=r==="high",y=(D,z)=>{let N=new pi;N.index=D.index;for(let V of["position","uv","aOut"])N.attributes[V]=D.attributes[V];return N.setAttribute("aC",new kt(new Float32Array(z.flatMap(V=>[V[0],V[1],V[2],V[3]])),4)),N.setAttribute("aT",new kt(new Float32Array(z.flatMap((V,ee)=>[V[4],ee*.6180339%1])),2)),N.instanceCount=z.length,N},w=n.clusters.filter((D,z)=>D[4]!==1&&(f||z%2===0)),x=n.clusters.filter((D,z)=>D[4]===1&&(f||z%3!==0)),S=y(m(f?80:46,.3,.3,9),w),_=y(m(f?70:44,.24,.24,21),x),R=new xe(_,new ye({side:mt,uniforms:{...h,tLeaf:{value:v},tLm:{value:l},uK:{value:n.lm.ground},uRect:{value:p}},vertexShader:`uniform float uTime; uniform vec4 uRect; uniform sampler2D tLm; uniform float uK; attribute vec4 aC; attribute vec2 aT; attribute float aOut;
          varying vec2 vUv; varying vec3 vW, vN; varying float vOut, vType, vVar, vLit;
          vec3 lmDecode(vec3 c, float K){ return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)) * K; }
          void main(){ vUv = uv; vOut = aOut; vType = aT.x; vVar = aT.y;
            float a = aT.y * 6.283; mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
            vec3 p = position; p.xz = rot * p.xz; p *= aC.w * smoothstep(0.6, 2.2, distance(aC.xyz, cameraPosition) - aC.w);   // no leaves brushing the lens
            bool low = abs(vType - 1.0) < 0.5 || vType > 3.5;                                  // coffee and pepper vines barely move
            float sway = sin(uTime * (low ? 1.6 : 0.7) + aC.x * 0.3 + aC.z * 0.2) * (low ? 0.04 : (vType > 2.5 ? 0.3 : 0.22)) * (0.5 + 0.5 * aOut);
            float flut = sin(uTime * (low ? 5.0 : 3.6) + position.x * 13.0 + position.z * 7.0 + aT.y * 40.0) * (low ? 0.012 : 0.03) * aC.w * aOut;   // each leaf flickers in the breeze
            vec3 w = aC.xyz + p + vec3(sway + flut, flut * 0.6, sway * 0.6 - flut * 0.5);
            vN = normalize(vec3(p.x, p.y * 0.6 + aC.w * 0.4, p.z));
            vec2 lu = vec2((aC.x - uRect.x) / (uRect.y - uRect.x), (uRect.w - aC.z) / (uRect.w - uRect.z));
            vLit = clamp(dot(lmDecode(texture2D(tLm, clamp(lu, 0.002, 0.998)).rgb, uK), vec3(0.333)) * 1.4, 0.25, 1.4);   // shade under the canopy, from the bake
            if (abs(vType - 1.0) > 0.5) vLit = mix(vLit, 1.15, smoothstep(10.0, 26.0, aC.y));   // high crowns stand in the sun
            vW = w; gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0); }`,fragmentShader:`uniform sampler2D tLeaf; uniform vec3 uSun, uFogCol; uniform float uFogK; varying vec2 vUv; varying vec3 vW, vN; varying float vOut, vType, vVar, vLit;
          void main(){ vec4 t = texture2D(tLeaf, vUv); if (t.a < 0.45) discard;
            vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n; vec3 V = normalize(cameraPosition - vW);
            vec3 tint = vType < 0.5 ? vec3(1.0) : vType < 1.5 ? vec3(0.85) : vType < 2.5 ? vec3(0.78, 0.92, 0.82) : vType < 3.5 ? vec3(0.72, 0.9, 0.62) : vec3(0.62, 0.82, 0.5);
            vec3 alb = t.rgb * mix(vec3(0.85, 1.0, 0.8), vec3(1.05, 1.0, 0.75), vVar) * tint;
            if (vType > 1.5 && vType < 2.5 && !gl_FrontFacing) alb = mix(alb, vec3(0.55, 0.6, 0.55), 0.55);                  // silver oak: the pale underside
            float ao = mix(0.45, 1.0, clamp(vOut, 0.0, 1.0));
            float nl = clamp(dot(n, uSun) * 0.6 + 0.4, 0.0, 1.0);
            vec3 c = alb * (vec3(1.0, 0.88, 0.7) * 1.7 * nl * vLit + vec3(0.25, 0.32, 0.36) * 0.9) * ao;
            c += alb * vec3(0.6, 0.85, 0.3) * pow(max(dot(-V, uSun), 0.0), 3.0) * 1.4 * vLit;                       // sun through the leaves
            c += vec3(0.9, 0.95, 1.0) * pow(max(dot(reflect(-V, n), uSun), 0.0), 40.0) * (abs(vType - 1.0) < 0.5 || vType > 3.5 ? 0.5 : 0.15);    // glossy coffee and pepper leaves
            float d = length(vW - cameraPosition); c = mix(c, uFogCol, 1.0 - exp(-d * uFogK));
            gl_FragColor = vec4(c, 1.0); }`}));R.frustumCulled=!1,t.add(rs(R,t,{cell:36,pad:4,fogK:h.uFogK?h.uFogK.value:0}));let E=new xe(S,R.material);E.frustumCulled=!1,t.add(rs(E,t,{cell:36,pad:4,fogK:h.uFogK?h.uFogK.value:0}));let M=n.cherries.filter((D,z)=>r==="high"||z%2===0),b=new wn(new zn(.045,6,4),new cn({roughness:.25,metalness:0}),M.length),C=new et,F=new de;M.forEach((D,z)=>{C.makeTranslation(D[0],D[1],D[2]),b.setMatrixAt(z,C),b.setColorAt(z,D[3]?F.setRGB(.55,.03,.03):F.setRGB(.25,.42,.08))}),b.frustumCulled=!1,t.add(Wa(b,t,{cell:30,minCount:120,fogK:h.uFogK?h.uFogK.value:0})),t.add(new Fi(13624063,2761750,1.1));let U=new ki(16769200,2.2);U.position.copy(d).multiplyScalar(50),t.add(U);let k=new ye({transparent:!0,depthWrite:!1,blending:Pt,side:mt,uniforms:{uTime:s.uTime},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec2 vUv; uniform float uTime; void main(){ float a = smoothstep(0.0, 0.3, vUv.x) * (1.0 - smoothstep(0.7, 1.0, vUv.x)) * smoothstep(0.0, 0.5, vUv.y) * 0.09 * (0.85 + 0.15 * sin(uTime * 0.4 + vUv.x * 9.0));
          gl_FragColor = vec4(vec3(1.0, 0.92, 0.75) * a, a); }`});for(let D=0;D<18;D++){let z=40-D*8+(Math.random()-.5)*4,N=Hn(z)+(Math.random()-.5)*14,V=new xe(new Ft(2.5+Math.random()*3,26),k);V.position.set(N,11,z),V.rotation.set(-.5,Math.random()*.6-.3,.42)}{let D=(ne,he=64)=>new gr(ne.map(([Ge,We])=>new ue(Ge,We)),he),z=ne=>e.texU[ne].value,N=D([[0,0],[.62,0],[.7,.08],[.72,.22],[.66,.36],[.5,.43],[.2,.445],[0,.445]],40),V=N.attributes.position;for(let ne=0;ne<V.count;ne++){let he=V.getX(ne),Ge=V.getZ(ne),We=Math.atan2(Ge,he),ut=1+.06*Math.sin(We*5+1)+.04*Math.sin(We*11);V.setX(ne,he*ut),V.setZ(ne,Ge*ut*.85)}N.computeVertexNormals();let ee=new xe(N,new cn({map:z("tD_mrock"),normalMap:z("tN_mrock"),roughness:.92,color:14211276}));ee.position.set(gi,tr-.445,li),t.add(ee);let ce=new cn({color:13803600,metalness:1,roughness:.24,envMap:e.envTex,envMapIntensity:1.3}),Y=new xe(D([[0,0],[.085,0],[.1,.012],[.112,.045],[.128,.062],[.125,.066],[.106,.05],[.094,.016],[0,.012]]),ce),be=D([[0,0],[.04,0],[.044,.008],[.05,.11],[.056,.124],[.053,.126],[.046,.112],[.038,.012],[0,.01]]),Z=new xe(be,ce),ae=new xe(be,ce);Y.position.set(gi-.05,tr,li),Z.position.set(gi-.05,tr+.018,li),ae.position.set(gi+.2,tr,li+.08);let fe=new xe(new ka(.047,40),new ye({uniforms:{uTime:s.uTime},vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec2 vP; uniform float uTime; float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
            void main(){ float r = length(vP) / 0.047; float foam = smoothstep(0.55, 0.95, r) * (0.7 + 0.3 * h(floor(vP * 900.0)));
              vec3 c = mix(vec3(0.16, 0.08, 0.035), vec3(0.62, 0.45, 0.28), foam * 0.9 + 0.12 * h(floor(vP * 500.0 + uTime)));   // filter coffee, frothed by pouring
              gl_FragColor = vec4(c * 0.9, 1.0); }`}));fe.rotation.x=-Math.PI/2,fe.position.set(gi+.2,tr+.105,li+.08),t.add(Y,Z,ae,fe),n.hero=[gi+.2,tr+.12,li+.08]}if(n.hero){let z=new Xe,N=new Float32Array(90*4);for(let ee=0;ee<90;ee++)N[ee*4]=Math.random(),N[ee*4+1]=Math.random()*6.28,N[ee*4+2]=Math.random(),N[ee*4+3]=Math.random();z.setAttribute("position",new qe(N.slice(0,90*3),3)),z.setAttribute("aS",new qe(N,4));let V=new on(z,new ye({transparent:!0,depthWrite:!1,uniforms:{uTime:s.uTime,uO:{value:new T(...n.hero)}},vertexShader:`uniform float uTime; uniform vec3 uO; attribute vec4 aS; varying float vA;
            void main(){ float t = fract(aS.x + uTime * (0.16 + aS.z * 0.08)); float h = t * 0.5;
              vec3 p = uO + vec3(cos(aS.y + h * 9.0) * (0.012 + h * 0.09), h, sin(aS.y + h * 9.0) * (0.012 + h * 0.09)) + vec3(sin(uTime * 0.9 + h * 10.0) * 0.06 * h, 0.0, 0.0);
              vA = sin(t * 3.14159) * 0.03 * smoothstep(0.0, 0.15, t); vec4 mv = viewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = clamp((14.0 + 46.0 * t) / -mv.z, 1.0, 60.0); }`,fragmentShader:"varying float vA; void main(){ vec2 d = gl_PointCoord - 0.5; float a = (1.0 - smoothstep(0.05, 0.25, dot(d, d))) * vA; gl_FragColor = vec4(vec3(0.95, 0.96, 0.94), a); }"}));V.frustumCulled=!1,V.renderOrder=7,t.add(V)}let H=Xa({U:s,lm:l,K:n.lm.ground,rect:n.rect,sun:d,tile:56,count:f?14e4:6e4,fade:[20,27],height:.42,wide:1.25,tip:[.16,.24,.06],dry:[.3,.3,.12],root:[.03,.04,.012],seed:7,heightGLSL:`float groundY(vec2 p){ float x = p.x, z = p.y; float px = 3.2 * sin(z * 0.045) + 1.6 * sin(z * 0.11 + 1.3); float d = abs(x - px);
          float fl = pow(clamp((d - 2.6) / 6.0, 0.0, 1.0), 1.5);
          float h = 1.4 * sin(x * 0.09 + 0.5) * cos(z * 0.07) + 0.9 * sin((x - z) * 0.13) + 0.5 * sin(x * 0.31 + z * 0.23);
          h = h * fl + 0.06 * sin(z * 0.5); h *= min(1.0, abs(z - 52.0) / 8.0) * min(1.0, abs(z + 100.0) / 8.0); return h + 0.02 * d * fl * 3.0; }`,maskGLSL:`float grassMask(vec2 p){ float px = 3.2 * sin(p.y * 0.045) + 1.6 * sin(p.y * 0.11 + 1.3);
          return smoothstep(2.2, 3.2, abs(p.x - px)) * smoothstep(2.4, 3.4, distance(p, vec2(${gi.toFixed(2)}, ${li.toFixed(1)}))) * smoothstep(0.25, 0.6, gn(p * 0.21)); }`});return t.add(H.mesh),{update(D,z,N,V){H.update(V)},setPx(D){H.setPx(1/D)}}}},i)}Nt();var Bn=(i,e,t)=>[i,e,t],Ow=[{pos:Bn(0,1.9,12.4),tgt:Bn(0,1,-40),w:.45},{pos:Bn(0,5.5,-6.5),tgt:Bn(0,-24,-95),w:1},{pos:Bn(-44,14,-28),tgt:Bn(0,0,-105),w:1},{pos:Bn(-66,34,-80),tgt:Bn(0,30,-108),w:1.1},{pos:Bn(-44,74,-132),tgt:Bn(0,30,-112),w:1.1},{pos:Bn(10,86,-142),tgt:Bn(0,20,-118),w:1},{pos:Bn(12,24,-172),tgt:Bn(0,10,-130),w:1.1},{pos:Bn(6,-8,-180),tgt:Bn(0,-14,-200),w:1},{pos:Bn(2,-32,-184),tgt:Bn(0,-56,-190),w:0}],Vd=[{at:[.04,.45],kick:"Client \xB7 Glavida",line:"Branding and website for Glavida, a real estate company that builds homes worth waiting for."},{at:[.45,.94],kick:"From line to landmark",line:"Every great building starts as a line on paper. We gave Glavida a brand people want to move into.",book:"glavida"}],Hw="uniform float uBuild, uSea;",Bw=`
  vec3 g3 = tri(vW, n, 2.4);
  // the towers assemble: above each one's build line nothing yet, at the line a warm glow of work in progress
  float city = step(vW.z, -70.0) * step(-23.4, vW.y);
  float hgt = uBuild - 18.0 * h21(floor(vW.xz / 24.0));
  if (city > 0.5 && ((k > 1.5 && k < 4.0) || k > 6.0) && vW.y > hgt) discard;   // concrete (2.5), glass (3.5), steel (6.5), roof gardens (7.5) wait for the build line   // concrete, glass, steel and roof gardens all wait for the build line
  float band = city * step(vW.y, hgt) * (1.0 - smoothstep(0.0, 0.5, hgt - vW.y)) * step(1.5, k) * step(k, 4.0);
  if (k < 1.0) { vec3 nd = N_stone(vW, n, 1.2); c = D_stone(vW, n) * L * 1.1 * relief(nd, n); }                        // sandstone gate, balustrade
  else if (k < 2.0) { vec3 nd = N_stone(vW * 1.4, n, 1.0); c = D_stone(vW * 1.4, n) * vec3(1.02, 1.0, 0.96) * L * 1.15 * relief(nd, n); }   // terrace paving
  else if (k < 3.0) { vec3 nd = N_conc(vW, n, 1.0); c = D_conc(vW, n) * (L * 1.6 + vec3(0.12, 0.15, 0.22) * (0.6 + 0.4 * nd.y)) * relief(nd, n); }   // facade concrete, lit by the dusk sky
  else if (k < 4.0) {                                                                                    // glass: the dusk sky, and rooms behind it
    vec2 wc = vec2(abs(n.x) > 0.5 ? vW.z : vW.x, vW.y - 0.28) / vec2(2.2, 3.2), cell = floor(wc), fc = fract(wc);
    float hc = h21(cell + floor(vW.xz / 30.0) * 7.0), lit = step(0.76, hc);
    // a lit room seen through glass: warm ceiling light falling off to a dark floor, a lamp pool, sometimes a sheer curtain or a dark shape
    float ceiling = smoothstep(0.35, 0.95, fc.y), lampPool = exp(-pow((fc.x - h21(cell * 3.7)) * 3.0, 2.0)) * smoothstep(0.1, 0.6, fc.y) * 0.6;
    float shape = step(0.62, h21(cell * 7.1)) * step(abs(fc.x - 0.3 - 0.4 * h21(cell * 9.3)), 0.12) * step(fc.y, 0.55);
    float sheer = step(0.55, h21(cell * 5.3)) * 0.35;
    vec3 warm = mix(vec3(1.0, 0.6, 0.3), vec3(1.0, 0.82, 0.6), h21(cell * 1.7));
    vec3 room = warm * (0.04 + 0.22 * ceiling + 0.25 * lampPool) * (1.0 - shape * 0.8) * (1.0 - sheer * 0.4) * lit * (0.55 + 0.9 * h21(cell * 2.3));
    room += vec3(0.25, 0.35, 0.55) * 0.012 * (1.0 - lit);
    float pr = 0.75 + 0.5 * h21(floor(vec2(vW.y / 3.2, (abs(n.x) > 0.5 ? vW.z : vW.x) / 2.2)));
    vec3 refl = env(normalize(R + vec3(0.0, (pr - 1.0) * 0.05, 0.0)), 0.15) * pr;
    c = refl * (0.12 + 0.85 * fres) + room * (1.0 - fres * 0.9) + vec3(0.006, 0.009, 0.015);
  }
  else if (k < 5.0) { vec3 nd = N_rock(vW, n, 1.3); c = D_rock(vW, n) * vec3(0.55, 0.66, 0.82) * L * 1.2 * relief(nd, n); }                          // cliff rock
  else if (k < 6.0) { vec3 nd = N_asph(vW, n, 1.0); c = D_asph(vW, n) * 0.7 * L + env(reflect(-V, nd), 1.0) * (0.02 + 0.3 * fres); }   // asphalt, damp
  else if (k < 7.0) c = env(R, 2.0) * 0.5 + L * 0.06;                                                      // metal
  else if (k < 8.0) c = D_lawn(vW, n) * vec3(0.8, 0.95, 0.7) * (L * 1.3 + vec3(0.03, 0.04, 0.03));                   // lawns, roof gardens, planters
  else { float gr = sin(vW.x * 9.0 + sin(vW.z * 2.0)) * 0.5 + 0.5; c = mix(vec3(0.36, 0.22, 0.12), vec3(0.5, 0.33, 0.18), gr) * (L * 1.4 + vec3(0.12, 0.07, 0.04)); }   // timber soffits, warm from the rooms
  c += vec3(1.0, 0.55, 0.2) * band * 1.4;
`;function t0(i){return zi({dir:"glavida",parts:["room"],way:Ow,chapters:Vd,palette:Bw,glsl:Hw,textures:{stone:{id:"large_sandstone_blocks",s:3},conc:{id:"concrete_tile_facade",s:3.2},rock:{id:"rock_face_03",s:2.8},asph:{id:"asphalt_02",s:4},lawn:{id:"forest_ground_04",s:3}},sun:[-.7,.25,-.35],sunCol:[1,.6,.4],scatter:.9,sky:{file:"kiara_9_dusk_sky.webp",exposure:1,rot:3.734,cut:0,haze:[.22,.3,.44]},uniforms:{uBuild:{value:-24},uSea:{value:-26}},background:[.16,.26,.42],fog:{col:[.22,.3,.44],k:.0026},exposure:.95,envAt:[0,30,-20],entry:{origin:[0,0,12],yaw:0},exit:{origin:[2,-26,-184],yaw:0},extras:async e=>{let{scene:t,info:n,tier:r,U:s,loader:a,base:o,unpack:c,renderer:l}=e,u=e.sky,d=new Nr(new Ft(8e3,5e3),{textureWidth:1024,textureHeight:512,color:5928336,shader:{name:"harbour",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null},uTime:s.uTime},vertexShader:"uniform mat4 textureMatrix; varying vec4 vUv4; varying vec3 vW; void main(){ vUv4 = textureMatrix * vec4(position, 1.0); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform sampler2D tDiffuse; uniform float uTime; varying vec4 vUv4; varying vec3 vW;
            float hgt(vec2 p){ float t = uTime; return 0.5 * sin(p.x * 0.7 + p.y * 0.23 + t * 0.9) + 0.3 * sin(p.x * 1.9 - p.y * 1.4 - t * 1.3) + 0.15 * sin(p.y * 3.1 + p.x * 0.6 + t * 1.7) + 0.07 * sin(p.x * 6.3 + p.y * 5.1 - t * 2.4); }
            void main(){
              float dd = length(vW - cameraPosition), e = 0.12; vec2 p = vW.xz * 0.55; p += 1.4 * vec2(sin(p.y * 0.41 + uTime * 0.3), cos(p.x * 0.33 - uTime * 0.25));   // a warped field: no repeating grid
              float h0 = hgt(p); vec2 g = vec2(hgt(p + vec2(e, 0.0)) - h0, hgt(p + vec2(0.0, e)) - h0) / e;         // the slope of the swell
              vec3 n = normalize(vec3(-g.x * 0.2, 1.0, -g.y * 0.2) / (1.0 + dd * 0.004));
              vec3 V = normalize(cameraPosition - vW); float cs = max(dot(n, V), 0.0), F = 0.03 + 0.97 * pow(1.0 - cs, 5.0);
              vec4 uv = vUv4; uv.xy += n.xz * 0.06 * uv.w;
              vec3 base = mix(vec3(0.012, 0.045, 0.08), vec3(0.04, 0.13, 0.19), 0.5 + 0.5 * h0);                      // deep harbour water, lighter in the troughs
              vec3 c = mix(base, texture2DProj(tDiffuse, uv).rgb, clamp(F * 1.25, 0.0, 0.9));
              c += vec3(1.0, 0.72, 0.5) * pow(max(dot(reflect(-V, n), normalize(vec3(-0.7, 0.25, -0.35))), 0.0), 80.0) * 1.1;   // low sun glints
              c = mix(c, vec3(0.2, 0.3, 0.45), smoothstep(60.0, 260.0, dd) * smoothstep(0.0, 0.5, 1.0 - V.y) * 0.95);        // far water, seen at a grazing angle, goes to haze; looking down it stays water
              gl_FragColor = vec4(c, 1.0); }`}});d.rotation.x=-Math.PI/2,d.position.set(0,n.sea,-305),t.add(d);let h=new Ls(new Uint8Array([200,200,200,255]),1,1);h.needsUpdate=!0;let p={uTime:s.uTime,uSun:{value:new T(-.7,.3,.25).normalize()},uFogCol:s.uFogCol,uFogK:s.uFogK},g=await br({base:o,unpack:c,loader:a,U:p,groundLm:h,groundK:.5,rect:new nt(-1,1,-1,1),tier:r,scene:t,layout:{items:n.items}}).catch(()=>null);g&&(t.add(g.group),g.fade.value=1);let v=new cn({color:13214247,metalness:.3,roughness:.6});t.add(new Fi(9414872,1710626,.9));let m=new ki(16756864,1);m.position.set(-70,35,25),t.add(m);let f=(M,b,C)=>{let F=[],U=(z,N,V)=>{let ee=new T().subVectors(N,z),ce=new vr(V,V,ee.length(),4,1,!0);ce.applyQuaternion(new Ut().setFromUnitVectors(new T(0,1,0),ee.clone().normalize())),ce.translate((z.x+N.x)/2,(z.y+N.y)/2,(z.z+N.z)/2),F.push(ce)},k=(z,N,V)=>C==="y"?new T(N*b/2,z,V*b/2):new T(z,N*b/2,V*b/2),H=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let[z,N]of H)U(k(0,z,N),k(M,z,N),.09);let D=b*1.1;for(let z=0;z<M-.01;z+=D)for(let N=0;N<4;N++){let[V,ee]=H[N],[ce,Y]=H[(N+1)%4],be=Math.min(M,z+D);U(k(z,V,ee),k(z,ce,Y),.05),U(k(z,V,ee),k(be,ce,Y),.045)}return y(F)},{mergeGeometries:y}=await Promise.resolve().then(()=>(Bd(),Hd)),w=[];for(let M of[1,2,5]){let b=n.towers[M],C=b[5]+2,F=b[0]+b[2]/2+3,U=b[1],k=C+16-n.gy,H=new xe(f(k,1.6,"y"),v);H.position.set(F,n.gy,U),t.add(H);let D=new $n;D.position.set(F,C+16,U),t.add(D);let z=new xe(f(50,1.1,"x"),v);z.position.x=-12,D.add(z);let N=new xe(new ei(2.2,2,2),new cn({color:14210248,roughness:.5}));N.position.set(1.8,-1.6,0),D.add(N);let V=new xe(new ei(3.6,2.4,2),new cn({color:7170660,roughness:.9}));V.position.set(-9.5,-1.4,0),D.add(V);let ee=new xe(new vr(.03,.03,20,4),new ci({color:1710618}));ee.position.set(26,-10,0),D.add(ee);let ce=new xe(new ei(.5,.7,.3),new cn({color:13214247}));ce.position.set(26,-20.3,0),D.add(ce);let Y=new xe(new zn(.25,8,6),new ci({color:new de(6,.4,.2)}));Y.position.set(38,.8,0),D.add(Y),w.push({jib:D,ph:M,beacon:Y})}let x=[];t.traverse(M=>{M.isMesh&&M.material.uniforms&&M.material.uniforms.uBuild&&x.push(M.material)});let S=n.sea,_=s.uFogCol.value.clone(),R=s.uFogK.value,E=t.background.clone();return{update(M,b,C,F){let U=ht.lerp(-26,92,ht.smoothstep(C,.05,.6));x.forEach(H=>H.uniforms.uBuild.value=U),w.forEach(H=>{H.jib.rotation.y=Math.sin(M*.07+H.ph)*1.4,H.beacon.visible=Math.sin(M*3+H.ph)>.2});let k=F.position.y<S;s.uFogCol.value.copy(k?new de(.02,.12,.2):_),s.uFogK.value=k?.12:R,t.background.copy(k?new de(.02,.12,.2):E),u.visible=!k,d.visible=!k}}}},i)}Nt();var En=(i,e,t)=>[i,e,t],Vw=[{pos:En(0,46,50),tgt:En(-2,22,44),w:.6},{pos:En(0,39,46),tgt:En(0,20,6),w:1},{pos:En(2,18,28),tgt:En(0,2,-10),w:1},{pos:En(-1,5,6),tgt:En(0,2,-30),w:1},{pos:En(1.5,3.2,-30),tgt:En(4,1.5,-78),w:1},{pos:En(0,4,-62),tgt:En(0,3,-100),w:1},{pos:En(2,6.5,-88),tgt:En(0,22,-120),w:1},{pos:En(0,24,-108),tgt:En(0,52,-136),w:1},{pos:En(0,43.5,-122),tgt:En(0,70,-150),w:1},{pos:En(0,51.2,-126),tgt:En(0,110,-150),w:0}],Wd=[{at:[.04,.5],kick:"Client \xB7 Innovius",line:"Branding and website for Innovius, a technology company."},{at:[.5,1.01],kick:"Invisible, until it lights up",line:"Like the cables under every ocean, great technology works quietly. We gave it a voice and a face.",book:"innovius"}],Ww=`
  // caustics: sunlight focused by the waves above into bright, sharp, slowly crawling webs, split slightly into colour
  float caus1(vec2 p, float t){ vec2 q = p; float c = 0.0;
    for (int i = 0; i < 4; i++) { float s = float(i) + 1.0;
      q = p * (0.6 + s * 0.35) + vec2(sin(t * 0.55 + q.y * 1.6 + s), cos(t * 0.47 + q.x * 1.3 - s)) * (0.9 / s);
      c += 1.0 / (1.0 + 24.0 * abs(sin(q.x) * sin(q.y))); }
    return pow(c / 4.0, 1.7) * 2.6; }
  vec3 caustic3(vec2 p, float t){ return vec3(caus1(p + 0.012, t), caus1(p, t), caus1(p - 0.012, t)); }`,Gw=`
  vec3 cs3 = caustic3(vW.xz * 0.42, uTime) * smoothstep(-0.2, 0.8, n.y) * (0.6 + 0.4 * smoothstep(-2.0, 30.0, vW.y)); float cs = dot(cs3, vec3(0.333));
  if (k < 1.0) {                                         // sand: ripples, caustics dancing across it
    float rip = sin(vW.x * 2.2 + sin(vW.z * 0.7) * 2.0) * 0.5 + 0.5;
    vec3 nd = N_sand(vW, n, 1.2); vec3 a = mix(D_sand(vW, n), D_grav(vW, n) * 0.9, smoothstep(0.55, 0.8, tri(vW * 0.08, vec3(0.0, 1.0, 0.0), 1.0).r));
    c = a * (0.85 + 0.15 * rip) * L * relief(nd, n) * (0.55 + 1.9 * cs3);
  } else if (k < 2.0) { vec3 nd = N_rock(vW, n, 1.3); c = D_rock(vW, n) * L * relief(nd, n) * (0.65 + 1.4 * cs3) + vec3(0.02, 0.06, 0.05) * smoothstep(0.4, 0.9, n.y); }   // rock, a little algae on top
  else if (k < 3.0) {                                    // cable sheath: dark, a pulse of light travelling along it
    float pulse = pow(0.5 + 0.5 * sin(vW.z * 0.35 + uTime * 3.0), 18.0);
    c = vec3(0.03) * L + vec3(0.2, 0.75, 1.0) * pulse * 3.0;
  } else { c = env(R, 1.5) * vec3(0.6, 0.65, 0.7) * 0.6 + L * 0.1 + vec3(0.2, 0.8, 1.0) * 1.5 * step(0.985, fract(vW.z * 0.31 + uTime * 0.5)); }   // repeater housings, a status light
  c *= exp(-length(vW - cameraPosition) * vec3(0.05, 0.016, 0.011));                                   // clear water: red is absorbed first, blue-green carries far
`;function n0(i){return zi({dir:"innovious",parts:["room",{name:"ground",planar:!0}],way:Vw,chapters:Wd,palette:Gw,glsl:Ww,textures:{sand:{id:"sand_02",s:2.5},grav:{id:"coral_gravel",s:2},rock:{id:"rock_wall_08",s:3.5}},sun:[.1,.95,.2],sunCol:[.5,.8,.85],scatter:.7,background:[.03,.2,.28],fog:{col:[.03,.2,.28],k:.012},exposure:1.2,entry:{origin:[0,52,50],yaw:0},exit:{origin:[0,52,-126],yaw:0},extras:async e=>{let{scene:t,info:n,tier:r,U:s}=e,a=new de(.1,.42,.5),o=new de(.02,.16,.25),c=r==="high"?420:180,l=16,u=new Ft(1.15,1,2,l*2);u.translate(0,.5,0);let d=new pi;d.index=u.index,d.attributes.position=u.attributes.position,d.attributes.uv=u.attributes.uv;let h=new Float32Array(c*4);for(let V=0;V<c;V++){let ee=Math.random()<.5?-1:1;h[V*4]=ee*(6+Math.random()*40),h[V*4+1]=60-Math.random()*200,h[V*4+2]=8+Math.random()*18,h[V*4+3]=Math.random()*6.28}d.setAttribute("aK",new kt(h,4)),d.instanceCount=c;let p=new xe(d,new ye({side:mt,uniforms:{uTime:s.uTime,uFogCol:s.uFogCol,uFogK:s.uFogK},vertexShader:`uniform float uTime; attribute vec4 aK; varying float vY; varying vec3 vW; varying vec2 vUv;
          void main(){ float y = position.y; vY = y; vUv = uv; float h = aK.z;
            vec3 p = vec3(position.x * (0.35 + 0.65 * smoothstep(0.0, 0.18, y)) * (1.0 - 0.45 * y) * (0.72 + 0.28 * sin(y * h * 1.9 + aK.w * 3.0)), y * h, 0.0);   // a frond, not a straw: narrow stipe, wide wavy blade
            float s = sin(uTime * 0.6 + aK.w + y * 2.5) * 1.6 * y * y + sin(uTime * 1.3 + aK.w * 2.0 + y * 6.0) * 0.15 * y;
            p.x += s; p.z += cos(uTime * 0.5 + aK.w + y * 2.0) * 0.8 * y * y;
            mat2 r = mat2(cos(aK.w), -sin(aK.w), sin(aK.w), cos(aK.w)); p.xz = r * p.xz;
            vec3 w = vec3(aK.x, -0.5, aK.y) + p; vW = w; gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0); }`,fragmentShader:`uniform vec3 uFogCol; uniform float uFogK; varying float vY; varying vec3 vW; varying vec2 vUv;
          void main(){ float x = abs(vUv.x - 0.5) * 2.0;
            float rib = 1.0 - smoothstep(0.0, 0.12, x), ruffle = 0.85 + 0.15 * sin(vW.y * 9.0 + x * 6.0), edge = smoothstep(0.75, 1.0, x);
            vec3 V = normalize(cameraPosition - vW); float glow = pow(max(-V.y * 0.5 + 0.5, 0.0), 2.0) * (0.4 + 0.6 * vY);   // sun through the frond from above
            vec3 c = mix(vec3(0.03, 0.045, 0.02), vec3(0.16, 0.17, 0.06), vY) * ruffle * (1.0 - edge * 0.3) + vec3(0.1, 0.09, 0.03) * rib * 0.3;   // giant kelp: olive-brown, never straw yellow
            c += vec3(0.2, 0.24, 0.08) * glow * 0.3 * (1.0 - rib * 0.3);
            float d = length(vW - cameraPosition); gl_FragColor = vec4(mix(c, uFogCol, 1.0 - exp(-d * uFogK)), 1.0); }`}));p.frustumCulled=!1,t.add(p);let g=new ye({transparent:!0,depthWrite:!1,blending:Pt,side:mt,uniforms:{uTime:s.uTime},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec2 vUv; uniform float uTime; void main(){ float a = smoothstep(0.0, 0.4, vUv.x) * (1.0 - smoothstep(0.6, 1.0, vUv.x)) * smoothstep(0.0, 0.9, vUv.y) * 0.085 * (0.55 + 0.45 * sin(uTime * 0.5 + vUv.x * 7.0));
          gl_FragColor = vec4(vec3(0.6, 0.9, 1.0) * a, a); }`});for(let V=0;V<26;V++){let ee=new xe(new Ft(3+Math.random()*6,60),g);ee.position.set((Math.random()-.5)*60,26,50-V*7.5),ee.rotation.set(.12,Math.random()*Math.PI,.08),ee.renderOrder=6,t.add(ee)}let v=new xe(new Ft(420,420,1,1),new ye({side:mt,depthWrite:!1,uniforms:{uTime:s.uTime,uFogCol:s.uFogCol},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform float uTime; uniform vec3 uFogCol; varying vec3 vW;
          float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h2(i), h2(i + vec2(1, 0)), f.x), mix(h2(i + vec2(0, 1)), h2(i + vec2(1, 1)), f.x), f.y); }
          float hgt(vec2 p, float t){ return n2(p * 0.35 + vec2(t * 0.11, t * 0.05)) * 1.0 + n2(p * 0.95 - vec2(t * 0.17, -t * 0.09)) * 0.45 + n2(p * 2.4 + vec2(t * 0.3, t * 0.21)) * 0.18 + n2(p * 6.1 - t * 0.45) * 0.06; }
          void main(){ vec3 V = normalize(vW - cameraPosition); float t = uTime;
            // a real water skin: many small waves (fine detail stays sharp however close you rise), seen through Snell's window
            float e = 0.08, h0 = hgt(vW.xz, t); vec2 g = vec2(hgt(vW.xz + vec2(e, 0.0), t) - h0, hgt(vW.xz + vec2(0.0, e), t) - h0) / e;
            vec3 nrm = normalize(vec3(-g.x * 0.35, -1.0, -g.y * 0.35));
            vec3 T = refract(V, nrm, 1.33); float cosI = dot(V, nrm), kW = 1.0 - 1.33 * 1.33 * (1.0 - cosI * cosI);
            // the window's edge is soft, and close under the surface it opens into light: never hard flat blobs
            float win = mix(smoothstep(-0.3, 0.3, kW), 1.0, smoothstep(16.0, 3.0, length(vW - cameraPosition)) * 0.9);
            vec3 D = kW > 0.0 ? normalize(T) : reflect(V, nrm);
            vec3 sunD = normalize(vec3(0.12, 0.96, -0.25)); float sd = max(dot(D, sunD), 0.0);
            vec3 sky = mix(vec3(0.3, 0.6, 0.72), vec3(0.62, 0.84, 0.94), smoothstep(0.3, 1.0, D.y));
            vec3 below = vec3(0.025, 0.15, 0.19);
            float edge = 1.0 - smoothstep(0.0, 0.18, abs(dot(V, nrm)) - 0.66);
            vec3 c = mix(below, sky, win) + vec3(0.55, 0.85, 0.9) * edge * 0.12 * win + vec3(1.0, 0.96, 0.85) * (pow(sd, 220.0) * 9.0 + pow(sd, 18.0) * 0.5) * win;
            float d = length(vW - cameraPosition); gl_FragColor = vec4(mix(c, uFogCol, 1.0 - exp(-d * 0.011)), 1.0); }`}));v.rotation.x=Math.PI/2,v.position.set(0,52,-100),v.renderOrder=2,t.add(v);let m=r==="high"?2500:900,f=new Xe,y=new Float32Array(m*3);for(let V=0;V<m;V++)y[V*3]=(Math.random()-.5)*80,y[V*3+1]=Math.random()*50,y[V*3+2]=60-Math.random()*200;f.setAttribute("position",new qe(y,3));let w=new on(f,new ye({transparent:!0,depthWrite:!1,uniforms:{uTime:s.uTime,uPx:{value:600}},vertexShader:`uniform float uTime, uPx; varying float vA; void main(){ vec3 p = position; p.y = mod(p.y - uTime * 0.25, 50.0); p.x += sin(uTime * 0.2 + p.z) * 0.6;
          vec4 mv = modelViewMatrix * vec4(p, 1.0); vA = (1.0 - smoothstep(5.0, 60.0, -mv.z)) * 0.5; gl_Position = projectionMatrix * mv; gl_PointSize = clamp(0.06 * uPx / -mv.z, 1.0, 5.0); }`,fragmentShader:"varying float vA; void main(){ vec2 d = gl_PointCoord - 0.5; float a = (1.0 - smoothstep(0.0, 0.25, dot(d, d))) * vA; gl_FragColor = vec4(vec3(0.8, 0.9, 0.95) * a, a); }"}));w.frustumCulled=!1,t.add(w);let x=r==="high"?260:120,S=new gr([[0,-.21],[.03,-.18],[.06,-.08],[.065,.02],[.05,.12],[.02,.18],[.012,.2]].map(([V,ee])=>new ue(V,ee)),10);S.scale(1,1,.55),S.rotateX(-Math.PI/2);let _=new Xe;_.setAttribute("position",new Ye([0,0,-.19,0,.07,-.29,0,-.07,-.29],3));let{mergeGeometries:R}=await Promise.resolve().then(()=>(Bd(),Hd)),E=S.toNonIndexed();E.deleteAttribute("uv"),E.deleteAttribute("normal");let M=R([E,_]);M.deleteAttribute("normal"),M.computeVertexNormals();let b=new cn({color:12176598,metalness:.25,roughness:.4,emissive:1915464,side:mt});b.onBeforeCompile=V=>{V.uniforms.uTime=s.uTime,V.vertexShader=`uniform float uTime;
`+V.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
 transformed.x += sin(uTime * 14.0 + float(gl_InstanceID) * 1.7 + position.z * 18.0) * 0.025 * (1.0 - smoothstep(-0.3, 0.05, position.z));`),V.fragmentShader=V.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb *= mix(vec3(0.35, 0.45, 0.55), vec3(1.0), smoothstep(-0.03, 0.04, -vNormal.y));`)};let C=new wn(M,b,x);C.frustumCulled=!1,t.add(C),t.add(new Fi(10475775,661536,1.4));let F=Array.from({length:x},()=>({r:4+Math.random()*5,h:(Math.random()-.5)*3,ph:Math.random()*6.28,sp:.25+Math.random()*.15})),U=new et,k=new Ut,H=new T,D=new T(1,1,1),z=new T(0,1,0),N=Xa({U:s,lm:e.groundLm,K:n.lm.ground,rect:n.rect,sun:new T(.1,.95,.2),tile:50,count:r==="high"?11e4:45e3,fade:[18,25],height:.75,wide:1.6,tip:[.2,.38,.12],dry:[.36,.42,.16],root:[.03,.07,.04],wind:.9,seed:21,heightGLSL:"float groundY(vec2 p){ float x = p.x, z = p.y; return 1.6 * sin(x * 0.05 + 0.4) * cos(z * 0.04) + 0.9 * sin((x + z) * 0.09) + 0.35 * sin(x * 0.23 - z * 0.17) - 0.0002 * x * x; }",maskGLSL:"float grassMask(vec2 p){ return smoothstep(0.42, 0.62, gn(p * 0.09) * 0.7 + gn(p * 0.5) * 0.3); }"});return t.add(N.mesh),{update(V,ee,ce,Y){N.update(Y);let be=ht.clamp((Y.position.y-5)/40,0,1);s.uFogCol.value.copy(o).lerp(a,be),t.background.copy(s.uFogCol.value);let Z=3,ae=-40+Math.sin(V*.05)*20;F.forEach((fe,ne)=>{let he=V*fe.sp+fe.ph;H.set(Z+Math.cos(he)*fe.r,7+fe.h+Math.sin(he*2)*.6,ae+Math.sin(he)*fe.r),k.setFromAxisAngle(z,-he),U.compose(H,k,D),C.setMatrixAt(ne,U)}),C.instanceMatrix.needsUpdate=!0},setPx(V){w.material.uniforms.uPx.value=V,N.setPx(1/V)}}}},i)}Nt();var Zo=-18,ls=i=>2+1.6*Math.sin(i*.06);function r0(i,e){let t=(e-Zo)/26,n=-2.2+2.2/(1+Math.exp(-t*3))+Math.max(0,e-Zo)*.035,r=1.2*Math.max(0,Math.tanh((e-6)/10))*(.6+.4*Math.sin(i*.12+1))+.5*Math.sin(i*.21+e*.13)*Math.max(0,Math.tanh((e-2)/8)),s=Math.min(1,Math.abs(i-ls(e))/5);return n+r*(.35+.65*s)+.04*Math.sin(i*1.3)*Math.sin(e*.9)}var Ns=i=>Math.max(r0(ls(i),i),.15)+.42+1.62,rn=37,Ln=ls(rn)+.2,zr=r0(Ln,rn)+.13,ti=(i,e,t)=>[i,e,t],qw=[{pos:ti(0,-.8,-66),tgt:ti(0,14,-44),w:.7},{pos:ti(0,.7,-54),tgt:ti(1,2.4,-8),w:1},{pos:ti(1.4,1.5,-32),tgt:ti(ls(0),2.6,8),w:1.1},{pos:ti(ls(-8),Ns(-8),-8),tgt:ti(ls(10),Ns(10)-.3,10),w:1},{pos:ti(ls(12)-.4,Ns(12),12),tgt:ti(ls(28),Ns(28)-.6,28),w:1.1},{pos:ti(Ln-.55,zr+.3,rn-.95),tgt:ti(Ln,zr+.06,rn),w:1.4},{pos:ti(Ln+3,Ns(rn)+2,rn+2.5),tgt:ti(Ln-30,26,rn+110),w:1.1},{pos:ti(Ln+2,Ns(rn)+16,rn+10),tgt:ti(Ln-30,20,rn+240),w:0}],Gd=[{at:[.04,.5],kick:"Client \xB7 House of Moh",line:"Branding and website for House of Moh: daily creams for women and men."},{at:[.5,1.01],kick:"Soft by nature",line:"Gentle as a twilight shore and made for every day. We designed a brand you want on your skin.",book:"houseofmoh"}],i0=`
  float hmH(float x, float z){ float t = (z - ${Zo.toFixed(1)}) / 26.0;
    float base = -2.2 + 2.2 / (1.0 + exp(-t * 3.0)) + max(0.0, z - ${Zo.toFixed(1)}) * 0.035;
    float wx = 2.0 + 1.6 * sin(z * 0.06);
    float dune = 1.2 * max(0.0, tanh((z - 6.0) / 10.0)) * (0.6 + 0.4 * sin(x * 0.12 + 1.0)) + 0.5 * sin(x * 0.21 + z * 0.13) * max(0.0, tanh((z - 2.0) / 8.0));
    return base + dune * (0.35 + 0.65 * min(1.0, abs(x - wx) / 5.0)); }`,Xw=`
  if (distance(vW.xz, vec2(${Ln.toFixed(3)}, ${rn.toFixed(1)})) < 1.45 && k > 1.5 && k < 7.0) discard;   // the baked plinth and jar: drawn live, at true scale
  if (k < 1.0) {                                     // sand: fine and dry above, dark and glassy where the waves have been, rippled below
    float wet = 1.0 - smoothstep(0.05, 0.55, vW.y);
    vec3 nd = N_sand(vW, n, 1.2); vec3 dry = D_sand(vW, n), dmp = D_wet(vW, n) * 0.8;
    vec3 a = mix(dry, dmp, wet); nd = normalize(mix(nd, N_wet(vW, n, 1.0), wet));
    float jd = distance(vW.xz, vec2(${Ln.toFixed(3)}, ${rn.toFixed(1)}));                            // the old plinth's baked shadow lifted
    vec3 Ls = mix(max(L, vec3(0.42, 0.4, 0.46)) * (0.7 + 0.3 * smoothstep(0.4, 0.75, jd)), L, smoothstep(1.6, 2.6, jd));
    c = a * Ls * 1.2 * relief(nd, n);
    c += env(reflect(-V, nd), 1.0) * wet * (0.04 + 0.5 * fres) * 0.5;                // the wet sand mirrors the sky
  }
  else if (k < 3.0) {                               // sandstone headlands and the plinth (the old stand-in's baked shadow lifted; a soft contact shadow kept)
    float jd = distance(vW.xz, vec2(${Ln.toFixed(3)}, ${rn.toFixed(1)}));
    vec3 Lp = mix(max(L, vec3(0.5, 0.46, 0.5)) * (0.55 + 0.45 * smoothstep(0.09, 0.2, jd)), L, smoothstep(0.75, 1.1, jd));
    vec3 nd = N_rock(vW, n, 1.3); c = D_rock(vW, n) * Lp * 1.25 * relief(nd, n); }
  else if (k < 4.0) { vec3 nd = N_plank(vW, n, 1.2); c = D_plank(vW, n) * L * 1.2 * relief(nd, n); }     // sun-silvered boardwalk planks
  else if (k < 5.0) c = D_rock(vW * 2.0, n) * vec3(0.8, 0.8, 0.78) * L;                                    // frangipani bark, smooth and grey
  else if (k < 6.0) { c = vec3(0.93, 0.88, 0.8) * max(L, vec3(0.62, 0.6, 0.66)) + env(R, 0.5) * (0.05 + 0.5 * fres) * 0.6; }   // the cream jar, glazed
  else if (k < 7.0) { c = vec3(0.85, 0.62, 0.3) * (L * 0.25 + 0.2) + vec3(0.85, 0.62, 0.3) * env(R, 0.8) * 1.2; }               // gold lid
  else c = vec3(0.04) * L + vec3(0.1) * fres;                                                                 // lantern iron
`;function s0(i){return zi({dir:"houseofmoh",parts:["room",{name:"ground",planar:!0}],way:qw,chapters:Gd,palette:Xw,textures:{sand:{id:"coast_sand_01",s:2.4},wet:{id:"damp_beach_sand",s:2},plank:{id:"weathered_planks",s:1.8},rock:{id:"coast_sand_rocks_02",s:4}},sun:[.2,.15,-1],sunCol:[1,.62,.42],scatter:1.1,closeUps:[[Ln,zr,rn,2.6]],sky:{file:"kiara_9_dusk_sky.webp",exposure:1.05,rot:2.429,cut:0},envAt:[Ln,zr+.4,rn],background:[.2,.25,.4],fog:{col:[.42,.42,.55],k:.0035},exposure:1.05,entry:{origin:[0,0,-66],yaw:Math.PI},exit:{origin:[Ln+2,Ns(rn)+16,rn+10],yaw:0},extras:async e=>{let{scene:t,info:n,tier:r,U:s,loader:a,base:o,unpack:c,groundLm:l}=e,u=r==="high",d=new T(-.3,.42,.86).normalize(),h=new T(.2,.05,-1).normalize(),p=`uniform sampler2D tSky; uniform float uSkyRot;
        vec3 skyCol(vec3 d){ float lon = atan(d.z, d.x) + uSkyRot, lat = asin(clamp(d.y, -1.0, 1.0));
          return pow(texture2D(tSky, vec2(0.5 + lon / 6.2831853, 0.5 + lat / 3.1415927)).rgb, vec3(2.2)); }`,g=e.sky,v=new xe(new Ft(4e3,4e3,u?400:240,u?400:240),new ye({transparent:!0,depthWrite:!1,side:mt,uniforms:{uTime:s.uTime,uFogCol:s.uFogCol,uFogK:s.uFogK,tSky:g.material.uniforms.tSky,uSkyRot:g.material.uniforms.uRot},vertexShader:`uniform float uTime; varying vec3 vW; varying float vCrest;
          void main(){ vec3 p = (modelMatrix * vec4(position, 1.0)).xyz;
            float w1 = sin(p.z * 0.35 + uTime * 1.1 + sin(p.x * 0.05) * 1.5), w2 = sin(p.x * 0.21 - p.z * 0.17 + uTime * 0.7), w3 = sin(p.z * 0.9 + p.x * 0.3 + uTime * 1.9);
            float shoal = smoothstep(-40.0, -8.0, p.z);                            // the swell grows as it shoals
            p.y += (w1 * 0.16 + w2 * 0.08 + w3 * 0.03) * (0.6 + shoal * 0.8); vCrest = w1 * 0.5 + 0.5; vW = p;
            gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0); }`,fragmentShader:`uniform float uTime; uniform vec3 uFogCol; uniform float uFogK; varying vec3 vW; varying float vCrest; ${i0} ${p}
          float wn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5), b = fract(sin(dot(i + vec2(1, 0), vec2(127.1, 311.7))) * 43758.5),
            c = fract(sin(dot(i + vec2(0, 1), vec2(127.1, 311.7))) * 43758.5), d = fract(sin(dot(i + vec2(1, 1), vec2(127.1, 311.7))) * 43758.5); return mix(mix(a, b, f.x), mix(c, d, f.x), f.y); }
          // the slope of a sum of wave trains (long swell to fine chop), for a real, sharp water normal
          vec2 waveSlope(vec2 p, float t){ vec2 g = vec2(0.0);
            vec2 D[6]; D[0] = normalize(vec2(0.1, 1.0)); D[1] = normalize(vec2(0.35, 1.0)); D[2] = normalize(vec2(-0.3, 1.0)); D[3] = normalize(vec2(0.8, 0.6)); D[4] = normalize(vec2(-0.7, 0.7)); D[5] = normalize(vec2(0.2, -1.0));
            float L[6]; L[0] = 9.0; L[1] = 5.3; L[2] = 3.1; L[3] = 1.7; L[4] = 0.95; L[5] = 0.55;
            for (int i = 0; i < 6; i++) { float k = 6.2831 / L[i], A = 0.045 * L[i] / 9.0 + 0.004, ph = dot(D[i], p) * k + t * sqrt(9.8 * k);
              g += D[i] * k * A * cos(ph); }
            return g; }
          void main(){ float depth = -hmH(vW.x, vW.z); vec3 V = normalize(cameraPosition - vW);
            float dc = length(vW - cameraPosition);
            vec2 sl = waveSlope(vW.xz, uTime) * (0.55 + 0.45 / (1.0 + dc * 0.015))              // long swell calms with distance: no contour stripes
                    + (vec2(wn(vW.xz * 1.3 + uTime * 0.4), wn(vW.xz * 1.3 - uTime * 0.35 + 9.0)) - 0.5) * 0.16
                    + (vec2(wn(vW.xz * 3.7 + uTime * 0.8), wn(vW.xz * 3.7 - uTime * 0.7 + 4.0)) - 0.5) * 0.1 / (1.0 + dc * 0.03)
                    + (vec2(wn(vW.xz * 9.0 - uTime * 1.3), wn(vW.xz * 9.0 + uTime * 1.1 + 2.0)) - 0.5) * 0.06 / (1.0 + dc * 0.08);
            vec3 n = normalize(vec3(-sl.x, 1.0, -sl.y));
            if (cameraPosition.y < vW.y) {                                  // from below: Snell's window, the dusk sky bent through the moving skin; beyond it the surface mirrors the deep
              vec3 nb = normalize(vec3(sl.x * 1.6, -1.0, sl.y * 1.6)); vec3 I = -V; vec3 T = refract(I, nb, 1.33);
              float win = dot(T, T) > 0.0 ? 1.0 : 0.0;
              vec3 sky = skyCol(normalize(T + vec3(0.0, 0.05, 0.0))) * 1.6 + vec3(1.0, 0.75, 0.5) * pow(max(dot(normalize(T), normalize(vec3(0.2, 0.06, -1.0))), 0.0), 40.0) * 2.0;
              vec3 deepU = vec3(0.03, 0.2, 0.26) * (0.8 + 0.4 * wn(vW.xz * 0.5 + uTime * 0.2));
              float edge = smoothstep(0.0, 0.25, dot(T, T));
              vec3 cu = mix(deepU, sky, win * edge);
              cu += vec3(0.6, 0.9, 1.0) * pow(wn(vW.xz * 2.0 + sl * 4.0 + uTime * 0.3), 6.0) * 0.6 * win;   // caustic sparkle on the skin
              float du = length(vW - cameraPosition); cu = mix(cu, uFogCol, 1.0 - exp(-du * 0.03));
              gl_FragColor = vec4(cu, 1.0); return; }
            vec3 R = reflect(-V, n); R.y = max(abs(R.y), 0.2); R = normalize(R);   // never reflect the dark band under the sky photo's horizon: that made flat puddles
            float fr = 0.02 + 0.98 * pow(1.0 - max(dot(n, V), 0.0), 5.0);
            vec3 deep = vec3(0.008, 0.05, 0.085), shallow = vec3(0.08, 0.36, 0.38);
            vec3 body = mix(shallow, deep, smoothstep(0.3, 7.0, depth)) * (0.92 + 0.16 * smoothstep(0.0, 0.25, sl.y + sl.x * 0.3));   // light through the crests
            vec3 c = mix(body, skyCol(R), fr);
            vec3 SUN = normalize(vec3(0.2, 0.06, -1.0));
            c += vec3(1.0, 0.72, 0.45) * (pow(max(dot(R, SUN), 0.0), 900.0) * 18.0 + pow(max(dot(R, SUN), 0.0), 60.0) * 0.5);   // the sun's glitter path
            float lace = smoothstep(0.5, 0.95, wn(vW.xz * 2.2 + vec2(uTime * 0.3, 0.0)) * 0.6 + wn(vW.xz * 7.0 - uTime * 0.5) * 0.4);
            float run = 0.35 + 0.25 * sin(vW.x * 0.25 + uTime * 0.9) + 0.15 * sin(uTime * 0.37);
            float foam = (1.0 - smoothstep(0.0, run, depth)) * (0.45 + 0.55 * lace);
            foam += smoothstep(run, run + 0.6, depth) * (1.0 - smoothstep(run + 0.6, run + 1.6, depth)) * lace * 0.45;   // the broken lace behind the wave
            foam += smoothstep(0.9, 1.0, vCrest) * smoothstep(-14.0, -4.0, vW.z) * lace * 0.1;   // only a whisper of white on the crests near the shore
            c = mix(c, vec3(0.74, 0.8, 0.84) * (0.6 + 0.4 * dot(n, vec3(0.0, 1.0, 0.0))), clamp(foam, 0.0, 1.0) * 0.85);
            float a = clamp(0.35 + depth * 0.9, 0.3, 0.96); a = max(a, foam);
            if (depth < -0.05) discard;
            float d = length(vW - cameraPosition); c = mix(c, uFogCol, (1.0 - exp(-d * uFogK)) * 0.55);
            gl_FragColor = vec4(c, a); }`}));v.rotation.x=-Math.PI/2,v.position.set(0,0,-120),v.renderOrder=4,v.frustumCulled=!1,t.add(v);let m=d.clone(),f={uTime:s.uTime,uSun:{value:m},uFogCol:s.uFogCol,uFogK:s.uFogK},y=new nt(...n.rect),w=n.items.filter(me=>!(me[0].startsWith("coast_rocks")&&me[3]<Zo+1)),x=await br({base:o,unpack:c,loader:a,U:f,groundLm:l,groundK:n.lm.ground,rect:y,tier:r,scene:t,layout:{items:w}}).catch(()=>null);x&&(t.add(x.group),x.fade.value=1);let S=await new Promise(me=>a.load(o+"bisikaapi/leaves.webp",Je=>{Je.colorSpace=Gt,Je.anisotropy=4,me(Je)})),_=(me,Je,O)=>{let it=new Xe,ze=[],Pe=[],we=[],Qe=[],Fe=O,I=()=>(Fe=Fe*16807%2147483647)/2147483647;for(let A=0;A<me;A++){let K=new T(I()-.5,I()-.5,I()-.5).multiplyScalar(1.6),re=new T(I()-.5,.2+I()*.7,I()-.5).normalize(),oe=new T().crossVectors(re,new T(I()-.5,I()-.5,I()-.5)).normalize(),se=.75+I()*.5,He=Math.floor(I()*16),Ae=He%4/4,De=1-(Math.floor(He/4)+1)/4,rt=ze.length/3;for(let[ve,ke]of[[-1,-1],[1,-1],[1,1],[-1,1]]){let Ne=K.clone().addScaledVector(oe,ve*Je*se).addScaledVector(re,ke*Je*se);ze.push(Ne.x,Ne.y,Ne.z),Pe.push(Ae+(ve+1)/8,De+(ke+1)/8),Qe.push(K.length()/1.1)}we.push(rt,rt+1,rt+2,rt,rt+2,rt+3)}return it.setAttribute("position",new Ye(ze,3)),it.setAttribute("uv",new Ye(Pe,2)),it.setAttribute("aOut",new Ye(Qe,1)),it.setIndex(we),it},R=(me,Je)=>{let O=new pi;O.index=me.index;for(let it of["position","uv","aOut"])O.attributes[it]=me.attributes[it];return O.setAttribute("aC",new kt(new Float32Array(Je.flatMap(it=>[it[0],it[1],it[2],it[3]])),4)),O.setAttribute("aT",new kt(new Float32Array(Je.flatMap((it,ze)=>[it[4],ze*.6180339%1])),2)),O.instanceCount=Je.length,O},E=new ye({side:mt,uniforms:{...f,tLeaf:{value:S},tLm:{value:l},uK:{value:n.lm.ground},uRect:{value:y}},vertexShader:`uniform float uTime; uniform vec4 uRect; uniform sampler2D tLm; uniform float uK; attribute vec4 aC; attribute vec2 aT; attribute float aOut;
          varying vec2 vUv; varying vec3 vW, vN; varying float vOut, vType, vVar, vLit;
          vec3 lmDecode(vec3 c, float K){ return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)) * K; }
          void main(){ vUv = uv; vOut = aOut; vType = aT.x; vVar = aT.y;
            float a = aT.y * 6.283; mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a)); vec3 p = position; p.xz = rot * p.xz; p *= aC.w * smoothstep(0.6, 2.2, distance(aC.xyz, cameraPosition) - aC.w);
            float sway = sin(uTime * 1.1 + aC.x * 0.4 + aC.z * 0.3) * 0.08 * (0.5 + 0.5 * aOut);
            float flut = sin(uTime * 4.4 + position.x * 13.0 + position.z * 7.0 + aT.y * 40.0) * 0.025 * aC.w * aOut;   // leaves flicker in the sea breeze
            vec3 w = aC.xyz + p + vec3(sway + flut, flut * 0.6, sway * 0.5 - flut * 0.4); vN = normalize(vec3(p.x, p.y * 0.6 + aC.w * 0.4, p.z));
            vec2 lu = vec2((aC.x - uRect.x) / (uRect.y - uRect.x), (uRect.w - aC.z) / (uRect.w - uRect.z));
            vLit = clamp(dot(lmDecode(texture2D(tLm, clamp(lu, 0.002, 0.998)).rgb, uK), vec3(0.333)) * 1.4, 0.3, 1.4);
            vW = w; gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0); }`,fragmentShader:`uniform sampler2D tLeaf; uniform vec3 uSun, uFogCol; uniform float uFogK; varying vec2 vUv; varying vec3 vW, vN; varying float vOut, vType, vVar, vLit;
          void main(){ vec4 t = texture2D(tLeaf, vUv); if (t.a < 0.45) discard;
            vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n; vec3 V = normalize(cameraPosition - vW);
            vec3 alb = t.rgb * (vType < 0.5 ? vec3(0.9, 1.0, 0.75) : vec3(0.75, 0.95, 0.7)) * mix(0.9, 1.1, vVar);
            float ao = mix(0.5, 1.0, clamp(vOut, 0.0, 1.0)), nl = clamp(dot(n, uSun) * 0.5 + 0.5, 0.0, 1.0);
            vec3 c = alb * (vec3(0.55, 0.6, 0.8) * 0.9 * nl * vLit + vec3(0.32, 0.26, 0.3) * 0.7) * ao;
            c += vec3(0.7, 0.75, 0.9) * pow(max(dot(reflect(-V, n), uSun), 0.0), 30.0) * 0.25;
            float d = length(vW - cameraPosition); c = mix(c, uFogCol, 1.0 - exp(-d * uFogK)); gl_FragColor = vec4(c, 1.0); }`}),M=new xe(R(_(u?70:42,.2,5),n.clusters.filter(me=>me[4]===0).map(me=>[me[0],me[1]+.15,me[2],me[3]*1.7,0])),E);M.frustumCulled=!1,t.add(rs(M,t,{cell:36,pad:4,fogK:f.uFogK?f.uFogK.value:0}));let b=new xe(R(_(u?64:40,.11,13),n.clusters.filter(me=>me[4]===1)),E);b.frustumCulled=!1,t.add(rs(b,t,{cell:36,pad:3,fogK:f.uFogK?f.uFogK.value:0}));let C=(me,Je)=>{let O=[],it=[],ze=[];O.push(0,0,0),it.push(0,0,0);for(let we=0;we<5;we++)for(let Qe=1;Qe<=4;Qe++)for(let Fe=-1;Fe<=1;Fe++){let I=we*1.2566+Fe*.42*Math.sin(Qe/4*Math.PI*.9+.3)+Qe/4*.35,A=me*(Qe/4);O.push(Math.cos(I)*A,Je*(Qe/4)**2*me,Math.sin(I)*A),it.push(Qe/4,0,0)}for(let we=0;we<5;we++){let Qe=1+we*12;ze.push(0,Qe+1,Qe),ze.push(0,Qe+2,Qe+1);for(let Fe=0;Fe<3;Fe++)for(let I=0;I<2;I++){let A=Qe+Fe*3+I,K=A+3;ze.push(A,K,A+1,A+1,K,K+1)}}let Pe=new Xe;return Pe.setAttribute("position",new Ye(O,3)),Pe.setAttribute("aR",new Ye(it.filter((we,Qe)=>Qe%3===0),1)),Pe.setIndex(ze),Pe.computeVertexNormals(),Pe},F=(me,Je)=>new ye({side:mt,uniforms:{uTime:s.uTime,uFogCol:s.uFogCol,uFogK:s.uFogK,uIn:{value:new de(...me)},uOut:{value:new de(...Je)},uMoon:{value:d}},vertexShader:`uniform float uTime; attribute float aR; varying float vR; varying vec3 vN, vW; void main(){ vR = aR; vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vec3 o = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;               // each flower nods in the sea breeze, the petals flutter a little
          w.xyz += vec3(sin(uTime * 1.7 + o.x * 0.8 + o.z * 0.6), 0.0, cos(uTime * 1.4 + o.z * 0.7)) * 0.03 + vec3(0.0, sin(uTime * 6.0 + o.x * 9.0 + aR * 5.0) * 0.006 * aR, 0.0); vW = w.xyz; vN = normalize(mat3(modelMatrix * instanceMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`uniform vec3 uIn, uOut, uFogCol, uMoon; uniform float uFogK; varying float vR; varying vec3 vN, vW;
          void main(){ vec3 n = normalize(vN); vec3 alb = mix(uIn, uOut, smoothstep(0.15, 0.6, vR));
            vec3 c = alb * (0.45 + 0.55 * abs(dot(n, uMoon))) * vec3(0.75, 0.75, 0.9) + alb * 0.12;
            float d = length(vW - cameraPosition); gl_FragColor = vec4(mix(c, uFogCol, 1.0 - exp(-d * uFogK)), 1.0); }`}),U=new et,k=new Ut,H=new Rn,D=new T,z=new T;for(let[me,Je,O,it,ze]of[[0,.075,.5,[1,.82,.25],[.98,.95,.88]],[1,.11,.7,[.35,.02,.05],[.85,.08,.1]]]){let Pe=n.flowers.filter(Qe=>Qe[3]===me),we=new wn(C(Je,O),F(it,ze),Pe.length);we.frustumCulled=!1,Pe.forEach((Qe,Fe)=>{H.set((Math.random()-.5)*1.6,Math.random()*6.28,(Math.random()-.5)*1.6),k.setFromEuler(H),U.compose(z.set(Qe[0],Qe[1],Qe[2]),k,D.setScalar(.8+Math.random()*.4)),we.setMatrixAt(Fe,U)}),t.add(Wa(we,t,{cell:30,minCount:120,fogK:f.uFogK?f.uFogK.value:0}))}let N=(()=>{let me=document.createElement("canvas");me.width=me.height=128;let Je=me.getContext("2d"),O=Je.createRadialGradient(64,64,0,64,64,64);return O.addColorStop(0,"rgba(255,210,150,1)"),O.addColorStop(.2,"rgba(255,170,90,0.5)"),O.addColorStop(1,"rgba(255,120,40,0)"),Je.fillStyle=O,Je.fillRect(0,0,128,128),new Qi(me)})(),V=[];for(let[me,Je,O]of n.lanterns){let it=new xe(new ei(.22,.34,.22),new ci({color:new de(3.2,1.9,.9)}));it.position.set(me,Je,O),t.add(it);let ze=new al(new Lo({map:N,color:16777215,transparent:!0,depthWrite:!1,blending:Pt,opacity:.8}));ze.position.set(me,Je,O),ze.scale.setScalar(1.6),ze.renderOrder=6,t.add(ze),V.push({halo:ze,glass:it,ph:Math.random()*6.28})}let ee=u?600:260,ce=new Xe,Y=new Float32Array(ee*3);for(let me=0;me<ee;me++)Y[me*3]=(Math.random()-.5)*50,Y[me*3+1]=Math.random()*6,Y[me*3+2]=Math.random()*60-10;ce.setAttribute("position",new qe(Y,3));let be=new on(ce,new ye({transparent:!0,depthWrite:!1,uniforms:{uTime:s.uTime,uPx:{value:600}},vertexShader:`uniform float uTime, uPx; varying float vA, vT; void main(){ vec3 p = position; float t = uTime * 0.25 + p.x * 0.1;
          p.x = mod(p.x + uTime * 0.6 + 25.0, 50.0) - 25.0; p.y = 0.4 + mod(p.y - uTime * 0.12, 6.0) + sin(t * 3.0) * 0.2; p.z += sin(t * 2.0 + p.y) * 0.6; vT = fract(position.z * 7.31);
          vec4 mv = modelViewMatrix * vec4(p, 1.0); vA = 1.0 - smoothstep(18.0, 40.0, -mv.z); gl_Position = projectionMatrix * mv; gl_PointSize = clamp(0.07 * uPx / -mv.z, 1.5, 9.0); }`,fragmentShader:`varying float vA, vT; void main(){ vec2 d = gl_PointCoord - 0.5; d.x *= 1.8; float a = (1.0 - smoothstep(0.15, 0.25, dot(d, d))) * vA * 0.85;
          gl_FragColor = vec4(mix(vec3(0.98, 0.93, 0.85), vec3(0.95, 0.55, 0.6), step(0.7, vT)), a); }`}));be.frustumCulled=!1,be.renderOrder=7,t.add(be),t.add(new Fi(10465496,2760728,.8));{let me=(re,oe=72)=>new gr(re.map(([se,He])=>new ue(se,He)),oe),Je=new cn({color:15920354,roughness:.16,metalness:0,envMap:e.envTex,envMapIntensity:.9}),O=new cn({color:14267498,roughness:.32,metalness:1,envMap:e.envTex,envMapIntensity:1.2}),it=new xe(me([[0,0],[.085,0],[.093,.004],[.098,.02],[.1,.075],[.096,.086],[.088,.09],[.088,.096],[0,.096]]),Je),ze=new xe(me([[0,.094],[.094,.094],[.1,.098],[.102,.122],[.098,.13],[.06,.133],[0,.133]]),O);for(let re of[it,ze])re.position.set(Ln,zr+.001,rn),t.add(re);let Pe=new ei(.62,.16,.44,8,2,6),we=Pe.attributes.position;for(let re=0;re<we.count;re++){let oe=we.getX(re),se=we.getY(re),He=we.getZ(re),Ae=1+.03*Math.sin(oe*23+He*17);we.setX(re,oe*Ae),we.setZ(re,He*Ae),se>0&&we.setY(re,se+.006*Math.sin(oe*40)*Math.cos(He*37))}Pe.computeVertexNormals();let Qe=e.texU.tD_sand.value.clone(),Fe=e.texU.tN_sand.value.clone();for(let re of[Qe,Fe])re.repeat.set(.7,.5),re.needsUpdate=!0;let I=new xe(Pe,new cn({map:Qe,normalMap:Fe,normalScale:new ue(1.6,1.6),roughness:.92,color:15786700}));I.position.set(Ln,zr-.08,rn),I.rotation.y=.2,t.add(I);let A=new ki(16757898,1.4);A.position.set(Ln+4,zr+3,rn-12),A.target.position.set(Ln,zr,rn),t.add(A,A.target);let K=new xl(16754784,2.2,6,2);K.position.set(Ln-1.3,zr+.6,rn-1.6),t.add(K)}let Z=Xa({U:s,lm:l,K:n.lm.ground,rect:n.rect,sun:new T(.2,.15,-1),tile:60,count:u?12e4:5e4,fade:[22,30],height:.85,wide:1.1,tip:[.42,.42,.2],dry:[.6,.52,.32],root:[.1,.1,.05],wind:1.5,seed:11,heightGLSL:`${i0} float groundY(vec2 p){ return hmH(p.x, p.y); }`,maskGLSL:`float grassMask(vec2 p){ float wx = 2.0 + 1.6 * sin(p.y * 0.06);
          return smoothstep(0.45, 0.9, hmH(p.x, p.y)) * smoothstep(1.9, 2.8, abs(p.x - wx)) * smoothstep(2.2, 3.2, distance(p, vec2(${Ln.toFixed(2)}, ${rn.toFixed(1)})))
            * smoothstep(0.3, 0.62, gn(p * 0.16) * 0.7 + gn(p * 0.9) * 0.3); }`});t.add(Z.mesh);let ae=s.uFogCol.value.clone(),fe=s.uFogK.value,ne=t.background.clone(),he=u?600:300,Ge=new Xe,We=new Float32Array(he*3);for(let me=0;me<We.length;me++)We[me]=Math.random();Ge.setAttribute("position",new qe(We,3));let ut=new on(Ge,new ye({transparent:!0,depthWrite:!1,uniforms:{uTime:s.uTime,uCam:{value:new T},uPx:{value:700}},vertexShader:`uniform float uTime, uPx; uniform vec3 uCam; varying float vA; void main(){ vec3 B = vec3(16.0, 12.0, 16.0); vec3 q = position; float sp = 0.6 + 1.2 * fract(q.x * 37.1);
          vec3 p = vec3(q.x * B.x, mod(q.y * B.y + uTime * sp, B.y), q.z * B.z); p.x += sin(uTime * 1.3 + q.z * 40.0) * 0.15; vec3 w = uCam + p - B * 0.5; vec4 mv = viewMatrix * vec4(w, 1.0);
          gl_Position = projectionMatrix * mv; gl_PointSize = (0.4 + 1.6 * fract(q.z * 91.7)) * uPx * 0.05 / max(-mv.z, 0.1); vA = smoothstep(0.5, 3.0, -mv.z) * (1.0 - smoothstep(10.0, 16.0, -mv.z)); }`,fragmentShader:"varying float vA; void main(){ float r = length(gl_PointCoord - 0.5); float ring = smoothstep(0.5, 0.4, r) - smoothstep(0.4, 0.2, r) * 0.6; gl_FragColor = vec4(vec3(0.8, 0.95, 1.0), ring * vA * 0.7); }"}));return ut.frustumCulled=!1,ut.visible=!1,t.add(ut),{update(me,Je,O,it){let ze=it.position.y<.05*Math.sin(me);s.uFogCol.value.copy(ze?new de(.05,.27,.33):ae),s.uFogK.value=ze?.06:fe,t.background.copy(ze?new de(.05,.27,.33):ne),g.visible=!ze,ut.visible=ze,ze&&ut.material.uniforms.uCam.value.copy(it.position),Z.update(it);for(let Pe of V){let we=.85+.1*Math.sin(me*9+Pe.ph)*Math.sin(me*5.3+Pe.ph*2);Pe.halo.material.opacity=.55*we,Pe.halo.scale.setScalar(1.5+.15*we)}},setPx(me){be.material.uniforms.uPx.value=me,ut.material.uniforms.uPx.value=me,Z.setPx(1/me)}}}},i)}Nt();var wr=i=>Math.sin(i*.02)*10,qd=(i,e,t)=>{let n=Math.min(1,Math.max(0,(t-i)/(e-i)));return n*n*(3-2*n)},In=-130;function Fl(i,e){let t=(1-qd(-140,70,e))*78,n=Math.abs(i-wr(e)),r=-Math.pow(n*.18,1.7)*3,s=Math.sin(i*.11+e*.07)*1.6+Math.sin(i*.31-e*.23)*.6+Math.abs(Math.sin(i*.05+e*.03))*4,a=Math.min(1,n/4),o=1-qd(6,16,Math.hypot(i-wr(In),e-In)),c=(1-qd(-140,70,In))*78+2;return(t+r+s*(.35+.65*a))*(1-o)+c*o}var Or=(i,e=0,t=1.75)=>[wr(i)+e,Fl(wr(i)+e,i)+t,i],ui=wr(In),yr=Fl(ui,In),jw=[{pos:[wr(84),Fl(wr(84),84)+22,86],tgt:Or(40,0,0),w:.8},{pos:[wr(72)+4,Fl(wr(72)+4,72)+8,74],tgt:Or(30,0,2),w:1.1},{pos:Or(46,1.2),tgt:Or(20,0,2.6),w:1},{pos:Or(4,-1),tgt:Or(-24,0,3.4),w:1},{pos:Or(-46,1),tgt:Or(-80,0,4),w:1},{pos:Or(-92,-.8),tgt:[ui,yr+2.4,In],w:1.1},{pos:[ui+3.5,yr+2.4,In+13],tgt:[ui-.4,yr+1.6,In],w:1.3},{pos:[ui+7,yr+3.2,In+9],tgt:[ui-30,yr+140,In-170],w:0}],Xd=[{at:[.04,1.01],kick:"Our platform \xB7 Cosmos",line:"Cosmos: our real estate platform, designed in-house from the first sketch."}],VE=new T(-.4,.5,-1).normalize(),Kw=`uniform sampler2D tSky; uniform float uSkyRot;
  vec3 nightSky(vec3 d){ float lon = atan(d.z, d.x) + uSkyRot, lat = asin(clamp(d.y, -1.0, 1.0));
    return pow(texture2D(tSky, vec2(0.5 + lon / 6.2831853, 0.5 + lat / 3.1415927)).rgb, vec3(2.2)) * 1.2; }`,Yw=`
  
  if (k < 2.0 && abs(vW.x - ${ui.toFixed(2)}) < 8.9 && abs(vW.z - ${In.toFixed(1)}) < 6.4 && vW.y > ${(yr+.1).toFixed(2)}) discard;   // no drift inside the pavilion
  if (k < 1.0) {                                      // real snow: wind-packed crust, moonlit, a sparkle of crystals
    vec3 nd = N_snow(vW, n, 1.0);
    float macro = tri(vW * 0.04, vec3(0.0, 1.0, 0.0), 1.0).r, sas = 0.5 + 0.5 * sin(dot(vW.xz, vec2(0.55, 0.83)) * 0.9 + macro * 6.0);   // wind-sculpted sastrugi
    c = D_snow(vW, n) * vec3(0.9, 0.94, 1.02) * L * 0.85 * relief(nd, n) * (0.7 + 0.4 * macro + 0.16 * sas) + vec3(0.04, 0.05, 0.09);
    float gl = step(0.9975, fract(sin(dot(floor(vW * 9.0), vec3(12.9, 78.2, 37.7))) * 43758.5));
    c += vec3(0.85, 0.92, 1.0) * gl * pow(max(dot(reflect(-V, nd), uSunDir), 0.0), 2.0) * 2.5;
  }
  else if (k < 2.0) { vec3 nd = N_rock(vW, n, 1.3); c = mix(D_rock(vW, n) * vec3(0.7, 0.78, 0.92) * (L * 1.1 + 0.34) * relief(nd, n), D_snow(vW, n) * L * 0.85, smoothstep(0.55, 0.85, nd.y)); }   // cold granite in moonlight   // granite, snow lying on its ledges
  else if (k < 3.0) { vec3 nd = N_conc(vW, n, 1.0); c = D_conc(vW, n) * L * 1.15 * relief(nd, n); }       // brushed concrete
  else if (k < 4.0) discard;                                                                               // the glass is drawn live (see-through)
  else if (k < 5.0) c = vec3(0.04) * L + vec3(0.12, 0.13, 0.16) * fres;                                        // dark steel
  else if (k < 6.0) c = D_oak(vW, n) * L * 1.15;                                                             // oak, in lamplight
  else if (k < 7.0) c = vec3(0.95, 0.94, 0.9) * L;                                                           // the white model
  else if (k < 8.0) { float wv = 0.9 + 0.1 * sin(vW.x * 180.0) * sin(vW.z * 180.0 + vW.y * 60.0); c = vec3(0.56, 0.51, 0.44) * wv * L * 1.15; }   // linen, loosely woven
  else if (k < 9.0) c = vec3(0.4, 0.21, 0.1) * L * 1.2 + vec3(0.07, 0.06, 0.05) * fres;                      // leather, a soft sheen at the edges
  else if (k < 10.0) { float st = 0.8 + 0.25 * step(0.5, fract(vW.x * 5.0 + vW.z * 1.3)); c = vec3(0.11, 0.13, 0.22) * st * L * 1.2; }   // woven rug, banded
  else if (k < 11.0) c = vec3(0.06, 0.2, 0.06) * (0.8 + 0.4 * fres) * L * 1.5;                                // leaves
  else if (k < 12.0) c = vec3(2.8, 1.8, 0.9);                                                               // lamp glass, lit
  else if (k < 13.0) { float hb = fract(sin(dot(floor(vec3(vW.x * 26.0 + vW.z * 26.0, vW.y * 3.2, 0.0)), vec3(12.9, 78.2, 37.7))) * 43758.5); c = (0.35 + 0.5 * cos(6.2832 * (hb + vec3(0.0, 0.33, 0.67)))) * vec3(0.6, 0.45, 0.4) * L * 1.3; }   // books, every spine a different colour
  else if (k < 14.0) c = vec3(3.4, 1.15, 0.3);                                                              // the fire
  else c = vec3(0.86, 0.82, 0.74) * L * 1.1 + vec3(0.06) * fres;                                              // glazed ceramic
`;function a0(i){return zi({dir:"cosmos",parts:["room",{name:"ground",planar:!0}],way:jw,chapters:Xd,palette:Yw,textures:{snow:{id:"snow_02",s:3},rock:{id:"rock_face_03",s:4},conc:{id:"brushed_concrete",s:2},oak:{id:"oak_wood_planks",s:1.6}},sun:[-.4,.5,-1],sunCol:[.55,.65,.95],scatter:.35,sky:{file:"rogland_moonlit_night_sky.webp",exposure:1,rot:2.573,cut:.4,haze:[.16,.22,.36]},background:[.03,.05,.1],fog:{col:[.16,.22,.36],k:.0026},exposure:1.25,entry:{origin:[wr(84),0,86],yaw:0},exit:{origin:[ui+7,yr+3.2,In+9],yaw:0},extras:async e=>{let{scene:t,info:n,tier:r,U:s,base:a,unpack:o,loader:c}=e,l=r==="high",u=e.sky,d={tSky:u.material.uniforms.tSky,uSkyRot:u.material.uniforms.uRot},h=await br({base:a,unpack:o,loader:c,U:{uTime:s.uTime,uSun:{value:new T(-.4,.5,-1).normalize()},uFogCol:s.uFogCol,uFogK:s.uFogK},groundLm:e.groundLm,groundK:n.lm.ground,rect:new nt(...n.rect),tier:r,scene:t,layout:{items:(n.items||[]).filter(E=>!(Math.abs(E[1]-ui)<11&&Math.abs(E[3]-In)<8.5)).map(E=>E[0]==="rock_07"?["rock_09",E[1],E[2]-.15,E[3],E[4],E[5]*2.2]:E)}}).catch(()=>null);h&&(t.add(h.group),h.fade.value=1);{let b=new Xe,C=[],F=[],U=(N,V)=>{let ee=Math.sin(N*127.1+V*311.7)*43758.5453;return ee-Math.floor(ee)},k=(N,V)=>{let ee=Math.floor(N),ce=Math.floor(V),Y=N-ee,be=V-ce,Z=Y*Y*(3-2*Y),ae=be*be*(3-2*be);return(U(ee,ce)*(1-Z)+U(ee+1,ce)*Z)*(1-ae)+(U(ee,ce+1)*(1-Z)+U(ee+1,ce+1)*Z)*ae},H=(N,V)=>{let ee=0,ce=1,Y=1,be=1;for(let Z=0;Z<6;Z++){let ae=1-Math.abs(k(N*Y,V*Y)*2-1);ae=ae*ae*be,ee+=ae*ce,be=Math.min(1,ae*1.8),ce*=.5,Y*=2.03}return ee};for(let N=0;N<220;N++)for(let V=0;V<=360;V++){let ee=N/219,ce=650+ee*1300,Y=V/360*Math.PI*2,be=Math.cos(Y)*ce,Z=-40+Math.sin(Y)*ce,ae=Math.pow(k(Math.cos(Y)*2.2+5,Math.sin(Y)*2.2+5),1.4),fe=H(be/520,Z/520)*230*(.45+.9*ae)*Math.sin(Math.min(1,ee*1.6)*Math.PI*.5)*(1-.35*ee)-20;C.push(be,fe,Z)}for(let N=0;N<219;N++)for(let V=0;V<360;V++){let ee=N*361+V,ce=ee+360+1;F.push(ee,ce,ee+1,ee+1,ce,ce+1)}b.setAttribute("position",new Ye(C,3)),b.setIndex(F),b.computeVertexNormals();let D=N=>e.texU[N].value,z=new xe(b,new ye({uniforms:{tS:{value:D("tD_snow")},tR:{value:D("tD_rock")},uFogCol:s.uFogCol,uMoon:{value:new T(-.4,.5,-1).normalize()}},vertexShader:"varying vec3 vW, vN; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform sampler2D tS, tR; uniform vec3 uFogCol, uMoon; varying vec3 vW, vN;
            vec3 tri(sampler2D t, vec3 p, vec3 n, float s){ vec3 w = pow(abs(n), vec3(4.0)); w /= dot(w, vec3(1.0)); return texture2D(t, p.zy * s).rgb * w.x + texture2D(t, p.xz * s).rgb * w.y + texture2D(t, p.xy * s).rgb * w.z; }
            void main(){ vec3 Nf = normalize(cross(dFdx(vW), dFdy(vW))); if (Nf.y < 0.0) Nf = -Nf; vec3 n = normalize(mix(normalize(vN), Nf, 0.6));
              vec3 rock = tri(tR, vW, n, 1.0 / 40.0) * vec3(0.55, 0.6, 0.72), snowT = tri(tS, vW, n, 1.0 / 25.0);
              float slope = 1.0 - n.y, hold = 1.0 - smoothstep(0.38, 0.62, slope + (dot(rock, vec3(0.333)) - 0.35) * 0.4);   // snow lies where it can
              vec3 alb = mix(rock * 0.5, snowT * vec3(0.92, 0.96, 1.05), hold);
              float moon = max(dot(n, uMoon), 0.0), sky = 0.5 + 0.5 * n.y;
              vec3 c = alb * (vec3(0.55, 0.62, 0.85) * moon * 0.9 + vec3(0.08, 0.1, 0.16) * sky);
              float d = length(vW - cameraPosition); c = mix(c, uFogCol * 1.25, 1.0 - exp(-d * 0.0008));            // night haze: each range fainter than the one before
              gl_FragColor = vec4(c, 1.0); }`}));z.renderOrder=1,z.frustumCulled=!1,t.add(z)}let p=new xe(new Ft(3e3,3e3,1,1),new ye({transparent:!0,depthWrite:!1,uniforms:{uTime:s.uTime},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform float uTime; varying vec3 vW;
          float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5), b = fract(sin(dot(i + vec2(1, 0), vec2(127.1, 311.7))) * 43758.5),
            c = fract(sin(dot(i + vec2(0, 1), vec2(127.1, 311.7))) * 43758.5), d = fract(sin(dot(i + vec2(1, 1), vec2(127.1, 311.7))) * 43758.5); return mix(mix(a, b, f.x), mix(c, d, f.x), f.y); }
          float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * n2(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
          void main(){ vec2 p = vW.xz * 0.006 + vec2(uTime * 0.004, uTime * 0.002); float f = fbm(p), g = fbm(p * 2.5 + 3.0);
            vec3 c = mix(vec3(0.12, 0.16, 0.27), vec3(0.62, 0.68, 0.82), smoothstep(0.35, 0.8, f) * (0.7 + 0.3 * g));
            float d = length(vW.xz - cameraPosition.xz); float a = smoothstep(0.25, 0.55, f) * (1.0 - smoothstep(1200.0, 1500.0, d));
            gl_FragColor = vec4(c, a * 0.95); }`}));p.rotation.x=-Math.PI/2,p.position.y=-4,p.renderOrder=3,p.frustumCulled=!1,t.add(p);let g=l?6e3:2500,v=new Xe,m=new Float32Array(g*3);for(let E=0;E<g;E++)m[E*3]=Math.random()*60,m[E*3+1]=Math.random()*30,m[E*3+2]=Math.random()*60;v.setAttribute("position",new qe(m,3));let f=new on(v,new ye({transparent:!0,depthWrite:!1,uniforms:{uTime:s.uTime,uCam:{value:new T},uPx:{value:600}},vertexShader:`uniform float uTime, uPx; uniform vec3 uCam; varying float vA;
          varying float vSoft, vGlint;
          void main(){ vec3 p = position; float sz = 0.5 + 1.5 * pow(fract(p.y * 13.7), 3.0);                 // a few big flakes among many small
            float gust = 0.7 + 0.6 * sin(uTime * 0.31 + p.z * 0.02);
            p.y -= uTime * (0.7 + fract(p.x * 7.3) * 0.5) * (0.8 + 0.4 / sz); p.x += uTime * 1.3 * gust + sin(uTime * 0.9 + p.z) * 0.45 * sz; p.z += sin(uTime * 0.6 + p.x * 1.3) * 0.4;
            p = mod(p - uCam + vec3(30.0, 15.0, 30.0), vec3(60.0, 30.0, 60.0)) + uCam - vec3(30.0, 15.0, 30.0);
            vec4 mv = viewMatrix * vec4(p, 1.0); float z = -mv.z;
            vSoft = 1.0 - smoothstep(0.6, 3.0, z);                          // close to the lens: big and out of focus
            vGlint = step(0.93, fract(p.x * 3.1 + p.z * 1.7 + uTime * 0.7));
            vA = (1.0 - smoothstep(14.0, 32.0, z)) * mix(0.85, 0.35, vSoft); gl_Position = projectionMatrix * mv;
            gl_PointSize = clamp(0.055 * sz * uPx / z, 1.0, 40.0); }`,fragmentShader:`varying float vA, vSoft, vGlint; void main(){ vec2 d = gl_PointCoord - 0.5; float r = dot(d, d);
          float a = (1.0 - smoothstep(mix(0.04, 0.12, vSoft), 0.25, r)) * vA;
          gl_FragColor = vec4(vec3(0.9, 0.94, 1.0) * (1.0 + vGlint * 1.5), a); }`}));f.frustumCulled=!1,f.renderOrder=8,t.add(f);let y=l?3500:1400,w=new Xe,x=new Float32Array(y*3);for(let E=0;E<y;E++)x[E*3]=Math.random()*40,x[E*3+1]=Math.random(),x[E*3+2]=Math.random()*40;w.setAttribute("position",new qe(x,3));let S=new on(w,new ye({transparent:!0,depthWrite:!1,uniforms:{uTime:s.uTime,uCam:{value:new T},uPx:{value:600}},vertexShader:`uniform float uTime, uPx; uniform vec3 uCam; varying float vA;
          void main(){ vec3 p = position; float sp = 4.0 + fract(p.z * 3.7) * 3.0; p.x += uTime * sp; p.z += sin(uTime * 1.3 + p.x * 0.4) * 0.6;
            p.xz = mod(p.xz - uCam.xz + 20.0, 40.0) + uCam.xz - 20.0; p.y = uCam.y - 1.7 + p.y * p.y * 1.1 + sin(uTime * 2.0 + p.x) * 0.06;
            vec4 mv = viewMatrix * vec4(p, 1.0); vA = (1.0 - smoothstep(6.0, 18.0, -mv.z)) * 0.5 * (0.5 + 0.5 * sin(p.x * 0.3 + uTime));
            gl_Position = projectionMatrix * mv; gl_PointSize = clamp(0.05 * uPx / -mv.z, 1.0, 5.0); }`,fragmentShader:"varying float vA; void main(){ vec2 d = gl_PointCoord - 0.5; float a = (1.0 - smoothstep(0.05, 0.25, dot(d, d))) * vA; gl_FragColor = vec4(vec3(0.9, 0.94, 1.0), a); }"}));S.frustumCulled=!1,S.renderOrder=8,t.add(S);let _=new xe(new zn(14,24,12),new ye({transparent:!0,depthWrite:!1,blending:Pt,side:en,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform vec3 uC; varying vec3 vW; void main(){ vec3 V = normalize(vW - cameraPosition); vec3 toC = uC - cameraPosition; float t = dot(toC, V); float d = length(toC - V * t);
          float a = exp(-d * d / 30.0) * 0.12; gl_FragColor = vec4(vec3(1.0, 0.7, 0.42) * a, a); }`,uniforms:{uC:{value:new T(ui,yr+2.5,In)}}}));_.position.set(ui,yr+2.5,In),_.renderOrder=9,t.add(_);let R=new ye({transparent:!0,depthWrite:!1,side:mt,uniforms:d,vertexShader:"varying vec3 vW, vN; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`varying vec3 vW, vN; ${Kw} void main(){ vec3 V = normalize(cameraPosition - vW); vec3 n = normalize(vN); if (dot(n, V) < 0.0) n = -n;
          float fr = 0.04 + 0.96 * pow(1.0 - max(dot(n, V), 0.0), 5.0); vec3 R = reflect(-V, n);
          vec3 c = nightSky(normalize(R)) * 1.4 * fr + vec3(1.0, 0.7, 0.45) * 0.03; gl_FragColor = vec4(c, 0.1 + 0.75 * fr); }`});for(let[E,M,b,C]of[[ui,In+5.1,15.2,0],[ui,In-5.1,15.2,0],[ui-7.6,In,10.2,Math.PI/2],[ui+7.6,In,10.2,Math.PI/2]]){let F=new xe(new Ft(b,4),R);F.position.set(E,yr+2.6,M),F.rotation.y=C,F.renderOrder=10,t.add(F)}return{update(E,M,b,C){f.material.uniforms.uCam.value.copy(C.position),S.material.uniforms.uCam.value.copy(C.position)},setPx(E){f.material.uniforms.uPx.value=E,S.material.uniforms.uPx.value=E}}}},i)}Nt();var vi=(i,e,t)=>[i,e,t],Zw=[{pos:vi(0,-10,60),tgt:vi(0,40,-60),w:1},{pos:vi(0,2,-20),tgt:vi(0,4,-90),w:1.1},{pos:vi(-8,6,-170),tgt:vi(0,30,-360),w:1.2},{pos:vi(4,2,-370),tgt:vi(0,0,-440),w:1.2},{pos:vi(0,3,-485),tgt:vi(0,4,-560),w:1},{pos:vi(0,6,-520),tgt:vi(0,4,-580),w:1.1},{pos:vi(0,170,-400),tgt:vi(0,150,-900),w:0}],jd=[{at:[0,.36],kick:"Client \xB7 Perseid Pictures",line:"Branding and website for Perseid Pictures: a studio that keeps its camera pointed at the stars."},{at:[.36,.74],kick:"And many more",line:"20+ clients across India, the USA and Australia. A small team, close to every brand we build."},{at:[.74,1.01],kick:"Nomadiic Horse Designs \xB7 Bangalore",line:"Branding and websites, built with obsessive detail. Let's build yours.",contact:!0}];async function o0({tier:i}){let e=i==="high",t=new Ji;t.background=new de(0,0,.004);let n={uTime:{value:0}},r=new xe(new zn(4e3,64,32),new ye({side:en,depthWrite:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }",fragmentShader:`varying vec3 vD;
      float hh(vec3 p){ return fract(sin(dot(p, vec3(12.9, 78.2, 37.7))) * 43758.5); }
      float n3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hh(i), hh(i + vec3(1, 0, 0)), f.x), mix(hh(i + vec3(0, 1, 0)), hh(i + vec3(1, 1, 0)), f.x), f.y), mix(mix(hh(i + vec3(0, 0, 1)), hh(i + vec3(1, 0, 1)), f.x), mix(hh(i + vec3(0, 1, 1)), hh(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
      float fbm(vec3 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * n3(p); p *= 2.1; a *= 0.5; } return s; }
      void main(){ vec3 d = normalize(vD);
        vec3 pole = normalize(vec3(0.35, 0.55, 0.76)); float lat = dot(d, pole);
        float band = exp(-lat * lat * 9.0), core = exp(-lat * lat * 40.0);
        float dust = smoothstep(0.45, 0.75, fbm(d * 7.0)) * exp(-lat * lat * 60.0);
        vec3 c = vec3(0.6, 0.62, 0.75) * band * 0.26 * (0.6 + 0.8 * fbm(d * 4.0)) + vec3(1.0, 0.86, 0.66) * core * 0.18 * fbm(d * 9.0);
        c *= 1.0 - dust * 0.85;
        c += (vec3(0.10, 0.05, 0.20) * fbm(d * 2.2 + 3.0) + vec3(0.02, 0.07, 0.16) * fbm(d * 3.1 + 9.0)) * (0.35 + band);   // faint violet and blue nebula wash: the black is never empty
        float s = hh(floor(d * 900.0)), b = hh(floor(d * 900.0) + 3.0);
        c += mix(vec3(0.75, 0.82, 1.0), vec3(1.0, 0.85, 0.7), b) * step(0.9945 - band * 0.005, s) * (0.3 + 1.7 * pow(b, 6.0));
        float s2 = hh(floor(d * 2200.0) + 7.0); c += vec3(0.8, 0.86, 1.0) * step(0.9975 - band * 0.003, s2) * 0.55;   // a second, finer layer of faint stars
        gl_FragColor = vec4(c, 1.0); }`}));r.renderOrder=-2,r.frustumCulled=!1,t.add(r);let s=5200,a=new T(0,-s-140,-380),o=new xe(new zn(s,160,80),new ye({vertexShader:"varying vec3 vW, vN; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform vec3 uC; varying vec3 vW, vN;
      float hh(vec3 p){ return fract(sin(dot(p, vec3(12.9, 78.2, 37.7))) * 43758.5); }
      float n3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hh(i), hh(i + vec3(1, 0, 0)), f.x), mix(hh(i + vec3(0, 1, 0)), hh(i + vec3(1, 1, 0)), f.x), f.y), mix(mix(hh(i + vec3(0, 0, 1)), hh(i + vec3(1, 0, 1)), f.x), mix(hh(i + vec3(0, 1, 1)), hh(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
      void main(){ vec3 n = normalize(vN), V = normalize(cameraPosition - vW); vec3 q = (vW - uC) / 5200.0;
        float land = smoothstep(0.5, 0.56, n3(q * 6.0) * 0.6 + n3(q * 14.0) * 0.4);
        float metro = smoothstep(0.5, 0.72, n3(q * 40.0)) * land;
        float city = metro * (pow(n3(q * 1500.0), 7.0) * 2.2 + pow(n3(q * 420.0), 4.0) * 0.45);
        vec3 c = mix(vec3(0.004, 0.008, 0.02), vec3(0.012, 0.012, 0.01), land) + vec3(1.0, 0.72, 0.38) * city;
        float rim = pow(1.0 - max(dot(n, V), 0.0), 3.0); c += vec3(0.1, 0.25, 0.6) * rim * 0.6;
        gl_FragColor = vec4(c, 1.0); }`,uniforms:{uC:{value:a}}}));o.position.copy(a),t.add(o);let c=new xe(new zn(s*1.018,160,80),new ye({transparent:!0,depthWrite:!1,blending:Pt,side:en,vertexShader:"varying vec3 vW, vN; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`varying vec3 vW, vN; void main(){ vec3 V = normalize(cameraPosition - vW); float f = pow(max(dot(vN, V), 0.0), 6.0);
      float side = smoothstep(-0.6, 0.9, normalize(vW).x * 0.0 + V.x * -0.6 + 0.4);
      vec3 c = mix(vec3(0.15, 0.4, 1.0), vec3(1.0, 0.55, 0.25), smoothstep(0.6, 1.0, f) * side) * f * 1.6; gl_FragColor = vec4(c, f); }`}));c.position.copy(a),c.renderOrder=2,t.add(c);let l=e?40:22,u=new Xe,d=new Float32Array(l*6),h=new Float32Array(l*6);u.setAttribute("position",new qe(d,3)),u.setAttribute("color",new qe(h,3));let p=new Ua(u,new Da({vertexColors:!0,transparent:!0,blending:Pt,depthWrite:!1}));p.frustumCulled=!1,t.add(p);let g=new T(30,260,-520),v=Array.from({length:l},()=>({t0:Math.random()*6,dur:.6+Math.random()*.9,dir:new T,start:new T})),m=(b,C)=>{b.t0=C+Math.random()*3.5,b.dur=.5+Math.random()*.9,b.dir.set(Math.random()-.5,Math.random()-.75,Math.random()-.3).normalize(),b.start.copy(g).addScaledVector(new T(Math.random()-.5,Math.random()-.5,Math.random()-.5),160).addScaledVector(b.dir,40)};v.forEach(b=>m(b,0));let f=Array.from({length:16},(b,C)=>{let F=C/16*Math.PI*2;return new T(Math.cos(F+Math.sin(C)*.4)*(22+C%3*6),Math.sin(F*2)*12+C%4*3,-440+Math.sin(C*1.7)*18)}),y=(()=>{let b=document.createElement("canvas");b.width=b.height=64;let C=b.getContext("2d"),F=C.createRadialGradient(32,32,0,32,32,32);return F.addColorStop(0,"rgba(255,255,255,1)"),F.addColorStop(.2,"rgba(255,228,190,0.85)"),F.addColorStop(1,"rgba(255,170,90,0)"),C.fillStyle=F,C.fillRect(0,0,64,64),new Qi(b)})(),w=new on(new Xe().setFromPoints(f),new Do({size:4.5,map:y,transparent:!0,blending:Pt,depthWrite:!1,color:16769208}));t.add(w);let x=[0,3,6,9,12,15,2,5,8,11,14,1,4,7,10,13,0],S=new Xe().setFromPoints(x.map(b=>f[b])),_=new Io(S,new Da({color:15975034,transparent:!0,opacity:.55,blending:Pt}));t.add(_);let R=os(Zw),E=new T,M=new T;return{key:"perseid",scene:t,chapters:jd,exposure:1,entry:{origin:[0,0,60],yaw:0},exit:{origin:[0,4,-528],yaw:0},pose(b,C){R.sample(b,E,M),C.position.copy(E),C.lookAt(M)},update(b,C,F){n.uTime.value=b,v.forEach((k,H)=>{let D=(b-k.t0)/k.dur;D>1&&(m(k,b),D=-1);let z=D>=0?Math.sin(Math.PI*D):0,N=k.start.clone().addScaledVector(k.dir,Math.max(D,0)*120),V=N.clone().addScaledVector(k.dir,-18-20*Math.max(D,0));d.set([N.x,N.y,N.z,V.x,V.y,V.z],H*6),h.set([z,z*.95,z*.85,0,0,0],H*6)}),u.attributes.position.needsUpdate=!0,u.attributes.color.needsUpdate=!0;let U=ht.smoothstep(F,.42,.66);S.setDrawRange(0,Math.max(2,Math.floor(U*x.length))),_.material.opacity=.55*U},setPx(){},dispose(){t.traverse(b=>{b.geometry?.dispose?.();for(let C of[].concat(b.material||[]))C.dispose()})}}}Nt();var Jw=`
vec3 hash3(vec3 p){ p = fract(p * vec3(.1031,.1030,.0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0; }
float vnoise(vec3 p){ vec3 i = floor(p), f = fract(p); vec3 u = f*f*(3.-2.*f);
  return mix(mix(mix(dot(hash3(i), f), dot(hash3(i+vec3(1,0,0)), f-vec3(1,0,0)), u.x),
                 mix(dot(hash3(i+vec3(0,1,0)), f-vec3(0,1,0)), dot(hash3(i+vec3(1,1,0)), f-vec3(1,1,0)), u.x), u.y),
             mix(mix(dot(hash3(i+vec3(0,0,1)), f-vec3(0,0,1)), dot(hash3(i+vec3(1,0,1)), f-vec3(1,0,1)), u.x),
                 mix(dot(hash3(i+vec3(0,1,1)), f-vec3(0,1,1)), dot(hash3(i+vec3(1,1,1)), f-vec3(1,1,1)), u.x), u.y), u.z); }
vec3 curl(vec3 p){ float e = 0.1;
  vec3 dx = vec3(e,0,0), dy = vec3(0,e,0), dz = vec3(0,0,e);
  float x = vnoise(p+dy) - vnoise(p-dy) - vnoise(p+dz+7.1) + vnoise(p-dz+7.1);
  float y = vnoise(p+dz) - vnoise(p-dz) - vnoise(p+dx+3.7) + vnoise(p-dx+3.7);
  float z = vnoise(p+dx+1.3) - vnoise(p-dx+1.3) - vnoise(p+dy+5.9) + vnoise(p-dy+5.9);
  return vec3(x, y, z) / (2.0 * e); }
`;function c0(i,{count:e,width:t=20,font:n="500 150px Satoshi, sans-serif",lineGap:r=1.05,letterSpacing:s=0}={}){let a=document.createElement("canvas"),o=a.getContext("2d");o.font=n;let c=i.map(f=>o.measureText(f)),l=parseFloat(/(\d+)px/.exec(n)[1]),u=Math.ceil(Math.max(...c.map(f=>f.width))+l*.4+s*30),d=Math.ceil(l*r*i.length+l*.4);a.width=u,a.height=d,o.font=n,o.fillStyle="#fff",o.textAlign="center",o.textBaseline="middle",s&&(o.letterSpacing=s+"px"),i.forEach((f,y)=>o.fillText(f,u/2,l*.2+l*r*(y+.5)));let h=o.getImageData(0,0,u,d).data,p=[];for(let f=0;f<d;f+=1)for(let y=0;y<u;y+=1)h[(f*u+y)*4+3]>128&&p.push(y,f);let g=t/u,v=new Float32Array(e*3),m=p.length/2;for(let f=0;f<e;f++){let y=Math.floor(Math.random()*m)*2;v[f*3]=(p[y]+Math.random()-u/2)*g,v[f*3+1]=(d/2-p[y+1]-Math.random())*g,v[f*3+2]=(Math.random()-.5)*g*6}return v}var kl=class extends on{constructor({count:e=2e4,size:t=9,colorA:n="#ffd2a1",colorB:r="#f59a4b",colorC:s="#ffffff",spread:a=14,additive:o=!0}={}){let c=new Xe,l=new Float32Array(e*4);for(let h=0;h<l.length;h++)l[h]=Math.random();let u=new Float32Array(e*3);c.setAttribute("position",new qe(u.slice(),3)),c.setAttribute("aA",new qe(u.slice(),3)),c.setAttribute("aB",new qe(u.slice(),3)),c.setAttribute("aSeed",new qe(l,4)),c.boundingSphere=new An(new T,1e5);let d=new ye({transparent:!0,depthWrite:!1,blending:o?Pt:Qr,uniforms:{uTime:{value:0},uMorph:{value:0},uAssemble:{value:0},uDance:{value:1},uSpread:{value:a},uSize:{value:t},uPR:{value:Math.min(devicePixelRatio,2)},uOpacity:{value:1},uWind:{value:new T(0,0,0)},cA:{value:new de(n)},cB:{value:new de(r)},cC:{value:new de(s)}},vertexShader:`${Jw}
        attribute vec3 aA, aB; attribute vec4 aSeed;
        uniform float uTime, uMorph, uAssemble, uDance, uSpread, uSize, uPR; uniform vec3 uWind;
        varying float vSeed; varying float vA;
        void main(){
          float m = smoothstep(aSeed.x * 0.45, 0.55 + aSeed.x * 0.45, uMorph);
          vec3 target = mix(aA, aB, m);
          // mid-morph the particles lift off and swirl before landing
          vec3 swirl = curl(target * 0.08 + uTime * 0.05 + aSeed.yzw * 3.0) * (1.0 - abs(m * 2.0 - 1.0)) * uSpread * 0.35;
          vec3 scatter = target + (aSeed.yzw * 2.0 - 1.0) * uSpread + curl(target * 0.05 + aSeed.wzy + uTime * 0.03) * uSpread * 0.6 + uWind * (0.5 + aSeed.x);
          float a = smoothstep(aSeed.y * 0.5, 0.5 + aSeed.y * 0.5, uAssemble);
          vec3 p = mix(scatter, target + swirl, a);
          // living, dancing surface
          p += curl(p * 0.35 + uTime * 0.12) * uDance * (0.05 + aSeed.z * 0.12);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * uPR * (0.35 + aSeed.w * 0.9) / max(-mv.z, 0.1);
          vSeed = aSeed.x; vA = a;
        }`,fragmentShader:`
        uniform vec3 cA, cB, cC; uniform float uOpacity; varying float vSeed; varying float vA;
        void main(){
          vec2 q = gl_PointCoord - 0.5; float d = length(q);
          float alpha = (1.0 - smoothstep(0.0, 0.5, d));
          alpha *= alpha;
          vec3 col = vSeed < 0.55 ? cA : (vSeed < 0.9 ? cB : cC);
          gl_FragColor = vec4(col, alpha * uOpacity * (0.35 + 0.65 * vA));
        }`});super(c,d),this.count=e,this.frustumCulled=!1,this.slot=0}setShape(e,t="A"){let n=this.geometry.getAttribute(t==="A"?"aA":"aB");n.array.set(e.subarray(0,n.array.length)),n.needsUpdate=!0}morphTo(e){let t=this.slot===0?"B":"A";return this.setShape(e,t),this.slot=this.slot===0?1:0,this.slot}get u(){return this.material.uniforms}};var Nl=function(){"use strict";var i="b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q;iekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq:P8Yqdbk;3sezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhDcbhqinaqae9pmeaDaeaq9RaqaDfae6Egkcsfgocl4cifcd4hxdndndndnaoc9WGgmTmbcbhPcehsawcjdfhzalhHinaraH9Rax6midnaraHaxfgl9RcK6mbczhoinawcj;cbfaogifgoc9WfhOdndndndndnaHaic9WfgAco4fRbbaAci4coG4ciGPlbedibkaO9cb83ibaOcwf9cb83ibxikaOalRblalRbbgAco4gCaCciSgCE86bbaocGfalclfaCfgORbbaAcl4ciGgCaCciSgCE86bbaocVfaOaCfgORbbaAcd4ciGgCaCciSgCE86bbaoc7faOaCfgORbbaAciGgAaAciSgAE86bbaoctfaOaAfgARbbalRbegOco4gCaCciSgCE86bbaoc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc93faAaCfgARbbaOciGgOaOciSgOE86bbaoc94faAaOfgARbbalRbdgOco4gCaCciSgCE86bbaoc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc97faAaCfgARbbaOciGgOaOciSgOE86bbaoc98faAaOfgORbbalRbiglco4gAaAciSgAE86bbaoc99faOaAfgORbbalcl4ciGgAaAciSgAE86bbaoc9:faOaAfgORbbalcd4ciGgAaAciSgAE86bbaocufaOaAfgoRbbalciGglalciSglE86bbaoalfhlxdkaOalRbwalRbbgAcl4gCaCcsSgCE86bbaocGfalcwfaCfgORbbaAcsGgAaAcsSgAE86bbaocVfaOaAfgORbbalRbegAcl4gCaCcsSgCE86bbaoc7faOaCfgORbbaAcsGgAaAcsSgAE86bbaoctfaOaAfgORbbalRbdgAcl4gCaCcsSgCE86bbaoc91faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc4faOaAfgORbbalRbigAcl4gCaCcsSgCE86bbaoc93faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc94faOaAfgORbbalRblgAcl4gCaCcsSgCE86bbaoc95faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc96faOaAfgORbbalRbvgAcl4gCaCcsSgCE86bbaoc97faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc98faOaAfgORbbalRbogAcl4gCaCcsSgCE86bbaoc99faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc9:faOaAfgORbbalRbrglcl4gAaAcsSgAE86bbaocufaOaAfgoRbbalcsGglalcsSglE86bbaoalfhlxekaOal8Pbb83bbaOcwfalcwf8Pbb83bbalczfhlkdnaiam9pmbaiczfhoaral9RcL0mekkaiam6mialTmidnakTmbawaPfRbbhOcbhoazhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkkazcefhzaPcefgPad6hsalhHaPad9hmexvkkcbhlasceGmdxikalaxad2fhCdnakTmbcbhHcehsawcjdfhminaral9Rax6mialTmdalaxfhlawaHfRbbhOcbhoamhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkamcefhmaHcefgHad6hsaHad9hmbkaChlxikcbhocehsinaral9Rax6mdalTmealaxfhlaocefgoad6hsadao9hmbkaChlxdkcbhlasceGTmekc9:hoxikabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqalmbkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;ebf8Kjjjjbaok;yzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;siliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabavcefciGaiVcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:Ohkxekcjjjj94hkkabavcdfciGaiVcetfak87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:Ohqxekcjjjj94hqkabavcufciGaiVcetfaq87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohqxekcjjjj94hqkabavciGaiVcetfaq87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2geTmbinababydbgdcwtcw91:Yadce91cjjj;8ifcjjj98G::NUdbabclfhbaecufgembkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaiczfhiaeczfheadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklz9Kbb",e="b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q;Aekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq;t9tqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk;h8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhwcbhDinaDae9pmeawaeaD9RaDawfae6Egqcsfgoc9WGgkci2hxakcethmaocl4cifcd4hPabaDad2fhscbhzdnincehHalhOcbhAdninaraO9RaP6miavcj;cbfaAak2fhCaOaPfhlcbhidnakc;ab6mbaral9Rc;Gb6mbcbhoinaCaofhidndndndndnaOaoco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklbalczfhlkdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklzalczfhlkdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklaalczfhlkdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalclfaYpQbfaXc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalcwfaYpQbfaXc:q:yjjbfRbbfhlxekaialpbbbpkl8Walczfhlkaoc;abfhiaocjefak0meaihoaral9Rc;Fb0mbkkdndnaiak9pmbaici4hoinaral9RcK6mdaCaifhXdndndndndnaOaico4fRbbaocoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpklbxikaXalpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaXalpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaXalpbbbpklbalczfhlkaocdfhoaiczfgiak6mbkkalTmbaAci6hHalhOaAcefgohAaoclSmdxekkcbhlaHceGmdkdnakTmbavcjdfazfhiavazfpbdbhYcbhXinaiavcj;cbfaXfgopblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLaoakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEaoamfpblbg3cep9Ta3aQp9op9Hp9rg3aoaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfhiaXczfgXak6mbkkazclfgzad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfhDc9:hoalmexikkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk;uzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:EPliuo97eue978Jjjjjbca9Rhidndnadcl9hmbdnaec98GglTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalae9pmeaiaeciGgvcdtgdVcbczad9R;8kbaiabalcdtfglad;8qbbdnavTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkalaiad;8qbbskdnaec98GgxTmbcbhvabhdinadczfglalpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oawaopmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgvax6mbkkaxae9pmbaiaeciGgvcitgdfcbcaad9R;8kbaiabaxcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oawaopmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalae9pmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbhdabheinaeaepbbbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepkbbaeczfheadclfgdav6mbkkdnaval9pmbaialciGgdcdtgeVcbc;abae9R;8kbaiabavcdtfgvae;8qbbdnadTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepklbkavaiae;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz9Tbb",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),n=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var r=WebAssembly.validate(t)?e:i,s,a=WebAssembly.instantiate(o(r),{}).then(function(f){s=f.instance,s.exports.__wasm_call_ctors()});function o(f){for(var y=new Uint8Array(f.length),w=0;w<f.length;++w){var x=f.charCodeAt(w);y[w]=x>96?x-97:x>64?x-39:x+4}for(var S=0,w=0;w<f.length;++w)y[S++]=y[w]<60?n[y[w]]:(y[w]-60)*64+y[++w];return y.buffer.slice(0,S)}function c(f,y,w,x,S,_){var R=s.exports.sbrk,E=w+3&-4,M=R(E*x),b=R(S.length),C=new Uint8Array(s.exports.memory.buffer);C.set(S,b);var F=f(M,w,x,b,S.length);if(F==0&&_&&_(M,E,x),y.set(C.subarray(M,M+w*x)),R(M-R(0)),F!=0)throw new Error("Malformed buffer data: "+F)}var l={NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp"},u={ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"},d=[],h=0;function p(f){var y={object:new Worker(f),pending:0,requests:{}};return y.object.onmessage=function(w){var x=w.data;y.pending-=x.count,y.requests[x.id][x.action](x.value),delete y.requests[x.id]},y}function g(f){for(var y="var instance; var ready = WebAssembly.instantiate(new Uint8Array(["+new Uint8Array(o(r))+"]), {}).then(function(result) { instance = result.instance; instance.exports.__wasm_call_ctors(); });self.onmessage = workerProcess;"+c.toString()+m.toString(),w=new Blob([y],{type:"text/javascript"}),x=URL.createObjectURL(w),S=0;S<f;++S)d[S]=p(x);URL.revokeObjectURL(x)}function v(f,y,w,x,S){for(var _=d[0],R=1;R<d.length;++R)d[R].pending<_.pending&&(_=d[R]);return new Promise(function(E,M){var b=new Uint8Array(w),C=h++;_.pending+=f,_.requests[C]={resolve:E,reject:M},_.object.postMessage({id:C,count:f,size:y,source:b,mode:x,filter:S},[b.buffer])})}function m(f){a.then(function(){var y=f.data;try{var w=new Uint8Array(y.count*y.size);c(s.exports[y.mode],w,y.count,y.size,y.source,s.exports[y.filter]),self.postMessage({id:y.id,count:y.count,action:"resolve",value:w},[w.buffer])}catch(x){self.postMessage({id:y.id,count:y.count,action:"reject",value:x})}})}return{ready:a,supported:!0,useWorkers:function(f){g(f)},decodeVertexBuffer:function(f,y,w,x,S){c(s.exports.meshopt_decodeVertexBuffer,f,y,w,x,s.exports[l[S]])},decodeIndexBuffer:function(f,y,w,x){c(s.exports.meshopt_decodeIndexBuffer,f,y,w,x)},decodeIndexSequence:function(f,y,w,x){c(s.exports.meshopt_decodeIndexSequence,f,y,w,x)},decodeGltfBuffer:function(f,y,w,x,S,_){c(s.exports[u[S]],f,y,w,x,s.exports[l[_]])},decodeGltfBufferAsync:function(f,y,w,x,S){return d.length>0?v(f,y,w,u[x],l[S]):a.then(function(){var _=new Uint8Array(f*y);return c(s.exports[u[x]],_,f,y,w,s.exports[l[S]]),_})}}}();var At=[{key:"mithraki",share:9,build:Qm,chapters:kd},{key:"revisetax",share:5,build:$m,chapters:Nd,hud:{lines:["Revise Tax"],at:[.02,.3]}},{key:"bisikaapi",share:8,build:e0,chapters:zd,hud:{lines:["Bisi Kaapi"],at:[.4,.8]}},{key:"glavida",share:6,build:t0,chapters:Vd,hud:{lines:["Glavida"],at:[.02,.3]}},{key:"innovious",share:5,build:n0,chapters:Wd,hud:{lines:["Innovius"],at:[.12,.5]}},{key:"houseofmoh",share:5,build:s0,chapters:Gd,hud:{lines:["House of Moh"],at:[.08,.5]}},{key:"cosmos",share:5,build:a0,chapters:Xd,hud:{lines:["Cosmos"],at:[.08,.45]},veil:[.8,.84,.92]},{key:"perseid",share:7,build:o0,chapters:jd,veil:[.015,.04,.09],hud:[{lines:["Perseid Pictures"],at:[.02,.34]},{lines:["20+ clients"],at:[.42,.72]},{lines:["Let's build yours"],at:[.78,1.5]}]}],p0=20,m0=p0+At.reduce((i,e)=>i+e.share,0),Mr=p0/m0,Sn=[];{let i=Mr;for(let e of At){let t=i+e.share/m0;Sn.push([i,t]),i=t}}var Qw={origin:[0,5.5,-53],yaw:0},Ol="https://aniketh-ani.github.io/nomadiic-cdn/palace/",Zd=new URL(import.meta.url).searchParams.get("v"),zs=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches||typeof innerWidth<"u"&&Math.min(innerWidth,innerHeight)<600,$w=/(_lm|_sky|_diff|_nor|leaves|leaves_nor|mtn_c|mtn_c_s|marble|meadow)\.webp(\?|$)/,eM=i=>zs&&typeof i=="string"&&$w.test(i)&&!/\.m\.webp/.test(i)?i.replace(/\.webp(\?|$)/,".m.webp$1"):i,Ya=i=>{let e=eM(i);return Zd&&typeof e=="string"&&e.startsWith(Ol)&&!/[?&]v=/.test(e)?e+(e.includes("?")?"&":"?")+"v="+Zd:e},l0="nrt-"+(Zd||"dev"),Hs=null,g0=(async()=>{try{if(!globalThis.caches)return null;for(let i of await caches.keys())i.startsWith("nrt-")&&i!==l0&&await caches.delete(i);Hs=await caches.open(l0)}catch{Hs=null}return Hs})(),ec=i=>{try{return new URL(i,location.href).href}catch{return i}},Kd=new Map,Jd=null,Qd={bytes:0},$d=new Map,ef=new Set,Yd=0,u0=null,h0=i=>{ef.has(i)||(ef.add(i),Qd.bytes+=$d.get(i)||0)},v0=async(i,e)=>{if(Hs)try{let r=await Hs.match(i);if(r)return h0(i),r}catch{}let t=Kd.get(i);t||(t=(globalThis.__nrtF0||fetch)(i,e).then(async r=>{if(r.ok){let s=await r.blob(),a=new Response(s,{headers:r.headers});if(Hs)try{await Hs.put(i,a.clone())}catch{}return h0(i),a}return r}).finally(()=>setTimeout(()=>Kd.delete(i),0)),Kd.set(i,t));let n=await t;return n.ok?n.clone():n};if(!globalThis.__nrtFetch){let i=globalThis.fetch.bind(globalThis);globalThis.__nrtFetch=!0,globalThis.__nrtF0=i,globalThis.fetch=async(e,t)=>{let n=typeof e=="string"?Ya(e):e;return typeof n=="string"&&(n.startsWith(Ol)||Jd&&ec(n).startsWith(Jd))&&!(t&&t.cache==="no-store")?(await g0,v0(ec(n),t)):i(n,t)},Md.setURLModifier(Ya)}async function Os(i,e=3){for(let t=0;;t++)try{let n=await fetch(i);if(!n.ok)throw new Error(n.status+" "+i);return n}catch(n){if(t>=e-1)throw n;await new Promise(r=>setTimeout(r,400*(t+1)))}}async function ja(i){let e=i.replace(/\.pack(\?|$)/,".mpk$1"),t=await Os(e),n=await new Response(t.body.pipeThrough(new DecompressionStream("gzip"))).arrayBuffer(),r=new DataView(n),s=r.getUint32(0,!0),a=JSON.parse(new TextDecoder().decode(new Uint8Array(n,4,s)));if(a.v===1){await Nl.ready;let m=4+s,{nv:f,ni:y,min:w,max:x}=a,S=new Xe;for(let _ of a.blocks){let R=new Uint8Array(n,m,_.len);if(m+=_.len+3&-4,_.kind==="idx"){let M=new Uint32Array(y);Nl.decodeIndexBuffer(new Uint8Array(M.buffer),y,4,R),S.setIndex(new qe(M,1));continue}let E=new Uint8Array(f*_.pstride);if(Nl.decodeVertexBuffer(E,f,_.pstride,R),_.kind==="q16"){let M=new Uint16Array(E.buffer),b=new Float32Array(f*3),C=_.pstride/2;for(let F=0;F<f;F++)for(let U=0;U<3;U++)b[F*3+U]=w[U]+M[F*C+U]/65535*(x[U]-w[U]);S.setAttribute("position",new qe(b,3))}else if(_.kind==="unorm16"){let M=new Uint16Array(E.buffer),b=_.pstride/2,C=_.n,F=b===C?M:new Uint16Array(f*C);if(F!==M)for(let U=0;U<f;U++)for(let k=0;k<C;k++)F[U*C+k]=M[U*b+k];S.setAttribute(_.name,new qe(F,C,!0))}else if(_.kind==="f32")S.setAttribute(_.name,new qe(new Float32Array(E.buffer),_.n));else{let M=_.n,b=new Float32Array(f*M);for(let C=0;C<f;C++)for(let F=0;F<M;F++)b[C*M+F]=E[C*_.pstride+F];S.setAttribute(_.name,new qe(b,M))}}return S}let o=4+s,{nv:c,ni:l,min:u,max:d}=a,h=new Uint16Array(n.slice(o,o+c*6));o+=c*6;let p=new Float32Array(c*3);for(let m=0;m<c*3;m++){let f=m%3;p[m]=u[f]+h[m]/65535*(d[f]-u[f])}let g=new Uint32Array(n.slice(o,o+l*4));o+=l*4;let v=new Xe;v.setAttribute("position",new qe(p,3)),v.setIndex(new qe(g,1));for(let[m,f,y]of a.extra)if(f==="unorm16"){let w=new Uint16Array(n.slice(o,o+c*y*2));o+=c*y*2,v.setAttribute(m,new qe(w,y,!0))}else if(f==="f32"){let w=new Float32Array(n.slice(o,o+c*y*4));o+=c*y*4,v.setAttribute(m,new qe(w,y))}else{let w=new Uint8Array(n.slice(o,o+c*y));o+=c*y,o+=(4-o%4)%4,v.setAttribute(m,new qe(new Float32Array(w),y))}return v}function Hi(i,e,{srgb:t=!1,repeat:n=!1,flip:r=!0}={}){return new Promise((s,a)=>i.load(e,o=>{o.colorSpace=t?Gt:qn,o.flipY=r,o.anisotropy=8,n&&(o.wrapS=o.wrapT=es);let c=/_lm|mtn_c|sky\./.test(e);o.generateMipmaps=!c,o.minFilter=c?$t:oi,s(o)},void 0,a))}async function d0(i){let e=await(await Os(i)).blob(),t=URL.createObjectURL(e),n=new Image;try{await new Promise((r,s)=>{n.onload=r,n.onerror=s,n.src=t})}finally{URL.revokeObjectURL(t)}return n}var Jo=i=>new Promise(e=>setTimeout(e,i)),Ka=new Map,us=new WeakMap,Qo=new WeakMap,zl=(()=>{try{if(typeof Worker>"u"||typeof OffscreenCanvas>"u")return null;let i=`self.onmessage = async (e) => { const { id, blob } = e.data;
      try { const bm = await createImageBitmap(blob, { premultiplyAlpha: "none", colorSpaceConversion: "none" });
        const W = bm.width, H = bm.height, c = new OffscreenCanvas(W, H), x = c.getContext("2d", { willReadFrequently: true, alpha: false }); x.drawImage(bm, 0, 0); bm.close();
        const d = x.getImageData(0, 0, W, H).data, row = W * 4, tmp = new Uint8ClampedArray(row);   // bottom row first, as WebGL wants (flipped here, by hand: no browser option to trust)
        for (let y = 0; y < H >> 1; y++) { const a = y * row, b = (H - 1 - y) * row; tmp.set(d.subarray(a, a + row)); d.copyWithin(a, b, b + row); d.set(tmp, b); }
        self.postMessage({ id, w: W, h: H, buf: d.buffer }, [d.buffer]); }
      catch (err) { self.postMessage({ id, err: String(err) }); } };`,e=new Worker(URL.createObjectURL(new Blob([i],{type:"text/javascript"}))),t=new Map,n=0;return e.onmessage=r=>{let s=t.get(r.data.id);t.delete(r.data.id),s&&(r.data.err?s[1](new Error(r.data.err)):s[0](r.data))},{decode:r=>new Promise((s,a)=>{let o=++n;t.set(o,[s,a]),e.postMessage({id:o,blob:r})})}}catch{return null}})(),f0=typeof navigator<"u"&&!!(navigator.userAgentData&&globalThis.createImageBitmap),$o=`
  vec3 lmDecode(vec3 c, float K){ return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)) * K; }
  vec3 srgb2lin(vec3 c){ return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }`;async function MS(i,e={}){{let L=!1;try{let j=document.createElement("canvas");L=!!(j.getContext("webgl2")||j.getContext("webgl"))}catch{}if(!L){let j=document.createElement("div");j.setAttribute("role","main"),j.style.cssText="position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:24px;background:#0c1220;color:#e9ecf3;font:400 18px/1.5 Satoshi,system-ui,sans-serif";let B=e.contactUrl||"https://nomadiichorse.com/contact-us";return j.innerHTML=`<div style="max-width:520px"><div style="font-size:12px;letter-spacing:.32em;color:#ffc48f;margin-bottom:14px">NOMADIIC HORSE DESIGNS \xB7 BANGALORE</div><h1 style="font:500 30px/1.25 Satoshi,system-ui,sans-serif;margin:0 0 14px">We build brands the way the Greeks built palaces.</h1><p style="margin:0 0 24px;opacity:.8">Our site is a 3D walk-through, and this browser can\u2019t show it. Open it in a current Chrome, Safari or Edge with graphics acceleration on, or write to us directly.</p><a href="${B}" style="display:inline-block;padding:13px 26px;border-radius:999px;background:#f2822f;color:#fff;font-weight:600;text-decoration:none">Contact us</a></div>`,i.appendChild(j),{destroy(){j.remove()}}}}let t=e.base||Ol+"assets/",n=!0;Jd=ec(t);let r=e.intro==="storm",s={uNight:{value:0},uFront:{value:1e4},uGlowK:{value:0},uStorm:{value:0}},a=0,o=0,c=r?Hm():null,l=r?zm():null,u=!1,d=0,h=null,p=e.onProgress||(()=>{}),g=1,v=!0,m=!0,f=!0,y=0,w=performance.now(),x=32e3,S=At.length+2,_=()=>(Yd?Math.min(1,Qd.bytes/Yd):g*.15)*.82+Math.min(1,y/S)*.18,R=()=>{h&&(h.setProgress(Math.min(f?1:.985,_())),v&&m&&(f||vt[0]&&performance.now()-w>x)&&h.ready())},E=h?setInterval(()=>{R(),h.showing&&clearInterval(E)},200):0,M=(L,j)=>{p(L,j),L<1&&(g=L),R()},b=!1,C=async L=>{if(navigator.connection&&navigator.connection.saveData&&!L)return;let j=globalThis.__nrtF0||fetch;try{await g0;let B=u0||(u0=await(await j(Ya(t+"manifest2.json"),{cache:"no-store"})).json()),W=["","plants","mithraki","revisetax","bisikaapi","glavida","innovious","houseofmoh","cosmos","tex","book"],Q=Se=>Se.includes("/")?Se.split("/")[0]:"",te=new Set(B.files.map(Se=>Se[0]).filter(Se=>Se.endsWith(".m.webp"))),pe=B.files.filter(([Se])=>(zs?!te.has(Se.replace(/\.webp$/,".m.webp"))||Se.endsWith(".m.webp"):!Se.endsWith(".m.webp"))&&W.includes(Q(Se))&&Se!=="score2.m4a"&&!Se.endsWith(".pack")).filter(([Se])=>Q(Se)==="book"==!!L&&!(zs&&Q(Se)==="book")).sort((Se,dt)=>W.indexOf(Q(Se[0]))-W.indexOf(Q(dt[0])));if(!L){for(let[Se,dt]of pe)$d.set(ec(Ya(t+Se)),dt);Yd=pe.reduce((Se,dt)=>Se+dt[1],0);for(let Se of ef)Qd.bytes+=$d.get(Se)||0}let Ee=async()=>{for(;pe.length&&n;){let Se=ec(Ya(t+pe.shift()[0]));for(let dt=0;dt<3;dt++){try{if((await v0(Se)).ok)break}catch{}await Jo(800*(dt+1))}}};await Promise.all(Array.from({length:6},Ee))}catch(B){console.warn("[nomadiic-rt] stream",B)}};C(!1);let F=matchMedia("(pointer: coarse)").matches||Math.min(innerWidth,innerHeight)<600,U=(()=>{try{return+sessionStorage.getItem("nrtLost")||0}catch{return 0}})(),k=e.tier||(F||Date.now()-U<6e5?"low":"high"),H=k==="high"?{pr:1.5,grassNear:22e4,grassFar:6e4,clumps:900,msaa:2,spray:2400}:{pr:1.25,grassNear:52e3,grassFar:16e3,clumps:300,msaa:0,spray:600},D=new sl({antialias:!1,powerPreference:"high-performance",alpha:!1});D.setPixelRatio(Math.min(devicePixelRatio,H.pr)),D.toneMapping=Bo,D.toneMappingExposure=e.exposure??.95,D.outputColorSpace=Gt,i.appendChild(D.domElement),Object.assign(D.domElement.style,{width:"100%",height:"100%",display:"block",touchAction:"none"});let z=new Ji;D.domElement.addEventListener("webglcontextlost",L=>{if(L.preventDefault(),console.warn("[nomadiic-rt] context lost"),!(Date.now()-U<6e4)){try{sessionStorage.setItem("nrtLost",String(Date.now()))}catch{}setTimeout(()=>{D.getContext().isContextLost()&&location.reload()},1500)}},!1),D.domElement.addEventListener("webglcontextrestored",()=>location.reload(),!1);let N=[...Fm.map(L=>({...L,at:[L.at[0]/Ga*Mr,Math.min(L.at[1]/Ga,1)*Mr]})),...At.flatMap((L,j)=>L.chapters.map(B=>({...B,at:[Sn[j][0]+B.at[0]*(Sn[j][1]-Sn[j][0]),Sn[j][0]+Math.min(B.at[1],j<At.length-1?.9:1)*(Sn[j][1]-Sn[j][0])]})))],V=!1,ee=async L=>{if(!V){V=!0;try{let j=await import(Ya(Ol+"book.js"));j.setBookBase(t+"book/"),j.openBook(i,L,{onClose:()=>{V=!1}})}catch(j){console.error("[nomadiic-rt] book",j),V=!1}}},ce=Xm(i,N,{contactUrl:e.contactUrl,onBook:ee,sound:l}),Y=new Tn(42,1,1,6e3),be=new class extends gl{load(L,j,B,W){let Q=new jn,te=this.manager.resolveURL(L),ge=f0,pe=()=>{let Ee=Os(te).then(Se=>Se.blob()).then(async Se=>{if(ge)return new Rs(await createImageBitmap(Se,{imageOrientation:"flipY",premultiplyAlpha:"none",colorSpaceConversion:"none"}));let dt=new Image,Ct=URL.createObjectURL(Se);return await new Promise((Jt,hn)=>{dt.onload=Jt,dt.onerror=hn,dt.src=Ct}),URL.revokeObjectURL(Ct),new Rs(dt)});return Ka.set(te,Ee),Ee.catch(()=>Ka.delete(te)),Ee};return(Ka.get(te)||pe()).then(Ee=>Ee.data&&Ee.data.__dropped?pe():Ee).then(Ee=>{Q.source=Ee,ge&&(Q.flipY=!1),Q.version++,(us.get(Ee)||us.set(Ee,[]).get(Ee)).push(Q),Qo.set(Ee,te),j&&j(Q)}).catch(Ee=>{W?W(Ee):console.warn("[nomadiic-rt] texture",Ee)}),Q}loadOld(L,j,B,W){return super.load(L,Q=>{let te=Q.image,ge=()=>j&&j(Q);navigator.userAgentData&&globalThis.createImageBitmap&&te?createImageBitmap(te,{imageOrientation:"flipY",premultiplyAlpha:"none",colorSpaceConversion:"none"}).then(pe=>{Q.image=pe,Q.flipY=!1,Q.needsUpdate=!0,ge()}).catch(ge):(te&&te.decode?te.decode().catch(()=>{}):Promise.resolve()).then(ge)},B,W)}},Z=0,ae=14,fe=()=>M(++Z/ae),ne=L=>L.then(j=>(fe(),j)),[he,Ge,We,ut,me,Je]=await Promise.all([ne(Os(t+"scene.json").then(L=>L.json())),ne(Hi(be,t+"sky.jpg",{srgb:!1})),ne(Hi(be,t+"ground_lm_s.webp")),ne(Hi(be,t+"meadow.webp",{srgb:!0,repeat:!0})),ne(d0(t+"grass_mask.png")),ne(ja(t+"emblem.pack"))]).catch(L=>{throw h&&h.fail(),L});{let L=document.createElement("canvas");L.width=64,L.height=32;let j=L.getContext("2d");j.drawImage(Ge.image,0,0,64,32);let B=j.getImageData(0,14,64,2).data,W=0,Q=0,te=0;for(let Ee=0;Ee<B.length;Ee+=4)W+=B[Ee],Q+=B[Ee+1],te+=B[Ee+2];let ge=B.length/4,pe=Ee=>(Ee/=255*ge,Ee<=.04045?Ee/12.92:Math.pow((Ee+.055)/1.055,2.4));e.fog=[pe(W),pe(Q),pe(te)]}let O=he.frames,it=O.length,ze=new T(...he.sun).normalize();Y.fov=he.fov,Y.updateProjectionMatrix();let Pe={uTime:{value:0},uSun:{value:ze},uFogCol:{value:new de(...e.fog)},uFogK:{value:34e-5},uCam:{value:Y.position}},we=new xe(new zn(5e3,48,24),new ye({side:en,depthWrite:!1,fog:!1,uniforms:{tSky:{value:Ge},uNight:{value:0},uFlash:{value:0},uT:{value:0},uFP:{value:new ue(.5,.7)}},vertexShader:"varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0); gl_Position = p.xyww; }",fragmentShader:`${$o} uniform sampler2D tSky; uniform float uNight, uFlash, uT; varying vec3 vDir;
      ${Il}
      void main(){ vec3 d = normalize(vDir); vec3 b = vec3(d.x, -d.z, d.y);
        float lon = atan(b.x, b.y), lat = asin(clamp(b.z, -1.0, 1.0));
        vec2 uv = vec2(0.5 + lon / 6.2831853, 0.5 + lat / 3.1415927);
        vec3 sk = srgb2lin(texture2D(tSky, uv).rgb);
        if (uNight > 0.001) sk = mix(sk, stormSky(d, uT, uFlash), uNight);
        gl_FragColor = vec4(sk, 1.0); }`}));we.renderOrder=-1,we.frustumCulled=!1,z.add(we);let Qe=jo({count:34,center:[0,58,40],radius:130,height:16,size:.6,color:1711136});z.add(Qe.mesh);let Fe=Dd({count:16,box:[-160,160,.6,5,-10,170],color:[.62,.68,.78],opacity:.16,size:[34,7]});z.add(Fe.mesh);let I=null;if(r){let L=k==="high"?14e3:6e3,j=new Float32Array(L*6),B=new Float32Array(L*2);for(let te=0;te<L;te++){let ge=Math.random(),pe=Math.random(),Ee=Math.random(),Se=Math.random();j.set([ge,pe,Ee,ge,pe,Ee],te*6),B[te*2]=B[te*2+1]=Se}let W=new Xe;W.setAttribute("position",new qe(j,3));let Q=new Float32Array(L*2);for(let te=0;te<L;te++)Q[te*2]=0,Q[te*2+1]=1;W.setAttribute("aEnd",new qe(Q,1)),W.setAttribute("aSeed",new qe(B,1)),I=new Ua(W,new ye({transparent:!0,depthWrite:!1,blending:Pt,uniforms:{uTime:Pe.uTime,uCam:Pe.uCam,uA:{value:1},uFl:{value:0}},vertexShader:`uniform float uTime; uniform vec3 uCam; attribute float aEnd, aSeed; varying float vA;
        void main(){ vec3 B = vec3(46.0, 30.0, 46.0); vec3 p = position * B;
          float sp = 22.0 + aSeed * 8.0; p.y = mod(p.y - uTime * sp - uCam.y, B.y);
          p.x = mod(p.x - uCam.x + uTime * 4.0, B.x); p.z = mod(p.z - uCam.z, B.z);
          vec3 w = uCam + p - B * vec3(0.5, 0.35, 0.5);
          w += vec3(0.04, -1.0, 0.01) * aEnd * (0.16 + aSeed * 0.22);
          vec4 mv = viewMatrix * vec4(w, 1.0); vA = (1.0 - smoothstep(3.0, 16.0, -mv.z)) * smoothstep(0.8, 2.5, -mv.z) * (0.35 + 0.65 * fract(aSeed * 13.7)) * (1.0 - aEnd * 0.7);
          gl_Position = projectionMatrix * mv; }`,fragmentShader:"uniform float uA, uFl; varying float vA; void main(){ gl_FragColor = vec4(vec3(0.62, 0.7, 0.86) * (0.09 + uFl * 0.5), vA * uA * 0.4); }"})),I.frustumCulled=!1,I.renderOrder=8,z.add(I)}let A=new La(D),K=new Ji;K.add(we.clone()),K.add(new xe(new ka(4e3,32).rotateX(-Math.PI/2),new ci({color:new de(.035,.045,.018)})));let re=A.fromScene(K,0,.1,6e3).texture;z.environment=re;let oe=he.ground,se=new ye({uniforms:{...Pe,tLm:{value:We},tAlb:{value:ut},uK:{value:he.lm.ground},uRect:{value:new nt(oe.x0,oe.x1,oe.z0,oe.z1)}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`${$o} ${mi} uniform sampler2D tLm, tAlb; uniform float uK; uniform vec4 uRect; varying vec3 vW;
      void main(){
        vec3 alb = texture2D(tAlb, vW.xz / 9.0).rgb * 0.6 + texture2D(tAlb, vW.xz / 53.0 + 0.37).rgb * 0.4;
        vec2 uv = vec2((vW.x - uRect.x) / (uRect.y - uRect.x), (uRect.w - vW.z) / (uRect.w - uRect.z));
        vec3 open = lmDecode(vec3(0.83), uK);
        vec3 L = lmDecode(texture2D(tLm, clamp(uv, 0.002, 0.998)).rgb, uK);
        float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
        float edge = inside * smoothstep(0.0, 0.08, min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)));
        vec3 c = alb * mix(open, L, edge);
        gl_FragColor = vec4(applyFog(c, vW), 1.0); }`}),He=new xe(new Ft(9e3,9e3,1,1).rotateX(-Math.PI/2),se);He.position.y=-.01,z.add(He),Je.computeVertexNormals();let Ae=new cn({color:new de("#e9a94a"),metalness:1,roughness:.16,envMapIntensity:1.1}),De=new xe(Je,Ae);De.matrixAutoUpdate=!1,z.add(De),r&&(Ae.emissive=new de(.32,.2,.06));let rt={p:new T,q:new Ut,s:new T};new et().fromArray(O[0].emb).decompose(rt.p,rt.q,rt.s);let ve=new yn;ve.position.copy(rt.p),ve.lookAt(O[0].cam[0],rt.p.y,O[0].cam[2]);let ke=ve.quaternion.clone().invert().multiply(rt.q),Ne={a:0,v:.25,drag:!1,x:0},tt=new T,Be=new T,xt=new ki(new de(1,.72,.48),6);xt.position.copy(ze).multiplyScalar(100),z.add(xt,xt.target);let lt=document.createElement("canvas");lt.width=me.width,lt.height=me.height,lt.getContext("2d").drawImage(me,0,0);let It=new Qi(lt);It.flipY=!1,It.colorSpace=qn;let G=he.mask,Ce={...Pe,tLm:{value:We},uK:{value:he.lm.ground},uRect:{value:new nt(oe.x0,oe.x1,oe.z0,oe.z1)},uPxAng:{value:6e-4},tMask:{value:It},uMask:{value:new nt(G.x0,G.x1,G.z0,G.z1)},uCenter:{value:new ue}},ie=new xe(qo(H.grassNear,84,1,1),Td({...Ce,uTile:{value:84},uWide:{value:F?1.6:1.15},uFade:{value:new ue(30,42)}})),le=new xe(qo(H.grassFar,300,1,2),Td({...Ce,uTile:{value:300},uWide:{value:3.4},uFade:{value:new ue(130,150)},uNear:{value:44}},!0));ie.frustumCulled=le.frustumCulled=!1,ie.layers.set(1),le.layers.set(1),Y.layers.enable(1),z.add(ie,le);let Ie=[ie,le],Ue=null,ot=null,Vt={value:0},qt=null,Lt=null,ni=null,Ti=null,tc=null,xi=null,Zt=null,Hr=null,Vn=new Tn,vt=At.map(()=>null),Er=At.map(()=>!1),Za=L=>new ye({uniforms:{tP:{value:L},uRes:{value:new ue(1,1)},uReady:{value:0},uCol:{value:new de(.9,.86,.8)},uFog:{value:new nt(.5,.5,.5,0)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D tP; uniform vec2 uRes; uniform float uReady; uniform vec3 uCol; uniform vec4 uFog; varying vec2 vUv;
      void main(){ vec3 glow = uCol * mix(1.35, 0.75, vUv.y) * (0.85 + 0.25 * (1.0 - abs(vUv.x - 0.5) * 2.0));   // soft daylight beyond the door, never a white panel
        vec3 c = uReady > 0.5 ? texture2D(tP, gl_FragCoord.xy / uRes).rgb : glow; gl_FragColor = vec4(mix(c, uFog.rgb, uFog.a), 1.0); }`}),Bs=L=>L.traverse(j=>{j.geometry?.dispose?.();for(let B of[].concat(j.material||[])){for(let W of Object.values(B))W&&W.isTexture&&!W.isRenderTargetTexture&&W.dispose();for(let W of Object.values(B.uniforms||{}))W&&W.value&&W.value.isTexture&&!W.value.isRenderTargetTexture&&W.value.dispose()}}),sn=-1,Hl=!1,nr=At.map(()=>null),nc=L=>L==="bisikaapi"?[Bm({count:36,box:[-12,12,.6,2.6,-70,30]}),Vm({count:140,box:[-12,12,0,14,-12,12],follow:!0}),Dd({count:22,box:[-60,60,.4,4.5,-100,50],color:[.78,.82,.8],opacity:.2})]:L==="glavida"?[jo({count:28,center:[10,30,-150],radius:90,height:14,size:.55,color:2764083})]:L==="houseofmoh"?[jo({count:14,center:[0,18,-60],radius:55,height:8,size:.75,color:13225684,glide:2.5,speed:.7})]:L==="cosmos"?[jo({count:2,center:[0,95,-40],radius:140,height:12,size:1.9,color:3814964,glide:4,speed:.5})]:[],tf=L=>{let j=vt[L];j&&(vt[L]=null,Er[L]=!1,Bs(j.scene),j.scene.traverse(B=>{B.isReflector&&B.dispose()}),j.dispose?.(),nr[L]=null)},P=new tn(4,4,{type:nn}),q=async(L,j,B=Y,W)=>{L.traverse(pe=>{for(let Ee of[].concat(pe.material||[]))Ee.transparent&&Ee.side===mt&&Ee.blending===Pt&&!Ee.depthWrite&&(Ee.forceSinglePass=!0)});let Q=L.isScene&&r?[I,c.group].filter(pe=>pe&&pe.parent!==L).map(pe=>[pe,pe.parent]):[];for(let[pe]of Q)L.add(pe);let te=[],ge=[];L.traverse(pe=>{pe.visible||(te.push(pe),pe.visible=!0),pe.frustumCulled&&(ge.push(pe),pe.frustumCulled=!1)});try{D.setRenderTarget(j);let pe=D.compileAsync(L,B,W);D.setRenderTarget(null),await pe,L.isScene&&(D.setRenderTarget(P),D.render(L,B))}catch(pe){console.warn("[nomadiic-rt] warm",pe)}finally{D.setRenderTarget(null);for(let pe of te)pe.visible=!1;for(let pe of ge)pe.frustumCulled=!0;for(let[pe,Ee]of Q)Ee?Ee.add(pe):L.remove(pe)}},J=()=>Promise.race([new Promise(L=>requestAnimationFrame(()=>L())),Jo(120)]),$=async L=>{let j=performance.now();await q(L.scene,Zt),globalThis.__nrtProf&&(globalThis.__nrtLog||(globalThis.__nrtLog=[])).push(L.key,"compileAsync",Math.round(performance.now()-j)+"ms");let B=new Set;L.scene.traverse(Q=>{for(let te of[].concat(Q.material||[])){for(let ge of Object.values(te))ge&&ge.isTexture&&!ge.isRenderTargetTexture&&B.add(ge);for(let ge of Object.values(te.uniforms||{}))ge&&ge.value&&ge.value.isTexture&&!ge.value.isRenderTargetTexture&&B.add(ge.value)}});let W=performance.now();for(let Q of B)j=performance.now(),D.initTexture(Q),globalThis.__nrtProf&&(globalThis.__nrtLog||(globalThis.__nrtLog=[])).push(L.key,"tex",Q.image&&Q.image.width,Math.round(performance.now()-j)+"ms"),performance.now()-W>(u?24:4)&&(await J(),W=performance.now())},X=async()=>{let L=0;for(let j of Ka.values()){let B;try{B=await j}catch{continue}let W=B.data,Q=us.get(B)||[];if(!W||W.__dropped||!Q.length||!Q.every(pe=>{let Ee=D.properties.get(pe);return Ee.__webglInit&&Ee.__version===pe.version}))continue;let te=W.width,ge=W.height;try{typeof W.close=="function"&&W.close()}catch{}B.data={width:te,height:ge,__dropped:!0},L++}e.debug&&console.log("[nomadiic-rt] released",L,"picture copies")},Me=1024*1024,Re=new Map,Oe=new Set,je=L=>{let j=new Set;return L.traverse(B=>{for(let W of[].concat(B.material||[])){let Q=te=>{if(te&&te.isTexture&&Qo.has(te.source)){let ge=te.source.data;ge&&ge.width*ge.height>=Me&&j.add(te.source)}};for(let te of Object.values(W))Q(te);for(let te of Object.values(W.uniforms||{}))Q(te&&te.value)}}),j},ct=L=>{if(L>=0&&!vt[L])return!1;let j=Re.get(L);if(j){for(let B of j)if(Oe.has(B))return!1}return!0},st=L=>L>=0&&L<At.length&&ct(L),Ke=()=>{let L=sn,j=ds?L-2:L-(zs?1:2),B=ds?L+(zs?1:2):L+2,W=new Set;for(let Q=Math.max(-1,j);Q<=Math.min(At.length-1,B);Q++)W.add(Q);return W},_t=L=>{let j=[],B=L<0?z:vt[L]&&vt[L].scene;return B&&B.traverse(W=>{W.isReflector&&j.push(W)}),j},zt=L=>{let j=new Set;for(let W of us.get(L)||[]){let Q=D.properties.get(W);Q.__nrt?(j.has(Q.__webglTexture)||(j.add(Q.__webglTexture),_e.deleteTexture(Q.__webglTexture)),D.properties.remove(W)):W.dispose()}let B=L.data;if(B&&!B.__dropped){try{B.close&&B.close()}catch{}L.data={width:B.width,height:B.height,__dropped:!0}}Oe.add(L)},_e=D.getContext(),Wn=D.extensions.has("EXT_texture_filter_anisotropic")?D.extensions.get("EXT_texture_filter_anisotropic"):null,Tt={[es]:_e.REPEAT,[ur]:_e.CLAMP_TO_EDGE,[_o]:_e.MIRRORED_REPEAT},Ze={[Xn]:_e.NEAREST,[$t]:_e.LINEAR,[ud]:_e.NEAREST_MIPMAP_NEAREST,[Ts]:_e.NEAREST_MIPMAP_LINEAR,[xo]:_e.LINEAR_MIPMAP_NEAREST,[oi]:_e.LINEAR_MIPMAP_LINEAR},Ai=L=>L.generateMipmaps&&L.minFilter!==Xn&&L.minFilter!==$t,Rt=L=>[L.wrapS,L.wrapT,L.magFilter,L.minFilter,L.anisotropy,L.colorSpace,Ai(L)].join(),bi=async(L,j,B,W)=>{let Q=Ai(L),te=Q?Math.floor(Math.log2(Math.max(B,W)))+1:1,ge=D.state,pe=_e.createTexture(),Ee=()=>ge.bindTexture(_e.TEXTURE_2D,pe);Ee(),_e.texStorage2D(_e.TEXTURE_2D,te,L.colorSpace===Gt?_e.SRGB8_ALPHA8:_e.RGBA8,B,W),_e.texParameteri(_e.TEXTURE_2D,_e.TEXTURE_WRAP_S,Tt[L.wrapS]),_e.texParameteri(_e.TEXTURE_2D,_e.TEXTURE_WRAP_T,Tt[L.wrapT]),_e.texParameteri(_e.TEXTURE_2D,_e.TEXTURE_MAG_FILTER,Ze[L.magFilter]),_e.texParameteri(_e.TEXTURE_2D,_e.TEXTURE_MIN_FILTER,Ze[L.minFilter]),Wn&&L.magFilter!==Xn&&(L.minFilter===Ts||L.minFilter===oi)&&L.anisotropy>1&&_e.texParameterf(_e.TEXTURE_2D,Wn.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(L.anisotropy,D.capabilities.getMaxAnisotropy()));let Se=Math.max(8,Math.floor((zs?1:4)*1048576/(B*4))),dt=performance.now();for(let Ct=0;Ct<W;Ct+=Se){let Jt=Math.min(Se,W-Ct);Ee(),_e.pixelStorei(_e.UNPACK_FLIP_Y_WEBGL,!1),_e.pixelStorei(_e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),_e.pixelStorei(_e.UNPACK_ALIGNMENT,4),_e.texSubImage2D(_e.TEXTURE_2D,0,0,Ct,B,Jt,_e.RGBA,_e.UNSIGNED_BYTE,j.subarray(Ct*B*4,(Ct+Jt)*B*4)),performance.now()-dt>(u?20:3)&&(await J(),dt=performance.now())}return Q&&(Ee(),_e.generateMipmap(_e.TEXTURE_2D)),pe},Br=(L,j)=>{let B=D.properties.get(L);B.__webglInit=!0,B.__webglTexture=j,B.__version=L.version,B.__nrt=!0},Kn=async L=>{let j=await(await Os(Qo.get(L))).blob(),{w:B,h:W,buf:Q}=await zl.decode(j);if(!Oe.has(L)||!n)return;let te=new Uint8Array(Q),ge=new Map;for(let pe of us.get(L)||[]){let Ee=Rt(pe);(ge.get(Ee)||ge.set(Ee,[]).get(Ee)).push(pe)}for(let pe of ge.values()){let Ee=await bi(pe[0],te,B,W);for(let Se of pe)Br(Se,Ee)}L.data={width:B,height:W,__dropped:!0},Oe.delete(L)},hs=async L=>{if(zl&&!zl.broken)try{return await Kn(L)}catch(W){zl.broken=!0,console.warn("[nomadiic-rt] slices",W)}let j=await(await Os(Qo.get(L))).blob(),B;if(f0)B=await createImageBitmap(j,{imageOrientation:"flipY",premultiplyAlpha:"none",colorSpaceConversion:"none"});else{let W=new Image,Q=URL.createObjectURL(j);try{await new Promise((te,ge)=>{W.onload=te,W.onerror=ge,W.src=Q});try{await Promise.race([W.decode(),Jo(400)])}catch{}}finally{URL.revokeObjectURL(Q)}B=W}if(!Oe.has(L)){try{B.close&&B.close()}catch{}return}L.data=B,L.needsUpdate=!0;for(let W of us.get(L)||[])D.initTexture(W),await J();try{B.close&&B.close()}catch{}L.data={width:B.width,height:B.height,__dropped:!0},Oe.delete(L)},Ot=!1,Yn=!1,ir=async()=>{if(!(!f&&!ii)){if(Ot){Yn=!0;return}Ot=!0;try{do{Yn=!1;let L=Ke(),j=new Set;for(let W of L)for(let Q of Re.get(W)||[])j.add(Q);for(let[W]of Re)for(let Q of _t(W)){let te=Q.getRenderTarget(),ge=W===sn||W===sn+1;Q.userData.size||(Q.userData.size=[te.width,te.height]),ge&&te.width!==Q.userData.size[0]?te.setSize(...Q.userData.size):!ge&&te.width!==1&&te.setSize(1,1)}let B=[...L].sort((W,Q)=>Math.abs(W-sn)-Math.abs(Q-sn));e:for(let W of B)for(let Q of Re.get(W)||[])if(Oe.has(Q)&&(await hs(Q),Yn))break e;if(!Yn){for(let[W,Q]of Re)if(!L.has(W))for(let te of Q)!j.has(te)&&!Oe.has(te)&&zt(te)}}while(Yn&&n)}catch(L){console.warn("[nomadiic-rt] memory",L)}finally{Ot=!1}}},ii=!1,Bi=async L=>{let j=new Set;L.traverse(W=>{for(let Q of[].concat(W.material||[])){for(let te of Object.values(Q))te&&te.isTexture&&!te.isRenderTargetTexture&&j.add(te);for(let te of Object.values(Q.uniforms||{}))te&&te.value&&te.value.isTexture&&!te.value.isRenderTargetTexture&&j.add(te.value)}});let B=performance.now();for(let W of j)D.initTexture(W),performance.now()-B>(u?24:4)&&(await J(),B=performance.now())},Ri={a:"#f6c47a",b:"#e0913a",c:"#fff0d2"},Ja=(L,j)=>{let B=new kl({count:k==="high"?3e4:18e3,size:34,colorA:Ri.a,colorB:Ri.b,colorC:Ri.c,spread:16,additive:!1});B.setShape(c0(L,{count:B.count,width:20,font:"600 150px Satoshi, sans-serif",lineGap:.95}),"A"),B.material.depthTest=!1,B.renderOrder=20,B.visible=!1;let W=new xe(new Ft(1,1),new ye({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{uA:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform float uA; varying vec2 vUv; void main(){ float r = length((vUv - 0.5) * vec2(1.0, 2.2)); gl_FragColor = vec4(0.03, 0.035, 0.05, uA * 0.72 * (1.0 - smoothstep(0.05, 0.5, r))); }"}));return W.renderOrder=19,W.scale.set(30,11,1),W.position.z=-.5,B.add(W),B.userData.halo=W,j.add(B),B},ic=new T,rc=new T,x0=(L,j,B,W)=>{let[Q,te]=j,ge=ht.smoothstep(B,Q,Q+.05)*(1-ht.smoothstep(B,te-.05,te));if(L.visible=ge>.001,!L.visible){L.u.uAssemble.value=0;return}let pe=18,Ee=Math.tan(ht.degToRad(Y.fov/2)),Se=ht.clamp((1.1-Y.aspect)/.6,0,1);ic.set(0,0,-1).applyQuaternion(Y.quaternion),rc.set(0,1,0).applyQuaternion(Y.quaternion),L.position.copy(Y.position).addScaledVector(ic,pe).addScaledVector(rc,pe*Ee*ht.lerp(.26,.2,Se)),L.quaternion.copy(Y.quaternion),L.scale.setScalar(2*pe*Ee*Y.aspect*ht.lerp(.5,.84,Se)/20),L.u.uTime.value=W,L.u.uAssemble.value=ge,L.u.uOpacity.value=ht.smoothstep(ge,.2,.7),L.u.uDance.value=.35+(1-ge)*2.2,L.userData.halo.material.uniforms.uA.value=ge},nf=Promise.resolve(),Qa=At.map(()=>null),rf=L=>{if(L<0||L>=At.length)return Promise.resolve(null);if(vt[L])return Promise.resolve(vt[L]);if(Qa[L])return Qa[L];let j=async()=>{if(vt[L]||!n)return vt[L];Er[L]=!0;try{let W=await At[L].build({base:t,unpack:ja,loader:be,renderer:D,tier:k,grainTex:Ti});if(W.huds=[].concat(At[L].hud||[]).map(Q=>({H:Ja(Q.lines,W.scene),at:Q.at})),W.exitPortal){let Q=new Ft(...W.exitPortal.size);if(W.exitPortal.arch){let[ge,pe]=W.exitPortal.size,Ee=ge/2,Se=new Na;Se.moveTo(-Ee,-pe/2),Se.lineTo(Ee,-pe/2),Se.lineTo(Ee,pe/2-Ee),Se.absarc(0,pe/2-Ee,Ee,0,Math.PI,!1),Se.lineTo(-Ee,-pe/2),Q=new zo(Se,32);let dt=Q.attributes.position,Ct=Q.attributes.uv;for(let Jt=0;Jt<dt.count;Jt++)Ct.setXY(Jt,dt.getX(Jt)/ge+.5,dt.getY(Jt)/pe+.5)}let te=new xe(Q,Za(Zt.texture));te.position.set(...W.exitPortal.pos),te.rotation.y=W.exitPortal.yaw,te.visible=!1,W.scene.add(te),W.portalQuad=te}if(!nr[L]){nr[L]=nc(At[L].key);for(let Q of nr[L])W.scene.add(Q.mesh)}await $(W),vt[L]=W,L===0&&(tc=W),Re.set(L,je(W.scene)),ii=!0,await X(),ir(),Wr(),e.debug&&(window.__worlds=vt)}catch(W){console.error("[nomadiic-rt] world",At[L].key,W)}return Er[L]=!1,vt[L]},B=nf=nf.then(j,j);return Qa[L]=B,B.finally(()=>{Qa[L]=null}),B},b0=L=>{rf(L)},ds=!1,y0=L=>{if(!(Er.some(Boolean)||Qa.some(Boolean))){for(let j of ds?[L-1,L+1]:[L+1,L-1])if(j>=0&&j<At.length&&!vt[j]){b0(j);return}}},sf=(async()=>{let[L,j,B,W]=await Promise.all([ne(ja(t+"arch.pack")),ne(Hi(be,t+"arch_lm_s.webp").catch(()=>Hi(be,t+"arch_lm.webp"))),ne(Hi(be,t+"marble.webp",{srgb:!0,repeat:!0})),ne(ja(t+"water.pack"))]);Ti=B;let Q=L.toNonIndexed();Q.computeVertexNormals();let te=[];for(let Ve of[-30,-36,-42,-48])for(let Bt of[-6.9,6.9])te.push(new T(Bt,11.6,Ve));let ge=(Ve,Bt,ft)=>new ye({uniforms:{...Pe,...s,tLm:{value:Ve},tMarble:{value:B},uK:{value:Bt},uLamps:{value:te}},defines:ft?{HALL:""}:{},vertexShader:`attribute float kind; varying vec2 vUv; varying vec3 vW, vN; varying float vKind;
        void main(){ vUv = uv; vKind = kind; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normal; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`${$o} ${mi} uniform sampler2D tLm, tMarble; uniform float uK, uNight, uFront, uGlowK, uStorm; uniform vec3 uLamps[8]; varying vec2 vUv; varying vec3 vW, vN; varying float vKind;
        vec3 tri(vec3 p, vec3 n, float s){ vec3 w = pow(abs(n), vec3(4.0)); w /= dot(w, vec3(1.0));
          return texture2D(tMarble, p.zy / s).rgb * w.x + texture2D(tMarble, p.xz / s).rgb * w.y + texture2D(tMarble, p.xy / s).rgb * w.z; }
        float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        void main(){
          vec3 n = vN; n = (dot(n, n) > 1e-8 && n == n) ? normalize(n) : vec3(0.0, 1.0, 0.0); vec3 L = lmDecode(texture2D(tLm, vUv).rgb, uK);
          #ifdef HALL
            { float lum = dot(L, vec3(0.333)); L *= 0.85 / (1.0 + max(lum - 0.85, 0.0) * 1.4);   // the stone right under each lamp baked hot: rolled off, then warmed so it never rings blue
              float l2 = dot(L, vec3(0.333)); L = mix(L, vec3(l2) * vec3(1.0, 0.93, 0.82), smoothstep(0.45, 0.8, lum) * 0.9);
              L = max(L, vec3(0.30, 0.275, 0.24)); }   // no corner of the hall is ever a dark slab: a warm floor of ambient light   // the stone right under each lamp baked hot: rolled off so nothing burns white
          #else
            if (vW.z < -24.8 && vW.z > -55.5 && abs(vW.x) < 8.3 && vW.y > 5.6 && vW.y < 16.5) discard;
            if (abs(vW.x) < 1.4 && vW.y > 23.35 && (abs(vW.z + 20.7) < 1.6 || abs(vW.z + 59.3) < 1.6)) discard;   // the old ball on each apex   // outside pieces (the colonnade's basins) that poke through into the hall
          #endif
          if (uNight > 0.001) L = mix(L, pow(L, vec3(0.62)) * 0.82, uNight);
          L += vec3(0.16, 0.15, 0.14) * uStorm;   // under the storm the marble glows softly, as if lit from within
          vec3 alb = tri(vW, n, 3.2);
          float k = vKind, gloss = 0.04;
          vec3 V = normalize(cameraPosition - vW); float fres = pow(clamp(1.0 - max(dot(n, V), 0.0), 0.0, 1.0), 5.0);
          if (k > 0.5 && k < 1.5) {
            alb *= vec3(1.02, 1.0, 0.98);
            #ifdef HALL
              // marble wall panels, each slab cut from a slightly different block, with fine joints
              vec2 pq = abs(n.x) > 0.5 ? vW.zy : vW.xy; vec2 cell = floor(pq / vec2(2.4, 1.6)); vec2 f = abs(fract(pq / vec2(2.4, 1.6)) - 0.5);
              float joint = smoothstep(0.488, 0.497, max(f.x, f.y));
              vec3 mA = tri(vW + vec3(cell.x * 7.3, cell.y * 3.1, 0.0), n, 2.2); float lA = dot(mA, vec3(0.333));
              float grain = dot(tri(vW * 1.0 + vec3(cell.y * 1.7, 0.0, cell.x * 2.3), n, 0.42), vec3(0.333)), fine = dot(tri(vW, n, 0.13), vec3(0.333));
              // calm white marble: a soft vein from the coarse stone, a tooth of fine grain, never the blotches
              alb = vec3(0.90, 0.885, 0.85) * (0.9 + 0.28 * (lA - 0.55) + 0.16 * (grain - 0.55) + 0.10 * (fine - 0.55));
              alb *= mix(vec3(0.97, 0.96, 0.93), vec3(0.91, 0.9, 0.88), h21(cell)) * (1.0 - joint * 0.5);
              gloss = 0.07;
            #endif
          }
          if (k > 1.5 && k < 2.5) {
            alb = tri(vW, n, 1.4) * vec3(0.9, 0.86, 0.8);
            #ifdef HALL
              // the hall floor: polished chequered marble, cream and grey-green, 1.2 m squares
              vec2 cell = floor(vW.xz / 1.2); vec2 f = abs(fract(vW.xz / 1.2) - 0.5);
              float chk = mod(cell.x + cell.y, 2.0), joint = smoothstep(0.49, 0.498, max(f.x, f.y));
              alb = tri(vW + vec3(cell.x * 5.1, 0.0, cell.y * 3.7), n, 1.6) * mix(vec3(0.93, 0.9, 0.84), vec3(0.42, 0.47, 0.42), chk) * (1.0 - joint * 0.5);
              gloss = 0.16;
            #endif
          }
          if (k > 2.5 && k < 3.5) {               // travertine paving: big slabs with thin joints
            vec2 q = vW.xz / vec2(1.6, 0.8); q.x += step(1.0, mod(floor(q.y), 2.0)) * 0.5; vec2 f = abs(fract(q) - 0.5);
            float joint = smoothstep(0.492, 0.498, max(f.x, f.y) );
            alb = tri(vW, n, 2.0) * vec3(0.86, 0.8, 0.7) * (1.0 - joint * 0.45);
          }
          vec3 c = alb * L;
          if (k > 3.5) {                           // gold / bronze fittings: no diffuse, sun glint + sky
            vec3 metal = k < 4.5 ? vec3(0.95, 0.72, 0.38) : vec3(0.55, 0.36, 0.2);
            vec3 H = normalize(V + uSun); float sp = pow(max(dot(n, H), 0.0), 60.0) * 6.0;
            c = metal * (0.25 * L + sp * L * 0.4 + 0.15);
          } else c += vec3(gloss) * fres * L * 0.6 + gloss * L * 0.0;
          #ifdef HALL
            // polished stone catches each lamp: small warm glints that move as you walk
            vec3 sp = vec3(0.0);
            for (int i = 0; i < 8; i++) { vec3 l = uLamps[i] - vW; float d = length(l); l /= d; vec3 H = normalize(l + V);
              sp += vec3(1.0, 0.72, 0.42) * pow(max(dot(n, H), 0.0), k > 1.5 && k < 2.5 ? 180.0 : 60.0) * 14.0 / (1.0 + d * d * 0.05); }
            c += sp * gloss;
          #endif
          gl_FragColor = vec4(applyFog(c, vW), 1.0); }`}),pe=ge(j,he.lm.arch,!1),Ee=pe.uniforms;Ue=new xe(Q,pe),z.add(Ue),Promise.all([ja(t+"hall.pack"),Hi(be,t+"hall_lm.webp")]).then(([Ve,Bt])=>{let ft=Ve.toNonIndexed();ft.computeVertexNormals(),z.add(new xe(ft,ge(Bt,he.lm.hall*.125,!0)))}).catch(Ve=>console.error("[nomadiic-rt] hall",Ve)),W.computeBoundingBox();let Se=W.boundingBox,dt=Se.getSize(new T),Ct=Se.getCenter(new T),Jt=new Nr(new Ft(dt.x,dt.z),{textureWidth:Math.round(innerWidth*Math.min(devicePixelRatio,H.pr)*.5),textureHeight:Math.round(innerHeight*Math.min(devicePixelRatio,H.pr)*.5),shader:{name:"Pool",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null},...Pe},vertexShader:`uniform mat4 textureMatrix; varying vec4 vUv4; varying vec3 vW;
          void main(){ vUv4 = textureMatrix * vec4(position, 1.0); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`${mi} uniform sampler2D tDiffuse; varying vec4 vUv4; varying vec3 vW;
          float h(vec2 p){ return sin(p.x * 2.3 + uTime * 0.8) * sin(p.y * 1.9 - uTime * 0.6) * 0.6 + 0.3 * sin(p.x * 5.1 - p.y * 3.7 + uTime * 1.4) + 0.2 * sin(p.x * -7.3 + p.y * 6.1 - uTime * 1.9); }
          float rip(vec2 w){ float d = length(w - vec2(0.0, 45.1)); float inner = (1.0 - smoothstep(2.3, 2.6, d));
            return sin(d * 5.0 - uTime * 3.2) * exp(-max(d - 2.4, 0.0) * 0.16) * 0.9 * (1.0 - inner) + sin(d * 14.0 - uTime * 9.0) * 0.6 * inner; }
          void main(){
            vec2 e = vec2(0.05, 0.0); vec2 p = vW.xz * 0.7;
            vec2 slope = vec2(h(p + e.xy) - h(p - e.xy), h(p + e.yx) - h(p - e.yx));
            vec2 e2 = vec2(0.04, 0.0); slope += vec2(rip(vW.xz + e2.xy) - rip(vW.xz - e2.xy), rip(vW.xz + e2.yx) - rip(vW.xz - e2.yx)) * 1.6;
            vec3 n = normalize(vec3(-slope.x * 0.02, 1.0, -slope.y * 0.02));
            vec3 V = normalize(cameraPosition - vW);
            float fres = 0.04 + 0.96 * pow(clamp(1.0 - max(dot(n, V), 0.0), 0.0, 1.0), 5.0);
            vec4 uv = vUv4; uv.xy += slope * 0.004 * uv.w;
            vec3 refl = texture2DProj(tDiffuse, uv).rgb;
            vec3 c = mix(vec3(0.01, 0.018, 0.016), refl, clamp(fres * 1.25 + 0.25, 0.0, 1.0));
            gl_FragColor = vec4(applyFog(c, vW), 1.0); }`}});Jt.rotation.x=-Math.PI/2,Jt.position.set(Ct.x,Se.max.y+.02,Ct.z),Jt.camera.layers.set(0),z.add(Jt);let hn=rs(Lm(he.trees,H.clumps,Pe),z,{cell:40,pad:3,minCount:400});z.add(hn),Ie.push(hn);try{await Promise.race([document.fonts.load('120px "Nomadiic Line"'),Jo(1500)])}catch{}let Te=new Qi(jm("NOMADIIC HORSE DESIGNS"));Te.anisotropy=8,new xe(new Ft(19.5,.76),new ye({transparent:!0,depthWrite:!1,blending:Zc,premultipliedAlpha:!0,polygonOffset:!0,polygonOffsetFactor:-2,uniforms:{tT:{value:Te}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D tT; varying vec2 vUv;
        void main(){ float a = texture2D(tT, vUv).r; float up = texture2D(tT, vUv + vec2(0.0, 0.012)).r;
          float shade = mix(1.0, 0.42, a) + clamp(up - a, 0.0, 1.0) * 0.0 + clamp(a - up, 0.0, 1.0) * 0.55;   // dark groove, lit lower lip
          gl_FragColor = vec4(vec3(shade), 1.0); }`})).position.set(0,17.98,-20.9);{let Ve={base:19.95,apex:23.45,half:11.05},Bt=document.createElement("canvas");Bt.width=2048,Bt.height=330;let ft=Bt.getContext("2d");ft.fillStyle="#000",ft.fillRect(0,0,2048,330),ft.filter="blur(3px)";let Zn=!1,to=(Mt,bt,gn,vn,fi)=>{ft.save(),ft.translate(Mt,bt),ft.rotate(gn),ft.beginPath(),ft.ellipse(0,0,vn,fi,0,0,Math.PI*2),ft.fill(),ft.restore()};for(let Mt of Zn?[-1,1]:[]){ft.strokeStyle="#9a9a9a",ft.lineWidth=9,ft.beginPath();for(let bt=0;bt<=1.0001;bt+=.02){let gn=1024+Mt*(190+bt*760),vn=120+bt*150-Math.sin(bt*Math.PI)*50;bt===0?ft.moveTo(gn,vn):ft.lineTo(gn,vn)}ft.stroke(),ft.fillStyle="#e6e6e6";for(let bt=.03;bt<.98;bt+=.032){let gn=1024+Mt*(190+bt*760),vn=120+bt*150-Math.sin(bt*Math.PI)*50,Dn=(34-bt*16)*1.5;to(gn-Mt*Dn*.3,vn-Dn*.55,Mt*-.55,Dn,Dn*.42),to(gn-Mt*Dn*.3,vn+Dn*.55,Mt*.55,Dn,Dn*.42)}for(let bt=0;bt<5;bt++)ft.beginPath(),ft.arc(1024+Mt*(260+bt*150),150+bt*28-Math.sin(bt/5*Math.PI)*40,11,0,Math.PI*2),ft.fillStyle="#ffffff",ft.fill()}ft.filter="none";let Ws=new Qi(Bt);Ws.anisotropy=8;let sr=new Na;sr.moveTo(-Ve.half,0),sr.lineTo(Ve.half,0),sr.lineTo(0,Ve.apex-Ve.base),sr.closePath();let Zl=new zo(sr),Jl=Zl.attributes.position,P0=Zl.attributes.uv;for(let Mt=0;Mt<Jl.count;Mt++)P0.setXY(Mt,(Jl.getX(Mt)+Ve.half)/(2*Ve.half),Jl.getY(Mt)/(Ve.apex-Ve.base));let uM=Mt=>new ye({uniforms:{tM:{value:B},tR:{value:Ws}},vertexShader:"varying vec3 vW, vN; varying vec2 vUv; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform sampler2D tM, tR; varying vec3 vW, vN; varying vec2 vUv;
          void main(){ vec3 n = normalize(vN); ${Mt}
            vec3 m = texture2D(tM, vW.xy * 0.08 + vW.z * 0.03).rgb * vec3(1.0, 0.98, 0.95);
            float sun = max(dot(n, normalize(vec3(-0.35, 0.75, 0.55))), 0.0);
            gl_FragColor = vec4(m * (0.62 + 0.5 * sun) * vec3(0.99, 0.985, 0.975) + 0.05, 1.0); }`}),Gs=Je,Ql=rt.s.clone().multiplyScalar(.27),L0=new T,$l=Ve.base+1.62;Gs.boundingSphere||Gs.computeBoundingSphere();let hc=Gs.boundingSphere.radius*Ql.x*.93,Wt=192,Pi=48,eu={};try{let Mt=j.image,bt=Mt.width,gn=Mt.height,vn=document.createElement("canvas");vn.width=bt,vn.height=gn;let fi=vn.getContext("2d",{willReadFrequently:!0});fi.drawImage(Mt,0,0);let Dn=fi.getImageData(0,0,bt,gn).data,Xt=Q.attributes.position.array,ar=Q.attributes.uv.array,ms=Q.attributes.normal.array;for(let[tu,qs]of[[-20.68,1],[-59.32,-1]]){let Xs=[];for(let at=0,jt=Xt.length/9;at<jt;at++){let yt=at*9,xn=(Xt[yt]+Xt[yt+3]+Xt[yt+6])/3,Fn=(Xt[yt+1]+Xt[yt+4]+Xt[yt+7])/3,mn=(Xt[yt+2]+Xt[yt+5]+Xt[yt+8])/3;Math.abs(xn)>Ve.half+.6||Fn<Ve.base-.4||Fn>Ve.apex+.4||Math.abs(mn-tu)>1.6||(ms[yt+2]+ms[yt+5]+ms[yt+8])/3*qs<.5||Xs.push(at)}let Un=new Float32Array(Wt*Pi*3),Tr=new Uint8Array(Wt*Pi);for(let at=0;at<Pi;at++)for(let jt=0;jt<Wt;jt++){let yt=-Ve.half+(jt+.5)/Wt*2*Ve.half,xn=qs*yt,Fn=Ve.base+(at+.5)/Pi*(Ve.apex-Ve.base),mn=-1e9,Li=0,Gi=0;for(let _n of Xs){let Kt=_n*9,qi=Xt[Kt],Xi=Xt[Kt+1],gs=Xt[Kt+3],Ks=Xt[Kt+4],Ys=Xt[Kt+6],Zs=Xt[Kt+7],nu=(Ks-Zs)*(qi-Ys)+(Ys-gs)*(Xi-Zs);if(Math.abs(nu)<1e-9)continue;let no=((Ks-Zs)*(xn-Ys)+(Ys-gs)*(Fn-Zs))/nu,io=((Zs-Xi)*(xn-Ys)+(qi-Ys)*(Fn-Zs))/nu,dc=1-no-io;if(no<-1e-4||io<-1e-4||dc<-1e-4)continue;let If=(no*Xt[Kt+2]+io*Xt[Kt+5]+dc*Xt[Kt+8])*qs;if(If>mn){mn=If;let Js=_n*6;Li=no*ar[Js]+io*ar[Js+2]+dc*ar[Js+4],Gi=no*ar[Js+1]+io*ar[Js+3]+dc*ar[Js+5]}}if(mn>-1e8){let _n=Math.min(bt-1,Math.max(0,Li*bt|0)),Kt=Math.min(gn-1,Math.max(0,(1-Gi)*gn|0)),qi=(Kt*bt+_n)*4,Xi=(at*Wt+jt)*3;Un[Xi]=Dn[qi],Un[Xi+1]=Dn[qi+1],Un[Xi+2]=Dn[qi+2],Tr[at*Wt+jt]=1}}for(let at=0;at<40;at++){let jt=0;for(let yt=0;yt<Pi;yt++)for(let xn=0;xn<Wt;xn++){let Fn=yt*Wt+xn;if(Tr[Fn])continue;let mn=0,Li=0,Gi=0,_n=0;for(let[Kt,qi]of[[1,0],[-1,0],[0,1],[0,-1]]){let Xi=xn+Kt,gs=yt+qi;if(Xi<0||gs<0||Xi>=Wt||gs>=Pi||Tr[gs*Wt+Xi]!==1)continue;let Ks=(gs*Wt+Xi)*3;Li+=Un[Ks],Gi+=Un[Ks+1],_n+=Un[Ks+2],mn++}if(mn){let Kt=Fn*3;Un[Kt]=Li/mn,Un[Kt+1]=Gi/mn,Un[Kt+2]=_n/mn,Tr[Fn]=2}else jt++}for(let yt=0;yt<Tr.length;yt++)Tr[yt]===2&&(Tr[yt]=1);if(!jt)break}let js=new Float32Array(Un.length);for(let at=0;at<4;at++){for(let jt=0;jt<Pi;jt++)for(let yt=0;yt<Wt;yt++)for(let xn=0;xn<3;xn++){let Fn=0,mn=0;for(let Li=-2;Li<=2;Li++)for(let Gi=-14;Gi<=14;Gi++){let _n=Math.min(Wt-1,Math.max(0,yt+Gi)),Kt=Math.min(Pi-1,Math.max(0,jt+Li));Fn+=Un[(Kt*Wt+_n)*3+xn],mn++}js[(jt*Wt+yt)*3+xn]=Fn/mn}Un.set(js)}for(let at=0;at<Pi;at++)for(let jt=0;jt<3;jt++){let yt=0,xn=0,Fn=0,mn=0;for(let _n=0;_n<Wt;_n++){let Kt=_n/(Wt-1)-.5,qi=Un[(at*Wt+_n)*3+jt];yt+=Kt,xn+=qi,Fn+=Kt*Kt,mn+=Kt*qi}let Li=(Wt*mn-yt*xn)/Math.max(1e-6,Wt*Fn-yt*yt),Gi=(xn-Li*yt)/Wt;for(let _n=0;_n<Wt;_n++)Un[(at*Wt+_n)*3+jt]=Gi+Li*(_n/(Wt-1)-.5)}let or=new Uint8Array(Wt*Pi*4);for(let at=0;at<Wt*Pi;at++)or[at*4]=Un[at*3],or[at*4+1]=Un[at*3+1],or[at*4+2]=Un[at*3+2],or[at*4+3]=255;let cr=new Ls(or,Wt,Pi,Si);cr.magFilter=cr.minFilter=$t,cr.wrapS=cr.wrapT=ur,cr.needsUpdate=!0,eu[qs]=cr}}catch(Mt){console.warn("[nomadiic-rt] pediment light",Mt)}let I0=Mt=>{let bt=new Ut().setFromAxisAngle(new T(0,1,0),Mt).multiply(ke),gn=new et().compose(new T,bt,Ql),vn=Gs.attributes.position,fi=Gs.index,Dn=new T(0,0,Mt?-1:1),Xt=new T,ar=new T,ms=new T,tu=new T,qs=new T,Xs=new T,Un=new T,Tr=fi?fi.count/3:vn.count/3,js=[];for(let at=0;at<Tr;at++){let jt=fi?fi.getX(at*3):at*3,yt=fi?fi.getX(at*3+1):at*3+1,xn=fi?fi.getX(at*3+2):at*3+2;Xt.fromBufferAttribute(vn,jt).applyMatrix4(gn),ar.fromBufferAttribute(vn,yt).applyMatrix4(gn),ms.fromBufferAttribute(vn,xn).applyMatrix4(gn);let Fn=tu.subVectors(ar,Xt).cross(qs.subVectors(ms,Xt)),mn=Fn.length();mn<1e-12||js.push([Fn.clone().divideScalar(mn),mn,(Xt.dot(Dn)+ar.dot(Dn)+ms.dot(Dn))/3])}let or=1e9,cr=-1e9;for(let at of js)or=Math.min(or,at[2]),cr=Math.max(cr,at[2]);for(let at of js)if(at[2]>or+(cr-or)*.5){let jt=at[0].dot(Dn)<0?at[0].clone().negate():at[0];Xs.addScaledVector(jt,at[1])}return Xs.lengthSq()>0?Xs.normalize():Dn},Lf=(Mt,bt)=>new ye({uniforms:{...Pe,...s,tM:{value:B},tP:{value:eu[Mt]||null},uK:{value:he.lm.arch},uDir:{value:Mt},uHas:{value:eu[Mt]?1:0},uMf:{value:bt?I0(Mt>0?0:Math.PI):new T(0,0,Mt)},uMc:{value:new T(0,$l,Mt>0?-20.68+.3:-59.32-.3)}},defines:bt?{MED:""}:{},vertexShader:"varying vec3 vW, vN; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`${$o} ${mi} uniform sampler2D tM, tP; uniform float uK, uDir, uHas, uNight, uStorm; uniform vec3 uMf, uMc; varying vec3 vW, vN;
          vec3 tri(vec3 p, vec3 n, float s){ vec3 w = pow(abs(n), vec3(4.0)); w /= dot(w, vec3(1.0));
            return texture2D(tM, p.zy / s).rgb * w.x + texture2D(tM, p.xz / s).rgb * w.y + texture2D(tM, p.xy / s).rgb * w.z; }
          void main(){ vec3 n = normalize(vN); vec3 nf = vec3(0.0, 0.0, uDir);
            vec2 pu = clamp(vec2((uDir * vW.x + ${Ve.half.toFixed(3)}) / ${(2*Ve.half).toFixed(3)}, (vW.y - ${Ve.base.toFixed(3)}) / ${(Ve.apex-Ve.base).toFixed(3)}), 0.003, 0.997);
            vec3 L = uHas > 0.5 ? lmDecode(texture2D(tP, pu).rgb, uK) : vec3(0.75, 0.78, 0.8);
            if (uNight > 0.001) L = mix(L, pow(L, vec3(0.62)) * 0.82, uNight);   // night and storm: exactly as the temple stone
            L += vec3(0.16, 0.15, 0.14) * uStorm;
            vec3 alb = tri(vW, n, 3.2) * vec3(1.02, 1.0, 0.98);
            float shade = 1.0;
            #ifdef MED
              // carved relief: the same sun as the temple, normalised so the flat field of the medallion matches the wall exactly
              // a raking light across the carving (from the upper left, like the sun on the colonnade) and dark cut walls, so the
              // horse and wreath read as stone cut into stone; the flat field keeps exactly the wall's light
              // the coin is a heightfield relief (back at -0.1 m, field near +0.04, the horse and wreath up to +0.1): its smoothed
              // normals carry the modelling, lit by a raking sun and normalised so a face turned like the coin matches the wall;
              // the field sits a touch deeper in shade than the raised carving
              if (dot(n, uMf) < 0.0) n = -n;
              vec3 sd = normalize(vec3(-0.55 * uDir, 0.7, 0.45 * uDir));
              float lit = 0.12 + 0.88 * max(dot(n, sd), 0.0), flat0 = 0.12 + 0.88 * max(dot(uMf, sd), 0.0);
              float h = dot(vW - uMc, uMf);
              shade = clamp(pow(lit / flat0, 1.4), 0.3, 1.45) * mix(0.78, 0.98, smoothstep(0.02, 0.09, h));
            #else
              // a soft contact shadow where the medallion stands off the wall, falling a little down and away from the sun
              vec2 dd = vW.xy - vec2(0.0, ${$l.toFixed(3)}) - vec2(-uSun.x * uDir, -max(uSun.y, 0.2)) * 0.12; float r = length(dd);
              // (only the band just outside the rim, where the coin stands off the stone)
              shade = 1.0 - 0.2 * smoothstep(${(hc*.9).toFixed(3)}, ${(hc*.99).toFixed(3)}, r) * (1.0 - smoothstep(${(hc*1).toFixed(3)}, ${(hc*1.12).toFixed(3)}, r));
            #endif
            gl_FragColor = vec4(applyFog(alb * L * shade, vW), 1.0); }`});for(let[Mt,bt]of[[-20.68,0],[-59.32,Math.PI]]){let gn=new xe(Zl,Lf(bt?-1:1,!1));gn.position.set(0,Ve.base,Mt),gn.rotation.y=bt,z.add(gn);let vn=new xe(Gs,Lf(bt?-1:1,!0));vn.matrixAutoUpdate=!1,vn.matrix.compose(L0.set(0,$l,Mt+(bt?-.3:.3)),new Ut().setFromAxisAngle(new T(0,1,0),bt).multiply(ke),Ql),z.add(vn)}}try{await Promise.race([document.fonts.load("600 100px Satoshi"),Jo(1500)])}catch{}for(let Ve of Ld){let Bt=new Qi(Km(Ve.lines));Bt.anisotropy=8,Bt.colorSpace=Gt;let ft=new ei(4,1.46,.09),Zn=new xe(ft,new ye({uniforms:{...Pe,tT:{value:Bt},uLz:{value:Ve.z}},vertexShader:"varying vec2 vUv; varying vec3 vW, vN; varying float vFront; void main(){ vUv = uv; vFront = step(0.5, normal.z); vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform sampler2D tT; uniform float uTime, uLz; varying vec2 vUv; varying vec3 vW, vN; varying float vFront;
          void main(){
            vec3 base = vFront > 0.5 ? texture2D(tT, vUv).rgb : vec3(0.26, 0.16, 0.08);
            vec3 lin = pow(base, vec3(2.2));
            vec3 V = normalize(cameraPosition - vW); vec3 n = normalize(vN);
            vec3 lp = vec3(sign(vW.x) * 7.1, 9.95, uLz); vec3 l = normalize(lp - vW); vec3 H = normalize(l + V);
            float flick = 0.9 + 0.1 * sin(uTime * 7.0 + vW.z) * sin(uTime * 11.0);
            float lum = dot(lin, vec3(0.33)); float gold = smoothstep(0.18, 0.4, lum);                    // gilded letters are the bright parts
            vec3 c = lin * (0.55 + 0.9 * max(dot(n, l), 0.0)) * flick;
            c += mix(vec3(0.7, 0.45, 0.25), vec3(1.0, 0.78, 0.4), gold) * pow(max(dot(n, H), 0.0), mix(18.0, 60.0, gold)) * (0.5 + 1.5 * gold) * flick;
            c += lin * pow(clamp(1.0 - abs(dot(n, V)), 0.0, 1.0), 3.0) * 0.6;
            gl_FragColor = vec4(c * 1.15, 1.0); }`}));Zn.position.set(Ve.x+(Ve.x<0?.05:-.05),8.4,Ve.z),Zn.rotation.y=Ve.x<0?Math.PI/2:-Math.PI/2,z.add(Zn)}let Et=new gr([[0,0],[.38,.02],[.5,.18],[.54,.34],[.5,.36],[0,.3]].map(([Ve,Bt])=>new ue(Ve,Bt)),28),dn=new cn({color:new de("#8a5a2b"),metalness:.55,roughness:.4,emissive:new de("#3a2410")}),an=new Ft(.7,1.2);an.translate(0,.55,0);let fn=new ye({transparent:!0,depthWrite:!1,blending:Pt,uniforms:{uTime:Pe.uTime},vertexShader:"varying vec2 vUv; uniform float uTime; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0); mv.xy += position.xy * vec2(1.0, 1.0 + 0.08 * sin(uTime * 9.0)); gl_Position = projectionMatrix * mv; }",fragmentShader:`varying vec2 vUv; uniform float uTime;
        float n(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(n(i), n(i + vec2(1, 0)), f.x), mix(n(i + vec2(0, 1)), n(i + vec2(1, 1)), f.x), f.y); }
        void main(){ vec2 p = vUv - vec2(0.5, 0.08); float t = uTime * 2.6;
          float w = 0.32 * (1.0 - vUv.y) + 0.02; float d = abs(p.x + (vn(vec2(vUv.y * 4.0 - t, 1.0)) - 0.5) * 0.18 * vUv.y) / w;
          float body = (1.0 - smoothstep(0.55, 1.0, d)) * smoothstep(0.0, 0.08, vUv.y) * (1.0 - smoothstep(0.55, 1.0, vUv.y + (vn(vec2(vUv.x * 3.0, vUv.y * 5.0 - t)) - 0.5) * 0.25));
          vec3 col = mix(vec3(1.0, 0.85, 0.5), vec3(1.0, 0.35, 0.08), smoothstep(0.1, 0.8, vUv.y));
          gl_FragColor = vec4(col * body * 9.0, body); }`});for(let Ve of Ld){let Bt=Math.sign(Ve.x),ft=new T(Ve.x-Bt*.56,0,Ve.z),Zn=10.25,to=new xe(Et,dn);to.position.set(ft.x,Zn-.55,ft.z),z.add(to);let Ws=new xe(new vr(.05,.05,.58,8),dn);Ws.rotation.z=Math.PI/2,Ws.position.set(ft.x+Bt*.28,Zn-.5,ft.z),z.add(Ws);let sr=new xe(an,fn);sr.position.set(ft.x,Zn-.22,ft.z),sr.renderOrder=8,sr.frustumCulled=!1,z.add(sr)}let di=Gm(0,45.1,H.spray,Pe);z.add(di),ni=di,Wr();let Wi=()=>br({base:t,unpack:ja,loader:be,U:Pe,groundLm:se.uniforms.tLm.value,groundK:he.lm.ground,rect:se.uniforms.uRect.value,tier:k,scene:z,onPart:()=>{}}).then(async Ve=>{await q(Ve.group,Zt,Y,z),await Bi(Ve.group),z.add(Ve.group),Ie.push(Ve.group),qt=Ve.fade,Lt=Ve,fe()}).catch(Ve=>console.error("[nomadiic-rt] garden",Ve)).finally(()=>{y++,R()});Zt=new tn(2,2,{type:nn,minFilter:$t,magFilter:$t}),Hr=new tn(2,2,{type:nn,minFilter:$t,magFilter:$t}),xi=new xe(new Ft(Ll.size[0],Ll.size[1]),Za(Zt.texture)),xi.position.set(...Ll.pos),xi.visible=!1,z.add(xi),Wr();let _r=async()=>{await Wi();for(let Ve=0;Ve<At.length&&n;Ve++)await rf(Ve),y++,R();f=!0,R(),Re.set(-1,je(z)),await X(),ir(),zs||C(!0)};r||_r();let[pn,rr,ps,lc]=await Promise.all([Os(t+"terrain.json").then(Ve=>Ve.json()),ne(d0(t+"terrain.png")),ne(Hi(be,t+"mtn_c_s.webp")),Hi(be,t+"tex/rock_face_03_diff.webp",{srgb:!0,repeat:!0}).catch(()=>null)]),Gr=document.createElement("canvas");Gr.width=rr.width,Gr.height=rr.height;let uc=Gr.getContext("2d");uc.drawImage(rr,0,0);let Vs=uc.getImageData(0,0,Gr.width,Gr.height).data,Cf=Gr.width,Kl=k==="high"?1:2,eo=Math.floor((Cf-1)/Kl)+1,Yl=new Ft(pn.ext*2,pn.ext*2,eo-1,eo-1).rotateX(-Math.PI/2),Pf=Yl.attributes.position;for(let Ve=0;Ve<eo;Ve++)for(let Bt=0;Bt<eo;Bt++){let ft=(Ve*Kl*Cf+Bt*Kl)*4,Zn=(Vs[ft]*256+Vs[ft+1])/65535;Pf.setY(Ve*eo+Bt,pn.lo+Zn*(pn.hi-pn.lo))}Pf.needsUpdate=!0,Yl.computeBoundingSphere();let C0=Promise.all([Hi(be,t+"arch_lm.webp"),Hi(be,t+"ground_lm.webp"),Hi(be,t+"mtn_c.webp")]).then(([Ve,Bt,ft])=>{Ee.tLm.value=Ve,se.uniforms.tLm.value=Bt,Ce.tLm.value=Bt,ot.material.uniforms.tC.value=ft,fe(),z.traverse(Zn=>{Zn.isInstancedMesh&&Zn.material.uniforms&&Zn.material.uniforms.tLm&&(Zn.material.uniforms.tLm.value=Bt)})}).catch(()=>{});ot=new xe(Yl,new ye({transparent:!0,depthWrite:!0,uniforms:{...Pe,...s,tC:{value:ps},tR:{value:lc},uK:{value:he.lm.mtn},uA:Vt,uLo:{value:pn.lo},uHi:{value:pn.hi}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`${$o} ${mi} uniform sampler2D tC, tR; uniform float uK, uA, uLo, uHi, uStorm; varying vec3 vW;
        vec3 rockTri(vec3 p, vec3 n, float s){ vec3 w = pow(abs(n), vec3(4.0)); w /= dot(w, vec3(1.0));
          return texture2D(tR, p.zy * s).rgb * w.x + texture2D(tR, p.xz * s).rgb * w.y + texture2D(tR, p.xy * s).rgb * w.z; }
        void main(){ vec2 uv = vec2((vW.x + 2000.0) / 4000.0, (-vW.z + 2000.0) / 4000.0);
          vec3 base = lmDecode(texture2D(tC, uv).rgb, uK); float lum = dot(base, vec3(0.3, 0.59, 0.11));
          vec3 Nw = normalize(cross(dFdx(vW), dFdy(vW))); if (Nw.y < 0.0) Nw = -Nw;
          // rock strata and gullies at two scales, normalised so the bake's light is kept
          vec3 r1 = rockTri(vW, Nw, 1.0 / 60.0), r2 = rockTri(vW + 31.0, Nw, 1.0 / 9.0);
          vec3 detail = (r1 * 0.6 + r2 * 0.4) / max(dot(r1 * 0.6 + r2 * 0.4, vec3(0.333)), 0.05);
          float slope = 1.0 - Nw.y, hN = clamp((vW.y - uLo) / max(uHi - uLo, 1.0), 0.0, 1.0), nz = dot(r1, vec3(0.333));
          // carve the form: sun side bright, the far side in deep cool shade, gullies darker than ridges
          float sunSide = mix(clamp(dot(Nw, uSun), 0.0, 1.0), 0.35 + 0.25 * Nw.y, uStorm * 0.85); float gully = smoothstep(0.25, 0.75, nz);
          vec3 c = base * mix(vec3(1.0), detail, 0.85) * (0.42 + 1.05 * sunSide) * (0.75 + 0.35 * gully);
          c += vec3(0.05, 0.07, 0.11) * (1.0 - sunSide) * lum;                                              // sky light in the shade
          float veg = (1.0 - smoothstep(0.18, 0.42, hN + (nz - 0.4) * 0.15)) * (1.0 - smoothstep(0.32, 0.6, slope));      // forest on the lower slopes
          c = mix(c, lum * vec3(0.2, 0.3, 0.14) * mix(1.0, nz * 2.2, 0.7) * (0.5 + 0.9 * sunSide), veg * 0.8);
          float snow = smoothstep(0.6, 0.74, hN + (nz - 0.45) * 0.18) * (1.0 - smoothstep(0.42, 0.68, slope));               // snow where it can lie
          c = mix(c, vec3(0.93, 0.95, 1.0) * max(lum, 0.12) * 2.3, snow);
          float d = length(vW - cameraPosition);
          c = mix(c, vec3(0.6, 0.7, 0.84) * 0.85, (1.0 - exp(-d * 0.00032)) * 0.55);                       // aerial perspective: every ridge bluer than the last
          vec3 f = applyFog(c, vW); f = mix(c, f, 0.5);
          if (uStorm > 0.001) {                    // in the storm: veils of rain between the ridges, the summits lost in the cloud deck
            float veil = 1.0 - exp(-d * 0.00065);
            float drift = nz * 0.35 + 0.5 * sin(vW.x * 0.004 + uTime * 0.05) * sin(vW.z * 0.003 - uTime * 0.04);
            float cloud = smoothstep(0.7, 0.95, hN + drift * 0.25) * 0.8;   // only the highest summits go into the cloud
            vec3 sc = mix(f, vec3(0.27, 0.29, 0.33), veil * 0.7);
            sc = mix(sc, vec3(0.3, 0.32, 0.36), cloud * 0.92);
            f = mix(f, sc, uStorm);
          }
          gl_FragColor = vec4(f, uA); }`})),ot.renderOrder=0,z.add(ot),Ie.push(ot),r&&(await C0,await q(z,Zt),await Bi(z),m=!0,y++,R(),_r())})();sf.catch(L=>{console.error("[nomadiic-rt] stage 2",L),h&&h.fail()});let w0=new tn(2,2,{type:nn,samples:H.msaa}),Ci=new Wo(D,w0),Vr=new Go(z,Y);Ci.addPass(Vr);let Bl=new xr({uniforms:{tDiffuse:{value:null},uPx:{value:new ue(1,1)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D tDiffuse; varying vec2 vUv;
      bool bad(vec3 c){ return any(isnan(c)) || any(isinf(c)); }
      void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb;
        if (bad(c)) { vec2 px = 1.0 / vec2(textureSize(tDiffuse, 0)); vec3 s = vec3(0.0); float n = 0.0;
          for (int i = -1; i <= 1; i++) for (int j = -1; j <= 1; j++) { vec3 t = texture2D(tDiffuse, vUv + vec2(i, j) * px).rgb; if (!bad(t)) { s += t; n += 1.0; } }
          c = n > 0.0 ? s / n : vec3(0.0); }
        gl_FragColor = vec4(min(max(c, vec3(0.0)), vec3(12.0)), 1.0); }`});Ci.addPass(Bl),k!=="high"&&(Bl.enabled=!1);let fs=new xr({uniforms:{tDiffuse:{value:null},uSun:{value:new ue(.5,.8)},uOn:{value:0},uThresh:{value:.7},uTint:{value:new de(1,.9,.72)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D tDiffuse; uniform vec2 uSun; uniform float uOn, uThresh; uniform vec3 uTint; varying vec2 vUv;
      void main(){ vec3 base = texture2D(tDiffuse, vUv).rgb;
        if (uOn < 0.001) { gl_FragColor = vec4(base, 1.0); return; }
        vec2 d = (vUv - uSun) * (0.92 / 40.0); vec2 p = vUv; vec3 acc = vec3(0.0); float w = 1.0;
        for (int i = 0; i < 40; i++) { p -= d; vec3 s = texture2D(tDiffuse, p).rgb; float l = dot(s, vec3(0.3333));
          acc += s * clamp((l - uThresh) / max(l, 1e-3), 0.0, 1.0) * w; w *= 0.955; }
        vec3 add = acc * (uOn / 40.0) * uTint; add = add / (1.0 + dot(add, vec3(0.3333)));    // rays brighten, never white out the frame
        gl_FragColor = vec4(base + add * 0.9, 1.0); }`});Ci.addPass(fs),k!=="high"&&(fs.enabled=!1);let Sr=new kr(new ue(2,2),.22,.6,1.6),sc=Sr.materialHighPassFilter;sc.fragmentShader=sc.fragmentShader.replace("vec4 texel = texture2D( tDiffuse, vUv );","vec4 texel = texture2D( tDiffuse, vUv ); if (texel.r != texel.r || texel.g != texel.g || texel.b != texel.b) texel = vec4(0.0); texel.rgb = min(texel.rgb, vec3(4.0));"),sc.needsUpdate=!0,Ci.addPass(Sr);let Vl={uniforms:{tDiffuse:{value:null},uTime:{value:0},uRes:{value:new ue(1,1)},uVeil:{value:0},uVeilCol:{value:new de(.96,.93,.88)},uSat:{value:1.22},uCon:{value:.38},uWarm:{value:0},uNight:{value:0},uFlash:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform sampler2D tDiffuse; uniform float uTime, uVeil, uSat, uCon, uWarm, uNight, uFlash; uniform vec2 uRes; uniform vec3 uVeilCol; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime) * 43758.5453); }
      void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb;
        c = mix(c, c * c * (3.0 - 2.0 * c), uCon);
        float l = dot(c, vec3(0.2126, 0.7152, 0.0722)); c = mix(vec3(l), c, uSat);
        c *= vec3(1.0 + uWarm * 0.06, 1.0, 1.0 - uWarm * 0.08);
        c = mix(c, c + vec3(0.02, 0.025, 0.04) * (1.0 - l), max(-uWarm, 0.0) * 0.6);
        if (uNight > 0.001) {
          float L = dot(c, vec3(0.2126, 0.7152, 0.0722));
          vec3 st = mix(vec3(L), c, 0.5) * vec3(0.6, 0.72, 1.0) * 0.72 + vec3(0.006, 0.01, 0.022);
          st = st * st * (3.0 - 2.0 * st) * 0.35 + st * 0.65;
          st = mix(st, c * 0.92, smoothstep(0.14, 0.34, (c.r - c.b) / max(c.r, 1e-3)) * smoothstep(0.015, 0.08, L));
          st += vec3(0.6, 0.68, 0.9) * uFlash * (0.12 + 0.75 * L);
          c = mix(c, st, uNight);
        }
        vec2 d = vUv - 0.5; c *= 1.0 - 0.32 * smoothstep(0.2, 0.85, dot(d, d) * 2.2);
        c += (h(vUv * uRes) - 0.5) * 0.018;
        c = mix(c, uVeilCol, uVeil);
        gl_FragColor = vec4(c, 1.0); }`};Sr.render=(L,j,B)=>{let W=Sr;L.getClearColor(W._oldClearColor),W.oldClearAlpha=L.getClearAlpha();let Q=L.autoClear;L.autoClear=!1,L.setClearColor(W.clearColor,0),W.highPassUniforms.tDiffuse.value=B.texture,W.highPassUniforms.luminosityThreshold.value=W.threshold,W.fsQuad.material=W.materialHighPassFilter,L.setRenderTarget(W.renderTargetBright),L.clear(),W.fsQuad.render(L);let te=W.renderTargetBright;for(let ge=0;ge<W.nMips;ge++){let pe=W.separableBlurMaterials[ge];W.fsQuad.material=pe,pe.uniforms.colorTexture.value=te.texture,pe.uniforms.direction.value=kr.BlurDirectionX,L.setRenderTarget(W.renderTargetsHorizontal[ge]),L.clear(),W.fsQuad.render(L),pe.uniforms.colorTexture.value=W.renderTargetsHorizontal[ge].texture,pe.uniforms.direction.value=kr.BlurDirectionY,L.setRenderTarget(W.renderTargetsVertical[ge]),L.clear(),W.fsQuad.render(L),te=W.renderTargetsVertical[ge]}W.fsQuad.material=W.compositeMaterial,W.compositeMaterial.uniforms.bloomStrength.value=W.strength,W.compositeMaterial.uniforms.bloomRadius.value=W.radius,W.compositeMaterial.uniforms.bloomTintColors.value=W.bloomTintColors,L.setRenderTarget(W.renderTargetsHorizontal[0]),L.clear(),W.fsQuad.render(L),L.setClearColor(W._oldClearColor,W.oldClearAlpha),L.autoClear=Q};let ri=new xr(new za({uniforms:{tDiffuse:{value:null},tBloom:{value:Sr.renderTargetsHorizontal[0].texture},uBloom:{value:1},uScrub:{value:k!=="high"?1:0},toneMappingExposure:{value:1},uTime:{value:0},uRes:{value:new ue(1,1)},uVeil:{value:0},uVeilCol:{value:new de(.96,.93,.88)},uSat:{value:1.22},uCon:{value:.38},uWarm:{value:0},uNight:{value:0},uFlash:{value:0}},glslVersion:Qc,vertexShader:`precision highp float; uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix; in vec3 position; in vec2 uv; out vec2 vUv;
      void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`precision highp float;
      #define texture2D texture
      uniform sampler2D tDiffuse, tBloom; uniform float uBloom, uScrub; uniform float uTime, uVeil, uSat, uCon, uWarm, uNight, uFlash; uniform vec2 uRes; uniform vec3 uVeilCol; in vec2 vUv; out vec4 fragOut;
      #include <tonemapping_pars_fragment>
      #include <colorspace_pars_fragment>
      bool bad(vec3 c){ return any(isnan(c)) || any(isinf(c)); }
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime) * 43758.5453); }
      void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb;
        if (uScrub > 0.5) {                                                 // (phones) the safety net, as the scrub pass does it
          if (bad(c)) { vec2 px = 1.0 / vec2(textureSize(tDiffuse, 0)); vec3 s = vec3(0.0); float n = 0.0;
            for (int i = -1; i <= 1; i++) for (int j = -1; j <= 1; j++) { vec3 t = texture2D(tDiffuse, vUv + vec2(i, j) * px).rgb; if (!bad(t)) { s += t; n += 1.0; } }
            c = n > 0.0 ? s / n : vec3(0.0); }
          c = min(max(c, vec3(0.0)), vec3(12.0)); }
        if (uBloom > 0.5) { vec4 b = texture2D(tBloom, vUv); c += b.rgb * b.a; }   // the bloom, as its additive blend (source alpha, one) added it
        c = AgXToneMapping(c);                                                // three's OutputPass: exposure + AgX, then the sRGB curve
        c = sRGBTransferOETF(vec4(c, 1.0)).rgb;
        c = mix(c, c * c * (3.0 - 2.0 * c), uCon);                       // punchy contrast, like Blender's AgX Punchy
        float l = dot(c, vec3(0.2126, 0.7152, 0.0722)); c = mix(vec3(l), c, uSat);
        c *= vec3(1.0 + uWarm * 0.06, 1.0, 1.0 - uWarm * 0.08);           // each world's time of day: warm afternoons, cool nights
        c = mix(c, c + vec3(0.02, 0.025, 0.04) * (1.0 - l), max(-uWarm, 0.0) * 0.6);   // night: lifted cool shadows
        if (uNight > 0.001) {                                                // a thunderstorm in daylight: overcast, cooler, a little darker
          float L = dot(c, vec3(0.2126, 0.7152, 0.0722));
          vec3 st = mix(vec3(L), c, 0.5) * vec3(0.6, 0.72, 1.0) * 0.72 + vec3(0.006, 0.01, 0.022);
          st = st * st * (3.0 - 2.0 * st) * 0.35 + st * 0.65;                  // storm light: flat, heavy, a little contrast
          st = mix(st, c * 0.92, smoothstep(0.14, 0.34, (c.r - c.b) / max(c.r, 1e-3)) * smoothstep(0.015, 0.08, L));   // gold, fire and lamplight keep their colour
          st += vec3(0.6, 0.68, 0.9) * uFlash * (0.12 + 0.75 * L);            // lightning lights the whole scene for an instant
          c = mix(c, st, uNight);
        }
        vec2 d = vUv - 0.5; c *= 1.0 - 0.32 * smoothstep(0.2, 0.85, dot(d, d) * 2.2);
        c += (h(vUv * uRes) - 0.5) * 0.018;
        c = mix(c, uVeilCol, uVeil);                                         // the light you step into between worlds
        fragOut = vec4(c, 1.0); }`}));ri.material.defines={AGX_TONE_MAPPING:"",SRGB_TRANSFER:""},Ci.addPass(ri);let Gn=Fs,yi=Fs,af=0,M0=0,Wl=0,tM=0,hi=D.domElement,ac=()=>{let L=sn<0?-1:sn-1;for(let j=Math.max(0,sn);j<At.length&&st(j);j++)L=j;return L<0?st(0)?Sn[0][1]:Mr*.9:L+1<At.length&&!st(L+1)?Sn[L][0]+(Sn[L][1]-Sn[L][0])*.8:Sn[L][1]},E0=()=>{let L=sn<0?-1:sn-1;for(let j=Math.max(0,sn);j<At.length&&st(j);j++)L=j;return L<0?!st(0):L+1<At.length&&!st(L+1)},oc=()=>Fs,of=L=>{L.preventDefault(),!V&&(Gn=ht.clamp(Gn+L.deltaY*32e-5*Mr,oc(),ac()))},cc=null,cf=L=>{cc=L.touches[0].clientY},lf=L=>{if(cc==null||V)return;let j=L.touches[0].clientY;Gn=ht.clamp(Gn+(cc-j)*.0011*Mr,oc(),ac()),cc=j,L.preventDefault()},uf=L=>{let j=hi.getBoundingClientRect();if(af=((L.clientX-j.left)/j.width-.5)*2,M0=((L.clientY-j.top)/j.height-.5)*2,Ne.drag){let B=L.clientX-Ne.x;Ne.x=L.clientX,Ne.a+=B*.012,Ne.v=ht.clamp(B*.012/Math.max(yf,1/120),-12,12)}},hf=L=>{yi/Mr*Ga<Fs*.9&&(Ne.drag=!0,Ne.x=L.clientX,hi.style.cursor="grabbing")},df=()=>{Ne.drag=!1,hi.style.cursor=yi/Mr*Ga<Fs*.9?"grab":""};hi.addEventListener("pointerdown",hf),addEventListener("pointerup",df);let ff=L=>{u||((L.key==="ArrowDown"||L.key==="PageDown"||L.key===" ")&&(Gn=Math.min(ac(),Gn+.03)),(L.key==="ArrowUp"||L.key==="PageUp")&&(Gn=Math.max(oc(),Gn-.03)))};hi.addEventListener("wheel",of,{passive:!1}),hi.addEventListener("touchstart",cf,{passive:!0}),hi.addEventListener("touchmove",lf,{passive:!1}),hi.addEventListener("pointermove",uf),addEventListener("keydown",ff);let wt={pr:Math.min(devicePixelRatio,H.pr),acc:0,n:0,hold:0},Wr=()=>{let L=i.clientWidth||innerWidth,j=i.clientHeight||innerHeight,B=Math.min(devicePixelRatio,H.pr,wt.pr);D.setPixelRatio(B),Ci.setPixelRatio(B),D.setSize(L,j,!1),Ci.setSize(L,j),Y.aspect=L/j,Y.fov=ht.lerp(he.fov,66,ht.clamp((1.2-Y.aspect)/.7,0,1)),Y.updateProjectionMatrix(),ri.uniforms.uRes.value.set(L*D.getPixelRatio(),j*D.getPixelRatio()),Ce.uPxAng.value=2*Math.tan(ht.degToRad(Y.fov)/2)/(j*D.getPixelRatio());let W=j*D.getPixelRatio()*.5/Math.tan(ht.degToRad(Y.fov)/2);if(ni&&(ni.material.uniforms.uPx.value=W),Zt){let Q=D.getPixelRatio();Zt.setSize(Math.round(L*Q),Math.round(j*Q));for(let te of[xi,...vt.map(ge=>ge&&ge.portalQuad)])te&&te.material.uniforms.uRes.value.set(L*Q,j*Q)}vt.forEach(Q=>Q&&Q.setPx(W))},pf=new ResizeObserver(Wr);pf.observe(i),Wr();let mf=()=>{Wr(),matchMedia(`(resolution: ${devicePixelRatio}dppx)`).addEventListener("change",mf,{once:!0})};mf();let nM=new Ut,iM=new Ut,gf=new Ut,S0=new Rn,rM=new et,sM=new et,aM=new T,oM=new T,cM=new T,lM=new T,Gl=new T,_0=os(),vf=new T,xf=new T,bf=new Ut,T0=new T(0,1,0),ql=new T,yf=1/60;function A0(L,j,B){let W=ht.clamp(L,0,1)*Ga;_0.sample(W,vf,xf),Y.position.copy(vf),Y.lookAt(xf);let Q=Math.abs(Gn-yi)<.002&&!Ne.drag?1:0;return Wl+=(af*Q-Wl)*.02,gf.setFromEuler(S0.set(0,-Wl*.025,0,"YXZ")),Y.quaternion.multiply(gf),u&&(Ne.a=0,Ne.v=0),Ne.drag||(Ne.a+=Ne.v*B,Ne.v+=(.22-Ne.v)*(1-Math.exp(-B*.9))),ve.lookAt(Y.position.x,rt.p.y,Y.position.z),bf.copy(ve.quaternion).multiply(new Ut().setFromAxisAngle(T0,Ne.a)).multiply(ke),ql.copy(rt.p),ql.y+=Math.sin(j*.9)*.12,De.matrix.compose(ql,bf,rt.s),De.visible=Y.position.z>40,W}let wf=new et,Mf=new Ps,Ef=new An,Sf=new de(.95,.9,.82),Vi=new T,_f=new T,Tf={palace:{rays:.35,thresh:.85,sat:1.18,con:.36,warm:.3},mithraki:{rays:.3,thresh:.9,sat:1.12,con:.34,warm:.2},revisetax:{rays:.55,thresh:.8,sat:1.12,con:.36,warm:.4},bisikaapi:{rays:.9,thresh:.62,sat:1.18,con:.4,warm:.25},glavida:{rays:.3,thresh:.75,sat:1.15,con:.38,warm:.1},innovious:{rays:.4,thresh:.8,sat:1.15,con:.34,warm:-.3},houseofmoh:{rays:.45,thresh:.7,sat:1.1,con:.34,warm:.15},cosmos:{rays:.15,thresh:.85,sat:1.05,con:.36,warm:-.8},perseid:{rays:0,thresh:1,sat:1.1,con:.3,warm:-.5}},Xl=null;document.fonts.load("600 150px Satoshi").catch(()=>{}).finally(()=>{Xl=Ja(["Nomadiic Horse Designs"],z)});let R0=(L,j)=>{let B=Xl,W=ht.smoothstep(j,.5,2.6)*(1-ht.smoothstep(L,Fs*.75,Fs*1.15));if(B.visible=W>.001,!B.visible)return;let Q=18,te=Math.tan(ht.degToRad(Y.fov/2)),ge=ht.clamp((1.1-Y.aspect)/.6,0,1);ic.set(0,0,-1).applyQuaternion(Y.quaternion),rc.set(0,1,0).applyQuaternion(Y.quaternion),B.position.copy(Y.position).addScaledVector(ic,Q).addScaledVector(rc,Q*te*ht.lerp(.62,.5,ge)),B.quaternion.copy(Y.quaternion),B.scale.setScalar(2*Q*te*Y.aspect*ht.lerp(.62,.9,ge)/20),B.u.uTime.value=j,B.u.uAssemble.value=W,B.u.uOpacity.value=ht.smoothstep(W,.2,.7),B.u.uDance.value=.3+(1-W)*2.2,B.userData.halo.material.uniforms.uA.value=W*.6};e.debug&&(window.__gpuoff=new Set);let jl=new Ha,Af=0,Rf=!0;function $a(){if(!Rf)return;Af=requestAnimationFrame($a);let L=Math.min(jl.getDelta(),.05),j=jl.elapsedTime;yi+=(Gn-yi)*(1-Math.exp(-L*3.2)),yf=L;e.onProgressUpdate&&e.onProgressUpdate(yi,Gn);let B=-1;for(let Te=0;Te<At.length;Te++)yi>=Sn[Te][0]&&st(Te)&&(B=Te);B!==sn&&(sn=B,ir());{let Te=ds;Gn<yi-4e-4?ds=!0:Gn>yi+4e-4&&(ds=!1),Te!==ds&&ir()}Zt&&y0(B);{let Te=B<0&&Y.position.z<-27;for(let $e of Ie)$e.visible=!Te}let W,Q,te;if(B>=0){let Te=vt[B],$e=(yi-Sn[B][0])/(Sn[B][1]-Sn[B][0]);Te.pose($e,Y),Te.update(j,L,$e,Y),vt.forEach(Et=>{if(Et&&Et!==Te)for(let dn of Et.huds||[])dn.H.visible=!1});for(let Et of Te.huds||[])x0(Et.H,Et.at,$e,j);Vr.scene=Te.scene,D.toneMappingExposure=Te.exposure,De.visible=!1,W=Te.exit,Q=Te.portalQuad,te=st(B+1)?vt[B+1]:null,z.visible&&xi&&(xi.visible=!1)}else{let Te=A0(yi/Mr,j,L);Vr.scene=z,Xl&&R0(Te,j-d),D.toneMappingExposure=e.exposure??.95,W=Qw,Q=xi,te=st(0)?vt[0]:null}vt.forEach(Te=>{Te&&Te.portalQuad&&Te.portalQuad!==Q&&(Te.portalQuad.visible=!1)}),B>=0&&xi&&(xi.visible=!1),Cd(Vr.scene,Y.position);let ge=W.origin,pe=Math.hypot(Y.position.x-ge[0],Y.position.z-ge[2]),Ee=B>=0?vt[B].entry.origin:null,Se=Ee?Math.hypot(Y.position.x-Ee[0],Y.position.z-Ee[2]):99,dt=pe<1.6||Se<1||B<0&&Y.position.z<-44||B>=0&&vt[B].closeUp?.(Y.position);if(Y.near<.5!==dt&&(Y.near=dt?.08:1,Y.updateProjectionMatrix()),Q){Q.updateMatrixWorld(),Y.updateMatrixWorld(),wf.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),Mf.setFromProjectionMatrix(wf),Q.geometry.boundingSphere||Q.geometry.computeBoundingSphere(),Ef.copy(Q.geometry.boundingSphere).applyMatrix4(Q.matrixWorld),Q.visible=Mf.intersectsSphere(Ef)&&(B>=0||Y.position.z<-22);let Te=Q.material.uniforms,$e=!!te;{let Et=B>=0&&vt[B].scene.background?vt[B].scene.background:Pe.uFogCol.value;Te.uFog.value.set(Et.r,Et.g,Et.b,ht.smoothstep(pe,22,120)*.88)}if(Te.uReady.value=$e?1:0,$e||Te.uCol.value.copy(B>=0&&vt[B].scene.background?vt[B].scene.background:Sf).lerp(Sf,.5),Q.visible&&$e){let Et=Zt;Te.tP.value=Et.texture;let dn=Zm(te.entry,W);Vn.copy(Y),Vn.matrixAutoUpdate=!1,Vn.matrixWorld.multiplyMatrices(dn,Y.matrixWorld),Vn.matrixWorldInverse.copy(Vn.matrixWorld).invert(),Vn.near=.08,Vn.updateProjectionMatrix(),Vn.matrixWorld.decompose(Vn.position,Vn.quaternion,Vn.scale),te.update(j,L,0,Vn),Cd(te.scene,Vn.position);let an=1,fn=1,di=-1,Wi=-1,_r=Q.geometry.attributes.position;for(let Vs=0;Vs<_r.count;Vs++){if(Vi.fromBufferAttribute(_r,Vs).applyMatrix4(Q.matrixWorld).project(Y),Vi.z>1){an=-1,fn=-1,di=1,Wi=1;break}an=Math.min(an,Vi.x),di=Math.max(di,Vi.x),fn=Math.min(fn,Vi.y),Wi=Math.max(Wi,Vi.y)}let pn=Et.width,rr=Et.height,ps=Math.max(0,Math.floor((an*.5+.5)*pn)-2),lc=Math.max(0,Math.floor((fn*.5+.5)*rr)-2),Gr=Math.min(pn,Math.ceil((di*.5+.5)*pn)+2)-ps,uc=Math.min(rr,Math.ceil((Wi*.5+.5)*rr)+2)-lc;Et.scissor.set(ps,lc,Math.max(1,Gr),Math.max(1,uc)),Et.scissorTest=!0,D.setRenderTarget(Et),D.render(te.scene,Vn),Et.scissorTest=!1,D.setRenderTarget(null)}}let Ct=0;for(let Te=0;Te<At.length;Te++)if(At[Te].veil){let $e=1-ht.smoothstep(Math.abs(yi-Sn[Te][0]),4e-4,.0075);$e>Ct&&(Ct=$e,ri.uniforms.uVeilCol.value.setRGB(...At[Te].veil))}ri.uniforms.uVeil.value=Ct;{let Te=B>=0?At[B].key:"palace",$e=Tf[Te]||Tf.palace,Et=B>=0?vt[B].sun:ze,dn=B<0&&Y.position.z<-24;if(Et&&$e.rays>0&&!dn){Vi.copy(Y.position).addScaledVector(Et,1e3).project(Y),Y.getWorldDirection(_f);let fn=ht.smoothstep(_f.dot(Et),.05,.45),di=1-ht.smoothstep(Math.hypot(Vi.x,Vi.y),1,1.8);fs.uniforms.uSun.value.set(Vi.x*.5+.5,Vi.y*.5+.5),fs.uniforms.uOn.value=$e.rays*fn*di*(1-Ct),fs.uniforms.uThresh.value=$e.thresh}else fs.uniforms.uOn.value=0;let an=ri.uniforms;an.uSat.value+=($e.sat-an.uSat.value)*.05,an.uCon.value+=($e.con-an.uCon.value)*.05,an.uWarm.value+=($e.warm-an.uWarm.value)*.05}let Jt=yi;if(ce.update(Jt,j),ce.setBusy&&ce.setBusy(!u&&(E0()&&Gn>=ac()-.004||sn>0&&!vt[sn-1]&&Gn<=oc()+.004)),j>6&&qt&&qt.value>=1&&(wt.acc+=L,wt.n++,wt.acc>1.2)){let Te=wt.n/wt.acc;wt.acc=0,wt.n=0,wt.hold=Math.max(0,wt.hold-1);let $e=Math.min(devicePixelRatio,H.pr),Et=typeof document<"u"&&document.hidden;if(wt.low=!Et&&Te<40?(wt.low||0)+1:0,wt.fast=Te>57?(wt.fast||0)+1:0,wt.low>=4&&wt.hold===0&&(wt.q||0)<4){if(wt.q=(wt.q||0)+1,wt.hold=4,wt.low=0,wt.q===1)for(let[dn,an]of[[ie.geometry,.55],[le.geometry,.6]]){let fn=dn.index?dn.index.count:dn.attributes.position.count;dn.setDrawRange(0,Math.floor(fn*an/3)*3)}else wt.q===2?fs.enabled=!1:(wt.pr=Math.max(1,wt.pr-.25),Wr());e.debug&&console.log("[nomadiic-rt] quality step",wt.q,"pr",wt.pr)}else wt.fast>=5&&wt.hold===0&&wt.pr<$e&&(wt.pr=Math.min($e,wt.pr+.25),wt.hold=6,wt.fast=0,wt.q=Math.max(2,(wt.q||0)-1),Wr())}if(qt&&qt.value<1&&(qt.value=Math.min(1,qt.value+L*.7)),Pe.uTime.value=j,ri.uniforms.uTime.value=j%10,ri.uniforms.toneMappingExposure.value=D.toneMappingExposure,ri.uniforms.uBloom.value=Sr.enabled?1:0,B<0)Qe.update(j,L,Pe.uFogCol.value,9e-4),Fe.update(j,L),Fe.mesh.visible=a>.05;else{if(!nr[B]&&vt[B]){nr[B]=nc(At[B].key);for(let $e of nr[B])vt[B].scene.add($e.mesh)}let Te=vt[B].scene.background||Pe.uFogCol.value;for(let $e of nr[B]||[])$e.leaves?$e.update(j,L,Y,Te,.03):$e.update(j,L,Te,.0012)}if(r){let Te=Y.position.z,$e=B>=0?At[B].key:"palace",Et=Y.position.y,dn=0,an=0,fn=1;B<0?(dn=ht.smoothstep(Te,-30,-16),fn=ht.smoothstep(Te,-26,-18)):$e==="glavida"?(dn=1,an=-23,fn=Et>-24?1:0):$e==="houseofmoh"&&(dn=1,fn=Et>.3?1:0),a+=(dn-a)*Math.min(1,L*3),vt.forEach((pn,rr)=>{if(pn&&pn.sky&&(At[rr].key==="glavida"||At[rr].key==="houseofmoh")){let ps=pn.sky.material.uniforms;ps.uStorm.value=1,ps.uT.value=j}});let di=u?0:l.update(L,a>.3&&fn>.5);l.strikeId!==o&&(o=l.strikeId,!u&&a>.3&&fn>.5&&c.strike(Y,an));let Wi=Vr.scene;I.parent!==Wi&&Wi.add(I),c.group.parent!==Wi&&Wi.add(c.group),c.update(di*a*fn),ri.uniforms.uNight.value=B<0?0:a*($e==="houseofmoh"?.55:1),we.material.uniforms.uNight.value=B<0?a:0,we.material.uniforms.uFlash.value=di,we.material.uniforms.uT.value=j;let _r=B>=0?vt[B].sky:null;_r&&_r.material.uniforms.uStorm.value>0&&(_r.material.uniforms.uFlash.value=di),s.uStorm.value=B<0?a:0,I.visible=a*fn>.01,I.material.uniforms.uA.value=a*fn,I.material.uniforms.uFl.value=di;{let pn=a*fn;!u&&Math.abs(pn-l.mix)>.04&&l.setMix(pn)}{let pn=$e==="bisikaapi"?"forest":$e==="houseofmoh"&&fn>.5?"sea":"";!u&&pn!==l.amb&&l.setAmb(pn)}}if(Y.getWorldDirection(Gl),Ce.uCenter.value.set(Y.position.x+Gl.x*34,Y.position.z+Gl.z*34),ot&&Vt.value<1&&(Vt.value=Math.min(1,Vt.value+L*.8)),r&&u){Je.boundingSphere||Je.computeBoundingSphere();let Te=Je.boundingSphere;tt.copy(Te.center).applyMatrix4(De.matrix),Be.set(0,1,0).applyQuaternion(Y.quaternion).multiplyScalar(Te.radius*rt.s.x*.86).add(tt),tt.project(Y),Be.project(Y);let $e=i.clientWidth||innerWidth,Et=i.clientHeight||innerHeight;h.setTarget((tt.x*.5+.5)*$e,(.5-tt.y*.5)*Et,Math.hypot((Be.x-tt.x)*.5*$e,(Be.y-tt.y)*.5*Et))}let hn=e.debug&&window.__gpuoff&&window.__gpuoff.size?window.__gpuoff:null;if(e.debug&&(Sr.enabled=!0,ri.enabled=!0),hn){Sr.enabled=!hn.has("nobloom"),ri.enabled=!hn.has("nograde");let Te=Vr.scene;if(Te.traverse($e=>{$e.isReflector&&hn.has("norefl")&&($e.visible=!1),$e.userData.hud===void 0&&$e.isPoints&&hn.has("nohud")&&($e.visible=!1)}),hn.has("nograss")&&(ie.visible=le.visible=!1),hn.has("noportal")&&Q&&(Q.visible=!1),hn.has("nosky")&&Te.children)for(let $e of Te.children)$e.renderOrder===-1&&$e.isMesh&&($e.visible=!1)}!u||h.diving?Ci.render(L):h.showing&&($a.warmN||0)<3&&($a.warmN=($a.warmN||0)+1,Ci.render(L))}return $a(),M(1,"ready"),v=!0,R(),e.debug&&(window.__checkDropped=()=>{let L=[],j=new Map;for(let[B,W]of Ka)W.then(Q=>j.set(Q,B));return new Promise(B=>setTimeout(()=>{let W=(Q,te)=>Q.traverse(ge=>{for(let pe of[].concat(ge.material||[])){let Ee=(Se,dt)=>{if(Se&&Se.isTexture&&Se.source&&Se.source.data&&Se.source.data.__dropped){let Ct=D.properties.get(Se);(!Ct.__webglInit||Ct.__version!==Se.version)&&L.push([te,dt,j.get(Se.source)||"?",us.get(Se.source)?.includes(Se)?"own":"clone",Oe.has(Se.source)])}};for(let[Se,dt]of Object.entries(pe))Ee(dt,Se);for(let[Se,dt]of Object.entries(pe.uniforms||{}))Ee(dt&&dt.value,Se)}});W(z,"palace"),vt.forEach((Q,te)=>Q&&W(Q.scene,te+":"+At[te].key)),B({cur:sn,bad:L})},30))}),e.debug&&(window.__abPost=()=>{let L=D.getContext(),j=L.drawingBufferWidth,B=L.drawingBufferHeight;if(!window.__oldChain){let Te=new Wo(D,new tn(2,2,{type:nn,samples:H.msaa})),$e=new Go(z,Y);Te.addPass($e),Te.addPass(new xr(Bl.material.clone()));let Et=new kr(new ue(2,2),.22,.6,1.6),dn=Et.materialHighPassFilter;dn.fragmentShader=sc.fragmentShader,dn.needsUpdate=!0,Te.addPass(Et),Te.addPass(new Tl);let an=new xr({uniforms:Ni.clone(Vl.uniforms),vertexShader:Vl.vertexShader,fragmentShader:Vl.fragmentShader});Te.addPass(an),window.__oldChain={c2:Te,rp:$e,g2:an}}let{c2:W,rp:Q,g2:te}=window.__oldChain,ge=i.clientWidth||innerWidth,pe=i.clientHeight||innerHeight;W.setPixelRatio(D.getPixelRatio()),W.setSize(ge,pe),Q.scene=Vr.scene,Q.camera=Vr.camera;for(let Te of["uTime","uVeil","uSat","uCon","uWarm","uNight","uFlash"])te.uniforms[Te].value=ri.uniforms[Te].value;te.uniforms.uRes.value.copy(ri.uniforms.uRes.value),te.uniforms.uVeilCol.value.copy(ri.uniforms.uVeilCol.value);let Ee=()=>{let Te=new Uint8Array(j*B*4);return L.readPixels(0,0,j,B,L.RGBA,L.UNSIGNED_BYTE,Te),Te};Ci.render(0);let Se=Ee();W.render(0);let dt=Ee(),Ct=0,Jt=0,hn=0;for(let Te=0;Te<Se.length;Te++){if((Te&3)===3)continue;let $e=Math.abs(Se[Te]-dt[Te]);Jt+=$e,$e>Ct&&(Ct=$e),$e>2&&hn++}return{w:j,h:B,meanDiff:+(Jt/(Se.length*.75)).toFixed(4),maxDiff:Ct,over2:+(hn/(Se.length*.75)*100).toFixed(3)+"%"}}),e.debug&&(window.__texRoundTrip=async()=>{let L=(B,W,Q)=>{let te=_e.createFramebuffer(),ge=_e.getParameter(_e.FRAMEBUFFER_BINDING);_e.bindFramebuffer(_e.FRAMEBUFFER,te),_e.framebufferTexture2D(_e.FRAMEBUFFER,_e.COLOR_ATTACHMENT0,_e.TEXTURE_2D,B,0);let pe=new Uint8Array(W*Q*4);return _e.readPixels(0,0,W,Q,_e.RGBA,_e.UNSIGNED_BYTE,pe),_e.bindFramebuffer(_e.FRAMEBUFFER,ge),_e.deleteFramebuffer(te),pe},j=[];for(let B of[sn,sn+1])for(let W of Re.get(B)||[]){if(Oe.has(W)||j.length>=3)continue;let Q=(us.get(W)||[])[0],te=D.properties.get(Q);if(!te.__webglTexture)continue;let ge=W.data.width,pe=W.data.height,Ee=L(te.__webglTexture,ge,pe),Se=!!te.__nrt;zt(W),await Kn(W);let dt=L(D.properties.get(Q).__webglTexture,ge,pe),Ct=0,Jt=0;for(let hn=0;hn<Ee.length;hn++){let Te=Math.abs(Ee[hn]-dt[hn]);Te&&Jt++,Te>Ct&&(Ct=Te)}j.push({url:Qo.get(W).replace(t,""),w:ge,h:pe,firstUpload:Se?"slices":"three",differentBytes:Jt,maxDiff:Ct})}return j}),e.debug&&(window.__texReport=()=>{let L=new Map;for(let[j,B]of Ka)B.then(W=>L.set(W,j)).catch(()=>{});return new Promise(j=>setTimeout(()=>{let B=new Map,W=(te,ge)=>{if(!te||!te.isTexture||te.isRenderTargetTexture)return;let pe=te.source.data||{},Ee=L.get(te.source)||te.constructor.name,Se=D.properties.get(te),dt=Ee+(te.generateMipmaps&&te.minFilter!==$t?" mip":"");B.has(dt)||B.set(dt,[Math.round((pe.width||0)*(pe.height||0)*4*(dt.endsWith("mip")?1.333:1)/1e5)/10,pe.width+"x"+pe.height,ge,!!Se.__webglInit])},Q=(te,ge)=>te.traverse(pe=>{for(let Ee of[].concat(pe.material||[])){for(let Se of Object.values(Ee))W(Se,ge);for(let Se of Object.values(Ee.uniforms||{}))W(Se&&Se.value,ge)}});Q(z,"palace"),vt.forEach((te,ge)=>te&&Q(te.scene,At[ge].key)),j([...B.entries()].sort((te,ge)=>ge[1][0]-te[1][0]).map(([te,ge])=>[ge[0],ge[1],ge[2],ge[3],te.replace(t,"")]))},50))}),e.debug&&Object.assign(window,{__portal:()=>[Zt&&[Zt.width,Zt.height,Zt.texture.minFilter,Zt.texture.magFilter],Hr&&[Hr.width,Hr.height]],__weather:l,__ranges:Sn,__intro:h,__P0:Mr,__scene:z,__composer:Ci,__renderer:D,__camera:Y,__bloom:Sr}),{scene:z,camera:Y,renderer:D,composer:Ci,get progress(){return yi},set progress(L){Gn=L},get targetProgress(){return Gn},ready:sf,destroy(){Rf=!1,n=!1,clearInterval(E),cancelAnimationFrame(Af),pf.disconnect(),hi.removeEventListener("wheel",of),hi.removeEventListener("touchstart",cf),hi.removeEventListener("touchmove",lf),hi.removeEventListener("pointermove",uf),removeEventListener("keydown",ff),hi.removeEventListener("pointerdown",hf),removeEventListener("pointerup",df),ce.destroy(),z.traverse(L=>{L.geometry?.dispose?.();let j=L.material;j&&(Array.isArray(j)?j:[j]).forEach(B=>B.dispose())}),Ci.dispose?.(),D.dispose(),hi.remove(),h&&h.destroy(),l&&l.destroy()}}}export{MS as mount};
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
