#version 300 es

layout(location = 0) in vec3 i_position;
layout(location = 1) in vec2 i_textureCoordinates_0;
layout(location = 2) in vec2 i_textureCoordinates_1;
layout(location = 3) in vec3 i_normal;
layout(location = 4) in vec4 i_tangent;
layout(location = 5) in vec3 i_vertex_color;

const int SPLIT_COUNT = 3;

out vec3 io_fragmentPosition;
out vec3 io_normal;
flat out int io_isThereNormal;
flat out int io_isThereTangent;
out vec2 io_textureCoordinates_0;
out vec2 io_textureCoordinates_1;
out vec3 io_vertex_color;
out vec3 io_viewPosition;
out mat3 io_TBN;
out vec4[SPLIT_COUNT] io_fragmentPositionLightSpace;

layout (std140) uniform Camera {                    //binding point: 1
    mat4 viewMatrix;                                //0
    mat4 projectionMatrix;                          //64
    vec3 viewPosition;                              //128
};                                                  //144

uniform mat4 modelMatrix;
uniform mat3 inverseTransposedModelMatrix3x3;
uniform bool useNormalMap;
uniform bool isThereNormal;
uniform bool isThereTangent;
uniform mat4[SPLIT_COUNT] shadowProjectionViewMatrices;

void main(){
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(i_position, 1.0);
    io_fragmentPosition = vec3(modelMatrix * vec4(i_position, 1.0));
    io_normal = normalize(inverseTransposedModelMatrix3x3 * i_normal);
    io_textureCoordinates_0 = i_textureCoordinates_0;
    io_textureCoordinates_1 = i_textureCoordinates_1;
    io_vertex_color = i_vertex_color;
    io_viewPosition = viewPosition;
    for(int i=0; i<SPLIT_COUNT; i++){
        io_fragmentPositionLightSpace[i] = shadowProjectionViewMatrices[i] * vec4(io_fragmentPosition, 1.0);
    }
    io_isThereNormal = int(isThereNormal);
    io_isThereTangent = int(isThereTangent);
    if(useNormalMap && isThereNormal && isThereTangent){
        vec3 tangentColumn = normalize(mat3(modelMatrix) * normalize(i_tangent.xyz));
        vec3 normalColumn = normalize(inverseTransposedModelMatrix3x3 * i_normal);
        vec3 bitangentColumn = cross(normalColumn, tangentColumn) * i_tangent.w;
        io_TBN = mat3(tangentColumn, bitangentColumn, normalColumn);
    }
}