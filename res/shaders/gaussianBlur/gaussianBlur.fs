#version 300 es

precision highp float;
precision highp sampler2DArray;

in vec2 io_textureCoordinates;

uniform sampler2DArray image;
uniform bool horizontal;
uniform int layer;
uniform float blurOffset;

out vec4 o_color;

void main(){
    vec2 blurScale = horizontal ? vec2(blurOffset, 0.0) : vec2(0.0, blurOffset);
    vec4 color = vec4(0);

    color += texture(image, vec3(io_textureCoordinates -2.0 * blurScale, layer)) * (1.0 / 16.0);
    color += texture(image, vec3(io_textureCoordinates -1.0 * blurScale, layer)) * (4.0 / 16.0);
    color += texture(image, vec3(io_textureCoordinates, layer)) * (6.0 / 16.0);
    color += texture(image, vec3(io_textureCoordinates + blurScale, layer)) * (4.0 / 16.0);
    color += texture(image, vec3(io_textureCoordinates + 2.0 * blurScale, layer)) * (1.0 / 16.0);

    o_color = color;

    /*color += texture(image, io_textureCoordinates + (vec2(-3.0) * blurScale)) * (1.0 / 64.0);
    color += texture(image, io_textureCoordinates + (vec2(-2.0) * blurScale)) * (6.0 / 64.0);
    color += texture(image, io_textureCoordinates + (vec2(-1.0) * blurScale)) * (15.0 / 64.0);
    color += texture(image, io_textureCoordinates + (vec2(0.0) * blurScale)) * (20.0 / 64.0);
    color += texture(image, io_textureCoordinates + (vec2(1.0) * blurScale)) * (15.0 / 64.0);
    color += texture(image, io_textureCoordinates + (vec2(2.0) * blurScale)) * (6.0 / 64.0);
    color += texture(image, io_textureCoordinates + (vec2(3.0) * blurScale)) * (1.0 / 64.0);*/


    /*float[3] weights = float[](0.202001f, 0.200995f, 0.198005f);
    vec2 offset = vec2(1.0f) / vec2(textureSize(image, 0));
    vec3 result = texture(image, io_textureCoordinates).rgb * weights[0];
    if(horizontal){
        for(int i = 1; i < 3; i++){
            result += texture(image, io_textureCoordinates + vec2(offset.x * float(i), 0.0f)).rgb * weights[i];
            result += texture(image, io_textureCoordinates - vec2(offset.x * float(i), 0.0f)).rgb * weights[i];
        }
    }
    else{
        for(int i = 1; i < 3; i++){
            result += texture(image, io_textureCoordinates + vec2(0.0f, offset.y * float(i))).rgb * weights[i];
            result += texture(image, io_textureCoordinates - vec2(0.0f, offset.y * float(i))).rgb * weights[i];
        }
    }
    o_color = vec4(result, 1.0f);*/
}
