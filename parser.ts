import type { ObjData } from "./main.ts";

/**
 * Call this function with the contents of the obj file to parse it as a set of traingle.
 * @param objString String data from the obj wavefront file type, will be parsed into traingles and verts
 * @returns ObjData to access the traingle data from the file
 */
export function parseObjString(objString: string): ObjData {
  const objData: ObjData = {
    vertices: [],
    triangles: [],
    faces: [],
  };

  const lines = objString.split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("v ")) {
      // Parse vertex (v x y z)
      const vertexParts = trimmedLine.split(/\s+/).slice(1).map(parseFloat);
      if (vertexParts.length === 3) {
        objData.vertices.push(vertexParts);
      }
    } else if (trimmedLine.startsWith("vt ")) {
      // Parse texture coordinate (vt u v [w])
      if (!objData.textureVertices) objData.textureVertices = [];
      const textureParts = trimmedLine.split(/\s+/).slice(1).map(parseFloat);
      if (textureParts.length >= 2) {
        objData.textureVertices.push(textureParts);
      }
    } else if (trimmedLine.startsWith("vn ")) {
      // Parse normal vector (vn x y z)
      if (!objData.normals) objData.normals = [];
      const normalParts = trimmedLine.split(/\s+/).slice(1).map(parseFloat);
      if (normalParts.length === 3) {
        objData.normals.push(normalParts);
      }
    } else if (trimmedLine.startsWith("f ")) {
      // Parse face (f v1/vt1/vn1 v2/vt2/vn2 ...)
      const faceParts = trimmedLine.split(/\s+/).slice(1);
      const faceVertices: number[] = [];
      const faceTextures: number[] = [];
      const faceNormals: number[] = [];

      for (const part of faceParts) {
        const [vertexIndex, textureIndex, normalIndex] = part
          .split("/")
          .map((v) => (v ? parseInt(v, 10) - 1 : undefined));

        if (vertexIndex !== undefined) faceVertices.push(vertexIndex);
        if (textureIndex !== undefined) faceTextures.push(textureIndex);
        if (normalIndex !== undefined) faceNormals.push(normalIndex);
      }

      objData.faces.push({
        vertices: faceVertices,
        textures: faceTextures.length ? faceTextures : undefined,
        normals: faceNormals.length ? faceNormals : undefined,
      });

      if (faceVertices.length === 3) {
        // Only add to triangles if it's a triangle
        objData.triangles.push(faceVertices);
      }
    } else if (trimmedLine.startsWith("o ")) {
      // Parse object name (o ObjectName)
      if (!objData.objects) objData.objects = [];
      const objectName = trimmedLine.split(/\s+/)[1];
      objData.objects.push(objectName);
    } else if (trimmedLine.startsWith("g ")) {
      // Parse group name (g GroupName)
      if (!objData.groups) objData.groups = [];
      const groupName = trimmedLine.split(/\s+/)[1];
      objData.groups.push(groupName);
    } else if (trimmedLine.startsWith("usemtl ")) {
      // Parse material usage (usemtl MaterialName)
      if (!objData.materials) objData.materials = [];
      const materialName = trimmedLine.split(/\s+/)[1];
      objData.materials.push(materialName);
    } else if (trimmedLine.startsWith("s ")) {
      // Parse smoothing group (s SmoothingGroup)
      if (!objData.smoothingGroups) objData.smoothingGroups = [];
      const smoothingGroup = trimmedLine.split(/\s+/)[1];
      objData.smoothingGroups.push(smoothingGroup);
    }
  }

  return objData;
}

/**
 * Parses obj bytes
 * @param objBuffer Uint8Array Byte buffer containing valid obj data
 * @returns ObjData parsed
 */
export function parseObjBuffer(objBuffer: Uint8Array): ObjData {
  const decoder = new TextDecoder();
  const objString = decoder.decode(objBuffer);
  return parseObjString(objString);
}
