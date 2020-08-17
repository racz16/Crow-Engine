#version 300 es

layout(location = 0) in vec4 i_position;
        
void main() {
    gl_Position = i_position;
}