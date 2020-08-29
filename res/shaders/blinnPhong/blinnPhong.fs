#version 300 es

precision highp float;
precision highp sampler2DArray;

struct Material {
    bool isThereDiffuseMap;
    sampler2D diffuseMap;
    vec2 diffuseMapTile;
    vec2 diffuseMapOffset;
    vec3 diffuseColor;

    bool isThereSpecularMap;
    sampler2D specularMap;
    vec2 specularMapTile;
    vec2 specularMapOffset;
    vec4 specularColor;

    bool isThereGlossiness;

    bool isThereNormalMap;
    sampler2D normalMap;
    vec2 normalMapTile;
    vec2 normalMapOffset;

    bool isTherePOM;
    float POMScale;
    float POMMinLayers;
    float POMMaxLayers;

    bool isThereReflectionMap;
    samplerCube reflectionMap;
    bool isThereRefractionMap;
    samplerCube refractionMap;
    float refractionIndex;
    bool isThereEnvironmentIntensityMap;
    sampler2D environmentIntensityMap;
    vec2 environmentIntensityMapTile;
    vec2 environmentIntensityMapOffset;
    vec3 environmentIntensityColor;

    bool isThereParallaxCorrection;
    float geometryProxyRadius;
    vec3 environmentProbePosition;

    bool isThereEmissiveMap;
    sampler2D emissiveMap;
    vec2 emissiveMapTile;
    vec2 emissiveMapOffset;
    vec3 emissiveColor;
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

const int SPLIT_COUNT = 3;
const int DIRECTIONAL_LIGHT = 0;
const int POINT_LIGHT = 1;
const int SPOT_LIGHT = 2;

in vec3 io_fragmentPosition;
in vec3 io_normal;
in vec2 io_textureCoordinates;
in vec3 io_viewPosition;
in mat3 io_TBN;
in vec4[SPLIT_COUNT] io_fragmentPositionLightSpace;

uniform Material material;
uniform sampler2DArray shadowMap;
uniform int shadowLightIndex;
uniform bool receiveShadow;
uniform float[SPLIT_COUNT + 1] splits;

layout(std140) uniform Lights { //binding point: 2
    Light[16] lights;           //1792
};

out vec4 o_color;

vec3 calculateLight(vec3 materialDiffuseColor, vec4 materialSpecularColor, vec3 viewDirection, vec3 normalVector, vec3 fragmentPosition, float shadow, int lightIndex);
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
vec3 getEmissiveColor(vec2 textureCoordinates);
vec2 getTextureCoordinates();
vec3 getIntensity(vec2 textureCoordinates);
//misc
vec2 parallaxMapping(vec3 textureCoordinates, vec2 tangentViewDirection);
float calculateShadow(vec3 N, vec3 L);
float calculateShadowInCascade(vec3 normalVector, vec3 lightDirection, int cascade);

void main(){
    vec3 viewDirection = normalize(io_viewPosition - io_fragmentPosition);
    vec3 fragmentPosition = io_fragmentPosition;
    vec2 textureCoordinates = getTextureCoordinates();
    vec3 normalVector = getNormalVector(textureCoordinates);
    vec3 emissiveColor = getEmissiveColor(textureCoordinates);
    vec4 diffuse = getDiffuse(textureCoordinates, viewDirection, normalVector);
    vec3 diffuseColor = diffuse.rgb;
    float alpha = diffuse.a;
    vec4 specularColor = getSpecularColor(textureCoordinates);
    float shadow = calculateShadow(normalVector, lights[shadowLightIndex].direction);

    vec3 result = vec3(0);
    for(int i=0; i<16; i++){
        if(lights[i].lightActive){
            result += calculateLight(diffuseColor, specularColor, viewDirection, normalVector, fragmentPosition, shadow, i);
        }
    }
    result += emissiveColor;
    o_color = vec4(result, alpha);
}

vec3 calculateLight(vec3 materialDiffuseColor, vec4 materialSpecularColor, vec3 viewDirection, vec3 normalVector, vec3 fragmentPosition, float shadow, int lightIndex){
    Light light = lights[lightIndex];
    vec3 lightDirection = light.type == POINT_LIGHT ? normalize(fragmentPosition - light.position) : light.direction;
    vec3 lightToFragmentDirection = light.type == DIRECTIONAL_LIGHT ? light.direction : normalize(fragmentPosition - light.position);

    shadow = mix(1.0, shadow, lightIndex == shadowLightIndex);
    vec3 diffuse = calculateDiffuseColor(materialDiffuseColor, light.diffuse, normalVector, lightDirection);
    vec3 specular = calculateSpecularColor(materialSpecularColor, light.specular, normalVector, lightToFragmentDirection, viewDirection);
    vec3 ambient = calculateAmbientColor(materialDiffuseColor, light.ambient);
    float attenuation = light.type == DIRECTIONAL_LIGHT ? 1.0 : calculateAttenuation(fragmentPosition, light.position, light.attenuation);
    float cutOff = light.type == SPOT_LIGHT ? calculateCutOff(lightToFragmentDirection, lightDirection, light.cutOff) : 1.0;
    return (ambient + diffuse * shadow + specular * shadow) * attenuation * cutOff;
}

vec3 calculateDiffuseColor(vec3 materialDiffuseColor, vec3 lightDiffuseColor, vec3 normalVector, vec3 lightDirection){
    float diffuseStrength = max(dot(normalVector, -lightDirection), 0.0);
    vec3 diffuse = lightDiffuseColor * diffuseStrength * materialDiffuseColor;
    return diffuse;
}

vec3 calculateSpecularColor(vec4 materialSpecularColor, vec3 lightSpecularColor, vec3 normalVector, vec3 lightToFragmentDirection, vec3 viewDirection){
    vec3 halfwayDirection = normalize(-lightToFragmentDirection + viewDirection);  
    float specularStrength = pow(max(dot(normalVector, halfwayDirection), 0.0), materialSpecularColor.a);
    return lightSpecularColor * specularStrength * materialSpecularColor.rgb;
}

vec3 calculateAmbientColor(vec3 materialDiffuseColor, vec3 lightAmbientColor){
    return lightAmbientColor * materialDiffuseColor;
}

float calculateAttenuation(vec3 fragmentPosition, vec3 lightPosition, vec3 lightAttenuation){
    float lightFragmentDistance = length(lightPosition - fragmentPosition);
    return 1.0 / (lightAttenuation.x + lightAttenuation.y * lightFragmentDistance + lightAttenuation.z * (lightFragmentDistance * lightFragmentDistance));    
}

float calculateCutOff(vec3 lightToFragmentDirection, vec3 lightDirection, vec2 lightCutOff){
    float theta = dot(-lightToFragmentDirection, -lightDirection); 
    float epsilon = lightCutOff.x - lightCutOff.y;
    return clamp((theta - lightCutOff.y) / epsilon, 0.0, 1.0);
}

float calculateShadowOld(vec3 N, vec3 L) {
    if(!receiveShadow){
        return 1.0;
    }
    vec2 texelSize = vec2(1.0 / vec2(textureSize(shadowMap, 0)));
    vec3 projectionCoordinates = io_fragmentPositionLightSpace[0].xyz / io_fragmentPositionLightSpace[0].w;
    projectionCoordinates = projectionCoordinates * 0.5 + 0.5;
    float currentDepth = projectionCoordinates.z;

    float maxOffset = 0.0002;
    float minOffset = 0.000001;
    float offsetMod = 1.0 - clamp(dot(N, L), 0.0, 1.0);
    float bias = minOffset + maxOffset * offsetMod;

    return currentDepth - bias > texture(shadowMap, vec3(projectionCoordinates.xy, 0)).r ? 0.0 : 1.0;
    float shadow = 0.0;
    for(int x = -1; x <= 1; ++x){
        for(int y = -1; y <= 1; ++y){
            float pcfDepth = texture(shadowMap, vec3(projectionCoordinates.xy + vec2(x, y) * texelSize, 0.0)).r; 
            shadow += currentDepth - bias > pcfDepth  ? 0.3 : 1.0;        
        }    
    }
    shadow /= 9.0;
    return shadow;
}

float calculateShadow(vec3 N, vec3 L) {
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float shadow;
    shadow = mix(shadow, calculateShadowInCascade(N, L, 2), depth <= splits[3] && depth >= splits[2]);
    shadow = mix(shadow, calculateShadowInCascade(N, L, 1), depth <= splits[2] && depth >= splits[1]);
    shadow = mix(shadow, calculateShadowInCascade(N, L, 0), depth <= splits[1] && depth >= splits[0]);
    return shadow;
}

float calculateShadowInCascade(vec3 N, vec3 L, int cascade){
    if(!receiveShadow){
        return 1.0;
    }
    vec3 projectionCoordinates = io_fragmentPositionLightSpace[cascade].xyz / io_fragmentPositionLightSpace[cascade].w;
    projectionCoordinates = projectionCoordinates * 0.5 + 0.5;
    float currentDepth = projectionCoordinates.z;
    vec2 moments = texture(shadowMap, vec3(projectionCoordinates.xy, cascade)).xy;
    if (currentDepth <= moments.x) {
		return 1.0;
    }
	float variance = moments.y - (moments.x * moments.x);
	variance = max(variance, 0.00002);
	float d = currentDepth - moments.x;
	float pMax = variance / (variance + d * d);
    return smoothstep(0.1, 1.0, pMax);
}

vec2 parallaxMapping(vec3 tangentViewDirection, vec2 textureCoordinates){
    float numLayers = mix(material.POMMaxLayers, material.POMMinLayers, abs(dot(vec3(0.0, 0.0, 1.0), tangentViewDirection)));
    float layerHeight = 1.0 / numLayers;
    float curLayerHeight = 0.0;
    vec2 dtex = material.POMScale * tangentViewDirection.xy / numLayers;
    vec2 currentTextureCoords = textureCoordinates;
    float heightFromTexture = texture(material.normalMap, currentTextureCoords).a;
    while(heightFromTexture > curLayerHeight){
        curLayerHeight += layerHeight; 
        currentTextureCoords -= dtex;
        heightFromTexture = texture(material.normalMap, currentTextureCoords).a;
    }
    vec2 prevTCoords = currentTextureCoords + dtex;
    float nextH	= heightFromTexture - curLayerHeight;
    float prevH	= texture(material.normalMap, prevTCoords).a - curLayerHeight + layerHeight;
    float weight = nextH / (nextH - prevH);
    vec2 finalTexCoords = prevTCoords * weight + currentTextureCoords * (1.0 - weight);
    
    if(finalTexCoords.x > 1.0 || finalTexCoords.y > 1.0 || finalTexCoords.x < 0.0 || finalTexCoords.y < 0.0){
        discard;
    }
    return finalTexCoords;
}

vec4 getDiffuse(vec2 textureCoordinates, vec3 viewDirection, vec3 normalVector){
    vec4 diffuse;
    if(material.isThereDiffuseMap){
        diffuse = texture(material.diffuseMap, textureCoordinates * material.diffuseMapTile + material.diffuseMapOffset);
    }else{
        diffuse = vec4(pow(material.diffuseColor, vec3(2.2)), 1.0);
    }
    vec3 reflectionColor;
    if(material.isThereReflectionMap){
        vec3 reflectionVector = reflect(-viewDirection, normalVector);
        if(material.isThereParallaxCorrection){
            reflectionVector = parallaxCorrectReflectionVector(reflectionVector);
        }
        reflectionColor = texture(material.reflectionMap, reflectionVector).rgb;
    }
    vec3 refractionColor;
    if(material.isThereRefractionMap){
        vec3 refractionVector = refract(-viewDirection, normalVector, material.refractionIndex);
        refractionColor = texture(material.refractionMap, refractionVector).rgb;
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
        intensity = texture(material.environmentIntensityMap, textureCoordinates * material.environmentIntensityMapTile + material.environmentIntensityMapOffset).rgb;
    }else{
        intensity = material.environmentIntensityColor;
    }
    if(!material.isThereReflectionMap){
        intensity.g = 0.0;
    }
    if(!material.isThereRefractionMap){
        intensity.b = 0.0;
    }
    sum = intensity.r + intensity.g + intensity.b;
    if(sum == 0.0){
        return vec3(1.0, 0.0, 0.0);
    }else{
        intensity /= sum;
        return intensity;
    }
}

vec4 getSpecularColor(vec2 textureCoordinates){
    vec4 ret;
    if(material.isThereSpecularMap){
        ret = texture(material.specularMap, textureCoordinates * material.specularMapTile + material.specularMapOffset);
        if(!material.isThereGlossiness){
            ret.a = material.specularColor.a;
        }
    }else{
        ret = material.specularColor;
    }
    ret.a *= 255.0;
    return ret;
}

vec3 getNormalVector(vec2 textureCoordinates){
    if(material.isThereNormalMap){
        vec3 normal = texture(material.normalMap, textureCoordinates * material.normalMapTile + material.normalMapOffset).rgb;
        normal = normalize(normal * 2.0 - 1.0);
        normal = normalize(io_TBN * normal);
        return normal;
    }else{
        return normalize(io_normal);
    }
}

vec3 getEmissiveColor(vec2 textureCoordinates){
    if(material.isThereEmissiveMap){
        return texture(material.emissiveMap, textureCoordinates * material.emissiveMapOffset + material.emissiveMapOffset).rgb;
    }else{
        return pow(material.emissiveColor, vec3(2.2));
    }
}

vec2 getTextureCoordinates(){
    if(material.isThereNormalMap && material.isTherePOM){
        vec3 tangentViewPosition = io_viewPosition * io_TBN;
        vec3 tangentFragmentPosition = io_fragmentPosition * io_TBN;
        vec3 tangentViewDirection = normalize(tangentViewPosition - tangentFragmentPosition);
        return parallaxMapping(tangentViewDirection, io_textureCoordinates * material.normalMapTile + material.normalMapOffset);
    }else{
        return io_textureCoordinates;
    }
}