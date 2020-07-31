#version 300 es

precision highp float;
precision highp sampler2DArray;

in vec2 io_textureCoordinates;

uniform sampler2DArray image;
uniform bool horizontal;
uniform int layer;

out vec4 o_color;

void main(){
    const float[] weights = float[](0.382928, 0.241732, 0.060598, 0.005977, 0.000229);
    vec2 offset = vec2(1.0f) / vec2(textureSize(image, 0));
    vec3 result = texture(image, vec3(io_textureCoordinates, layer)).rgb * weights[0];
    vec2 offsetVector = horizontal ? vec2(offset.x, 0) : vec2(0, offset.y);    
    for(int i = 1; i < weights.length(); i++){
        result += texture(image, vec3(io_textureCoordinates + offsetVector * float(i), layer)).rgb * weights[i];
        result += texture(image, vec3(io_textureCoordinates - offsetVector * float(i), layer)).rgb * weights[i];
    }
    o_color = vec4(result, 1.0f);
}
