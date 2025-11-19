import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    /** 
     * Expects that all Name components are properly masked 
     * @methodtype constructor
     */
    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = [...source]; // Create a copy to avoid external modifications
    }

    public clone(): Object {
        // Create a new StringArrayName with a copy of the components
        return new StringArrayName([...this.components], this.delimiter);
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
}