#version 300 es

precision highp float;

layout (std140) uniform Camera {                    //binding point: 1
    mat4 viewMatrix;                                //0
    mat4 projectionMatrix;                          //64
    vec3 viewPosition;                              //128
};                                                  //144

uniform vec2 u_viewport;
uniform vec3 u_lightDirection;

layout(location = 0) out vec4 o_color;
layout(location = 1) out vec4 o_godray_occlusion;

vec3 calculateDirection();

const float PI = 3.141592;
const int primaryStepCount = 16;
const int secondaryStepCount = 8;

vec3 calculateDirection() {
    vec4 csPosition = vec4(gl_FragCoord.xy / u_viewport * 2.0 - 1.0, 0.0, 1.0);
    vec4 vsPosition = inverse(projectionMatrix) * csPosition;
    vsPosition = vsPosition / vsPosition.w;
    vec4 wsPosition = inverse(viewMatrix) * vsPosition;
    return normalize(wsPosition.xyz - viewPosition);
}

//https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection
//analytic solution
float calculateraySphereIntersectionDistance(vec3 rayStartPosition, vec3 rayDirection, float sphereRadius) {
    float a = dot(rayDirection, rayDirection);
    float b = 2.0 * dot(rayDirection, rayStartPosition);
    float c = dot(rayStartPosition, rayStartPosition) - (sphereRadius * sphereRadius);
    float d = (b * b) - 4.0 * a * c; //we're inside the atmosphere, so determinant can't be lower than 0
    return (-b + sqrt(d)) / (2.0 * a);
}

float rayleighPhase(vec3 rayDirection, vec3 inverseLightDirection) {
    float mu = dot(rayDirection, inverseLightDirection);
    float mumu = mu * mu;
    return 3.0 / (16.0 * PI) * (1.0 + mumu);
}

float miePhase(vec3 rayDirection, vec3 inverseLightDirection, float g) {
    float mu = dot(rayDirection, inverseLightDirection);
    float mumu = mu * mu;
    float gg = g * g;
    return 3.0 / (8.0 * PI) * ((1.0 - gg) * (mumu + 1.0)) / (pow(1.0 + gg - 2.0 * mu * g, 1.5) * (2.0 + gg));
}

vec3 calculateAtmosphericScattering(vec3 rayDirection, vec3 rayStartPosition, vec3 inverseLightDirection, float sunIntensity, 
                                    float planetRadius, float atmosphereRadius, vec3 rayleighProfile, float mieProfile, 
                                    float rayleighScaleHeight, float mieScaleHeight, float g) {

    float cameraAtmosphereDistance = calculateraySphereIntersectionDistance(rayStartPosition, rayDirection, atmosphereRadius);  //distance between the camera and the end of the atmosphere
    float primaryStepDistance = cameraAtmosphereDistance / float(primaryStepCount);
    float primaryDistanceSum = 0.0;
    vec3 rayleighScattering = vec3(0,0,0);
    vec3 mieScattering = vec3(0,0,0);
    float primaryRayleighOpticalDepthSum = 0.0;
    float primaryMieOpticalDepthSum = 0.0;
    for (int i = 0; i < primaryStepCount; i++) {
        vec3 primarySamplePosition = rayStartPosition + rayDirection * (primaryDistanceSum + primaryStepDistance * 0.5);
        float primaryHeight = length(primarySamplePosition) - planetRadius;
        float primaryRayleighOpticalDepth = exp(-primaryHeight / rayleighScaleHeight) * primaryStepDistance;
        float primaryMieOpticalDepth = exp(-primaryHeight / mieScaleHeight) * primaryStepDistance;
        primaryRayleighOpticalDepthSum += primaryRayleighOpticalDepth;
        primaryMieOpticalDepthSum += primaryMieOpticalDepth;

        float secondaryStepDistance = calculateraySphereIntersectionDistance(primarySamplePosition, inverseLightDirection, atmosphereRadius) / float(secondaryStepCount);
        float secondaryDistanceSum = 0.0;
        float secondaryRayleighOpticalDepthSum = 0.0;
        float secondaryMieOpticalDepthSum = 0.0;
        for (int j = 0; j < secondaryStepCount; j++) {
            vec3 secondarySamplePosition = primarySamplePosition + inverseLightDirection * (secondaryDistanceSum + secondaryStepDistance * 0.5);
            float secondaryHeight = length(secondarySamplePosition) - planetRadius;
            secondaryRayleighOpticalDepthSum += exp(-secondaryHeight / rayleighScaleHeight) * secondaryStepDistance;
            secondaryMieOpticalDepthSum += exp(-secondaryHeight / mieScaleHeight) * secondaryStepDistance;
            secondaryDistanceSum += secondaryStepDistance;
        }

        vec3 attenuation = exp(-(mieProfile * (primaryMieOpticalDepthSum + secondaryMieOpticalDepthSum) + rayleighProfile * (primaryRayleighOpticalDepthSum + secondaryRayleighOpticalDepthSum)));
        rayleighScattering += primaryRayleighOpticalDepth * attenuation;
        mieScattering += primaryMieOpticalDepth * attenuation;
        primaryDistanceSum += primaryStepDistance;
    }
    
    float rayleighPhase = rayleighPhase(rayDirection, inverseLightDirection);
    float miePhase = miePhase(rayDirection, inverseLightDirection, g);

    return sunIntensity * (rayleighPhase * rayleighProfile * rayleighScattering + miePhase * mieProfile * mieScattering);
}

void main(){
    vec3 viewDirection = calculateDirection();
    vec3 cameraPosition = vec3(0, 1 ,0);
    float planetRadius = 6372e3;

    vec3 color = calculateAtmosphericScattering(
        viewDirection,                                  // normalized ray direction
        vec3(0, planetRadius, 0) + cameraPosition,      // ray origin
        -u_lightDirection,                              // position of the sun
        22.0,                                           // intensity of the sun
        planetRadius,                                   // radius of the planet in meters
        planetRadius + 100e3,                           // radius of the atmosphere in meters
        vec3(5.5e-6, 13.0e-6, 22.4e-6),                 // Rayleigh scattering coefficient
        21e-6,                                          // Mie scattering coefficient
        8e3,                                            // Rayleigh scale height
        1.2e3,                                          // Mie scale height
        0.75                                            // Mie preferred scattering direction (g)
    );

    if(dot(-u_lightDirection, viewDirection) >= 0.9999) {
        o_godray_occlusion = vec4(color, 1);
        color *= 2.0;
    }
    o_color = vec4(color, 1.0);
}
