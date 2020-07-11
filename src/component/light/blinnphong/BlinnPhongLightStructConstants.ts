export class BlinnPhongLightStructConstants {
    public static readonly AMBIENT_OFFSET = 0;
    public static readonly DIFFUSE_OFFSET = 16;
    public static readonly SPECULAR_OFFSET = 32;
    public static readonly DIRECTION_OFFSET = 48;
    public static readonly POSITION_OFFSET = 64;
    public static readonly ATTENUATION_OFFSET = 80;
    public static readonly CUTOFF_OFFSET = 96;
    public static readonly TYPE_OFFSET = 104;
    public static readonly ACTIVE_OFFSET = 108;

    public static readonly LIGHT_DATASIZE = 112;
    public static readonly DIRECTIONAL_LIGHT_TYPE = 0;
    public static readonly POINT_LIGHT_TYPE = 1;
    public static readonly SPOT_LIGHT_TYPE = 2;

    public static readonly LIGHT_COUNT = 16;
}