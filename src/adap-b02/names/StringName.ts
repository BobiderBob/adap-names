import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    /** 
     * Expects that the source string contains properly masked components 
     * @methodtype constructor
     */
    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        // Parse the source string using the provided delimiter and convert to internal format
        this.name = this.parseAndNormalize(source, this.delimiter);
        this.noComponents = this.calculateNoComponents();
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
            return 0;
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
            return [];
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

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     * @methodtype conversion-method
     */
    public asString(delimiter: string = this.delimiter): string {
        const components = this.splitComponents();
        // Unescape the components for human-readable output
        const unescapedComponents = components.map(component => {
            return component.replace(new RegExp(`\\${ESCAPE_CHARACTER}(.)`, 'g'), '$1');
        });
        return unescapedComponents.join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     * @methodtype conversion-method
     */
    public asDataString(): string {
        return this.name;
    }

    /**
     * Returns delimiter char; must be a single character
     * @methodtype get-method
     */
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    /**
     * Returns true, if number of components == 0; else false
     * @methodtype boolean-query
     */
    public isEmpty(): boolean {
        return this.noComponents === 0;
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
    public getComponent(x: number): string {
        const components = this.splitComponents();
        return components[x];
    }

    /** 
     * Expects that new Name component c is properly masked 
     * @methodtype set-method
     */
    public setComponent(n: number, c: string): void {
        const components = this.splitComponents();
        components[n] = c;
        this.name = this.joinComponents(components);
    }

    /** 
     * Expects that new Name component c is properly masked 
     * @methodtype command-method
     */
    public insert(n: number, c: string): void {
        const components = this.splitComponents();
        components.splice(n, 0, c);
        this.name = this.joinComponents(components);
        this.noComponents++;
    }

    /** 
     * Expects that new Name component c is properly masked 
     * @methodtype command-method
     */
    public append(c: string): void {
        if (this.name === "") {
            this.name = c;
        } else {
            this.name += DEFAULT_DELIMITER + c;
        }
        this.noComponents++;
    }

    /** 
     * @methodtype command-method 
     */
    public remove(n: number): void {
        const components = this.splitComponents();
        components.splice(n, 1);
        this.name = this.joinComponents(components);
        this.noComponents--;
    }

    /** 
     * @methodtype command-method 
     */
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}