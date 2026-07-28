import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sourceUrl = new URL("../app/guide-data.ts", import.meta.url);

async function parseGraph() {
  const source = await readFile(sourceUrl, "utf8");
  const starts = [...source.matchAll(/^  ([a-z][a-z0-9_]*): \{$/gm)];
  const graph = new Map();

  for (const [index, match] of starts.entries()) {
    const next = starts[index + 1];
    const block = source.slice(match.index, next?.index ?? source.length);
    graph.set(
      match[1],
      [...block.matchAll(/target: "([^"]+)"/g)].map((target) => target[1]),
    );
  }

  return graph;
}

test("every guide choice points to an existing node", async () => {
  const graph = await parseGraph();
  const missing = [];

  for (const [source, targets] of graph) {
    for (const target of targets) {
      if (!graph.has(target)) missing.push(`${source} → ${target}`);
    }
  }

  assert.deepEqual(missing, []);
});

test("every guide node is reachable from intro", async () => {
  const graph = await parseGraph();
  const visited = new Set(["intro"]);
  const queue = ["intro"];

  while (queue.length) {
    const source = queue.shift();
    for (const target of graph.get(source) ?? []) {
      if (visited.has(target)) continue;
      visited.add(target);
      queue.push(target);
    }
  }

  assert.deepEqual(
    [...graph.keys()].filter((node) => !visited.has(node)),
    [],
  );
});
