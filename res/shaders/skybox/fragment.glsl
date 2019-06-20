#version 300 es

precision mediump float;

out vec4 color;

in vec3 io_textureCoordinates;

uniform samplerCube cubeMap;
uniform bool isThereCubeMap;

void main(){
    if(isThereCubeMap){
        color = texture(cubeMap, io_textureCoordinates);
    }else{
        color = vec4(0.5f, 0.5f, 0.5f, 1);
    }
}