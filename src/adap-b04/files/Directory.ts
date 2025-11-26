import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        // Precondition: child node must not be null
        IllegalArgumentException.assert(cn !== null && cn !== undefined, "child node must not be null or undefined");
        
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        // Precondition: child node must not be null
        IllegalArgumentException.assert(cn !== null && cn !== undefined, "child node must not be null or undefined");
        
        const oldSize = this.childNodes.size;
        const wasPresent = this.childNodes.has(cn);
        
        this.childNodes.add(cn);
        
        // Postcondition: child node is now in set
        MethodFailedException.assert(this.childNodes.has(cn), "child node must be in set after add");
        // If it wasn't present before, size should increase
        if (!wasPresent) {
            MethodFailedException.assert(this.childNodes.size === oldSize + 1, "size must increase if node was not present");
        }
    }

    public removeChildNode(cn: Node): void {
        // Precondition: child node must not be null
        IllegalArgumentException.assert(cn !== null && cn !== undefined, "child node must not be null or undefined");
        
        const wasPresent = this.childNodes.has(cn);
        const oldSize = this.childNodes.size;
        
        this.childNodes.delete(cn); // Yikes! Should have been called remove
        
        // Postcondition: child node is no longer in set
        MethodFailedException.assert(!this.childNodes.has(cn), "child node must not be in set after remove");
        // If it was present before, size should decrease
        if (wasPresent) {
            MethodFailedException.assert(this.childNodes.size === oldSize - 1, "size must decrease if node was present");
        }
    }

}