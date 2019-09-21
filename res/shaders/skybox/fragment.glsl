#version 300 es

precision highp float;

in vec3 io_textureCoordinates;

uniform samplerCube cubeMap;
uniform bool isThereCubeMap;

out vec4 o_color;

void main(){
    if(isThereCubeMap){
        o_color = texture(cubeMap, io_textureCoordinates);
    }else{
        o_color = vec4(pow(vec3(0.5f), vec3(2.2f)), 1.0f);
    }
}