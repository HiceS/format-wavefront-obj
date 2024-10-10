import type { ObjData } from "./main.ts";

/**
 * Will write the ObjData struct to a proper obj file.
 * @param objData Struct that folds the OBJ data
 * @returns OBJ file that can be saved or loaded elsewhere
 */
export function writeObjData(objData: ObjData): string {
  let objFileContent = "";

  // Add object names if present
  if (objData.objects) {
    for (const obj of objData.objects) {
      objFileContent += `o ${obj}\n`;
    }
  }

  // Add vertices
  for (const vertex of objData.vertices) {
    objFileContent += `v ${vertex.join(" ")}\n`;
  }

  // Add texture vertices if present
  if (objData.textureVertices) {
    for (const textureVertex of objData.textureVertices) {
      objFileContent += `vt ${textureVertex.join(" ")}\n`;
    }
  }

  // Add normals if present
  if (objData.normals) {
    for (const normal of objData.normals) {
      objFileContent += `vn ${normal.join(" ")}\n`;
    }
  }

  // Add groups if present
  if (objData.groups) {
    for (const group of objData.groups) {
      objFileContent += `g ${group}\n`;
    }
  }

  // Add materials if present
  if (objData.materials) {
    for (const material of objData.materials) {
      objFileContent += `usemtl ${material}\n`;
    }
  }

  // Add smoothing groups if present
  if (objData.smoothingGroups) {
    for (const smoothingGroup of objData.smoothingGroups) {
      objFileContent += `s ${smoothingGroup}\n`;
    }
  }

  // Add faces and handle optional texture and normal indices
  for (const face of objData.faces) {
    let faceLine = "f";
    for (let i = 0; i < face.vertices.length; i++) {
      const vertexIndex = face.vertices[i] + 1; // Convert from 0-based to 1-based index
      const textureIndex = face.textures ? face.textures[i] + 1 : undefined;
      const normalIndex = face.normals ? face.normals[i] + 1 : undefined;

      // Build the face entry based on available indices
      if (textureIndex !== undefined && normalIndex !== undefined) {
        faceLine += ` ${vertexIndex}/${textureIndex}/${normalIndex}`;
      } else if (textureIndex !== undefined) {
        faceLine += ` ${vertexIndex}/${textureIndex}`;
      } else if (normalIndex !== undefined) {
        faceLine += ` ${vertexIndex}//${normalIndex}`;
      } else {
        faceLine += ` ${vertexIndex}`;
      }
    }
    objFileContent += `${faceLine}\n`;
  }

  return objFileContent;
}
