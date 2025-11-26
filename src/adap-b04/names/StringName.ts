import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    /** 
     * Expects that the source string contains properly masked components 
     * @methodtype constructor
     */
    constructor(source: string, delimiter?: string) {
        // Precondition: source must not be null or undefined
        IllegalArgumentException.assert(source !== undefined && source !== null, "source must not be null or undefined");
        
        super(delimiter);
        // Parse the source string using the provided delimiter and convert to internal format
        this.name = this.parseAndNormalize(source, this.delimiter);
        this.noComponents = this.calculateNoComponents();
        
        // Class invariant
        this.assertClassInvariants();
    }

    /**
     * Parse input string with given delimiter and normalize to internal format (using DEFAULT_DELIMITER)
     * @methodtype helper-method
     */
    private parseAndNormalize(source: string, inputDelimiter: string): string {
        if (source === "") {
            return "";
        }

        const components: string[] = [];
        let currentComponent = "";
        let i = 0;

        while (i < source.length) {
            if (source[i] === ESCAPE_CHARACTER && i + 1 < source.length) {
                // Include the escape character and the next character
                currentComponent += source[i] + source[i + 1];
                i += 2;
            } else if (source[i] === inputDelimiter) {
                components.push(currentComponent);
                currentComponent = "";
                i++;
            } else {
                // If this character is the DEFAULT_DELIMITER but not the input delimiter,
                // we need to escape it for internal storage
                if (source[i] === DEFAULT_DELIMITER && inputDelimiter !== DEFAULT_DELIMITER) {
                    currentComponent += ESCAPE_CHARACTER + source[i];
                } else {
                    currentComponent += source[i];
                }
                i++;
            }
        }
        
        components.push(currentComponent);
        return components.join(DEFAULT_DELIMITER);
    }

    /**
     * Calculate the number of components in the name string
     * @methodtype helper-method
     */
    private calculateNoComponents(): number {
        if (this.name === "") {
            return 1; // Empty string is one empty component
        }
        
        let count = 1;
        let i = 0;
        while (i < this.name.length) {
            if (this.name[i] === ESCAPE_CHARACTER && i + 1 < this.name.length) {
                // Skip escaped character
                i += 2;
            } else if (this.name[i] === DEFAULT_DELIMITER) {
                count++;
                i++;
            } else {
                i++;
            }
        }
        return count;
    }

    /**
     * Split the name string into components
     * @methodtype helper-method
     */
    private splitComponents(): string[] {
        if (this.name === "") {
            return [""]; // Empty string is one empty component
        }

        const components: string[] = [];
        let currentComponent = "";
        let i = 0;

        while (i < this.name.length) {
            if (this.name[i] === ESCAPE_CHARACTER && i + 1 < this.name.length) {
                // Include the escape character and the next character
                currentComponent += this.name[i] + this.name[i + 1];
                i += 2;
            } else if (this.name[i] === DEFAULT_DELIMITER) {
                components.push(currentComponent);
                currentComponent = "";
                i++;
            } else {
                currentComponent += this.name[i];
                i++;
            }
        }
        
        components.push(currentComponent);
        return components;
    }

    /**
     * Join components into a name string
     * @methodtype helper-method
     */
    private joinComponents(components: string[]): string {
        return components.join(DEFAULT_DELIMITER);
    }

    public clone(): Object {
        // Create a new StringName by cloning the internal state
        const cloned = new StringName("", this.delimiter);
        cloned.name = this.name;
        cloned.noComponents = this.noComponents;
        
        // Postcondition: cloned object is equal to original
        MethodFailedException.assert(this.isEqual(cloned as Name), "clone must create an equal object");
        
        return cloned;
    }

    public asDataString(): string {
        // For StringName, return the internal representation directly
        // which already has proper escaping
        const result = this.name;
        
        // Postcondition: result is not null
        MethodFailedException.assert(result !== null && result !== undefined, "asDataString result must not be null");
        
        return result;
    }

    /** 
     * Returns number of components in Name instance 
     * @methodtype get-method
     */
    public getNoComponents(): number {
        return this.noComponents;
    }

    /** 
     * Returns properly masked component string 
     * @methodtype get-method
     */
    public getComponent(i: number): string {
        // Precondition: index must be valid
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.noComponents, "index must be less than number of components");
        
        const components = this.splitComponents();
        let result = components[i];
        
        // If using a non-default delimiter, unescape any escaped DEFAULT_DELIMITER characters
        // because they were escaped only for internal storage
        if (this.delimiter !== DEFAULT_DELIMITER) {
            // Simple replacement: \. -> .
            const escaped = ESCAPE_CHARACTER + DEFAULT_DELIMITER;
            result = result.split(escaped).join(DEFAULT_DELIMITER);
        }
        
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
        IllegalArgumentException.assert(i < this.noComponents, "index must be less than number of components");
        IllegalArgumentException.assert(c !== null && c !== undefined, "component must not be null or undefined");
        
        const oldLength = this.noComponents;
        const components = this.splitComponents();
        components[i] = c;
        this.name = this.joinComponents(components);
        
        // Postcondition: length unchanged
        MethodFailedException.assert(this.noComponents === oldLength, "setComponent must not change number of components");
        
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
        IllegalArgumentException.assert(i <= this.noComponents, "index must be at most number of components");
        IllegalArgumentException.assert(c !== null && c !== undefined, "component must not be null or undefined");
        
        const oldLength = this.noComponents;
        const components = this.splitComponents();
        components.splice(i, 0, c);
        this.name = this.joinComponents(components);
        this.noComponents++;
        
        // Postcondition: length increased by 1
        MethodFailedException.assert(this.noComponents === oldLength + 1, "insert must increase component count by 1");
        
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
        
        const oldLength = this.noComponents;
        // Always add delimiter when appending (even if name is empty string representing one empty component)
        if (this.noComponents === 0) {
            // This should not happen anymore since empty string is 1 component
            this.name = c;
        } else {
            this.name += DEFAULT_DELIMITER + c;
        }
        this.noComponents++;
        
        // Postcondition: length increased by 1
        MethodFailedException.assert(this.noComponents === oldLength + 1, "append must increase component count by 1");
        
        // Class invariant
        this.assertClassInvariants();
    }

    /** 
     * @methodtype command-method 
     */
    public remove(i: number): void {
        // Preconditions
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.noComponents, "index must be less than number of components");
        IllegalArgumentException.assert(this.noComponents > 1, "cannot remove last component");
        
        const oldLength = this.noComponents;
        const components = this.splitComponents();
        components.splice(i, 1);
        this.name = this.joinComponents(components);
        this.noComponents--;
        
        // Postcondition: length decreased by 1
        MethodFailedException.assert(this.noComponents === oldLength - 1, "remove must decrease component count by 1");
        
        // Class invariant
        this.assertClassInvariants();
    }

}