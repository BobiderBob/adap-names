import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        // Preconditions
        IllegalArgumentException.assert(baseName !== null && baseName !== undefined, "baseName must not be null or undefined");
        IllegalArgumentException.assert(parent !== null && parent !== undefined, "parent must not be null or undefined");
        
        super(baseName, parent);
        
        // Initialize state to CLOSED (already done in declaration)
        // Class invariant - check after construction is complete
        this.assertClassInvariants();
    }

    public open(): void {
        // Precondition: file must not be open or deleted
        IllegalArgumentException.assert(this.state !== FileState.OPEN, "cannot open an already open file");
        IllegalArgumentException.assert(this.state !== FileState.DELETED, "cannot open a deleted file");
        
        const oldState = this.state;
        this.state = FileState.OPEN;
        
        // Postcondition: file is now open
        MethodFailedException.assert(this.state === FileState.OPEN, "file must be open after open()");
        
        // Class invariant
        this.assertClassInvariants();
    }

    public read(noBytes: number): Int8Array {
        // Preconditions
        IllegalArgumentException.assert(noBytes >= 0, "number of bytes must be non-negative");
        IllegalArgumentException.assert(this.state === FileState.OPEN, "cannot read from a closed file");
        IllegalArgumentException.assert(this.state !== FileState.DELETED, "cannot read from a deleted file");
        
        const result = new Int8Array(noBytes);
        
        // Postcondition: result length matches requested bytes
        MethodFailedException.assert(result.length === noBytes, "read must return requested number of bytes");
        
        return result;
    }

    public close(): void {
        // Precondition: file must not be closed or deleted
        IllegalArgumentException.assert(this.state !== FileState.CLOSED, "cannot close an already closed file");
        IllegalArgumentException.assert(this.state !== FileState.DELETED, "cannot close a deleted file");
        
        this.state = FileState.CLOSED;
        
        // Postcondition: file is now closed
        MethodFailedException.assert(this.state === FileState.CLOSED, "file must be closed after close()");
        
        // Class invariant
        this.assertClassInvariants();
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

    // Class invariant check
    protected assertClassInvariants(): void {
        InvalidStateException.assert(
            this.state === FileState.OPEN || this.state === FileState.CLOSED || this.state === FileState.DELETED,
            "file state must be valid"
        );
    }

}