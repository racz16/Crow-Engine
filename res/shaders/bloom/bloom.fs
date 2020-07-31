#version 300 es

precision highp float;
precision highp sampler2DArray;

in vec2 io_textureCoordinates;

uniform sampler2D image;
uniform sampler2DArray emission;

out vec4 o_color;

void main() {
    vec3 color0 = texture(image, io_textureCoordinates).rgb;
    vec3 color = texture(emission, vec3(io_textureCoordinates, 0.0)).rgb;
    o_color = vec4(color0 + color, 1.0);
}