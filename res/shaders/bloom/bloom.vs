#version 300 es

layout (location = 0) in vec3 i_position;
layout (location = 1) in vec2 i_textureCoordinates;

out vec2 io_textureCoordinates;

void main(){
    io_textureCoordinates = i_textureCoordinates;
    gl_Position = vec4(i_position, 1.0f);
}