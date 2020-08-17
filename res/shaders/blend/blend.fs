#version 300 es

precision highp float;

uniform sampler2D image;
        
out vec4 o_color;

void main() {
    o_color = texelFetch(image, ivec2(gl_FragCoord.xy), 0);
}