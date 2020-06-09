import { GlBindingPoint } from '../webgl/GlBindingPoint';
import { GlTextureUnit } from '../webgl/GlTextureUnit';

export class Conventions {

    private constructor() { }

    //UBO binding points
    public static readonly CAMERA_BINDING_POINT = new GlBindingPoint(1, 'Camera');
    public static readonly LIGHTS_BINDING_POINT = new GlBindingPoint(2, 'Lights');

    //VBO indices
    public static readonly POSITIONS_VBO_INDEX = 0;
    public static readonly TEXTURE_COORDINATES_0_VBO_INDEX = 1;
    public static readonly TEXTURE_COORDINATES_1_VBO_INDEX = 2;
    public static readonly NORMALS_VBO_INDEX = 3;
    public static readonly TANGENTS_VBO_INDEX = 4;
    public static readonly VERTEX_COLORS_VBO_INDEX = 5;

    //texture units
    public static readonly ZERO_TEXTURE_UNIT = new GlTextureUnit(0);

    public static readonly BASE_COLOR_TEXTURE_UNIT = new GlTextureUnit(1);
    public static readonly NORMAL_POM_TEXTURE_UNIT = new GlTextureUnit(2);
    public static readonly ROUGHNESS_METALNESS_TEXTURE_UNIT = new GlTextureUnit(3);
    public static readonly OCCLUSION_TEXTURE_UNIT = new GlTextureUnit(4);
    public static readonly EMISSIVE_TEXTURE_UNIT = new GlTextureUnit(5);

    public static readonly DIFFUSE_IBL_TEXTURE_UNIT = new GlTextureUnit(6);
    public static readonly SPECULAR_IBL_TEXTURE_UNIT = new GlTextureUnit(7);
    public static readonly BRDF_LUT_TEXTURE_UNIT = new GlTextureUnit(8);

    public static readonly SHADOW_TEXTURE_UNIT = new GlTextureUnit(9);



    /*private readonly DIFFUSE_TEXTURE_UNIT = 1;
    private readonly SPECULAR_TEXTURE_UNIT = 2;
    private readonly REFLECTION_TEXTURE_UNIT = 4;
    private readonly REFRACTION_TEXTURE_UNIT = 5;
    private readonly ENVIRONMENT_INTENSITY_TEXTURE_UNIT = 6;*/

}