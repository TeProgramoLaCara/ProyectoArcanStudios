export type Capacitacion = 'Blender' | 'Unity' | 'Unreal Engine' | 'ZBrush' | 'Maya 3D';

export type Profesor = {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  tel: string;
  status: 'active' | 'inactive';
  caps: Capacitacion[];
};
