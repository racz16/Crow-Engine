#version 300 es

precision highp float;

struct Material {
    bool isThereBaseColorMap;
    sampler2D baseColorMap;
    vec2 baseColorMapTile;
    vec2 baseColorMapOffset;
    vec3 baseColor;

    bool isThereOcclusionRoughnessMetalnessMap;
    sampler2D occlusionRoughnessMetalnessMap;
    vec2 occlusionRoughnessMetalnessMapTile;
    vec2 occlusionRoughnessMetalnessMapOffset;
    vec3 occlusionRoughnessMetalness;
    float occlusionStrength;

    bool isThereNormalMap;
    sampler2D normalMap;
    vec2 normalMapTile;
    vec2 normalMapOffset;

    bool isTherePOM;
    float POMScale;
    float POMMinLayers;
    float POMMaxLayers;

    bool isThereEmissiveMap;
    sampler2D emissiveMap;
    vec2 emissiveMapTile;
    vec2 emissiveMapOffset;
    vec3 emissiveColor;
};

struct DotInfo{
    float NdotL;
    float NdotV;
    float NdotH;
    float VdotH;
};

struct MaterialInfo{
    vec3 baseColor;
    vec3 emissiveColor;
    vec3 F0;
    float alpha;
    float occlusion;
    float roughness;
    float metalness;
};

struct Light {              //base alignment        alignment offset
    vec3 color;             //16                    0
    vec3 direction;         //16                    16
    vec3 position;          //16                    32
    vec2 cutOff;            //8                     48
    float intensity;        //4                     56
    float range;            //4                     60
    int type;               //4                     64
    bool lightActive;       //4                     68
};                          //12 padding            80

const int DIRECTIONAL_LIGHT = 0;
const int POINT_LIGHT = 1;
const int SPOT_LIGHT = 2;
const int LIGHT_COUNT = 16;
const float PI = 3.14159265359;

in vec3 io_fragmentPosition;
in vec3 io_normal;
in vec2 io_textureCoordinates;
in vec3 io_viewPosition;
in mat3 io_TBN;

uniform Material material;

layout(std140) uniform Lights {             //binding point: 2
    Light[LIGHT_COUNT] lights;              //1024
};

out vec4 o_color;

vec3 calculateLight(Light light, MaterialInfo materialInfo, vec3 fragmentPosition, vec3 V, vec3 N);
vec3 calculateShading(MaterialInfo materialInfo, vec3 L, vec3 N, vec3 V);
float calculateDistributionGGX(DotInfo dotInfo, float roughness);
float calculateGeometrySchlickGGX(DotInfo dotInfo, float roughness);
float calculateGeometrySmith(DotInfo dotInfo, float roughness);
vec3 calculateFresnelSchlick(DotInfo dotInfo, vec3 F0);
float calculatePointAttenuation(float range, float distance);
float calculateSpotAttenuation(vec3 pointToLight, vec3 spotDirection, float outerConeCos, float innerConeCos);

vec2 parallaxMapping(vec3 tangentViewDirection, vec2 textureCoordinates);

vec3 getNormalVector(vec2 textureCoordinates);
void getBaseColorAndAlpha(vec2 textureCoordinates, out vec3 baseColor, out float alpha);
void getOcclusionRoughnessMetalness(vec2 textureCoordinates, out float occlusion, out float roughness, out float metalness);
vec3 getEmissiveColor(vec2 textureCoordinates);
vec2 getTextureCoordinates();
DotInfo createDotInfo(vec3 L, vec3 N, vec3 V);
MaterialInfo createMaterialInfo(vec2 textureCoordinates);

