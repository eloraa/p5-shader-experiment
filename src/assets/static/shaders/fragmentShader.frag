#ifdef GL_ES
precision mediump float;
#endif  
   
   
varying vec2 vTexCoord;

uniform float u_ratio;
uniform float u_time;
uniform float u_width;
uniform float u_coloring;
uniform float u_speed;
uniform vec2 u_point;

//    https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
        -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
        dot(x12.zw, x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }


//    https://gist.github.com/983/e170a24ae8eba2cd174f
    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    float get_noise(vec2 uv, float t){
        float SCALE = 4.;
        float noise = snoise(vec2(uv.x * .9 * SCALE, -uv.y * SCALE - t));
        SCALE = 9.;
        noise += .2 * snoise(vec2(uv.x * SCALE + 3. * t, uv.y * .8 * SCALE));
        noise += 1.;

        return noise;
    }


    float circle_s (vec2 dist, float radius) {
        return smoothstep(0., radius, pow(dot(dist, dist), .3) * .1);
    }

    void main () {
        vec2 uv = vTexCoord;
        uv /= (1000. / u_width);
        uv.y /= u_ratio;

        vec2 mouse = vTexCoord - u_point;
        mouse.y /= u_ratio;

        float t = u_time * u_speed;

        float noise = get_noise(uv, t);
        noise *= circle_s(mouse, .05);

        const float STEPS = 5.;
        float stepped_noise = floor(noise * STEPS) / STEPS;
        float d = -.5 * pow(stepped_noise, 1.5);

        vec3 hsv = vec3(u_coloring + d * .4, 1., 1.);
        vec3 col = hsv2rgb(hsv);

        float opacity = .9 * smoothstep(.45, .46, noise);
        col *= opacity;

        gl_FragColor = vec4(col, opacity);
    }