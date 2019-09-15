#version 300 es
layout (location = 0) in vec3 position;

out vec3 io_textureCoordinates;

layout (std140) uniform Camera {                    //binding point: 1
    mat4 viewMatrix;                                //0
    mat4 projectionMatrix;                          //64
    vec3 viewPosition;                              //128
};                                                  //144

void main(){
    mat4 view = mat4(mat3(viewMatrix));
    io_textureCoordinates = position;
    gl_Position = projectionMatrix * view * vec4(position, 1.0);
    gl_Position = gl_Position.xyww;
}   