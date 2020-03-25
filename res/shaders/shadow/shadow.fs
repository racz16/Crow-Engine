#version 300 es

precision highp float;

void main(){
    gl_FragDepth = gl_FragCoord.z;
} 