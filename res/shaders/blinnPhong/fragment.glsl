#version 300 es

precision highp float;

struct Material {
    bool isThereDiffuseMap;
    sampler2D diffuse;
    vec2 diffuseTile;
    vec2 diffuseOffset;
    vec3 diffuseColor;

    bool isThereSpecularMap;
    sampler2D specular;
    vec2 specularTile;
    vec2 specularOffset;
    vec4 specularColor;

    bool isThereGlossiness;

    bool isThereNormalMap;
    sampler2D normal;
    vec2 normalTile;
    vec2 normalOffset;

    bool isTherePOM;
    float POMScale;
    float POMMinLayers;
    float POMMaxLayers;

    bool isThereReflectionMap;
    samplerCube reflection;
    bool isThereRefractionMap;
    samplerCube refraction;
    float refractionIndex;
    bool isThereEnvironmentIntensityMap;
    sampler2D environmentIntensity;
    vec2 environmentIntensityTile;
    vec2 environmentIntensityOffset;
    vec3 environmentIntensityColor;

    bool isThereParallaxCorrection;
    float geometryProxyRadius;
    vec3 environmentProbePosition;
};

struct Light {              //base alignment        alignment offset
    vec3 ambient;           //16                    0
    vec3 diffuse;           //16                    16
    vec3 specular;          //16                    32
    vec3 direction;         //16                    48
    vec3 position;          //16                    64
    vec3 attenuation;       //16                    80
    vec2 cutOff;            //8                     96
    int type;               //4                     104
    bool lightActive;       //4                     108
};                          //                      112

const int DIRECTIONAL_LIGHT = 0;
const int POINT_LIGHT = 1;
const int SPOT_LIGHT = 2;

in vec3 io_fragmentPosition;
in vec3 io_normal;
in vec2 io_textureCoordinates;
in vec3 io_viewPosition;
in mat3 io_TBN;
//in mat4 io_shadowProjectionViewMatrix;
//in vec4 io_fragmentPositionLightSpace;

uniform Material material;
//uniform sampler2D shadowMap;
//uniform bool receiveShadow;

layout(std140) uniform Lights { //binding point: 2
    Light[16] lights;           //1792
};

out vec4 o_color;

vec3 calculateLight(vec3 materialDiffuseColor, vec4 materialSpecularColor, vec3 viewDirection, vec3 normalVector, vec3 fragmentPosition, Light light);
vec3 calculateDiffuseColor(vec3 materialDiffuseColor, vec3 lightDiffuseColor, vec3 normalVector, vec3 lightDirection);
vec3 calculateSpecularColor(vec4 materialSpecularColor, vec3 lightSpecularColor, vec3 normalVector, vec3 lightDirection, vec3 viewDirection);
vec3 calculateAmbientColor(vec3 materialDiffuseColor, vec3 lightAmbientColor);
float calculateAttenuation(vec3 fragmentPosition, vec3 lightPosition, vec3 lightAttenuation);
float calculateCutOff(vec3 lightToFragmentDirection, vec3 lightDirection, vec2 lightCutOff);
//data collection
vec4 getDiffuse(vec2 textureCoordinates, vec3 viewDirection, vec3 normalVector);
vec3 parallaxCorrectReflectionVector(vec3 reflectionVector);
vec4 getSpecularColor(vec2 textureCoordinates);
vec3 getNormalVector(vec2 textureCoordinates);
vec2 getTextureCoordinates();
vec3 getIntensity(vec2 textureCoordinates);
//misc
vec2 parallaxMapping(vec3 textureCoordinates, vec2 tangentViewDirection);
//float calculateShadow(bool receiveShadow, vec4 fragmentPositionLightSpace, vec3 normalVector);

void main(){
    vec3 viewDirection = normalize(io_viewPosition - io_fragmentPosition);
    vec3 fragmentPosition = io_fragmentPosition;
    vec2 textureCoordinates = getTextureCoordinates();
    vec3 normalVector = getNormalVector(textureCoordinates);
    vec4 diffuse = getDiffuse(textureCoordinates, viewDirection, normalVector);
    vec3 diffuseColor = diffuse.rgb;
    float alpha = diffuse.a;
    vec4 specularColor = getSpecularColor(textureCoordinates);

    vec3 result = vec3(0);
    //shadows
    //result *= calculateShadow(receiveShadow, io_fragmentPositionLightSpace, normalVector);
    for(int i=0; i<16; i++){
        if(lights[i].lightActive){
            result += calculateLight(diffuseColor, specularColor, viewDirection, normalVector, fragmentPosition, lights[i]);
        }
    }
    o_color = vec4(result, alpha);
}