void main(){
    vec2 textureCoordinates = getTextureCoordinates();
    vec3 fragmentPosition = io_fragmentPosition;
    vec3 V = normalize(io_viewPosition - io_fragmentPosition);
    vec3 N = getNormalVector(textureCoordinates);
    MaterialInfo materialInfo = createMaterialInfo(textureCoordinates);

    vec3 result = vec3(0.0f);
    for(int i=0; i<LIGHT_COUNT; i++){
        if(lights[i].lightActive){
            result += calculateLight(lights[i], materialInfo, fragmentPosition, V, N);
        }
    }
    
    result = mix(result, result * vec3(materialInfo.occlusion), material.occlusionStrength);
    result += materialInfo.emissiveColor;
    o_color = vec4(result, materialInfo.alpha);
}

vec3 calculateLight(Light light, MaterialInfo materialInfo, vec3 fragmentPosition, vec3 V, vec3 N){
    vec3 fragmentToLightVector = light.type == DIRECTIONAL_LIGHT ? -light.direction : light.position - fragmentPosition;
    vec3 L = normalize(fragmentToLightVector);
    float lightDistance = length(fragmentToLightVector);
    float pointAttenuation = light.type == DIRECTIONAL_LIGHT ? 1.0f : calculatePointAttenuation(light.range, lightDistance);
    float spotAttenuation = light.type != SPOT_LIGHT ? 1.0f : calculateSpotAttenuation(light.direction, L, light.cutOff.x, light.cutOff.y);
    vec3 shade = calculateShading(materialInfo, L, N, V);
    return pointAttenuation * spotAttenuation * light.intensity * light.color * shade;
}

vec3 calculateShading(MaterialInfo materialInfo, vec3 L, vec3 N, vec3 V){
    DotInfo dotInfo = createDotInfo(L, N, V);
    if (dotInfo.NdotL > 0.0 || dotInfo.NdotV > 0.0){
        vec3 F = calculateFresnelSchlick(dotInfo, materialInfo.F0);
        float D = calculateDistributionGGX(dotInfo, materialInfo.roughness);
        float G = calculateGeometrySmith(dotInfo, materialInfo.roughness);

        vec3 nominator = D * G * F;
        float denominator = 4.0f * dotInfo.NdotV * dotInfo.NdotL;
        vec3 specular = nominator / max(denominator, 0.001f);

        vec3 diffuseFactor = (vec3(1.0f) - F) * (1.0f - materialInfo.metalness);
        vec3 diffuse = diffuseFactor * materialInfo.baseColor / PI;

        return (diffuse + specular) * dotInfo.NdotL;
    }
    return vec3(0, 0, 0);
}

float calculateDistributionGGX(DotInfo dotInfo, float roughness){
    float roughnessAlpha = roughness * roughness;
    float roughnessAlpha_2 = roughnessAlpha * roughnessAlpha;
    float NdotH_2 = dotInfo.NdotH * dotInfo.NdotH;

    float nominator = roughnessAlpha_2;
    float denominator = (NdotH_2 * (roughnessAlpha_2 - 1.0f) + 1.0f);
    denominator = PI * denominator * denominator;

    return nominator / max(denominator, 0.001f);
}

float calculateGeometrySchlickGGX(DotInfo dotInfo, float roughness){
    float r = (roughness + 1.0f);
    float k = (r * r) / 8.0f;

    float nominator   = dotInfo.NdotV;
    float denominator = dotInfo.NdotV * (1.0f - k) + k;

    return nominator / denominator;
}

float calculateGeometrySmith(DotInfo dotInfo, float roughness){
    float ggx2 = calculateGeometrySchlickGGX(dotInfo, roughness);
    float ggx1 = calculateGeometrySchlickGGX(dotInfo, roughness);
    return ggx1 * ggx2;
}

vec3 calculateFresnelSchlick(DotInfo dotInfo, vec3 F0){
    return F0 + (1.0f - F0) * pow(1.0f - dotInfo.VdotH, 5.0f);
}

float calculatePointAttenuation(float range, float distance){
    return max(min(1.0 - pow(distance / range, 4.0f), 1.0f), 0.0f) / pow(distance, 2.0f);
}

