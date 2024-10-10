import { assertEquals } from "@std/assert";
import { parseObjBuffer, parseObjString } from "./parser.ts";
import type { ObjData } from "./main.ts";
import { writeObjData } from "./writer.ts";

Deno.test("parseObjString should handle empty OBJ gracefully", () => {
  const objString = ``;

  const expectedData: ObjData = {
    vertices: [],
    triangles: [],
    faces: [],
  };

  const parsedData = parseObjString(objString);
  assertEquals(parsedData, expectedData);
});

Deno.test("parseObjString should parse OBJ without optional data", () => {
  const objString = `
  v 0.123 0.234 0.345
  v 1.000 0.000 0.000
  v 0.000 1.000 0.000
  f 1 2 3
  `;

  const parsedData = parseObjString(objString);

  assertEquals(parsedData.vertices.length, 3);
  assertEquals(parsedData.triangles.length, 1);
  assertEquals(parsedData.textureVertices, undefined);
  assertEquals(parsedData.normals, undefined);
});

Deno.test("parseObjString should correctly parse vertex normals", () => {
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
  assertEquals(parsedData, expectedData);
});

Deno.test(
  "parseObjBuffer should correctly parse vertices and triangles from byte buffer",
  () => {
    const objString = `
  v 0.123 0.234 0.345
  v 1.000 0.000 0.000
  v 0.000 1.000 0.000
  f 1 2 3
  `;

    const encoder = new TextEncoder();
    const objBuffer = encoder.encode(objString);

    const expectedData: ObjData = {
      vertices: [
        [0.123, 0.234, 0.345],
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
      ],
      triangles: [[0, 1, 2]],
      faces: [{ vertices: [0, 1, 2], normals: undefined, textures: undefined }],
    };

    // Parse the byte buffer
    const parsedData = parseObjBuffer(objBuffer);

    // Validate the output
    assertEquals(parsedData, expectedData);
  },
);

Deno.test(
  "compileObjData should correctly compile ObjData into OBJ format",
  () => {
    const objData: ObjData = {
      vertices: [
        [0.123, 0.234, 0.345],
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
      ],
      textureVertices: [
        [0.5, 1.0],
        [0.5, 0.0],
      ],
      normals: [
        [0.0, 0.0, 1.0],
        [0.0, 1.0, 0.0],
      ],
      triangles: [
        [0, 1, 2],
        [0, 2, 3],
      ],
      faces: [
        { vertices: [0, 1, 2], textures: [0, 1, 0], normals: [0, 1, 0] },
        { vertices: [0, 2, 3], textures: [0, 0, 1], normals: [0, 1, 1] },
      ],
      objects: ["Cube"],
      groups: ["Group1"],
      materials: ["Material1"],
      smoothingGroups: ["1"],
    };

    const expectedOutput = `
o Cube
v 0.123 0.234 0.345
v 1 0 0
v 0 1 0
v 0 0 1
vt 0.5 1
vt 0.5 0
vn 0 0 1
vn 0 1 0
g Group1
usemtl Material1
s 1
f 1/1/1 2/2/2 3/1/1
f 1/1/1 3/1/2 4/2/2
    `.trim();

    const compiledOutput = writeObjData(objData).trim();
    assertEquals(compiledOutput, expectedOutput);
  },
);