vec3 calculateLight(vec3 materialDiffuseColor, vec4 materialSpecularColor, vec3 viewDirection, vec3 normalVector, vec3 fragmentPosition, Light light){
    vec3 lightDirection = light.type == POINT_LIGHT ? normalize(fragmentPosition - light.position) : light.direction;
    vec3 lightToFragmentDirection = light.type == DIRECTIONAL_LIGHT ? light.direction : normalize(fragmentPosition - light.position);

    vec3 diffuse = calculateDiffuseColor(materialDiffuseColor, light.diffuse, normalVector, lightDirection);
    vec3 specular = calculateSpecularColor(materialSpecularColor, light.specular, normalVector, lightToFragmentDirection, viewDirection);
    vec3 ambient = calculateAmbientColor(materialDiffuseColor, light.ambient);
    float attenuation = light.type == DIRECTIONAL_LIGHT ? 1.0f : calculateAttenuation(fragmentPosition, light.position, light.attenuation);
    float cutOff = light.type == SPOT_LIGHT ? calculateCutOff(lightToFragmentDirection, lightDirection, light.cutOff) : 1.0f;
    return (ambient + diffuse + specular) * attenuation * cutOff;
}

vec3 calculateDiffuseColor(vec3 materialDiffuseColor, vec3 lightDiffuseColor, vec3 normalVector, vec3 lightDirection){
    float diffuseStrength = max(dot(normalVector, -lightDirection), 0.0f);
    vec3 diffuse = lightDiffuseColor * diffuseStrength * materialDiffuseColor;
    return diffuse;
}

vec3 calculateSpecularColor(vec4 materialSpecularColor, vec3 lightSpecularColor, vec3 normalVector, vec3 lightToFragmentDirection, vec3 viewDirection){
    vec3 halfwayDirection = normalize(-lightToFragmentDirection + viewDirection);  
    float specularStrength = pow(max(dot(normalVector, halfwayDirection), 0.0f), materialSpecularColor.a);
    return lightSpecularColor * specularStrength * materialSpecularColor.rgb;
}

vec3 calculateAmbientColor(vec3 materialDiffuseColor, vec3 lightAmbientColor){
    return lightAmbientColor * materialDiffuseColor;
}

float calculateAttenuation(vec3 fragmentPosition, vec3 lightPosition, vec3 lightAttenuation){
    float lightFragmentDistance = length(lightPosition - fragmentPosition);
    return 1.0f / (lightAttenuation.x + lightAttenuation.y * lightFragmentDistance + lightAttenuation.z * (lightFragmentDistance * lightFragmentDistance));    
}

float calculateCutOff(vec3 lightToFragmentDirection, vec3 lightDirection, vec2 lightCutOff){
    float theta = dot(-lightToFragmentDirection, -lightDirection); 
    float epsilon = lightCutOff.x - lightCutOff.y;
    return clamp((theta - lightCutOff.y) / epsilon, 0.0f, 1.0f);
}

/*float calculateShadow(bool receiveShadow, vec4 fragmentPositionLightSpace, vec3 normalVector, vec3 lightDirection){
    if(!receiveShadow){
        return 1.0f;
    }else if(dot(normalVector, -lightDirection) < 0.0f){
        return 0.3f;
    }
    vec2 texelSize = vec2(1 / textureSize(shadowMap, 0));
    vec3 projectionCoordinates = fragmentPositionLightSpace.xyz / fragmentPositionLightSpace.w;
    projectionCoordinates = projectionCoordinates * 0.5f + 0.5f;
    float currentDepth = projectionCoordinates.z;
    float bias = max(0.00005f * (1.0f - dot(normalVector, lightDirection)    ), 0.000005f)  * texelSize.x * 3500.0f;
    float shadow = 0.0f;
    for(int x = -1; x <= 1; ++x){
        for(int y = -1; y <= 1; ++y){
            float pcfDepth = texture(shadowMap, projectionCoordinates.xy + vec2(x, y) * texelSize).r; 
            shadow += currentDepth - bias > pcfDepth  ? 0.3f : 1.0f;        
        }    
    }
    shadow /= 9.0f;
    return shadow;
}*/

