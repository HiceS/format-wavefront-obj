/**
 * OjbData is a struct to hold the parsed wavefront obj information.
 */
export interface ObjData {
  vertices: number[][]; // Geometric vertices (v)
  textureVertices?: number[][]; // Optional: Texture vertices (vt)
  normals?: number[][]; // Optional: Vertex normals (vn)
  triangles: number[][]; // Triangles (f with 3 vertices)
  faces: { vertices: number[]; textures?: number[]; normals?: number[] }[]; // Faces with optional texture/normal indices
  objects?: string[]; // Optional: Object names (o)
  groups?: string[]; // Optional: Group names (g)
  materials?: string[]; // Optional: Material names (usemtl)
  smoothingGroups?: string[]; // Optional: Smoothing group (s)
}
