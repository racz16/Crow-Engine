#version 300 es

precision highp float;

in vec2 io_textureCoordinates;

uniform sampler2D image;

out vec4 o_color;

void main(){
    vec3 color = texture(image, io_textureCoordinates).rgb;
    color = pow(color, vec3(1.0f / 2.2f));
    o_color = vec4(color, 1.0f);
}