import imageSize from "image-size";
import path from "path";
import { Processor } from "unified";
import { Node } from "unist";
import { visit } from "unist-util-visit";
import { promisify } from "util";

const sizeOf = promisify(imageSize);

interface ImageNode extends Node {
  type: "element";
  tagName: "img";
  properties: {
    src: string;
    height?: number;
    width?: number;
  };
}

/**
 * Check if a node is an image node
 * @param {Node} node the node to check
 * @returns {boolean} true if the node is an image node
 */
function isImageNode(node: Node): node is ImageNode {
  const img = node as ImageNode;
  return (
    img.type === "element" &&
    img.tagName === "img" &&
    img.properties &&
    typeof img.properties.src === "string"
  );
}

/**
 * Filter image nodes to only include local images
 * @param {ImageNode} node the node to check
 * @returns {boolean} true if the node is a local image node
 */
function filterImageNode(node: ImageNode): boolean {
  return node.properties.src.startsWith("/");
}

/**
 * Add metadata to an image node
 * @param {ImageNode} node the node to add metadata to
 * @returns {Promise<void>} a promise that resolves when the metadata has been added
 */
async function addMetadata(node: ImageNode): Promise<void> {
  const res = await sizeOf(path.join(process.cwd(), "public", node.properties.src));

  if (!res) throw Error(`Invalid image with src "${node.properties.src}"`);

  node.properties.width = res.width;
  node.properties.height = res.height;
}

/**
 * A unified plugin to add metadata to image nodes
 * @param {Processor} this  the processor
 * @returns {Promise<Node>} a promise that resolves to the transformed tree
 */
export default function imageMetadata(this: Processor) {
  return async function transformer(tree: Node): Promise<Node> {
    const imgNodes: ImageNode[] = [];

    visit(tree, "element", (node) => {
      if (isImageNode(node) && filterImageNode(node)) {
        imgNodes.push(node);
      }
    });

    for (const node of imgNodes) {
      await addMetadata(node);
    }

    return tree;
  };
}