vec2 parallaxMapping(vec3 tangentViewDirection, vec2 textureCoordinates){
    float numLayers = mix(material.POMMaxLayers, material.POMMinLayers, abs(dot(vec3(0, 0, 1), tangentViewDirection)));
    float layerHeight = 1.0f / numLayers;
    float curLayerHeight = 0.0f;
    vec2 dtex = material.POMScale * tangentViewDirection.xy / numLayers;
    vec2 currentTextureCoords = textureCoordinates;
    float heightFromTexture = texture(material.normal, currentTextureCoords).a;
    while(heightFromTexture > curLayerHeight){
        curLayerHeight += layerHeight; 
        currentTextureCoords -= dtex;
        heightFromTexture = texture(material.normal, currentTextureCoords).a;
    }

    vec2 prevTCoords = currentTextureCoords + dtex;
    float nextH	= heightFromTexture - curLayerHeight;
    float prevH	= texture(material.normal, prevTCoords).a - curLayerHeight + layerHeight;
    float weight = nextH / (nextH - prevH);
    vec2 finalTexCoords = prevTCoords * weight + currentTextureCoords * (1.0f - weight);
    if(finalTexCoords.x > 1.0 || finalTexCoords.y > 1.0f || finalTexCoords.x < 0.0f || finalTexCoords.y < 0.0f){
        discard;
    }
    return finalTexCoords;
}

vec4 getDiffuse(vec2 textureCoordinates, vec3 viewDirection, vec3 normalVector){
    vec4 diffuse;
    if(material.isThereDiffuseMap){
        diffuse = texture(material.diffuse, textureCoordinates * material.diffuseTile + material.diffuseOffset);
    }else{
        diffuse = vec4(pow(material.diffuseColor, vec3(2.2f)), 1.0f);
    }

    vec3 reflectionColor;
    if(material.isThereReflectionMap){
        vec3 reflectionVector = reflect(-viewDirection, normalVector);
        if(material.isThereParallaxCorrection){
            reflectionVector = parallaxCorrectReflectionVector(reflectionVector);
        }
        reflectionColor = texture(material.reflection, reflectionVector).rgb;
    }
    vec3 refractionColor;
    if(material.isThereRefractionMap){
        vec3 refractionVector = refract(-viewDirection, normalVector, material.refractionIndex);
        refractionColor = texture(material.refraction, refractionVector).rgb;
    }
    vec3 intensity = getIntensity(textureCoordinates);
    return vec4(diffuse.rgb * intensity.r + reflectionColor * intensity.g + refractionColor * intensity.b, diffuse.a);
}

vec3 parallaxCorrectReflectionVector(vec3 reflectionVector){
    return material.geometryProxyRadius * (io_fragmentPosition - material.environmentProbePosition) + reflectionVector;
}

vec3 getIntensity(vec2 textureCoordinates){
    vec3 intensity;
    float sum;
    if(material.isThereEnvironmentIntensityMap){
        intensity = texture(material.environmentIntensity, textureCoordinates * material.environmentIntensityTile + material.environmentIntensityOffset).rgb;
    }else{
        intensity = material.environmentIntensityColor;
    }
    if(!material.isThereReflectionMap){
        intensity.g = 0.0f;
    }
    if(!material.isThereRefractionMap){
        intensity.b = 0.0f;
    }
    sum = intensity.r + intensity.g + intensity.b;
    if(sum == 0.0f){
        return vec3(1.0f, 0.0f, 0.0f);
    }else{
        intensity /= sum;
        return intensity;
    }
}

vec4 getSpecularColor(vec2 textureCoordinates){
    vec4 ret;
    if(material.isThereSpecularMap){
        ret = texture(material.specular, textureCoordinates * material.specularTile + material.specularOffset);
        if(!material.isThereGlossiness){
            ret.a = material.specularColor.a;
        }
    }else{
        ret = material.specularColor;
    }
    ret.a *= 255.0f;
    return ret;
}

vec3 getNormalVector(vec2 textureCoordinates){
    if(material.isThereNormalMap){
        vec3 normal = texture(material.normal, textureCoordinates * material.normalTile + material.normalOffset).rgb;
        normal = normalize(normal * 2.0f - 1.0f);
        normal = normalize(io_TBN * normal);
        return normal;
    }else{
        return normalize(io_normal);
    }
}

vec2 getTextureCoordinates(){
    if(material.isThereNormalMap && material.isTherePOM){
        vec3 tangentViewPosition = io_viewPosition * io_TBN;
        vec3 tangentFragmentPosition = io_fragmentPosition * io_TBN;
        vec3 tangentViewDirection = normalize(tangentViewPosition - tangentFragmentPosition);
        return parallaxMapping(tangentViewDirection, io_textureCoordinates * material.normalTile + material.normalOffset);
    }else{
        return io_textureCoordinates;
    }
}