float calculateSpotAttenuation(vec3 lightDirection, vec3 L, float cutoffAngleCos, float outerCutOffAngleCos){
    float realAngleCos = dot(lightDirection, -L);
    if (realAngleCos > outerCutOffAngleCos)
    {
        if (realAngleCos < cutoffAngleCos)
        {
            return smoothstep(outerCutOffAngleCos, cutoffAngleCos, realAngleCos);
        }
        return 1.0f;
    }
    return 0.0f;
}

vec2 parallaxMapping(vec3 tangentViewDirection, vec2 textureCoordinates){
    float numLayers = mix(material.POMMaxLayers, material.POMMinLayers, abs(dot(vec3(0, 0, 1), tangentViewDirection)));
    float layerHeight = 1.0f / numLayers;
    float curLayerHeight = 0.0f;
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
    vec2 finalTexCoords = prevTCoords * weight + currentTextureCoords * (1.0f - weight);
    if(finalTexCoords.x > 1.0 || finalTexCoords.y > 1.0f || finalTexCoords.x < 0.0f || finalTexCoords.y < 0.0f){
        discard;
    }
    return finalTexCoords;
}

//
// collecting info-------------------------------------------------------------------------------------------------
//

vec3 getNormalVector(vec2 textureCoordinates){
    if(material.isThereNormalMap){
        vec3 normal = texture(material.normalMap, textureCoordinates * material.normalMapTile + material.normalMapOffset).rgb;
        normal = normalize(normal * 2.0f - 1.0f);
        normal = normalize(io_TBN * normal);
        return normal;
    }else{
        return normalize(io_normal);
    }
}

void getBaseColorAndAlpha(vec2 textureCoordinates, out vec3 baseColor, out float alpha){
    if(material.isThereBaseColorMap){
        vec4 result = texture(material.baseColorMap, textureCoordinates * material.baseColorMapTile + material.baseColorMapOffset);
        baseColor = result.rgb;
        alpha = result.a;
    }else{
        baseColor = pow(material.baseColor, vec3(2.2f));
        alpha = 1.0f;
    }
}

void getOcclusionRoughnessMetalness(vec2 textureCoordinates, out float occlusion, out float roughness, out float metalness){
    vec3 result;
    if(material.isThereOcclusionRoughnessMetalnessMap){
        result = texture(material.occlusionRoughnessMetalnessMap, textureCoordinates * material.occlusionRoughnessMetalnessMapTile + material.occlusionRoughnessMetalnessMapOffset).rgb;
    }else{
        result = material.occlusionRoughnessMetalness;
    }
    occlusion = result.r;
    roughness = result.g;
    metalness = result.b;
}

vec3 getEmissiveColor(vec2 textureCoordinates){
    if(material.isThereEmissiveMap){
        return texture(material.emissiveMap, textureCoordinates * material.emissiveMapOffset + material.emissiveMapOffset).rgb;
    }else{
        return pow(material.emissiveColor, vec3(2.2f));
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

DotInfo createDotInfo(vec3 L, vec3 N, vec3 V){
    vec3 H = normalize(L + V);
    float NdotL = clamp(dot(N, L), 0.0, 1.0);
    float NdotV = clamp(dot(N, V), 0.0, 1.0);
    float NdotH = clamp(dot(N, H), 0.0, 1.0);
    float VdotH = clamp(dot(V, H), 0.0, 1.0);
    return DotInfo(NdotL, NdotV, NdotH, VdotH);
}

MaterialInfo createMaterialInfo(vec2 textureCoordinates){
    vec3 emissiveColor = getEmissiveColor(textureCoordinates);
    vec3 baseColor;
    float alpha, occlusion, roughness, metalness;
    getBaseColorAndAlpha(textureCoordinates, baseColor, alpha);
    getOcclusionRoughnessMetalness(textureCoordinates, occlusion, roughness, metalness);
    vec3 F0 = mix(vec3(0.04), baseColor, metalness);
    return MaterialInfo(baseColor, emissiveColor, F0, alpha, occlusion, roughness, metalness);
}