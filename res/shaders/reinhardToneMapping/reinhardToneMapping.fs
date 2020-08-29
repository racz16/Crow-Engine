#version 300 es

precision highp float;

in vec2 io_textureCoordinates;

uniform sampler2D image;

out vec4 o_color;

void main(){
    vec3 color = texture(image, io_textureCoordinates).rgb;
    color = color / (color + vec3(1.0));
    o_color = vec4(color, 1.0);
}