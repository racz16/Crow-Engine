#version 300 es

precision highp float;

in vec2 io_textureCoordinates;

uniform sampler2D image;

out vec4 o_color;

void main(){
    o_color = texture(image, io_textureCoordinates);
} 