#version 300 es

layout(location = 0) in vec3 i_position;

void main(){
    gl_Position = vec4(vec2(i_position), 1.0, 1.0);
}