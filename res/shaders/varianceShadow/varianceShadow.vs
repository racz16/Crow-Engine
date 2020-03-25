#version 300 es

layout(location = 0) in vec3 i_positiom;

uniform mat4 projectionViewModelMatrix;

void main(){
    gl_Position = projectionViewModelMatrix * vec4(i_positiom, 1.0f);
}