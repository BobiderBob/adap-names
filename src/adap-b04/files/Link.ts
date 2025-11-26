import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        // Precondition: target must not be null
        IllegalArgumentException.assert(target !== null && target !== undefined, "target node must not be null or undefined");
        
        this.targetNode = target;
        
        // Postcondition: target is set
        MethodFailedException.assert(this.targetNode === target, "target node must be set");
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        const result = target.getBaseName();
        
        // Postcondition: result is not null
        MethodFailedException.assert(result !== null && result !== undefined, "baseName must not be null");
        
        return result;
    }

    public rename(bn: string): void {
        // Precondition: new name must not be null
        IllegalArgumentException.assert(bn !== null && bn !== undefined, "baseName must not be null or undefined");
        
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
        
        // Postcondition: name changed
        MethodFailedException.assert(target.getBaseName() === bn, "baseName must be updated after rename");
    }

    protected ensureTargetNode(target: Node | null): Node {
        // Precondition check: target must not be null
        IllegalArgumentException.assert(target !== null && target !== undefined, "target node must not be null");
        
        const result: Node = this.targetNode as Node;
        return result;
    }
}