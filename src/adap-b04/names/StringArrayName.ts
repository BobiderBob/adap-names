import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    /** 
     * Expects that all Name components are properly masked 
     * @methodtype constructor
     */
    constructor(source: string[], delimiter?: string) {
        // Precondition: source must not be null or undefined
        IllegalArgumentException.assert(source !== undefined && source !== null, "source must not be null or undefined");
        IllegalArgumentException.assert(source.length > 0, "source array must not be empty");
        
        super(delimiter);
        this.components = [...source]; // Create a copy to avoid external modifications
        
        // Class invariant
        this.assertClassInvariants();
    }

    public clone(): Object {
        // Create a new StringArrayName with a copy of the components
        const cloned = new StringArrayName([...this.components], this.delimiter);
        
        // Postcondition: cloned object is equal to original
        MethodFailedException.assert(this.isEqual(cloned as Name), "clone must create an equal object");
        
        return cloned;
    }

    public asDataString(): string {
        // For StringArrayName, if using non-default delimiter, need to escape DEFAULT_DELIMITER in components
        if (this.delimiter !== DEFAULT_DELIMITER) {
            const escapedComponents = this.components.map(c => {
                // Escape any unescaped DEFAULT_DELIMITER characters
                let result = "";
                for (let i = 0; i < c.length; i++) {
                    if (c[i] === ESCAPE_CHARACTER && i + 1 < c.length) {
                        result += c[i] + c[i + 1];
                        i++;
                    } else if (c[i] === DEFAULT_DELIMITER) {
                        result += ESCAPE_CHARACTER + c[i];
                    } else {
                        result += c[i];
                    }
                }
                return result;
            });
            return escapedComponents.join(DEFAULT_DELIMITER);
        }
        return this.components.join(DEFAULT_DELIMITER);
    }

    /** 
     * Returns number of components in Name instance 
     * @methodtype get-method
     */
    public getNoComponents(): number {
        return this.components.length;
    }

    /** 
     * Returns properly masked component string 
     * @methodtype get-method
     */
    public getComponent(i: number): string {
        // Precondition: index must be valid
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.components.length, "index must be less than number of components");
        
        const result = this.components[i];
        
        // Postcondition: result must not be null
        MethodFailedException.assert(result !== null && result !== undefined, "component must not be null");
        
        return result;
    }

    /** 
     * Expects that new Name component c is properly masked 
     * @methodtype set-method
     */
    public setComponent(i: number, c: string): void {
        // Preconditions
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.components.length, "index must be less than number of components");
        IllegalArgumentException.assert(c !== null && c !== undefined, "component must not be null or undefined");
        
        const oldLength = this.components.length;
        this.components[i] = c;
        
        // Postcondition: length unchanged
        MethodFailedException.assert(this.components.length === oldLength, "setComponent must not change number of components");
        
        // Class invariant
        this.assertClassInvariants();
    }

    /** 
     * Expects that new Name component c is properly masked 
     * @methodtype command-method
     */
    public insert(i: number, c: string): void {
        // Preconditions
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i <= this.components.length, "index must be at most number of components");
        IllegalArgumentException.assert(c !== null && c !== undefined, "component must not be null or undefined");
        
        const oldLength = this.components.length;
        this.components.splice(i, 0, c);
        
        // Postcondition: length increased by 1
        MethodFailedException.assert(this.components.length === oldLength + 1, "insert must increase component count by 1");
        
        // Class invariant
        this.assertClassInvariants();
    }

    /** 
     * Expects that new Name component c is properly masked 
     * @methodtype command-method
     */
    public append(c: string): void {
        // Precondition: component must not be null
        IllegalArgumentException.assert(c !== null && c !== undefined, "component must not be null or undefined");
        
        const oldLength = this.components.length;
        this.components.push(c);
        
        // Postcondition: length increased by 1
        MethodFailedException.assert(this.components.length === oldLength + 1, "append must increase component count by 1");
        
        // Class invariant
        this.assertClassInvariants();
    }

    /** 
     * @methodtype command-method 
     */
    public remove(i: number): void {
        // Preconditions
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.components.length, "index must be less than number of components");
        IllegalArgumentException.assert(this.components.length > 1, "cannot remove last component");
        
        const oldLength = this.components.length;
        this.components.splice(i, 1);
        
        // Postcondition: length decreased by 1
        MethodFailedException.assert(this.components.length === oldLength - 1, "remove must decrease component count by 1");
        
        // Class invariant
        this.assertClassInvariants();
    }
}