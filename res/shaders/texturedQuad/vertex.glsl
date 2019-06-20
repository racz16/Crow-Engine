#version 300 es

layout (location = 0) in vec3 position;
layout (location = 1) in vec2 textureCoordinates;

out vec2 io_textureCoordinates;

void main(){
    io_textureCoordinates = textureCoordinates;
    gl_Position =  vec4(position, 1.0f);
}  