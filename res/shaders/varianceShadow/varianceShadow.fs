#version 300 es

precision highp float;

in vec2 io_textureCoordinates_0;
in vec2 io_textureCoordinates_1;

uniform bool isThereTextureMap;
uniform sampler2D textureMap;
uniform vec2 tile;
uniform vec2 offset;
uniform int textureCoordinate;
uniform int alphaMode;
uniform float alphaCutoff;

out vec4 o_color;

const int ALPHA_MODE_OPAQUE = 0;
const int ALPHA_MODE_MASK = 1;
const int ALPHA_MODE_BLEND = 2;

void discardIfTransparent(){
    if(!isThereTextureMap) {
        discard;
    }
    vec2 textureCoordinates = mix(io_textureCoordinates_0, io_textureCoordinates_1, bvec2(textureCoordinate != 0));
    float alpha = texture(textureMap, textureCoordinates * tile + offset).a;
    if(alphaMode == ALPHA_MODE_BLEND) {
        if(alpha < 1.0) {
            discard;
        }
    } else if(alphaMode == ALPHA_MODE_MASK) {
        if(alpha < alphaCutoff) {
            discard;
        }
    }
}

void main(){
    discardIfTransparent();
    float depth = gl_FragCoord.z;
    float depthSquared = depth * depth;
    float dx = dFdx(depth);
    float dy = dFdy(depth);
    depthSquared += 0.25 * (dx * dx + dy * dy);
    o_color = vec4(depth, depthSquared, 0.0, 1.0);
}