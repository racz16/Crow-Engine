#version 300 es

precision highp float;
precision highp sampler2DArray;

in vec2 io_textureCoordinates;

uniform sampler2DArray image;
uniform int layer;

out vec4 o_color;

void main(){
    o_color = texture(image, vec3(io_textureCoordinates, layer));
} 