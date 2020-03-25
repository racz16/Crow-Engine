#version 300 es
                                            
layout(location = 0) in vec3 i_position;
layout(location = 1) in vec2 i_textureCoordinates;
layout(location = 2) in vec3 i_normal;
layout(location = 3) in vec3 i_tangent;

const int SPLIT_COUNT = 3;

out vec3 io_fragmentPosition;
out vec3 io_normal;
out vec2 io_textureCoordinates;
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
uniform mat4[SPLIT_COUNT] shadowProjectionViewMatrices;

void main(){
    gl_Position = projectionMatrix *  viewMatrix * modelMatrix * vec4(i_position, 1.0f);
    io_fragmentPosition = vec3(modelMatrix * vec4(i_position, 1.0f));
    io_normal = normalize(inverseTransposedModelMatrix3x3 * i_normal);
    io_textureCoordinates = i_textureCoordinates;
    io_viewPosition = viewPosition;
    for(int i=0; i<SPLIT_COUNT; i++){
        io_fragmentPositionLightSpace[i] = shadowProjectionViewMatrices[i] * vec4(io_fragmentPosition, 1.0f);
    }
    if(useNormalMap){
        vec3 tangentColumn = normalize(mat3(modelMatrix) * i_tangent);
        vec3 normalColumn = normalize(mat3(modelMatrix) * i_normal);
        tangentColumn = normalize(tangentColumn - dot(tangentColumn, normalColumn) * normalColumn);
        vec3 bitangentColumn = cross(normalColumn, tangentColumn);
        io_TBN = mat3(tangentColumn, bitangentColumn, normalColumn);
    }
}