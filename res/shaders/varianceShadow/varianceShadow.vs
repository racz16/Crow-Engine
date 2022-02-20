#version 300 es

layout(location = 0) in vec3 i_position;
layout(location = 1) in vec2 i_textureCoordinates_0;
layout(location = 2) in vec2 i_textureCoordinates_1;

out vec2 io_textureCoordinates_0;
out vec2 io_textureCoordinates_1;

uniform mat4 projectionViewModelMatrix;

void main() {
    gl_Position = projectionViewModelMatrix * vec4(i_position, 1.0);
    io_textureCoordinates_0 = i_textureCoordinates_0;
    io_textureCoordinates_1 = i_textureCoordinates_1;
}