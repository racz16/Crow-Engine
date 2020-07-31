#version 300 es

precision highp float;

in vec2 io_textureCoordinates;

uniform sampler2D image;
uniform sampler2D godrayOcclusion;

uniform vec2 u_lightPosition;

out vec4 o_color;

void main() {
    int sampleCount = 100;
    float decay = 0.99;
    float density = 0.95;
    float weight = 0.02;
    
    vec2 tc = io_textureCoordinates;
    vec2 deltaTexCoord = (tc - u_lightPosition);
    deltaTexCoord *= 1.0 / float(sampleCount) * density;
    float illuminationDecay = 1.0;
    vec3 color = texture(godrayOcclusion, tc).rgb * weight;
    for(int i = 0; i < sampleCount; i++) {
        tc -= deltaTexCoord;
        vec3 sampleX = texture(godrayOcclusion, tc).rgb;
        sampleX *= illuminationDecay * weight;
        color += sampleX;
        illuminationDecay *= decay;
    }
    vec3 color0 = texture(image, io_textureCoordinates).rgb;
    o_color = vec4(color0 + color, 1.0);
}