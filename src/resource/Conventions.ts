import { BindingPoint } from '../webgl/BindingPoint';

export class Conventions {

    private constructor() { }

    //UBO binding points
    public static readonly CAMERA_BINDING_POINT = new BindingPoint(1, 'Camera');
    public static readonly LIGHTS_BINDING_POINT = new BindingPoint(2, 'Lights');

    //VBO indices
    public static readonly POSITIONS_VBO_INDEX = 0;
    public static readonly TEXTURE_COORDINATES_VBO_INDEX = 1;
    public static readonly NORMALS_VBO_INDEX = 2;
    public static readonly TANGENTS_VBO_INDEX = 3;

    //texture units
    public static readonly DIFFUSE_TEXTURE_UNIT = 1;
    public static readonly BASE_COLOR_TEXTURE_UNIT = 1;
    public static readonly SPECULAR_TEXTURE_UNIT = 2;
    public static readonly NORMAL_POM_TEXTURE_UNIT = 3;
    public static readonly REFLECTION_TEXTURE_UNIT = 4;
    public static readonly REFRACTION_TEXTURE_UNIT = 5;
    public static readonly ENVIRONMENT_INTENSITY_TEXTURE_UNIT = 6;
    public static readonly OCCLUSION_ROUGHNESS_METALNESS_TEXTURE_UNIT = 7;
    public static readonly EMISSIVE_TEXTURE_UNIT = 8;

}