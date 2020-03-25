#version 300 es

precision highp float;

out vec4 o_color;

void main(){
    float depth = gl_FragCoord.z;
    float depthSquared = depth * depth;
    float dx = dFdx(depth);
    float dy = dFdy(depth);
    depthSquared += 0.25f * (dx * dx + dy * dy);
    o_color = vec4(depth, depthSquared, 0.0, 1.0);
}