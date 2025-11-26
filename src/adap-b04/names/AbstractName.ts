import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(delimiter !== undefined && delimiter !== null, "delimiter must not be null or undefined");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a single character");
        this.delimiter = delimiter;
    }

    public abstract clone(): Object;

    public asString(delimiter: string = this.delimiter): string {
        // Precondition: delimiter must be valid
        IllegalArgumentException.assert(delimiter !== undefined && delimiter !== null, "delimiter must not be null or undefined");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a single character");
        
        // Get all components and unescape them for human-readable output
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const component = this.getComponent(i);
            // Unescape: remove escape characters before special characters
            const unescaped = component.replace(new RegExp(`\\${ESCAPE_CHARACTER}(.)`, 'g'), '$1');
            components.push(unescaped);
        }
        const result = components.join(delimiter);
        
        // Postcondition: result is not null
        MethodFailedException.assert(result !== null && result !== undefined, "asString result must not be null");
        
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        // Machine-readable format uses DEFAULT_DELIMITER
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        const result = components.join(DEFAULT_DELIMITER);
        
        // Postcondition: result is not null
        MethodFailedException.assert(result !== null && result !== undefined, "asDataString result must not be null");
        
        return result;
    }

    public isEqual(other: Name): boolean {
        // Precondition: other must not be null
        IllegalArgumentException.assert(other !== undefined && other !== null, "other must not be null or undefined");
        
        // Two names are equal if they have the same components
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        
        return true;
    }

    public getHashCode(): number {
        // Simple hash code based on the data string representation
        const dataString = this.asDataString();
        let hash = 0;
        for (let i = 0; i < dataString.length; i++) {
            const char = dataString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        // Precondition: other must not be null
        IllegalArgumentException.assert(other !== undefined && other !== null, "other must not be null or undefined");
        // Precondition: delimiters must match
        IllegalArgumentException.assert(this.delimiter === other.getDelimiterCharacter(), "delimiters must match for concat");
        
        const oldLength = this.getNoComponents();
        
        // Concatenate by appending all components from other
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
        
        // Postcondition: length increased by other's length
        MethodFailedException.assert(
            this.getNoComponents() === oldLength + other.getNoComponents(),
            "concat did not properly increase component count"
        );
    }

    // Class invariant check
    protected assertClassInvariants(): void {
        InvalidStateException.assert(this.delimiter !== undefined && this.delimiter !== null, "delimiter must not be null");
        InvalidStateException.assert(this.delimiter.length === 1, "delimiter must be a single character");
        InvalidStateException.assert(this.getNoComponents() >= 0, "number of components must be non-negative");
    }

}