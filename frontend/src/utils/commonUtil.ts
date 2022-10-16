export function validName(name: string) {
    if (name.trim().length == 0) return true;
    let validNamePattern = new RegExp("^[a-zA-Z]+(?:[-'\\s][a-zA-Z]+)*$");
    if (validNamePattern.test(name.trim())) {
        return true;
    }
    return false;
}