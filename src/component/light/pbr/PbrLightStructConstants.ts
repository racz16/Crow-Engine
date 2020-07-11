export class PbrLightStructConstants {
    public static readonly COLOR_OFFSET = 0;
    public static readonly DIRECTION_OFFSET = 16;
    public static readonly POSITION_OFFSET = 32;
    public static readonly CUTOFF_OFFSET = 48;
    public static readonly INTENSITY_OFFSET = 56;
    public static readonly RANGE_OFFSET = 60;
    public static readonly TYPE_OFFSET = 64;
    public static readonly ACTIVE_OFFSET = 68;

    public static readonly LIGHT_DATASIZE = 80;
    public static readonly DIRECTIONAL_LIGHT_TYPE = 0;
    public static readonly POINT_LIGHT_TYPE = 1;
    public static readonly SPOT_LIGHT_TYPE = 2;

    public static readonly LIGHT_COUNT = 16;
}