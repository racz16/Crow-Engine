#version 300 es

precision mediump float;

out vec4 color;
in vec2 io_textureCoordinates;

uniform sampler2D image;

void main(){
    color = texture(image, io_textureCoordinates);
} 