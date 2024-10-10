# Wavefront OBJ Parsing and writing

This is a small library hopefully usable everywhere that will be able to very simply parse obj files and write obj files based off of vertex and traingle data.

## Format description

- vertices: Stores vertex positions (v).
- textureVertices: Stores texture coordinates (vt).
- normals: Stores normal vectors (vn).
- triangles: Stores only faces with exactly 3 vertices for simplicity.
- faces: More general faces that include optional texture and normal references. These faces may have more or fewer than 3 vertices.
- objects: Stores object names (o), used for organizing the model.
- groups: Stores group names (g) used to group faces.
- materials: Stores material names (usemtl), specifying which material to apply to the faces.
- smoothingGroups: Stores smoothing group information (s), if present.

## Usage

Example of reading a file and then parsing it:

```typescript
import { parseObjBuffer } from "@format/wavefront-obj";

async function readAndParseObjFile(filePath: string) {
  try {
    const objBuffer = await Deno.readFile(filePath);
    const parsedObjData = parseObjBuffer(objBuffer);
    console.log("Parsed OBJ Data:", parsedObjData);
  } catch (error) {
    console.error("Error reading or parsing OBJ file:", error);
  }
}

const objFilePath = "./path_to_your_file/example.obj";
await readAndParseObjFile(objFilePath);
```

Example of parsing raw string data from file on the web:
```typescript
import { parseObjString, ObjData } from "@format/wavefront-obj";

const objString = `
  v 0.123 0.234 0.345
  v 1.000 0.000 0.000
  v 0.000 1.000 0.000
  vn 0.000 0.000 1.000
  vn 1.000 0.000 0.000
  f 1//1 2//2 3//1
  `;

const expectedData: ObjData = {
    vertices: [
        [0.123, 0.234, 0.345],
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
    ],
    normals: [
        [0.0, 0.0, 1.0],
        [1.0, 0.0, 0.0],
    ],
    triangles: [[0, 1, 2]],
    faces: [{ vertices: [0, 1, 2], normals: [0, 1, 0], textures: undefined }],
};

const parsedData = parseObjString(objString);
```