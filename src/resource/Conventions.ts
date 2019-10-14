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

}