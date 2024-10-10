import { assertEquals } from "@std/assert";
import { parseObjBuffer, parseObjString } from "./parser.ts";
import type { ObjData } from "./main.ts";

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
  }
);
