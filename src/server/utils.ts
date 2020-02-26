export class Utils {

    public static deleteInArray(array: any[], findMethod: any): boolean {
        const index: number = array.findIndex(findMethod);
        if (index !== -1) {
            array.splice(index, 1);
        }

        return index !== -1;
    }

    public static isNumber(text: string): boolean {
        return !isNaN(parseInt(text, 10));
    }
}
