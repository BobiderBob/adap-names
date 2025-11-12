import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    /** 
     * Expects that all Name components are properly masked 
     * @methodtype constructor
     */
    constructor(source: string[], delimiter?: string) {
        this.components = [...source]; // Create a copy to avoid external modifications
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     * @methodtype conversion-method
     */
    public asString(delimiter: string = this.delimiter): string {
        // Unescape the components for human-readable output
        const unescapedComponents = this.components.map(component => {
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
        return this.components.join(DEFAULT_DELIMITER);
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
        return this.components.length === 0;
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
        return this.components[i];
    }

    /** 
     * Expects that new Name component c is properly masked 
     * @methodtype set-method
     */
    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    /** 
     * Expects that new Name component c is properly masked 
     * @methodtype command-method
     */
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    /** 
     * Expects that new Name component c is properly masked 
     * @methodtype command-method
     */
    public append(c: string): void {
        this.components.push(c);
    }

    /** 
     * @methodtype command-method 
     */
    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    /** 
     * @methodtype command-method 
     */
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }

}