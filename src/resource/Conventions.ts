import { GlBindingPoint } from '../webgl/GlBindingPoint';
import { GlTextureUnit } from '../webgl/GlTextureUnit';
import { ParameterKey } from '../utility/parameter/ParameterKey';
import { vec3 } from 'gl-matrix';
import { MaterialSlot } from '../material/MaterialSlot';
import { AlphaMode } from '../material/AlphaMode';

export class Conventions {

    private constructor() { }

    //UBO binding points
    public static readonly BP_CAMERA = new GlBindingPoint(1, 'Camera');
    public static readonly BP_LIGHTS = new GlBindingPoint(2, 'Lights');

    //VBO indices
    public static readonly VI_POSITIONS = 0;
    public static readonly VI_TEXTURE_COORDINATES_0 = 1;
    public static readonly VI_TEXTURE_COORDINATES_1 = 2;
    public static readonly VI_NORMALS = 3;
    public static readonly VI_TANGENTS = 4;
    public static readonly VI_VERTEX_COLORS = 5;

    //texture units
    public static readonly TU_ZERO = new GlTextureUnit(0);

    public static readonly TU_BASE_COLOR = new GlTextureUnit(1);
    public static readonly TU_NORMAL_POM = new GlTextureUnit(2);
    public static readonly TU_ROUGHNESS_METALNESS = new GlTextureUnit(3);
    public static readonly TU_OCCLUSION = new GlTextureUnit(4);
    public static readonly TU_EMISSIVE = new GlTextureUnit(5);

    public static readonly TU_DIFFUSE_IBL = new GlTextureUnit(6);
    public static readonly TU_SPECULAR_IBL = new GlTextureUnit(7);
    public static readonly TU_BRDF_LUT = new GlTextureUnit(8);

    public static readonly TU_SHADOW = new GlTextureUnit(9);

    //TODO
    /*private readonly DIFFUSE_TEXTURE_UNIT = 1;
    private readonly SPECULAR_TEXTURE_UNIT = 2;
    private readonly REFLECTION_TEXTURE_UNIT = 4;
    private readonly REFRACTION_TEXTURE_UNIT = 5;
    private readonly ENVIRONMENT_INTENSITY_TEXTURE_UNIT = 6;*/

    //material slot parameters
    public static readonly MSP_USE_GLOSSINESS = new ParameterKey<boolean>('MSP_USE_GLOSSINESS');
    public static readonly MSP_NORMAL_SCALE = new ParameterKey<number>('MSP_NORMAL_SCALE');
    public static readonly MSP_USE_POM = new ParameterKey<boolean>('MSP_USE_POM');
    public static readonly MSP_POM_SCALE = new ParameterKey<number>('MSP_POM_SCALE');
    public static readonly MSP_POM_MIN_LAYERS = new ParameterKey<number>('MSP_POM_MIN_LAYERS');
    public static readonly MSP_POM_MAX_LAYERS = new ParameterKey<number>('MSP_POM_MAX_LAYERS');
    public static readonly MSP_REFRACTION_INDEX = new ParameterKey<number>('MSP_REFRACTION_INDEX');
    public static readonly MSP_PARALLAX_CORRECTION_GEOMETRY_PROXY_RADIUS = new ParameterKey<number>('MSP_PARALLAX_CORRECTION_GEOMETRY_PROXY_RADIUS');
    public static readonly MSP_PARALLAX_CORRECTION_ENVIRONMENT_PROBE_POSITION = new ParameterKey<vec3>('MSP_PARALLAX_CORRECTION_ENVIRONMENT_PROBE_POSITION');
    public static readonly MSP_OCCLUSION_STRENGTH = new ParameterKey<number>('MSP_OCCLUSION_STRENGTH');

    //material slots
    public static readonly MS_SKYBOX = new ParameterKey<MaterialSlot>('MS_SKYBOX');//TODO
    public static readonly MS_DIFFUSE = new ParameterKey<MaterialSlot>('MS_DIFFUSE');
    public static readonly MS_SPECULAR = new ParameterKey<MaterialSlot>('MS_SPECULAR');
    public static readonly MS_NORMAL = new ParameterKey<MaterialSlot>('MS_NORMAL');
    public static readonly MS_REFLECTION = new ParameterKey<MaterialSlot>('MS_REFLECTION');
    public static readonly MS_REFRACTION = new ParameterKey<MaterialSlot>('MS_REFRACTION');
    public static readonly MS_ENVIRONMENT_INTENSITY = new ParameterKey<MaterialSlot>('MS_ENVIRONMENT_INTENSITY');
    public static readonly MS_BASE_COLOR = new ParameterKey<MaterialSlot>('MS_BASE_COLOR');
    public static readonly MS_ROUGHNESS_METALNESS = new ParameterKey<MaterialSlot>('MS_ROUGHNESS_METALNESS');
    public static readonly MS_OCCLUSION = new ParameterKey<MaterialSlot>('MS_OCCLUSION');
    public static readonly MS_EMISSIVE = new ParameterKey<MaterialSlot>('MS_EMISSIVE');

    //material parameters
    public static readonly MP_ALPHA_MODE = new ParameterKey<AlphaMode>('MP_ALPHA_MODE');
    public static readonly MP_ALPHA_CUTOFF = new ParameterKey<number>('MP_ALPHA_CUTOFF');
    public static readonly MP_DOUBLE_SIDED = new ParameterKey<boolean>('MP_DOUBLE_SIDED');

}