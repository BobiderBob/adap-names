import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        // Preconditions
        IllegalArgumentException.assert(bn !== null && bn !== undefined, "baseName must not be null or undefined");
        IllegalArgumentException.assert(pn !== null && pn !== undefined, "parentNode must not be null or undefined");
        
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        // Precondition: target directory must not be null
        IllegalArgumentException.assert(to !== null && to !== undefined, "target directory must not be null or undefined");
        
        const oldParent = this.parentNode;
        
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
        
        // Postcondition: parent changed
        MethodFailedException.assert(this.parentNode === to, "parent must be updated after move");
        MethodFailedException.assert(this.parentNode !== oldParent || oldParent === to, "parent must have changed unless moving to same directory");
        
        // Class invariant
        this.assertClassInvariants();
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        
        // Postcondition: result is not null
        MethodFailedException.assert(result !== null && result !== undefined, "full name must not be null");
        
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        // Precondition: new name must not be null
        IllegalArgumentException.assert(bn !== null && bn !== undefined, "baseName must not be null or undefined");
        
        this.doSetBaseName(bn);
        
        // Postcondition: name changed
        MethodFailedException.assert(this.baseName === bn, "baseName must be updated after rename");
        
        // Class invariant
        this.assertClassInvariants();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    // Class invariant check
    protected assertClassInvariants(): void {
        InvalidStateException.assert(this.baseName !== null && this.baseName !== undefined, "baseName must not be null");
        InvalidStateException.assert(this.parentNode !== null && this.parentNode !== undefined, "parentNode must not be null");
    }

}
