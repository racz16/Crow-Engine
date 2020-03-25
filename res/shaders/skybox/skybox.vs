#version 300 es

layout (location = 0) in vec3 i_position;

out vec3 io_textureCoordinates;

layout (std140) uniform Camera {                    //binding point: 1
    mat4 viewMatrix;                                //0
    mat4 projectionMatrix;                          //64
    vec3 viewPosition;                              //128
};                                                  //144

void main(){
    mat4 view = mat4(mat3(viewMatrix));
    io_textureCoordinates = i_position;
    gl_Position = projectionMatrix * view * vec4(i_position, 1.0f);
    gl_Position = gl_Position.xyww;
}   